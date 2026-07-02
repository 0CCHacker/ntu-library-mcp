---
name: cite_a_claim
description: Find a credible source that backs a specific claim you've written, with a link.
type: skill
tools: [search_ntu_library]
---

# /cite_a_claim

Find a credible source that backs a specific claim you've written, with a link.

**When to use:** You've written a sentence or claim and your tutor wants a credible source behind it.

## How to call it

Skills are MCP prompts — your client shows them as slash commands. Pick the skill
and give it your content; the client passes it in as the argument. You don't hand-write
the whole instruction — the skill expands it for you.

```
/cite_a_claim claim: "<your claim>"
```

## Inputs

- `claim` — The sentence or claim you need to support

## What it expands to

The skill sends this instruction to the assistant (`{…}` filled with your input):

> Find a credible academic source in the NTU library that supports this claim, and give me a citation with a link I can open. Confirm from the abstract that it actually backs the point. Claim: "{claim}". Read the abstracts before recommending, summarise what each source argues, and tell me how to access each (open access, NTU login, or print). Only recommend sources the tools actually return — don't add any from your own memory or invent DOIs.

**Drives:** `search_ntu_library`
