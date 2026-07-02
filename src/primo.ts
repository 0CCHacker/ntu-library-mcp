/**
 * Thin client + parser for NTU's Primo public search API (`pnxs`).
 *
 * We only touch the public search endpoint — no full-text scraping, no EZproxy
 * wrapping, no caching of publisher content. See README §"Boundaries".
 */
import { CONFIG } from "./config";

export type ResourceType = "all" | "articles" | "books" | "journals";

export interface SearchOptions {
  query: string;
  limit?: number;
  resourceType?: ResourceType;
  offset?: number;
}

/** Access situation for a record, drives the student download recommendation. */
export type Access =
  | "open_access" // free to read for everyone
  | "online_licensed" // full text online, but needs NTU login / EZproxy
  | "digital_repository" // NTU digital object (DR-NTU etc.)
  | "physical" // print only, on a library shelf
  | "unknown";

export interface LibraryRecord {
  recordId: string;
  title: string;
  authors: string[];
  year: string | null;
  type: string; // article | book | journal | ...
  abstract: string | null;
  doi: string | null;
  permalink: string;
  access: Access;
  fulltextAvailable: boolean;
  /** One-line, student-facing download recommendation with an emoji cue. */
  recommendation: string;
}

export interface SearchResult {
  total: number;
  records: LibraryRecord[];
  query: string;
}

const rtypeFacet: Record<Exclude<ResourceType, "all">, string> = {
  articles: "articles",
  books: "books",
  journals: "journals",
};

/** Primo wraps some display fields with `$$Q...` / `$$...` markup — strip it. */
function clean(value: string | undefined): string {
  if (!value) return "";
  // Take the human-readable segment before any `$$X` control marker.
  return value.split("$$")[0].replace(/\s+/g, " ").trim();
}

function firstClean(arr: unknown): string | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const v = clean(String(arr[0]));
  return v.length ? v : null;
}

