/**
 * Skills = invokable MCP prompts, one per common research task. Clients surface
 * these (often as slash commands) so a student can call the task directly:
 * pick the skill, give it your content (a claim / topic / title), and it expands
 * into a ready-to-run instruction that drives the tools.
 *
 * This is the single source of truth: index.ts registers these as MCP prompts,
 * and scripts/gen-skills.ts renders one Markdown "agent card" per skill from it.
 */
import { z } from "zod";

export interface Skill {
  /** Slash-command name, e.g. cite_a_claim */
  name: string;
  /** One-line summary shown by clients. */
  description: string;
  /** When a student should reach for this. */
  when: string;
  /** Tool(s) the resulting prompt is meant to drive. */
  tools: string[];
  /** Zod raw shape for the skill's arguments. */
  args: Record<string, z.ZodType>;
  /** Build the ready-to-run instruction from the student's input. */
  build: (a: Record<string, string>) => string;
}

const READ_RULE =
  "Read the abstracts before recommending, summarise what each source argues, and tell me how to access each (open access, NTU login, or print).";

export const SKILLS: Skill[] = [
  {
    name: "cite_a_claim",
    description: "Find a credible source that backs a specific claim you've written, with a link.",
    when: "You've written a sentence or claim and your tutor wants a credible source behind it.",
    tools: ["search_ntu_library"],
    args: { claim: z.string().describe("The sentence or claim you need to support") },
    build: (a) =>
      `Find a credible academic source in the NTU library that supports this claim, and give me a citation with a link I can open. Confirm from the abstract that it actually backs the point. Claim: "${a.claim}". ${READ_RULE}`,
  },
  {
    name: "reading_list",
    description: "Build a starter reading list of sources on a topic, marked by how to get each.",
    when: "New essay, blank page — you want 5–6 solid sources to start from.",
    tools: ["search_ntu_library"],
    args: {
      topic: z.string().describe("Essay / project topic"),
      count: z.string().optional().describe("How many sources (default 6)"),
    },
    build: (a) =>
      `Build me a reading list of ${a.count ?? "6"} sources on "${a.topic}" using the NTU library. Mix open-access and library items, and clearly mark which I can download now. ${READ_RULE}`,
  },
  {
    name: "most_cited",
    description: "Find the most-cited work on a topic, then check NTU access.",
    when: "You want the seminal, high-impact paper the whole field cites — to anchor an argument.",
    tools: ["find_influential_research", "search_ntu_library"],
    args: { topic: z.string().describe("Research topic") },
    build: (a) =>
      `Find the most-cited academic works on "${a.topic}" with find_influential_research, then cross-check which of the top titles NTU can give me access to via search_ntu_library. ${READ_RULE}`,
  },
  {
    name: "downloadable_only",
    description: "Find sources on a topic you can read online or download right now.",
    when: "Deadline's near — you only want sources you can open tonight, not request.",
    tools: ["search_ntu_library"],
    args: {
      topic: z.string().describe("Topic to search"),
      recent_years: z.string().optional().describe("Only the last N years (optional)"),
    },
    build: (a) =>
      `Find peer-reviewed articles on "${a.topic}"${a.recent_years ? ` from the last ${a.recent_years} years` : ""} that I can download for free or read online with my NTU login — skip anything print-only. ${READ_RULE}`,
  },
  {
    name: "trace_a_fact",
    description: "Trace a statistic or fact back to its original, citable source.",
    when: "You read a figure somewhere and need the original, citable research behind it.",
    tools: ["search_ntu_library", "find_influential_research"],
    args: { claim: z.string().describe("The fact or statistic you want to source") },
    build: (a) =>
      `Find the original, citable research behind this fact and give me the reference with a DOI or link: "${a.claim}". ${READ_RULE}`,
  },
  {
    name: "find_a_book",
    description: "Check whether NTU has a specific book and where to get it.",
    when: "A reading references a specific book and you want to know if NTU has it, and where.",
    tools: ["search_ntu_library"],
    args: { title: z.string().describe("Book title (and author if known)") },
    build: (a) =>
      `Does NTU have the book "${a.title}"? Tell me whether it's available online or in print, and if print, where to find it. Use search_ntu_library with books.`,
  },
];
