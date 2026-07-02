---
name: trace_a_fact
description: Trace a statistic or fact back to its original, citable source.
type: skill
tools: [search_ntu_library, find_influential_research]
---

# /trace_a_fact

Trace a statistic or fact back to its original, citable source.

**When to use:** You read a figure somewhere and need the original, citable research behind it.

## How to call it

Skills are MCP prompts — your client shows them as slash commands. Pick the skill
and give it your content; the client passes it in as the argument. You don't hand-write
the whole instruction — the skill expands it for you.

```
/trace_a_fact claim: "<your claim>"
```

## Inputs

- `claim` — The fact or statistic you want to source

## What it expands to

The skill sends this instruction to the assistant (`{…}` filled with your input):

> Find the original, citable research behind this fact and give me the reference with a DOI or link: "{claim}". Read the abstracts before recommending, summarise what each source argues, and tell me how to access each (open access, NTU login, or print).

**Drives:** `search_ntu_library`, `find_influential_research`
