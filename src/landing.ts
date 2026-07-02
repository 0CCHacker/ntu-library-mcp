/**
 * Home page, served from the Worker root.
 * Composed from the shared design system in ./ui — see that module for the CSS,
 * icon sprite, header/footer, and shared scripts. This file is just the content.
 */
import {
  pageHead,
  siteHeader,
  siteFooter,
  setupTabs,
  mcpConfigs,
  GRAPH_SCRIPT,
  SHARED_SCRIPT,
} from "./ui";

/**
 * Demo video. Two ways to set it:
 *   1. Self-hosted file — drop demo.mp4 in public/media/ and set DEMO_VIDEO_FILE
 *      to "/media/demo.mp4". (Served by the Worker's static assets.)
 *   2. YouTube — set DEMO_VIDEO_ID to the video id.
 * Leave both empty to show a "coming soon" placeholder.
 */
const DEMO_VIDEO_FILE = "/media/demo.mp4";
const DEMO_VIDEO_ID = ""; // e.g. "dQw4w9WgXcQ"

function demoVideo(): string {
  if (DEMO_VIDEO_FILE) {
    return `<div class="video reveal">
        <video controls preload="metadata" playsinline src="${DEMO_VIDEO_FILE}">Your browser can't play this video — <a href="${DEMO_VIDEO_FILE}">download it</a>.</video>
      </div>`;
  }
  if (DEMO_VIDEO_ID) {
    return `<div class="video reveal">
        <iframe src="https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}" title="NTU Library MCP — Claude Code demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>`;
  }
  return `<div class="video reveal">
        <div class="video-ph">
          <div>
            <span class="play"><svg class="ico"><use href="#i-play"/></svg></span>
            <p>Claude Code demo — coming soon. Add it in ~60 seconds:</p>
            <p class="mono">claude mcp add --transport http ntu-library …/mcp<br />→ “Find NTU sources on hawker culture I can download”</p>
          </div>
        </div>
      </div>`;
}

