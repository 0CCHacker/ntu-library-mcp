/**
 * The Playbook — a second page teaching how to use the tools for different
 * research jobs. Each "play" is a copy-paste prompt + what it does + which tools
 * it uses. Built from the shared design system in ./ui.
 */
import {
  pageHead,
  siteHeader,
  siteFooter,
  setupTabs,
  mcpConfigs,
  SHARED_SCRIPT,
  ORBIT_SCRIPT,
} from "./ui";
import { SKILLS } from "./skills";

/** primary (first) argument name for a skill, for showing the call form. */
function skillArg(name: string): string {
  const s = SKILLS.find((x) => x.name === name);
  return s ? Object.keys(s.args)[0] : "input";
}

interface Play {
  icon: string;
  kicker: string;
  title: string;
  when: string;
  prompt: string;
  how: string;
  skill: string; // the invokable MCP prompt ("skill") to call for this task
}

const PLAYS: Play[] = [
  {
    icon: "i-link",
    kicker: "back up a claim",
    title: "Get a citation for a sentence",
    when: "You've written a claim and your tutor wants a credible source behind it.",
    prompt:
      "I wrote: “Hawker centres strengthen social ties across income groups.” Find me a credible academic source that supports this, with a link I can open.",
    how: "Runs search_ntu_library on the claim's keywords, reads the abstracts, and returns a source that actually backs the point — plus how to access it.",
    skill: "cite_a_claim",
  },
  {
    icon: "i-book",
    kicker: "start a project",
    title: "Build a reading list",
    when: "New essay, blank page. You want 5–6 solid sources to start from.",
    prompt:
      "Build me a reading list of 6 sources for an essay on the future of Singapore's hawker culture. Mix open-access and library items, and tell me which I can download now.",
    how: "Searches broadly, groups by access (download-now first), and summarises what each source argues so you can pick fast.",
    skill: "reading_list",
  },
  {
    icon: "i-trend",
    kicker: "find the key paper",
    title: "Find the most-cited work",
    when: "You want the seminal paper the whole field cites — to anchor your argument.",
    prompt:
      "What are the most-cited academic works on urban food heritage? Then check which ones NTU can give me access to.",
    how: "Runs find_influential_research (Crossref) to rank by citations, then cross-checks the top titles through search_ntu_library for NTU access.",
    skill: "most_cited",
  },
  {
    icon: "i-download",
    kicker: "get the full text",
    title: "Only what you can read tonight",
    when: "Deadline's tomorrow. You need sources you can open right now, not request.",
    prompt:
      "Find recent peer-reviewed articles on climate adaptation in cities that I can download or read online tonight — skip anything print-only.",
    how: "Searches with resource_type=articles, then filters to items tagged open-access or online-via-NTU-login and hands you the links.",
    skill: "downloadable_only",
  },
  {
    icon: "i-search",
    kicker: "fact-check",
    title: "Trace where a fact comes from",
    when: "You read a statistic somewhere and need the original, citable source.",
    prompt:
      "I saw a claim that street food vending supports a large share of urban employment in Southeast Asia. Find the original research behind a figure like that and give me the reference.",
    how: "Searches the topic, reads abstracts to find the study reporting the figure, and returns the primary source with its DOI.",
    skill: "trace_a_fact",
  },
  {
    icon: "i-library",
    kicker: "locate a title",
    title: "Is this book in the library?",
    when: "A reading references a specific book and you want to know if NTU has it.",
    prompt:
      "Does NTU have the book ‘The Hawker Chan Story’? If so, tell me whether it's online or on a shelf, and where.",
    how: "Runs search_ntu_library with resource_type=books and reports the access tag and location.",
    skill: "find_a_book",
  },
];

