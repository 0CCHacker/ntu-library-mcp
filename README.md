# NTU Library MCP Server

> **Find the right source, not 3 million results.**
> An AI research assistant for NTU Singapore students — it plugs the library's
> OneSearch catalogue straight into Claude (or any MCP client) so your AI can
> **search, read the abstracts, and tell you which copy you can actually
> download.** Built for the CC0001 op-ed grind. Free & open source.

A remote [Model Context Protocol](https://modelcontextprotocol.io) server running
on Cloudflare Workers. It wraps NTU's **public** Ex Libris Primo search API and
turns raw results into student-friendly recommendations.

---

## Why

Every NTU first-year takes **CC0001 – Inquiry & Communication in an
Interdisciplinary World**: a whole semester spent building one op-ed. The hardest
part isn't the writing — it's finding *credible sources you can actually read
tonight*. Type your topic into OneSearch and it answers with two million results.

You don't need two million. You need the handful that are relevant, that you can
skim the abstract of, and that aren't locked behind a login you'll rage-quit at
1am. AI is great at that triage — it just couldn't see NTU's catalogue. This is
the bridge.

---

## What it does

| Tool | What it does |
|------|--------------|
| `search_ntu_library` | What NTU **holds**. Search OneSearch by keyword → title, author, year, abstract, DOI, permalink, and a **download recommendation** per hit. Optional `resource_type` (`articles`/`books`/`journals`/`all`) and `limit`. |
| `find_influential_research` | What the **field cites most**. Taps [Crossref](https://www.crossref.org)'s ~150M-work open index to surface the most-cited papers on a topic (topically ranked, then sorted by citations), so students can cite what the field actually builds on — then cross-check availability with `search_ntu_library`. |
| `get_ntu_record` | Fetch the full abstract + access detail for one record by its Primo `recordid`. |

Full parameter reference and prompting guidance for the AI live in
[`USAGE.md`](USAGE.md) (a skill-style doc). The server also ships these as MCP
`instructions`, including the key rule: **always read the abstract before
recommending a source.**

**The recommendation is the point.** Each result is tagged:

- ✅ **Open access / digital repository** — download directly, no login.
- 🔒 **Online via NTU subscription** — sign in with your NTU account (EZproxy).
- 📚 **Print only** — borrow it on the shelf; not downloadable.

---

## Architecture

```
MCP client (Claude / Cursor / …)
        │  MCP over HTTP+SSE
        ▼
Cloudflare Worker  (McpAgent, Durable Object)
        │  GET /primaws/rest/pub/pnxs   (public tier, no key)
        ▼
NTU Primo — ntu-sp.primo.exlibrisgroup.com
        │
        └─▶ Analytics Engine + KV  (anonymous usage counts, no PII)
```

- **Stack:** TypeScript · Cloudflare Workers · Agents SDK (`McpAgent`) · Zod.
- **No auth** — reads public library data only.
- **Endpoints:** `/mcp` (Streamable HTTP), `/sse` (SSE), `/` (landing page),
  `/stats` (anonymous total), `/health`.

Source of truth for NTU's Primo config lives in [`src/config.ts`](src/config.ts).

---

## Setup / Deploy

```bash
npm install
npm run typecheck          # sanity check
npm run site               # preview the website only → http://localhost:3000  (+ /playbook)
npm run dev                # full Worker (site + MCP tools + /stats) → http://localhost:8787
npx wrangler deploy        # → https://ntu-library.openskillshub.org/mcp
```

- `npm run site` — fastest way to eyeball the marketing site (home + Playbook). No Cloudflare runtime needed.
- `npm run dev` — the real Worker via wrangler: serves the pages **and** the MCP endpoints at `/mcp` and `/sse`.

### Pages

| Route | What |
|-------|------|
| `/` | Home — pitch, use cases, what's included, one-click setup. |
| `/playbook` | The Playbook — copy-paste prompts (plays) for each research job. |
| `/mcp`, `/sse` | MCP transports (Streamable HTTP / SSE). |
| `/stats` | Anonymous total search count (JSON). |

### Skills (invokable MCP prompts)

Beyond the tools, the server exposes **skills** — named prompts a client surfaces
(often as slash commands) so a student can call a task directly:
`cite_a_claim` · `reading_list` · `most_cited` · `downloadable_only` ·
`trace_a_fact` · `find_a_book`. You **pick the skill and give it your content**
(a claim / topic / title); it expands that into a ready-to-run instruction that
drives the tools. Example:

```
/cite_a_claim claim: "Hawker centres strengthen social ties across income groups."
```

Skills are defined once in [`src/skills.ts`](src/skills.ts). Human-readable
"agent cards" (one Markdown file per skill) live in [`skills/`](skills/) and are
regenerated from that source with:

```bash
npm run skills:gen
```

### Analytics (optional but nice for the "flex" numbers)

Analytics Engine is already bound in [`wrangler.jsonc`](wrangler.jsonc). To also
keep a simple KV counter, create the namespace and uncomment the `kv_namespaces`
block:

```bash
npx wrangler kv namespace create USAGE_KV
# paste the returned id into wrangler.jsonc
```

Query usage later with the Analytics Engine SQL API (total searches, distinct
hashed sessions, top keywords, p95 latency).

---

## Connect a client

Live server URL: **`https://ntu-library.openskillshub.org/mcp`**

Most clients now add a remote MCP server **through the UI** — no JSON editing:

- **Claude** (Desktop / claude.ai / mobile) — Settings → **Connectors** → *Add
  custom connector* → paste the URL.
  [Official guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).
  Works on Free, Pro, Max, Team & Enterprise (Free = 1 connector).
- **ChatGPT** (Plus / Pro / Business / Enterprise / Edu — not Free) — Settings →
  **Connectors** → *Create* (Business/Enterprise: an admin enables **Developer
  mode** first).
  [Connectors in ChatGPT](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) ·
  [Developer mode](https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt).
- **Gemini** — Gemini CLI: `gemini mcp add -t http ntu-library <url>/mcp`
  ([guide](https://geminicli.com/docs/tools/mcp-server/)). Enterprise admins use a
  [custom MCP data store](https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/set-up-custom-mcp-server).
- **Claude Code** — `claude mcp add --transport http ntu-library <url>/mcp`
  ([docs](https://docs.claude.com/en/docs/claude-code/mcp)).
- **Cursor / dev tools** — add to `~/.cursor/mcp.json` under `mcpServers`
  ([docs](https://docs.cursor.com/context/model-context-protocol)).

Then ask: *"Search NTU Library for sources on my topic — ones I can download."*
The deployed home page at `/` has this same copy-paste setup with links, and
`/playbook` has ready-made prompts.

---

## Boundaries (please respect these)

This project deliberately stays on the right side of the library's terms of use:

- **Public search endpoint only.** No full-text scraping, no EZproxy wrapping, no
  caching or re-hosting of publisher content. It points you at the legitimate
  copy; you download it the normal way.
- The catalogue data belongs to **Ex Libris and NTU's subscribed publishers** —
  not to this project. So it stays **free and open source for NTU students**, with
  no ads and no commercialisation of NTU's licensed resources.
- **Anonymous by design.** Usage tracking stores no IPs, names, or PII — only
  salted hashes to count distinct users. See [`src/analytics.ts`](src/analytics.ts).
- Be gentle with Primo's rate limits (bounded `limit`, request timeouts).

Not affiliated with NTU or Ex Libris.

---

## Project layout

```
src/
  index.ts       MCP server (McpAgent) + tools + HTTP routing
  primo.ts       Primo API client, PNX parser, access classification
  format.ts      Structured records → text the AI reads back
  analytics.ts   Anonymous usage tracking (Analytics Engine + KV)
  config.ts      NTU Primo host / vid / scope / tab (verified live)
  landing.ts     The public landing page (self-contained HTML)
wrangler.jsonc   Worker + Durable Object + Analytics bindings
```

## License

MIT.
