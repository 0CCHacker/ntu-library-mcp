---
name: find_a_book
description: Check whether NTU has a specific book and where to get it.
type: skill
tools: [search_ntu_library]
---

# /find_a_book

Check whether NTU has a specific book and where to get it.

**When to use:** A reading references a specific book and you want to know if NTU has it, and where.

## How to call it

Skills are MCP prompts — your client shows them as slash commands. Pick the skill
and give it your content; the client passes it in as the argument. You don't hand-write
the whole instruction — the skill expands it for you.

```
/find_a_book title: "<your title>"
```

## Inputs

- `title` — Book title (and author if known)

## What it expands to

The skill sends this instruction to the assistant (`{…}` filled with your input):

> Does NTU have the book "{title}"? Tell me whether it's available online or in print, and if print, where to find it. Use search_ntu_library with books.

**Drives:** `search_ntu_library`
