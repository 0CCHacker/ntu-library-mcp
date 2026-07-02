/**
 * Turn structured records into compact text the AI reads back to a student.
 * Optimised for an LLM to summarise, not for pixel-perfect display.
 */
import type { LibraryRecord, SearchResult } from "./primo";

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

function formatRecord(r: LibraryRecord, index: number): string {
  const lines: string[] = [];
  const author = r.authors.length ? r.authors.slice(0, 3).join("; ") : "Unknown author";
  const year = r.year ? ` (${r.year})` : "";
  lines.push(`${index}. ${r.title}${year} — ${author} [${r.type}]`);
  if (r.abstract) {
    // Fuller abstract so the AI can judge relevance from the search alone
    // (call get_ntu_record for the complete text if this is still cut off).
    lines.push(`   Abstract: ${truncate(r.abstract, 700)}`);
  }
  if (r.doi) lines.push(`   DOI: ${r.doi}`);
  lines.push(`   ${r.recommendation}`);
  lines.push(`   Record: ${r.permalink}`);
  return lines.join("\n");
}

export function formatSearchResult(result: SearchResult): string {
  if (result.records.length === 0) {
    return `No results found in NTU Library for "${result.query}". Try broader or different keywords.`;
  }
  const header =
    `Found ${result.total.toLocaleString("en-US")} results in NTU Library for "${result.query}". ` +
    `Showing the top ${result.records.length}, ranked by relevance:\n`;

  const body = result.records.map((r, i) => formatRecord(r, i + 1)).join("\n\n");

  const legend =
    "\n\nDownload guide: ✅ = get it directly · 🔒 = online but needs NTU login (EZproxy) · " +
    "📚 = print only, borrow on shelf.";

  return `${header}\n${body}${legend}`;
}

export function formatRecordDetail(r: LibraryRecord): string {
  const lines: string[] = [];
  lines.push(`Title: ${r.title}`);
  if (r.authors.length) lines.push(`Author(s): ${r.authors.join("; ")}`);
  if (r.year) lines.push(`Year: ${r.year}`);
  lines.push(`Type: ${r.type}`);
  if (r.doi) lines.push(`DOI: ${r.doi}`);
  lines.push(`Abstract: ${r.abstract ?? "(no abstract available for this record)"}`);
  lines.push(`Access: ${r.recommendation}`);
  lines.push(`Record link: ${r.permalink}`);
  return lines.join("\n");
}