function allClean(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of arr) {
    const v = clean(String(raw));
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

function buildPermalink(recordId: string, context: string): string {
  const params = new URLSearchParams({
    docid: recordId,
    context: context || "L",
    vid: CONFIG.VID,
    lang: CONFIG.LANG,
  });
  return `https://${CONFIG.PRIMO_HOST}/discovery/fulldisplay?${params.toString()}`;
}

/**
 * Classify how a student can actually get the item, and phrase the advice.
 * This mapping is the heart of the tool's value.
 */
function classifyAccess(doc: any): { access: Access; available: boolean; recommendation: string } {
  const delivery = doc?.delivery ?? {};
  const categories: string[] = Array.isArray(delivery.deliveryCategory)
    ? delivery.deliveryCategory
    : delivery.deliveryCategory
      ? [delivery.deliveryCategory]
      : [];
  const oa: string[] = Array.isArray(doc?.pnx?.addata?.oa) ? doc.pnx.addata.oa : [];
  const isOpenAccess = oa.some((v) => /free|open/i.test(String(v)));

  const has = (needle: string) => categories.some((c) => c.toLowerCase().includes(needle));

  if (isOpenAccess) {
    return {
      access: "open_access",
      available: true,
      recommendation: "✅ Open access — free to download directly, no login needed. Prefer this one.",
    };
  }
  if (has("alma-d") || has("digital")) {
    return {
      access: "digital_repository",
      available: true,
      recommendation: "✅ In NTU's digital repository (e.g. DR-NTU) — usually downloadable directly.",
    };
  }
  if (has("alma-e") || has("remote search") || has("online")) {
    return {
      access: "online_licensed",
      available: true,
      recommendation: "🔒 Full text online via NTU subscription — sign in with your NTU account (EZproxy) to download.",
    };
  }
  if (has("alma-p") || has("physical") || has("print")) {
    return {
      access: "physical",
      available: false,
      recommendation: "📚 Print copy only — not downloadable. Borrow it on the shelf at an NTU library.",
    };
  }
  return {
    access: "unknown",
    available: false,
    recommendation: "❔ Availability unclear — open the record link to check how to get it.",
  };
}

function parseDoc(doc: any): LibraryRecord {
  const display = doc?.pnx?.display ?? {};
  const addata = doc?.pnx?.addata ?? {};
  const control = doc?.pnx?.control ?? {};
  const recordId = firstClean(control.recordid) ?? doc?.["@id"] ?? "";
  const context = String(doc?.context ?? "L");

  const authors = allClean(display.creator);
  const contributors = allClean(display.contributor);
  const abstract = firstClean(addata.abstract) ?? firstClean(display.description);

  const { access, available, recommendation } = classifyAccess(doc);

  return {
    recordId,
    title: firstClean(display.title) ?? "(untitled)",
    authors: authors.length ? authors : contributors,
    year: firstClean(display.creationdate),
    type: (firstClean(display.type) ?? "resource").toLowerCase(),
    abstract,
    doi: firstClean(addata.doi),
    permalink: buildPermalink(recordId, context),
    access,
    fulltextAvailable: available,
    recommendation,
  };
}

/** Build the pnxs query string for a search. */
function buildSearchUrl(opts: Required<Pick<SearchOptions, "query" | "limit" | "offset" | "resourceType">>): string {
  const params = new URLSearchParams({
    blendFacetsSeparately: "false",
    disableCache: "false",
    getMore: "0",
    inst: CONFIG.INST,
    lang: CONFIG.LANG,
    limit: String(opts.limit),
    offset: String(opts.offset),
    pcAvailability: "true",
    q: `any,contains,${opts.query}`,
    qExclude: "",
    qInclude: "",
    refEntryActive: "false",
    rtaLinks: "true",
    scope: CONFIG.SCOPE,
    skipDelivery: "N",
    sort: "rank",
    tab: CONFIG.TAB,
    vid: CONFIG.VID,
  });
  if (opts.resourceType !== "all") {
    params.set("multiFacets", `facet_rtype,include,${rtypeFacet[opts.resourceType]}`);
  }
  return `https://${CONFIG.PRIMO_HOST}/primaws/rest/pub/pnxs?${params.toString()}`;
}

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function fetchPrimo(url: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        // Primo's public tier returns 400 to header-less clients.
        "user-agent": BROWSER_UA,
        referer: `https://${CONFIG.PRIMO_HOST}/discovery/search?vid=${CONFIG.VID}`,
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Primo API returned HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function searchLibrary(opts: SearchOptions): Promise<SearchResult> {
  const query = opts.query.trim();
  if (!query) throw new Error("query must not be empty");

  const limit = Math.min(Math.max(opts.limit ?? CONFIG.DEFAULT_LIMIT, 1), CONFIG.MAX_LIMIT);
  const url = buildSearchUrl({
    query,
    limit,
    offset: Math.max(opts.offset ?? 0, 0),
    resourceType: opts.resourceType ?? "all",
  });

  const json = await fetchPrimo(url);
  const docs: any[] = Array.isArray(json?.docs) ? json.docs : [];
  const total = Number(json?.info?.total ?? docs.length) || docs.length;

  return {
    total,
    query,
    records: docs.map(parseDoc),
  };
}

/** Fetch a single record by its Primo recordid (for get_abstract). */
export async function getRecord(recordId: string): Promise<LibraryRecord | null> {
  const id = recordId.trim();
  if (!id) throw new Error("record_id must not be empty");
  const params = new URLSearchParams({
    inst: CONFIG.INST,
    lang: CONFIG.LANG,
    limit: "1",
    offset: "0",
    pcAvailability: "true",
    q: `any,contains,${id}`,
    qExclude: "",
    qInclude: "",
    rtaLinks: "true",
    scope: CONFIG.SCOPE,
    skipDelivery: "N",
    sort: "rank",
    tab: CONFIG.TAB,
    vid: CONFIG.VID,
  });
  const url = `https://${CONFIG.PRIMO_HOST}/primaws/rest/pub/pnxs?${params.toString()}`;
  const json = await fetchPrimo(url);
  const docs: any[] = Array.isArray(json?.docs) ? json.docs : [];
  const match = docs.find((d) => firstClean(d?.pnx?.control?.recordid) === id) ?? docs[0];
  return match ? parseDoc(match) : null;
}
