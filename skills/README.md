# Skills

Invokable **MCP prompts** shipped by the NTU Library MCP server. In your AI client
they appear as slash commands — pick one and give it your content (a claim, topic,
or title). The skill expands your input into a ready-to-run instruction that drives
the tools, so you don't have to phrase the whole prompt yourself.

> Auto-generated from `src/skills.ts` by `npm run skills:gen` — edit the source, not these files.

| Skill | Use it to |
|-------|-----------|
| [`/cite_a_claim`](./cite_a_claim.md) | Find a credible source that backs a specific claim you've written, with a link. |
| [`/reading_list`](./reading_list.md) | Build a starter reading list of sources on a topic, marked by how to get each. |
| [`/most_cited`](./most_cited.md) | Find the most-cited work on a topic, then check NTU access. |
| [`/downloadable_only`](./downloadable_only.md) | Find sources on a topic you can read online or download right now. |
| [`/trace_a_fact`](./trace_a_fact.md) | Trace a statistic or fact back to its original, citable source. |
| [`/find_a_book`](./find_a_book.md) | Check whether NTU has a specific book and where to get it. |

## Two ways to use them

1. **Just talk** — describe what you need in plain language; the assistant already
   knows the tools (the server sends usage rules on connect).
2. **Call the skill** — run `/cite_a_claim` (etc.) and fill in your content when
   the client asks. Faster and consistent, especially for repeat tasks.

Either way, the golden rule is baked in: it reads the abstract before recommending
a source.
