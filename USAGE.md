---
name: ntu-library-research
description: How to use the NTU Library MCP tools to find, read, and recommend academic sources for NTU students (especially the CC0001 op-ed). Read this before calling the tools.
---

# NTU Library — research assistant skill

This MCP server connects an AI to **NTU Singapore's library (OneSearch / Primo)**
plus **Crossref's open citation index**. Its job: help a student find the *few*
sources that are relevant, readable, and gettable — not dump a results page.

> The server also sends these rules as MCP "instructions" on connect, but this
> file is the full reference for the tools and their parameters.

## The one rule that matters

**Always read the abstract before you recommend a source.** Never suggest a paper
on its title alone. For each source you put forward, summarise what it actually
argues in 1–2 sentences, and say how the student can get it. If a result has no
abstract, say so rather than guessing.

## Tools

### 1. `search_ntu_library` — what NTU *holds* (use this first)

Searches NTU's catalogue. Returns title, author, year, type, abstract, DOI, a
permalink, and an **access tag** for each hit.

| Parameter | Type | Required | Default | Notes |
|-----------|------|----------|---------|-------|
| `query` | string | ✅ | — | **Concise keywords, 2–5 words.** `hawker culture heritage`, not a full sentence. |
| `limit` | number | ✕ | 10 | 1–25. Ask for fewer (5–8) for a tight, high-signal list. |
| `resource_type` | enum | ✕ | `all` | `articles` \| `books` \| `journals` \| `all`. Narrow when the student asks for a specific kind. |

**Access tags → how to advise:**
- ✅ **Open access / digital repository** — download directly, no login.
- 🔒 **Online via NTU subscription** — sign in with the NTU account (EZproxy).
- 📚 **Print only** — borrow on the shelf; not downloadable.

Lead with ✅, then 🔒, then 📚.

### 2. `find_influential_research` — what the *field* cites most

Uses Crossref (~150M papers, not limited to NTU) to surface the **most-cited**
work on a topic. Use it when the student wants seminal / high-impact sources or
wants to strengthen an argument. **Then cross-check the titles with
`search_ntu_library`** to see which ones NTU can actually provide.

| Parameter | Type | Required | Default | Notes |
|-----------|------|----------|---------|-------|
| `query` | string | ✅ | — | Topic keywords. |
| `limit` | number | ✕ | 8 | 1–20. |
| `from_year` | number | ✕ | — | Only works published from this year onward. Good for "recent" requests. |
| `sort` | enum | ✕ | `citations` | `citations` (impact) or `relevance` (text match). |

Returns title, authors, year, venue, **citation count**, type, DOI. Citation count
is a signal of influence, *not* of quality or fit — still read the abstract.

### 3. `get_ntu_record` — deep-read one item

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `record_id` | string | ✅ | The Primo `recordid` from a `search_ntu_library` result (`alma…` or `cdi_…`). |

Returns the full abstract and access detail for a single record.

## A good workflow

1. **Clarify the angle** if the topic is vague (the CC0001 op-ed needs a specific
   claim, not just a theme).
2. `search_ntu_library` with tight keywords → read the abstracts → shortlist the
   3–5 most relevant.
3. If they want heavier hitters, `find_influential_research` → pick the top
   most-cited → re-run those titles through `search_ntu_library` to check NTU access.
4. Present a short, ranked list: **what each argues + how to get it**, ✅ first.

## Example prompts a student might give

- "Find NTU sources on whether hawker culture can survive — ones I can download."
- "What are the most-cited papers on urban food heritage? Can NTU get them?"
- "Summarise the abstract of that second result and tell me if it supports my thesis."

## Boundaries

Public search + open metadata only. No full-text scraping, no EZproxy wrapping,
no re-hosting publisher PDFs. Point the student to the legitimate copy.
