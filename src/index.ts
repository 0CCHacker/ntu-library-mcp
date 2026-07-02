/**
 * NTU Library MCP Server — remote MCP on Cloudflare Workers.
 *
 * Exposes NTU Singapore's public Primo search to any MCP client (Claude, etc.)
 * so an AI can find papers, read abstracts, and tell a student which copy to
 * actually download. Read-only, public data, no auth.
 */
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { CONFIG, LIBRARY_NAME } from "./config";
import { searchLibrary, getRecord } from "./primo";
import { formatSearchResult, formatRecordDetail } from "./format";
import { findInfluentialResearch, formatInfluential } from "./scholar";
import { trackUsage, sessionKey } from "./analytics";
import { SKILLS } from "./skills";
import { LANDING_PAGE } from "./landing";
import { PLAYBOOK_PAGE } from "./playbook";

/**
 * Guidance surfaced to the AI client on connect. Keeps tool prompts short while
 * still steering the model to actually READ abstracts and pick the right tool.
 */
const SERVER_INSTRUCTIONS = `NTU Library research assistant. You help NTU Singapore students find and choose academic sources (books, articles, journals) for essays — especially the CC0001 op-ed.

Tools:
- search_ntu_library — what NTU HOLDS. Use first for most requests. Returns abstracts, DOIs, and an access tag per result.
- find_influential_research — what the FIELD CITES MOST (via Crossref). Use when the student wants seminal/high-impact sources or to strengthen an argument; then cross-check the titles with search_ntu_library to see which ones NTU can provide.
- get_ntu_record — full abstract + access detail for one record id.

How to help well:
1. ALWAYS read the returned abstracts before recommending — never suggest a source on its title alone. Summarise what each source actually argues in 1–2 sentences.
2. Lead with sources the student can actually get: prefer ✅ open access / digital, then 🔒 online-via-NTU-login, and only then 📚 print-only. Always tell them how to obtain each one.
3. Keep it to the few most relevant results, not a long dump. Quality of triage is the point.
4. Search terms: pass concise topical keywords (2–5 words), not full sentences. Use resource_type to narrow to articles/books/journals when the student asks.`;

export interface Env {
  ANALYTICS?: AnalyticsEngineDataset;
  USAGE_KV?: KVNamespace;
  MCP_OBJECT: DurableObjectNamespace;
  ASSETS: Fetcher;
}

export class NtuLibraryMCP extends McpAgent<Env> {
  server = new McpServer(
    {
      name: "ntu-library",
      version: "1.1.0",
    },
    { instructions: SERVER_INSTRUCTIONS },
  );

