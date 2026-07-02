/**
 * Generates one Markdown "agent card" per skill into skills/, from the single
 * source of truth in src/skills.ts. Run: npm run skills:gen
 *
 * Each card documents how to invoke the skill (as a slash command with your
 * content) and exactly what instruction it expands into.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SKILLS, type Skill } from "../src/skills";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "skills");
mkdirSync(OUT, { recursive: true });

function argNames(s: Skill): string[] {
  return Object.keys(s.args);
}
function isOptional(s: Skill, name: string): boolean {
  return s.args[name].isOptional();
}
function argDesc(s: Skill, name: string): string {
  return (s.args[name].description ?? "").toString();
}

/** Render the template with {placeholder} tokens instead of real values. */
function template(s: Skill): string {
  const filled: Record<string, string> = {};
  for (const n of argNames(s)) filled[n] = `{${n}}`;
  return s.build(filled);
}

/** A concrete example call + expansion, using each arg's description as a hint. */
function example(s: Skill): { call: string; text: string } {
  const names = argNames(s);
  const primary = names[0];
  const sample: Record<string, string> = { [primary]: "<your " + primary + ">" };
  const call =
    names.length === 1
      ? `/${s.name} ${primary}: "<your ${primary}>"`
      : `/${s.name} ${names.map((n) => `${n}: "…"`).join("  ")}`;
  return { call, text: s.build(sample) };
}

function card(s: Skill): string {
  const inputs = argNames(s)
    .map((n) => `- \`${n}\`${isOptional(s, n) ? " *(optional)*" : ""} — ${argDesc(s, n)}`)
    .join("\n");
  const ex = example(s);
  return `---
name: ${s.name}
description: ${s.description}
type: skill
tools: [${s.tools.join(", ")}]
---

# /${s.name}

${s.description}

**When to use:** ${s.when}

## How to call it

Skills are MCP prompts — your client shows them as slash commands. Pick the skill
and give it your content; the client passes it in as the argument. You don't hand-write
the whole instruction — the skill expands it for you.

\`\`\`
${ex.call}
\`\`\`

## Inputs

${inputs}

## What it expands to

The skill sends this instruction to the assistant (\`{…}\` filled with your input):

> ${template(s)}

**Drives:** ${s.tools.map((t) => `\`${t}\``).join(", ")}
`;
}

const names: string[] = [];
for (const s of SKILLS) {
  writeFileSync(join(OUT, `${s.name}.md`), card(s));
  names.push(s.name);
}

// index
const index = `# Skills

Invokable **MCP prompts** shipped by the NTU Library MCP server. In your AI client
they appear as slash commands — pick one and give it your content (a claim, topic,
or title). The skill expands your input into a ready-to-run instruction that drives
the tools, so you don't have to phrase the whole prompt yourself.

> Auto-generated from \`src/skills.ts\` by \`npm run skills:gen\` — edit the source, not these files.

| Skill | Use it to |
|-------|-----------|
${SKILLS.map((s) => `| [\`/${s.name}\`](./${s.name}.md) | ${s.description} |`).join("\n")}

## Two ways to use them

1. **Just talk** — describe what you need in plain language; the assistant already
   knows the tools (the server sends usage rules on connect).
2. **Call the skill** — run \`/${SKILLS[0].name}\` (etc.) and fill in your content when
   the client asks. Faster and consistent, especially for repeat tasks.

Either way, the golden rule is baked in: it reads the abstract before recommending
a source.
`;
writeFileSync(join(OUT, "README.md"), index);

console.log(`Wrote ${names.length} skill cards + index to skills/:`);
console.log("  " + names.map((n) => n + ".md").join(", "));
