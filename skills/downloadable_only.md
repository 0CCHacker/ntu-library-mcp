---
name: downloadable_only
description: Find sources on a topic you can read online or download right now.
type: skill
tools: [search_ntu_library]
---

# /downloadable_only

Find sources on a topic you can read online or download right now.

**When to use:** Deadline's near — you only want sources you can open tonight, not request.

## How to call it

Skills are MCP prompts — your client shows them as slash commands. Pick the skill
and give it your content; the client passes it in as the argument. You don't hand-write
the whole instruction — the skill expands it for you.

```
/downloadable_only topic: "…"  recent_years: "…"
```

## Inputs

- `topic` — Topic to search
- `recent_years` *(optional)* — Only the last N years (optional)

## What it expands to

The skill sends this instruction to the assistant (`{…}` filled with your input):

> Find peer-reviewed articles on "{topic}" from the last {recent_years} years that I can download for free or read online with my NTU login — skip anything print-only. Read the abstracts before recommending, summarise what each source argues, and tell me how to access each (open access, NTU login, or print).

**Drives:** `search_ntu_library`