  async init() {
    this.server.tool(
      "search_ntu_library",
      "Search NTU Singapore Library (OneSearch/Primo) for academic resources — " +
        "articles, books, and journals. Returns titles, authors, year, abstract, DOI, " +
        "and a plain-language recommendation on which copy a student can actually download " +
        "(open access, online via NTU login, or print only). Use this to help NTU students " +
        "find and choose sources for essays and research.",
      {
        query: z.string().min(1).describe("Search keywords, e.g. 'climate change adaptation'"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(CONFIG.MAX_LIMIT)
          .optional()
          .describe(`How many results to return (default ${CONFIG.DEFAULT_LIMIT}, max ${CONFIG.MAX_LIMIT})`),
        resource_type: z
          .enum(["all", "articles", "books", "journals"])
          .optional()
          .describe("Filter by resource type. Default 'all'."),
      },
      async ({ query, limit, resource_type }) => {
        try {
          const result = await searchLibrary({
            query,
            limit,
            resourceType: resource_type ?? "all",
          });

          // Anonymous, best-effort usage tracking (no PII).
          const sk = await sessionKey(query + "|" + (resource_type ?? "all"));
          await trackUsage(this.env, {
            tool: "search_ntu_library",
            query,
            resourceType: resource_type ?? "all",
            resultCount: result.records.length,
            sessionKey: sk,
          });

          return { content: [{ type: "text", text: formatSearchResult(result) }] };
        } catch (err) {
          return {
            content: [
              {
                type: "text",
                text: `Could not reach ${LIBRARY_NAME}. ${(err as Error).message}. Please try again shortly.`,
              },
            ],
            isError: true,
          };
        }
      },
    );

    this.server.tool(
      "get_ntu_record",
      "Get the full abstract and access details for a single NTU Library record by its " +
        "Primo record id (the id returned by search_ntu_library, e.g. 'alma99...' or 'cdi_...').",
      {
        record_id: z.string().min(1).describe("Primo recordid from a prior search result"),
      },
      async ({ record_id }) => {
        try {
          const record = await getRecord(record_id);
          if (!record) {
            return {
              content: [{ type: "text", text: `No record found for id "${record_id}".` }],
            };
          }
          const sk = await sessionKey("record|" + record_id);
          await trackUsage(this.env, {
            tool: "get_ntu_record",
            query: record_id,
            resourceType: "record",
            resultCount: 1,
            sessionKey: sk,
          });
          return { content: [{ type: "text", text: formatRecordDetail(record) }] };
        } catch (err) {
          return {
            content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
            isError: true,
          };
        }
      },
    );

    // ---- Skills: invokable MCP prompts, one per common research job. ----
    // These appear in MCP clients (e.g. as slash commands) so a student can
    // call the skill directly instead of hand-writing the prompt.
    for (const skill of SKILLS) {
      this.server.prompt(skill.name, skill.description, skill.args, (a: Record<string, string>) => ({
        messages: [{ role: "user", content: { type: "text", text: skill.build(a) } }],
      }));
    }

    this.server.tool(
      "find_influential_research",
      "Find the MOST-CITED scholarly work on a topic, across the whole field, using " +
        "Crossref's open index of ~150M papers (not just what NTU holds). Use this to surface " +
        "seminal / high-impact sources for an argument, then cross-check the titles with " +
        "search_ntu_library to see which ones NTU can actually provide. Returns title, authors, " +
        "year, venue, citation count, and DOI. Always read what a paper argues before recommending it.",
      {
        query: z.string().min(1).describe("Topic keywords, e.g. 'hawker culture heritage'"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .describe("How many works to return (default 8, max 20)"),
        from_year: z
          .number()
          .int()
          .optional()
          .describe("Only include works published from this year onward (optional)"),
        sort: z
          .enum(["citations", "relevance"])
          .optional()
          .describe("Rank by citation impact (default) or by text relevance."),
      },
      async ({ query, limit, from_year, sort }) => {
        try {
          const result = await findInfluentialResearch({
            query,
            limit,
            fromYear: from_year,
            sort: sort ?? "citations",
          });
          const sk = await sessionKey("scholar|" + query);
          await trackUsage(this.env, {
            tool: "find_influential_research",
            query,
            resourceType: "scholar",
            resultCount: result.works.length,
            sessionKey: sk,
          });
          return { content: [{ type: "text", text: formatInfluential(result) }] };
        } catch (err) {
          return {
            content: [
              { type: "text", text: `Could not reach Crossref. ${(err as Error).message}.` },
            ],
            isError: true,
          };
        }
      },
    );
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // MCP transports
    if (url.pathname === "/mcp") {
      return NtuLibraryMCP.serve("/mcp").fetch(request, env, ctx);
    }
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return NtuLibraryMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    // Tiny public stats endpoint (from KV counters) for the "flex" numbers.
    if (url.pathname === "/stats") {
      const total = env.USAGE_KV ? Number((await env.USAGE_KV.get("total_searches")) ?? "0") : 0;
      return Response.json({ total_searches: total, library: LIBRARY_NAME });
    }

    // Health check
    if (url.pathname === "/health") {
      return new Response("ok", { status: 200 });
    }

    // The Playbook — how-to-use page with per-use-case prompts.
    if (url.pathname === "/playbook" || url.pathname === "/guide") {
      return new Response(PLAYBOOK_PAGE(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // Home page (pitch + what's included + 1-click setup + story).
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(LANDING_PAGE(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // Everything else → static assets (og.png, /media/demo.mp4, …).
    // The ASSETS binding returns its own 404 for paths with no matching file.
    return env.ASSETS.fetch(request);
  },
};
