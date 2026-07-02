---
name: reading_list
description: Build a starter reading list of sources on a topic, marked by how to get each.
type: skill
tools: [search_ntu_library]
---

# /reading_list

Build a starter reading list of sources on a topic, marked by how to get each.

**When to use:** New essay, blank page — you want 5–6 solid sources to start from.

## How to call it

Skills are MCP prompts — your client shows them as slash commands. Pick the skill
and give it your content; the client passes it in as the argument. You don't hand-write
the whole instruction — the skill expands it for you.

```
/reading_list topic: "…"  count: "…"
```

## Inputs

- `topic` — Essay / project topic
- `count` *(optional)* — How many sources (default 6)

## What it expands to

The skill sends this instruction to the assistant (`{…}` filled with your input):

> Build me a reading list of {count} sources on "{topic}" using the NTU library. Mix open-access and library items, and clearly mark which I can download now. Read the abstracts before recommending, summarise what each source argues, and tell me how to access each (open access, NTU login, or print).

**Drives:** `search_ntu_library`