export function LANDING_PAGE(): string {
  const cfg = mcpConfigs();

  return `${pageHead(
    "NTU Library MCP — find the right source without reading every abstract",
    "An AI research assistant for NTU students. It reads the abstracts for you, tells you which sources actually fit, and which copy you can download.",
  )}
${siteHeader("home")}

<main class="hero">
  <div class="wrap">
    <div class="grid">
      <div>
        <span class="eyebrow"><svg class="ico"><use href="#i-sparkles"/></svg>AI research sidekick for NTU students</span>
        <h1>Find the <span class="u">right</span> source.<br />Skip <span class="strike">200 abstracts</span>.</h1>
        <p class="lede">A search still hands you hundreds of hits — and the real chore is opening <b>each abstract</b> to see if it actually fits. This plugs NTU's library into your AI so it <b>reads the abstracts for you</b>: which sources fit, what they argue, and which copy you can download. Essay, a single claim, or just a reference with a real link.</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#setup"><svg class="ico"><use href="#i-arrow"/></svg>Set it up in 2 min</a>
          <a class="btn btn-explore" href="/playbook"><svg class="ico"><use href="#i-layers"/></svg>Explore use cases</a>
        </div>
      </div>
      <div class="graph-card reveal">
        <span class="graph-tag">live · knowledge graph</span>
        <canvas id="graph"></canvas>
        <span class="graph-cap"><svg class="ico"><use href="#i-drag"/></svg>drag to explore — every node is a source</span>
      </div>
    </div>

    <div class="stat">
      <div class="cell reveal"><div class="n" data-count="200" data-prefix="~">0</div><div class="k">abstracts you'd otherwise skim by hand</div></div>
      <div class="cell reveal"><div class="n" data-count="10" data-prefix="~">0</div><div class="k">relevant picks it hands back — abstracts already read</div></div>
      <div class="cell reveal"><div class="n" data-count="0" data-prefix="S$">0</div><div class="k">free &amp; open source, forever</div></div>
    </div>
  </div>
</main>

<section id="uses">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-ask"/></svg>use it for</span>
      <h2>One tool, a dozen reasons</h2>
      <p class="sub">The CC0001 op-ed is just where it started. Any time you need a source, a reference, or a link — this is the move. <a href="/playbook">See the full Playbook →</a></p>
    </div>
    <div class="uses">
      <div class="ask reveal">
        <span class="q"><svg class="ico"><use href="#i-link"/></svg></span>
        <p>“Give me a credible source I can <b>cite for this claim</b> — with a link I can open.”</p>
        <span class="kind">back up a statement</span>
      </div>
      <div class="ask reveal">
        <span class="q"><svg class="ico"><use href="#i-search"/></svg></span>
        <p>“Find <b>info on urban heat islands</b> and give me the reference.”</p>
        <span class="kind">look something up</span>
      </div>
      <div class="ask reveal">
        <span class="q"><svg class="ico"><use href="#i-download"/></svg></span>
        <p>“Any recent papers on this I can <b>actually download tonight</b>?”</p>
        <span class="kind">get the full text</span>
      </div>
      <div class="ask reveal">
        <span class="q"><svg class="ico"><use href="#i-trend"/></svg></span>
        <p>“What's the <b>most-cited work</b> on this topic — and can NTU get it?”</p>
        <span class="kind">find the key paper</span>
      </div>
      <div class="ask reveal">
        <span class="q"><svg class="ico"><use href="#i-book"/></svg></span>
        <p>“Build me a <b>short reading list</b> for my essay on ___.”</p>
        <span class="kind">start a project</span>
      </div>
      <div class="ask reveal">
        <span class="q"><svg class="ico"><use href="#i-library"/></svg></span>
        <p>“Is this book in the NTU library, and <b>where do I find it</b>?”</p>
        <span class="kind">locate a title</span>
      </div>
    </div>
    <div class="explore-wrap reveal">
      <a class="btn btn-explore btn-lg" href="/playbook"><svg class="ico"><use href="#i-layers"/></svg>Explore all use cases in the Playbook<svg class="ico"><use href="#i-arrow"/></svg></a>
    </div>
  </div>
</section>

<section id="how">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-graph"/></svg>what it does</span>
      <h2>Four moves, so you stop doomscrolling results</h2>
    </div>
    <div class="cards">
      <div class="card reveal">
        <span class="chip"><svg class="ico"><use href="#i-search"/></svg></span>
        <div class="lbl">01 · search</div>
        <h3>Ask in plain English</h3>
        <p>“Find peer-reviewed sources on hawker culture.” Your AI hits NTU OneSearch directly — no login wall, no facet checkboxes.</p>
      </div>
      <div class="card reveal">
        <span class="chip"><svg class="ico"><use href="#i-book"/></svg></span>
        <div class="lbl">02 · read</div>
        <h3>Abstracts, pre-read</h3>
        <p>Every hit returns its abstract, author, year and DOI — so the AI tells you what a paper argues <b>before</b> you open a tab.</p>
      </div>
      <div class="card reveal">
        <span class="chip"><svg class="ico"><use href="#i-trend"/></svg></span>
        <div class="lbl">03 · rank</div>
        <h3>Find the influential work</h3>
        <p>A second tool taps Crossref's 150M-paper index to surface the <b>most-cited</b> research on your topic — so you cite what the field actually builds on.</p>
      </div>
      <div class="card reveal">
        <span class="chip"><svg class="ico"><use href="#i-download"/></svg></span>
        <div class="lbl">04 · decide</div>
        <h3>Which copy to grab</h3>
        <p>The real time-saver: each source is tagged <b>download free</b>, <b>online via NTU login</b>, or <b>print only</b>. No more dead links.</p>
      </div>
    </div>
  </div>
</section>

<section id="included">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-library"/></svg>what's included</span>
      <h2>Everything in the box</h2>
    </div>
    <div class="included">
      <div class="toolkit">
        <div class="tool-row reveal">
          <span class="chip"><svg class="ico"><use href="#i-search"/></svg></span>
          <div>
            <h4>search_ntu_library</h4>
            <p>What NTU <b style="color:var(--text)">holds</b>. Searches OneSearch (Primo) and returns title, author, year, abstract, DOI, a permalink, and an access tag per result.</p>
            <div class="params"><span>query</span><span class="opt">limit?</span><span class="opt">resource_type?</span></div>
          </div>
        </div>
        <div class="tool-row reveal">
          <span class="chip" style="background:rgba(167,139,250,.12);color:var(--violet);border-color:rgba(167,139,250,.24)"><svg class="ico"><use href="#i-trend"/></svg></span>
          <div>
            <h4>find_influential_research</h4>
            <p>What the <b style="color:var(--text)">field cites most</b>. Taps Crossref's ~150M-paper open index to surface high-impact work on a topic, then you cross-check what NTU can give you.</p>
            <div class="params"><span>query</span><span class="opt">limit?</span><span class="opt">from_year?</span><span class="opt">sort?</span></div>
          </div>
        </div>
        <div class="tool-row reveal">
          <span class="chip" style="background:rgba(61,232,160,.12);color:var(--go);border-color:rgba(61,232,160,.24)"><svg class="ico"><use href="#i-book"/></svg></span>
          <div>
            <h4>get_ntu_record</h4>
            <p>Deep-read <b style="color:var(--text)">one item</b>. Full abstract and access detail for a single record by its Primo id.</p>
            <div class="params"><span>record_id</span></div>
          </div>
        </div>
        <div class="note reveal">
          <h4><svg class="ico"><use href="#i-sparkles"/></svg>Smart citation ranking (not naïve)</h4>
          <p>Crossref's own <code>sort=citations</code> returns the most-cited paper on Earth regardless of topic. So this fetches a <b style="color:var(--text)">relevance-matched pool first, then ranks that by citations</b> — you get work that's influential <em>and</em> on-topic. A hawker-culture query surfaces <span class="ex">“Singapore Hawker Centers: Origins, Identity, Authenticity”</span>, not “Global Burden of Disease”.</p>
        </div>
      </div>

      <aside class="sidebar reveal">
        <div class="stitle">Under the hood</div>
        <div class="spec"><svg class="ico"><use href="#i-sparkles"/></svg><div><b>Edge-hosted</b><span>Cloudflare Workers, global, low-latency.</span></div></div>
        <div class="spec"><svg class="ico"><use href="#i-graph"/></svg><div><b>MCP standard</b><span>Works in Claude Desktop, Claude Code, Cursor — any MCP client.</span></div></div>
        <div class="spec"><svg class="ico"><use href="#i-eyeoff"/></svg><div><b>Anonymous</b><span>Hashed usage counts only. No IPs, no names, no PII.</span></div></div>
        <div class="spec"><svg class="ico"><use href="#i-book"/></svg><div><b>Reads abstracts</b><span>The AI is instructed to read every abstract before recommending.</span></div></div>
        <div class="spec"><svg class="ico"><use href="#i-branch"/></svg><div><b>Open source</b><span>MIT licensed. Fork it, read it, improve it.</span></div></div>
      </aside>
    </div>
  </div>
</section>

<section class="reveal" style="padding-left:0;padding-right:0">
  <div class="oped" id="story">
    <div class="inner">
      <span class="eyebrow"><svg class="ico"><use href="#i-user"/></svg>where it started</span>
      <h2>It began with one op-ed. Now it's for any time you need a source.</h2>
      <div class="byline">By an NTU student &nbsp;·&nbsp; Started in CC0001, Inquiry &amp; Communication</div>
      <div class="col">
        <p>The spark was the CC0001 op-ed — the note my tutor kept leaving: <em>“support this with a credible source.”</em> So I'd open OneSearch, type a topic, and get two million results back. Helpful.</p>
        <p class="pull">But that problem isn't an op-ed problem. It's every assignment, every claim, every “wait, what do I even cite for this?”</p>
        <p>You rarely need two million results. You need the <span class="mark">few that are actually relevant</span>, an abstract you can skim in ten seconds, and a copy you can open <em>tonight</em> — whether you're writing an essay, backing up a single sentence, or just chasing down where a fact comes from.</p>
        <p>AI is great at that triage. It just couldn't see NTU's catalogue — until now. This is a small, free bridge: it hands your AI the library's public search and the field's citation index, and asks it to do the boring part. Find the relevant few. Read what they argue. Hand you the link.</p>
        <p>It's open source, it stores nothing about you, and it's for anyone at NTU who's ever needed a source and a link — fast. That's the whole pitch.</p>
      </div>
    </div>
  </div>
</section>

<section class="setup" id="setup">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-terminal"/></svg>one-click setup · ~2 min</span>
      <h2>Point your AI at the library</h2>
    </div>

    ${setupTabs(cfg)}

    <div class="cta-band reveal" style="margin-top:26px">
      <div class="t">
        <svg class="ico"><use href="#i-check"/></svg>
        <div><b>Added it? Here's what to do next.</b><span>The Playbook has copy-paste prompts for every kind of research job.</span></div>
      </div>
      <a class="btn btn-primary" href="/playbook">Open the Playbook <svg class="ico"><use href="#i-arrow"/></svg></a>
    </div>
  </div>
</section>

<section id="demo">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-play"/></svg>see it in action</span>
      <h2>A 60-second demo</h2>
      <p class="sub">Watch it run inside Claude Code — or read the exchange below.</p>
    </div>
    <div style="margin-bottom:22px">${demoVideo()}</div>
    <div class="demo reveal">
      <div class="msg user">
        <span class="who"><svg class="ico"><use href="#i-user"/></svg>You</span>
        <p>I'm arguing that Singapore's hawker culture is worth preserving. Find me credible sources I can actually read and cite.</p>
      </div>
      <div class="msg ai">
        <span class="who"><svg class="ico"><use href="#i-sparkles"/></svg>Claude + NTU Library</span>
        <p>Found 3 strong picks in NTU OneSearch (out of 18,400):</p>
        <div class="rec">
          <div class="row"><svg class="ico go"><use href="#i-download"/></svg><span><b>“Hawker centres as social infrastructure”</b> (2021) — J. Tan · <span class="go">Open access — download directly, no login.</span></span></div>
          <div class="row"><svg class="ico login"><use href="#i-lock"/></svg><span><b>“Intangible heritage &amp; urban food”</b> (2019) · <span class="login">Full text online — sign in with your NTU account.</span></span></div>
          <div class="row"><svg class="ico print"><use href="#i-library"/></svg><span><b>“Preserving Singapore's food streets”</b> (2016) · <span class="print">Print only — on the shelf at Lee Wee Nam Library.</span></span></div>
        </div>
        <p style="margin-top:12px">Want me to pull the most-cited paper on this too, so your argument leans on the field's key work?</p>
      </div>
    </div>
  </div>
</section>

<section id="boundaries">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><svg class="ico"><use href="#i-shield"/></svg>the fine print, honestly</span>
      <h2>What it will &amp; won't do</h2>
    </div>
    <div class="bounds">
      <div class="bound reveal"><h3><svg class="ico"><use href="#i-shield"/></svg>Reads the public catalogue</h3><p>Only NTU's public Primo search plus open scholarly metadata (Crossref). The same results you'd get in a browser. Nothing behind a paywall.</p></div>
      <div class="bound reveal"><h3><svg class="ico"><use href="#i-ban"/></svg>Won't pirate anything</h3><p>No full-text scraping, no EZproxy wrapping, no re-hosting PDFs. It points you to the legit copy; you grab it the normal way.</p></div>
      <div class="bound reveal"><h3><svg class="ico"><use href="#i-eyeoff"/></svg>Stores nothing about you</h3><p>Usage counts are anonymous and hashed — no IPs, no names. Just enough to know people use it.</p></div>
      <div class="bound reveal"><h3><svg class="ico"><use href="#i-branch"/></svg>Free &amp; open source</h3><p>Runs on Cloudflare's edge. For NTU students, by an NTU student. Fork it, read it, improve it.</p></div>
    </div>
  </div>
</section>

${siteFooter()}
${GRAPH_SCRIPT}
${SHARED_SCRIPT}
</body>
</html>`;
}
