/**
 * Open scholarly-metadata client, powered by Crossref (https://api.crossref.org).
 *
 * Crossref is the DOI registration agency behind ~150M scholarly works and is the
 * open index most research tools (Zotero, Paperpile, many research MCPs) build on.
 * It is fully public — no API key. We use the "polite pool" by sending a mailto.
 *
 * This complements the NTU catalogue search: OneSearch tells you what NTU HOLDS;
 * Crossref tells you what the FIELD cites most. Pairing them lets the AI recommend
 * influential work and then check whether a student can get it via NTU.
 */

const CROSSREF = "https://api.crossref.org/works";
const POLITE_MAILTO = "ntu-library-mcp@users.noreply.github.com";
const UA = "ntu-library-mcp/1.0 (Cloudflare Worker; +https://github.com/)";

export interface InfluentialWork {
  title: string;
  authors: string[];
  year: number | null;
  venue: string | null;
  doi: string | null;
  doiUrl: string | null;
  citationCount: number;
  type: string;
  isOpenAccess: boolean;
}

export interface InfluentialResult {
  query: string;
  total: number;
  works: InfluentialWork[];
}

function firstAuthors(item: any, max = 3): string[] {
  const list: any[] = Array.isArray(item?.author) ? item.author : [];
  return list
    .slice(0, max)
    .map((a) => [a.given, a.family].filter(Boolean).join(" ").trim() || a.name)
    .filter(Boolean);
}

function pubYear(item: any): number | null {
  const parts =
    item?.issued?.["date-parts"]?.[0] ??
    item?.["published-print"]?.["date-parts"]?.[0] ??
    item?.["published-online"]?.["date-parts"]?.[0];
  const y = Array.isArray(parts) ? parts[0] : undefined;
  return typeof y === "number" ? y : null;
}

function parseWork(item: any): InfluentialWork {
  const doi: string | null = item?.DOI ?? null;
  return {
    title: (Array.isArray(item?.title) ? item.title[0] : item?.title) ?? "(untitled)",
    authors: firstAuthors(item),
    year: pubYear(item),
    venue: (Array.isArray(item?.["container-title"]) ? item["container-title"][0] : null) ?? null,
    doi,
    doiUrl: doi ? `https://doi.org/${doi}` : null,
    citationCount: Number(item?.["is-referenced-by-count"] ?? 0) || 0,
    type: String(item?.type ?? "").replace(/-/g, " ") || "work",
    // Crossref exposes a licence/OA hint; treat a free-to-read licence as OA.
    isOpenAccess: Array.isArray(item?.license) && item.license.length > 0,
  };
}

export type ScholarSort = "citations" | "relevance";

export interface ScholarOptions {
  query: string;
  limit?: number;
  sort?: ScholarSort;
  fromYear?: number;
}

export async function findInfluentialResearch(opts: ScholarOptions): Promise<InfluentialResult> {
  const query = opts.query.trim();
  if (!query) throw new Error("query must not be empty");
  const limit = Math.min(Math.max(opts.limit ?? 8, 1), 20);
  const sort: ScholarSort = opts.sort ?? "citations";

  // Crossref's own sort=citations ignores relevance and returns the most-cited
  // paper on the planet regardless of topic. So we always fetch a *relevance*-
  // ranked pool, then (for "citations") re-rank that topical pool by impact.
  const pool = Math.min(sort === "citations" ? limit * 4 : limit, 40);
  const params = new URLSearchParams({
    query,
    rows: String(pool),
    // Only request the fields we actually use — keeps responses small & fast.
    select: "title,author,issued,container-title,DOI,is-referenced-by-count,type,license",
    mailto: POLITE_MAILTO,
  });
  if (opts.fromYear && Number.isFinite(opts.fromYear)) {
    params.set("filter", `from-pub-date:${opts.fromYear}-01-01`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${CROSSREF}?${params.toString()}`, {
      headers: { accept: "application/json", "user-agent": UA },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Crossref returned HTTP ${res.status}`);
    const json = (await res.json()) as any;
    const items: any[] = json?.message?.items ?? [];
    let works = items.map(parseWork);
    if (sort === "citations") {
      works = works.sort((a, b) => b.citationCount - a.citationCount);
    }
    return {
      query,
      total: Number(json?.message?.["total-results"] ?? items.length) || items.length,
      works: works.slice(0, limit),
    };
  } finally {
    clearTimeout(timer);
  }
}

export function formatInfluential(result: InfluentialResult): string {
  if (result.works.length === 0) {
    return `No scholarly works found for "${result.query}".`;
  }
  const head =
    `Most-cited scholarly work on "${result.query}" (from Crossref, ${result.total.toLocaleString("en-US")} matches). ` +
    `Cross-check these titles with search_ntu_library to see which NTU can give you:\n`;
  const body = result.works
    .map((w, i) => {
      const who = w.authors.length ? w.authors.join("; ") : "Unknown";
      const yr = w.year ? ` (${w.year})` : "";
      const cites = `${w.citationCount.toLocaleString("en-US")} citations`;
      const lines = [
        `${i + 1}. ${w.title}${yr} — ${who}`,
        `   ${cites}${w.venue ? ` · ${w.venue}` : ""} · ${w.type}`,
      ];
      if (w.doiUrl) lines.push(`   ${w.doiUrl}${w.isOpenAccess ? "  (a free version may exist)" : ""}`);
      return lines.join("\n");
    })
    .join("\n\n");
  return `${head}\n${body}`;
}
