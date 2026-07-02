---
name: most_cited
description: Find the most-cited work on a topic, then check NTU access.
type: skill
tools: [find_influential_research, search_ntu_library]
---

# /most_cited

Find the most-cited work on a topic, then check NTU access.

**When to use:** You want the seminal, high-impact paper the whole field cites — to anchor an argument.

## How to call it

Skills are MCP prompts — your client shows them as slash commands. Pick the skill
and give it your content; the client passes it in as the argument. You don't hand-write
the whole instruction — the skill expands it for you.

```
/most_cited topic: "<your topic>"
```

## Inputs

- `topic` — Research topic

## What it expands to

The skill sends this instruction to the assistant (`{…}` filled with your input):

> Find the most-cited academic works on "{topic}" with find_influential_research, then cross-check which of the top titles NTU can give me access to via search_ntu_library. Read the abstracts before recommending, summarise what each source argues, and tell me how to access each (open access, NTU login, or print). Only recommend sources the tools actually return — don't add any from your own memory or invent DOIs.

**Drives:** `find_influential_research`, `search_ntu_library`
