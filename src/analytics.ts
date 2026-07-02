/**
 * Anonymous usage tracking. Privacy-first:
 *  - NO raw IPs, names, or anything personally identifying is stored.
 *  - The session id is a salted SHA-256 hash, only used to count distinct users.
 *
 * Primary sink: Cloudflare Workers Analytics Engine (SQL-queryable, ~free).
 * Fallback: a KV counter, so the server still records volume without AE.
 */
import type { Env } from "./index";

/** Salted, one-way hash of a value → non-reversible session/user bucket. */
async function hashSession(value: string): Promise<string> {
  const data = new TextEncoder().encode(`ntu-lib-mcp::${value}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

/** Derive an anonymous session key from request-ish signals (never stored raw). */
export async function sessionKey(rawSignal: string | null | undefined): Promise<string> {
  return hashSession(rawSignal || "anon");
}

export interface UsageEvent {
  query: string;
  resourceType: string;
  resultCount: number;
  sessionKey: string;
  tool: string;
}

export async function trackUsage(env: Env, event: UsageEvent): Promise<void> {
  // 1) Analytics Engine (if bound)
  try {
    env.ANALYTICS?.writeDataPoint({
      blobs: [event.tool, event.query.slice(0, 96), event.resourceType],
      doubles: [event.resultCount],
      indexes: [event.sessionKey],
    });
  } catch {
    // Analytics is best-effort; never let it break a search.
  }

  // 2) KV fallback counters (if bound) — cheap "total searches" + per-day.
  if (env.USAGE_KV) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      await Promise.all([
        bump(env.USAGE_KV, "total_searches"),
        bump(env.USAGE_KV, `searches:${today}`),
      ]);
    } catch {
      // ignore
    }
  }
}

async function bump(kv: KVNamespace, key: string): Promise<void> {
  const current = Number((await kv.get(key)) ?? "0") || 0;
  await kv.put(key, String(current + 1));
}