function playCard(p: Play): string {
  const id = `play-${slug(p.title)}`;
  return `<div class="flowstep reveal">
    <span class="chip"><svg class="ico"><use href="#${p.icon}"/></svg></span>
    <div>
      <div class="lbl" style="margin-top:0;color:var(--dim);font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase">${p.kicker}</div>
      <h3>${p.title}</h3>
      <p>${p.when}</p>
      <div class="code promptcode" style="margin:12px 0 12px">
        <button class="copy" data-copy="${id}"><svg class="ico"><use href="#i-copy"/></svg>Copy prompt</button>
        <div class="bar"><svg class="ico"><use href="#i-quote"/></svg><span class="f">paste into your AI</span></div>
        <pre id="${id}">${escapeText(p.prompt)}</pre>
      </div>
      <p style="margin:0 0 4px;color:var(--faint);font-size:13.5px"><b style="color:var(--dim)">Under the hood:</b> ${p.how}</p>
      <span class="skilltag"><svg class="ico"><use href="#i-sparkles"/></svg>Or call the skill: <b>/${p.skill}</b> ${skillArg(p.skill)}:&nbsp;“…”</span>
    </div>
  </div>`;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function PLAYBOOK_PAGE(): string {
  const cfg = mcpConfigs();

  return `${pageHead(
    "NTU Library MCP — the Playbook",
    "Copy-paste prompts for every kind of research job: cite a claim, build a reading list, find the most-cited paper, get downloadable sources, and more.",
    "/playbook",
  )}
${siteHeader("playbook")}

<main class="hero">
  <div class="wrap">
    <div class="grid">
      <div class="ghero">
        <a class="crumb" href="/"><svg class="ico"><use href="#i-back"/></svg>Home</a>
        <span class="eyebrow" style="margin-top:18px"><svg class="ico"><use href="#i-layers"/></svg>the playbook</span>
        <h1>Plays for every research job.</h1>
        <p class="lede">Set it up once, then steal these. Each play is a prompt you paste straight into your AI — for backing up a claim, building a reading list, finding the paper the field is built on, or grabbing something you can read tonight.</p>
        <div class="toc">
          <a href="#plays"><svg class="ico"><use href="#i-layers"/></svg>The plays</a>
          <a href="#technique"><svg class="ico"><use href="#i-target"/></svg>Prompting tips</a>
          <a href="#skill"><svg class="ico"><use href="#i-sparkles"/></svg>The skills</a>
          <a href="#start"><svg class="ico"><use href="#i-terminal"/></svg>Not set up yet?</a>
        </div>
      </div>
      <div class="graph-card reveal">
        <span class="graph-tag">live · your skills</span>
        <canvas id="orbit"></canvas>
        <span class="graph-cap"><svg class="ico"><use href="#i-drag"/></svg>drag to spin — each orbit is a skill</span>
      </div>
    </div>
  </div>
</main>

<section id="plays">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-layers"/></svg>the plays</span>
      <h2>Pick the job. Copy the prompt.</h2>
    </div>
    <div class="flowlist">
      ${PLAYS.map(playCard).join("\n      ")}
    </div>
  </div>
</section>

<section id="technique">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-target"/></svg>prompting tips</span>
      <h2>Get better sources, faster</h2>
    </div>
    <div class="techs">
      <div class="tech reveal">
        <h3><svg class="ico"><use href="#i-target"/></svg>Be specific about the angle</h3>
        <p>A topic returns thousands of hits; a <em>claim</em> returns the right few. Give it your actual argument, not just the theme.</p>
        <span class="prompt">Find sources that argue hawker centres reduce social isolation — not just about hawker food generally.</span>
      </div>
      <div class="tech reveal">
        <h3><svg class="ico"><use href="#i-download"/></svg>Say how you'll read it</h3>
        <p>Ask for downloadable-only when you're in a hurry. The tool tags each source, so it can filter to what you can actually open.</p>
        <span class="prompt">Only show me ones I can download for free or open with my NTU login.</span>
      </div>
      <div class="tech reveal">
        <h3><svg class="ico"><use href="#i-book"/></svg>Make it read the abstract</h3>
        <p>Ask it to summarise what each source argues and whether it fits your point — don't accept a bare list of titles.</p>
        <span class="prompt">For each result, summarise the argument in one line and say if it supports my thesis.</span>
      </div>
      <div class="tech reveal">
        <h3><svg class="ico"><use href="#i-trend"/></svg>Chain the two lenses</h3>
        <p>Find the most-cited work across the field, then check what NTU can actually give you. Influence first, access second.</p>
        <span class="prompt">Most-cited papers on this topic, then which ones NTU has access to.</span>
      </div>
      <div class="tech reveal">
        <h3><svg class="ico"><use href="#i-quote"/></svg>Ask for the reference, formatted</h3>
        <p>Once you've picked a source, get a clean citation with the DOI or permalink so you can drop it straight into your essay.</p>
        <span class="prompt">Give me an APA citation for the second source, with the DOI.</span>
      </div>
      <div class="tech reveal">
        <h3><svg class="ico"><use href="#i-search"/></svg>Narrow by type &amp; year</h3>
        <p>Tell it books vs. articles, and “recent” when currency matters. It maps that to the right filters.</p>
        <span class="prompt">Just journal articles from the last five years, please.</span>
      </div>
    </div>
  </div>
</section>

<section id="skill">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-sparkles"/></svg>the skills</span>
      <h2>Call a skill, or just talk</h2>
      <p class="sub">Each play above has a matching <b style="color:var(--text)">skill</b> — an MCP prompt your client shows as a slash command. You don't type the whole instruction; you pick the skill and give it your content.</p>
    </div>

    <div class="techs" style="margin-bottom:22px">
      <div class="tech reveal">
        <h3><svg class="ico"><use href="#i-terminal"/></svg>How to call one</h3>
        <p>Run the skill and pass your content as the argument — the client fills the rest.</p>
        <span class="prompt">/cite_a_claim claim: "Hawker centres strengthen social ties."</span>
      </div>
      <div class="tech reveal">
        <h3><svg class="ico"><use href="#i-ask"/></svg>Or just describe it</h3>
        <p>Prefer plain language? Skip the slash command — the assistant already knows the tools and rules.</p>
        <span class="prompt">Find me a source that backs this sentence, with a link.</span>
      </div>
    </div>

    <div class="toolkit reveal" style="margin-bottom:22px">
      ${SKILLS.map(
        (s) => `<div class="tool-row">
        <span class="chip" style="background:rgba(167,139,250,.12);color:var(--violet);border-color:rgba(167,139,250,.24)"><svg class="ico"><use href="#i-sparkles"/></svg></span>
        <div>
          <h4>/${s.name}</h4>
          <p>${escapeText(s.description)}</p>
          <div class="params"><span>${Object.keys(s.args)[0]}</span>${Object.keys(s.args).slice(1).map((a) => `<span class="opt">${a}?</span>`).join("")}</div>
        </div>
      </div>`,
      ).join("\n      ")}
    </div>

    <div class="skillcard reveal">
      <h3><svg class="ico"><use href="#i-sparkles"/></svg>The rules ship with it</h3>
      <p>You don't have to teach the AI how to behave — the server sends its guidance as MCP instructions the moment your client connects. That's why it picks the right tool and leads with sources you can actually get.</p>
      <div class="rule">
        <svg class="ico"><use href="#i-check"/></svg>
        <p style="margin:0;color:var(--dim);font-size:15px"><b>The golden rule, baked in:</b> it always reads the abstract before recommending a source — and summarises what each one argues, so you never cite something on its title alone.</p>
      </div>
    </div>
  </div>
</section>

<section id="start" class="setup">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-terminal"/></svg>not set up yet?</span>
      <h2>Two minutes and you're in</h2>
    </div>

    ${setupTabs(cfg)}

    <div class="cta-band reveal" style="margin-top:26px">
      <div class="t">
        <svg class="ico"><use href="#i-layers"/></svg>
        <div><b>Ready to try one?</b><span>Jump back up to the plays and paste a prompt.</span></div>
      </div>
      <a class="btn btn-primary" href="#plays"><svg class="ico"><use href="#i-back"/></svg>Back to the plays</a>
    </div>
  </div>
</section>

${siteFooter()}
${ORBIT_SCRIPT}
${SHARED_SCRIPT}
</body>
</html>`;
}
