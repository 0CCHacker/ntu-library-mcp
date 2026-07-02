/**
 * Shared design system for the site's pages (home + how-to-use guide).
 * One source of truth for CSS, the icon sprite, header/footer, and shared JS,
 * so both pages stay visually identical. Fully self-contained (no external
 * fonts / scripts / icon CDNs) → renders under a strict CSP too.
 *
 * Icons are inlined from the Lucide set (ISC licensed) as an SVG sprite.
 */

import { PUBLIC_HOST } from "./config";

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export interface McpConfigs {
  sse: string;
  mcp: string;
  desktopConfig: string;
  claudeCodeCmd: string;
  cursorConfig: string;
}

export function mcpConfigs(): McpConfigs {
  const base = `https://${PUBLIC_HOST}`;
  const sse = `${base}/sse`;
  const mcp = `${base}/mcp`;
  return {
    sse,
    mcp,
    desktopConfig: JSON.stringify(
      { mcpServers: { "ntu-library": { command: "npx", args: ["-y", "mcp-remote", sse] } } },
      null,
      2,
    ),
    claudeCodeCmd: `claude mcp add --transport http ntu-library ${mcp}`,
    cursorConfig: JSON.stringify({ mcpServers: { "ntu-library": { url: mcp } } }, null, 2),
  };
}

export const STYLES = `
  :root{
    --bg:#060910; --bg-2:#0A0F1B; --panel:#0E1524; --panel-2:#131D30;
    --text:#EAF0FA; --dim:#8A97AE; --faint:#5A6478;
    --cyan:#3AE1FF; --cyan-deep:#12B5D8; --violet:#A78BFA; --amber:#FFC24B;
    --go:#3DE8A0; --login:#FFC24B; --print:#FF9AAD;
    --line:rgba(234,240,250,.10); --line-2:rgba(234,240,250,.16);
    --glow:0 0 0 1px rgba(58,225,255,.14), 0 18px 50px -20px rgba(58,225,255,.28);
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --serif: ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
    --mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
    --maxw: 1120px;
  }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%; scroll-behavior:smooth; scroll-padding-top:20px}
  section[id], main[id]{scroll-margin-top:20px}
  body{margin:0; background:
      radial-gradient(1100px 700px at 78% -6%, rgba(58,225,255,.10), transparent 60%),
      radial-gradient(900px 600px at 8% 8%, rgba(167,139,250,.08), transparent 55%),
      var(--bg);
    color:var(--text); font-family:var(--sans); font-size:17px; line-height:1.6; -webkit-font-smoothing:antialiased; overflow-x:clip}
  .wrap{max-width:var(--maxw); margin:0 auto; padding:0 26px}
  a{color:var(--cyan); text-decoration:none}
  a:hover{text-decoration:underline}
  h1,h2,h3{font-weight:700; text-wrap:balance; line-height:1.05; letter-spacing:-.03em; margin:0}
  .eyebrow{display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--cyan); background:rgba(58,225,255,.08); border:1px solid rgba(58,225,255,.22); padding:6px 13px; border-radius:999px}
  :focus-visible{outline:2px solid var(--cyan); outline-offset:3px; border-radius:4px}
  .ico{width:1em; height:1em; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; fill:none; display:inline-block; vertical-align:-.125em}

  .reveal{opacity:0; transform:translateY(24px); transition:opacity .6s cubic-bezier(.2,.7,.2,1), transform .6s cubic-bezier(.2,.7,.2,1)}
  .reveal.in{opacity:1; transform:none}

  /* masthead */
  /* static top bar — its own block above the content, never overlays it */
  header.top{position:relative; z-index:50; background:#080B12; border-bottom:1px solid var(--line)}
  header.top .wrap{display:flex; align-items:center; justify-content:space-between; padding:15px 26px}
  .brand{display:flex; align-items:center; gap:10px; font-family:var(--mono); font-size:14px; font-weight:600; letter-spacing:.02em; color:var(--text)}
  .brand:hover{text-decoration:none}
  .brand .ico{width:19px; height:19px; color:var(--cyan)}
  .top nav{display:flex; align-items:center; gap:24px}
  .top nav a{color:var(--dim); font-family:var(--mono); font-size:13px}
  .top nav a:hover{color:var(--text); text-decoration:none}
  .top nav a.active{color:var(--cyan)}
  .top .go{display:inline-flex; align-items:center; gap:7px; color:var(--bg); background:var(--cyan); padding:9px 15px; border-radius:9px; font-weight:600; box-shadow:0 8px 24px -10px rgba(58,225,255,.7)}
  .top .go:hover{background:#7cebff; text-decoration:none; color:var(--bg)}
  @media(max-width:760px){.top nav a:not(.go){display:none}}

  /* hero */
  .hero{padding:66px 0 30px}
  .hero .grid{display:grid; grid-template-columns:1.05fr .95fr; gap:44px; align-items:center}
  @media(max-width:900px){.hero .grid{grid-template-columns:1fr; gap:30px}}
  .hero h1{font-size:clamp(42px,7vw,78px); letter-spacing:-.045em; margin-top:22px}
  .hero h1 .u{color:var(--cyan)}
  .hero h1 .strike{position:relative; color:var(--dim); white-space:nowrap}
  .hero h1 .strike::after{content:""; position:absolute; left:-2%; right:-2%; top:52%; height:4px; background:var(--print); transform:rotate(-2.4deg); border-radius:3px}
  .lede{font-size:clamp(17px,2vw,20px); color:var(--dim); max-width:52ch; margin:26px 0 34px}
  .lede b{color:var(--text); font-weight:600}
  .cta-row{display:flex; flex-wrap:wrap; gap:14px; align-items:center}
  .btn{display:inline-flex; align-items:center; gap:9px; font-family:var(--mono); font-size:14.5px; font-weight:600; padding:14px 22px; border-radius:12px; border:1px solid transparent; cursor:pointer; transition:transform .13s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease}
  .btn .ico{width:17px; height:17px}
  .btn:hover{transform:translateY(-2px); text-decoration:none}
  .btn-primary{background:var(--cyan); color:#04121A; box-shadow:0 14px 34px -14px rgba(58,225,255,.8)}
  .btn-primary:hover{background:#7cebff}
  .btn-ghost{background:rgba(234,240,250,.03); color:var(--text); border-color:var(--line-2)}
  .btn-ghost:hover{border-color:var(--cyan); color:var(--cyan)}
  /* standout "explore" CTA */
  .btn-explore{position:relative; color:#04121A; background:linear-gradient(105deg, var(--cyan), #8FD0FF 40%, var(--violet)); background-size:180% 100%; background-position:0% 0; box-shadow:0 16px 40px -14px rgba(58,225,255,.7), 0 0 0 1px rgba(255,255,255,.12) inset; transition:background-position .5s ease, transform .13s ease, box-shadow .18s ease}
  .btn-explore:hover{background-position:100% 0; transform:translateY(-2px); box-shadow:0 20px 46px -14px rgba(167,139,250,.7)}
  .btn-explore .ico{width:18px; height:18px}
  .explore-wrap{display:flex; justify-content:center; margin-top:34px}
  .btn-lg{font-size:15.5px; padding:16px 28px}

  /* interactive graph panel */
  .graph-card{position:relative; border-radius:22px; border:1px solid var(--line-2); background:linear-gradient(180deg, rgba(19,29,48,.6), rgba(10,15,27,.6)); box-shadow:var(--glow); overflow:hidden; aspect-ratio:1/.92}
  @media(max-width:900px){.graph-card{aspect-ratio:1/.7; max-height:360px}}
  #graph,#orbit{display:block; width:100%; height:100%; cursor:grab; touch-action:none}
  #graph:active,#orbit:active{cursor:grabbing}
  .graph-cap{position:absolute; left:16px; bottom:14px; font-family:var(--mono); font-size:11.5px; letter-spacing:.03em; color:var(--dim); display:flex; align-items:center; gap:7px; pointer-events:none}
  .graph-cap .ico{width:14px; height:14px; color:var(--cyan)}
  .graph-tag{position:absolute; top:14px; right:14px; font-family:var(--mono); font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--cyan); border:1px solid rgba(58,225,255,.25); border-radius:999px; padding:5px 10px; pointer-events:none}

  /* stat plate */
  .stat{margin-top:52px; display:grid; grid-template-columns:repeat(3,1fr); gap:16px}
  .stat .cell{position:relative; background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:22px}
  .stat .cell::before{content:""; position:absolute; left:22px; top:22px; width:26px; height:3px; border-radius:3px; background:var(--cyan)}
  .stat .cell:nth-child(2)::before{background:var(--violet)} .stat .cell:nth-child(3)::before{background:var(--go)}
  .stat .n{font-size:clamp(30px,4.6vw,44px); font-weight:700; font-variant-numeric:tabular-nums; letter-spacing:-.03em; line-height:1; margin-top:16px}
  .stat .k{font-family:var(--mono); font-size:11.5px; letter-spacing:.04em; color:var(--dim); margin-top:11px; line-height:1.4}
  @media(max-width:620px){.stat{grid-template-columns:1fr}}

  section{padding:78px 0}
  .sec-head{margin-bottom:40px; max-width:40ch}
  .sec-head h2{font-size:clamp(28px,4.8vw,46px); margin-top:16px}
  .sec-head .sub{color:var(--dim); font-size:17px; margin-top:14px}

  /* capability cards */
  .cards{display:grid; grid-template-columns:repeat(3,1fr); gap:18px}
  @media(max-width:820px){.cards{grid-template-columns:1fr}}
  .card{background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:26px; transition:transform .18s ease, border-color .18s ease, box-shadow .18s ease}
  .card:hover{transform:translateY(-4px); border-color:var(--line-2); box-shadow:0 24px 50px -30px rgba(58,225,255,.35)}
  .chip{display:inline-grid; place-items:center; width:46px; height:46px; border-radius:13px; background:rgba(58,225,255,.10); color:var(--cyan); border:1px solid rgba(58,225,255,.2)}
  .card:nth-child(2) .chip{background:rgba(167,139,250,.12); color:var(--violet); border-color:rgba(167,139,250,.24)}
  .card:nth-child(3) .chip{background:rgba(61,232,160,.12); color:var(--go); border-color:rgba(61,232,160,.24)}
  .chip .ico{width:22px; height:22px}
  .card .lbl{font-family:var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); margin-top:16px}
  .card h3{font-size:22px; margin:8px 0 9px}
  .card p{margin:0; color:var(--dim); font-size:15.5px}
  .card b{color:var(--text); font-weight:600}

  /* use cases — example prompts */
  .uses{display:grid; grid-template-columns:repeat(3,1fr); gap:14px}
  @media(max-width:820px){.uses{grid-template-columns:1fr 1fr}}
  @media(max-width:560px){.uses{grid-template-columns:1fr}}
  .ask{position:relative; background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:20px 20px 18px; transition:border-color .16s ease, transform .16s ease}
  .ask:hover{border-color:rgba(58,225,255,.35); transform:translateY(-3px)}
  .ask .q{display:inline-grid; place-items:center; width:30px; height:30px; border-radius:9px; background:rgba(58,225,255,.08); color:var(--cyan); border:1px solid rgba(58,225,255,.2); margin-bottom:13px}
  .ask .q .ico{width:15px; height:15px}
  .ask p{margin:0; font-size:15.5px; line-height:1.5; color:var(--text)}
  .ask .kind{display:block; margin-top:11px; font-family:var(--mono); font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim)}

  /* what's included */
  .included{display:grid; grid-template-columns:1.4fr .85fr; gap:22px; align-items:start}
  @media(max-width:860px){.included{grid-template-columns:1fr}}
  .toolkit{display:grid; gap:14px}
  .tool-row{display:grid; grid-template-columns:auto 1fr; gap:16px; background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:20px 22px}
  .tool-row .chip{width:44px; height:44px}
  .tool-row h4{margin:2px 0 6px; font-size:17px; font-family:var(--mono); font-weight:600; letter-spacing:-.01em}
  .tool-row p{margin:0 0 10px; color:var(--dim); font-size:15px}
  .params{display:flex; flex-wrap:wrap; gap:7px}
  .params span{font-family:var(--mono); font-size:11.5px; color:var(--cyan); background:rgba(58,225,255,.07); border:1px solid rgba(58,225,255,.18); border-radius:7px; padding:3px 9px}
  .params span.opt{color:var(--dim); border-color:var(--line); background:transparent}
  .note{margin-top:16px; background:linear-gradient(180deg, rgba(58,225,255,.06), rgba(167,139,250,.05)); border:1px solid rgba(58,225,255,.2); border-radius:16px; padding:20px 22px}
  .note h4{display:flex; align-items:center; gap:9px; margin:0 0 8px; font-size:16px}
  .note h4 .ico{width:18px; height:18px; color:var(--cyan)}
  .note p{margin:0; color:var(--dim); font-size:14.5px; line-height:1.62}
  .note code{font-family:var(--mono); color:var(--text); font-size:13px}
  .note .ex{color:var(--go)}
  .sidebar{background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:8px 22px 12px}
  .sidebar .stitle{font-family:var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); padding:16px 0 4px}
  .spec{display:flex; gap:12px; align-items:flex-start; padding:13px 0; border-top:1px solid var(--line)}
  .spec:first-of-type{border-top:none}
  .spec .ico{width:18px; height:18px; color:var(--cyan); margin-top:2px; flex:none}
  .spec b{display:block; font-size:14.5px; font-weight:600}
  .spec span{color:var(--dim); font-size:13.5px}

  /* op-ed (paper) */
  .oped{background:#F7F3E9; color:#1A1B22; border-radius:24px; margin:0 26px; border:1px solid rgba(0,0,0,.1)}
  .oped .inner{max-width:64ch; margin:0 auto; padding:16px 8px}
  .oped .eyebrow{color:#8a1c0c; background:rgba(255,90,60,.12); border-color:rgba(226,58,30,.3)}
  .oped h2{color:#1A1B22; font-family:var(--serif); font-weight:600; font-style:italic; font-size:clamp(28px,5vw,44px); line-height:1.08; margin-top:16px}
  .oped .byline{font-family:var(--mono); font-size:12px; letter-spacing:.04em; text-transform:uppercase; color:#565A66; border-top:1px solid rgba(26,27,34,.14); border-bottom:1px solid rgba(26,27,34,.14); padding:12px 0; margin:22px 0 28px}
  .oped .col{font-family:var(--serif); font-size:19px; line-height:1.72}
  .oped .col p{margin:0 0 20px}
  .oped .col > p:first-of-type::first-letter{font-size:66px; line-height:.8; float:left; padding:6px 12px 0 0; color:var(--cyan-deep); font-weight:700; font-family:var(--sans)}
  .oped .mark{background:rgba(58,225,255,.28); padding:1px 5px; border-radius:4px; box-decoration-break:clone; -webkit-box-decoration-break:clone}
  .oped .pull{font-size:24px; font-style:italic; color:var(--cyan-deep); border-left:3px solid var(--cyan-deep); padding-left:20px; margin:30px 0; line-height:1.4}

  /* setup */
  .setup .tabs{display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px}
  .tab{display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:13.5px; padding:11px 16px; border-radius:11px; background:var(--panel); color:var(--dim); border:1px solid var(--line); cursor:pointer; transition:.15s ease}
  .tab .ico{width:15px; height:15px}
  .tab[aria-selected="true"]{color:var(--cyan); border-color:rgba(58,225,255,.4); background:rgba(58,225,255,.07)}
  .tab:hover{color:var(--text)}
  .panel{display:none} .panel[data-active="true"]{display:block; animation:fade .3s ease}
  @keyframes fade{from{opacity:0; transform:translateY(8px)}to{opacity:1}}
  .panel .hint{color:var(--dim); font-size:15.5px; margin:0 0 14px}
  .panel .hint code{font-family:var(--mono); color:var(--cyan); font-size:13.5px}
  .code{position:relative; background:#05080F; border:1px solid var(--line-2); border-radius:16px; overflow:hidden}
  .code .bar{display:flex; align-items:center; gap:9px; padding:12px 15px; border-bottom:1px solid var(--line)}
  .code .bar .ico{width:15px; height:15px; color:var(--dim)}
  .code .bar .f{font-family:var(--mono); font-size:12px; color:var(--dim)}
  .code pre{margin:0; padding:20px; overflow-x:auto; font-family:var(--mono); font-size:13.5px; line-height:1.7; color:#CBD5E6}
  /* prompt blocks should wrap (readable on mobile), not scroll off-screen */
  .code.promptcode pre{white-space:pre-wrap; overflow-wrap:anywhere; overflow-x:visible}
  .code .copy{position:absolute; top:9px; right:9px; display:inline-flex; align-items:center; gap:6px; font-family:var(--mono); font-size:12px; padding:8px 12px; border-radius:9px; background:var(--panel-2); color:var(--text); border:1px solid var(--line-2); cursor:pointer; transition:.15s ease}
  .code .copy .ico{width:14px; height:14px}
  .code .copy:hover{background:var(--cyan); color:#04121A; border-color:var(--cyan)}
  .steps{counter-reset:s; margin:28px 0 0; padding:0; list-style:none; display:grid; gap:14px}
  .steps li{position:relative; padding-left:46px; color:var(--dim); font-size:16px; padding-top:5px}
  .steps li::before{counter-increment:s; content:counter(s); position:absolute; left:0; top:0; width:32px; height:32px; border-radius:10px; background:rgba(58,225,255,.1); border:1px solid rgba(58,225,255,.28); color:var(--cyan); font-family:var(--mono); font-weight:700; font-size:14px; display:grid; place-items:center}
  .steps b{color:var(--text)}

  /* setup: doc/video links + notes */
  .doclinks{display:flex; flex-wrap:wrap; gap:10px; margin-top:16px}
  .doclinks a{display:inline-flex; align-items:center; gap:7px; font-family:var(--mono); font-size:12.5px; color:var(--dim); background:var(--panel); border:1px solid var(--line); border-radius:9px; padding:8px 13px}
  .doclinks a:hover{color:var(--cyan); border-color:rgba(58,225,255,.35); text-decoration:none}
  .doclinks a.vid:hover{color:var(--print); border-color:rgba(255,154,173,.4)}
  .doclinks a .ico{width:14px; height:14px}
  .finenote{margin:14px 0 0; color:var(--faint); font-size:13px}
  .finenote b{color:var(--dim)}
  .tab .best{margin-left:1px; font-size:10px; letter-spacing:.06em; color:var(--go)}
  .urlbar{margin-bottom:2px}

  /* video embed */
  .video{position:relative; border-radius:18px; overflow:hidden; border:1px solid var(--line-2); background:#05080F; box-shadow:var(--glow); aspect-ratio:16/9}
  .video iframe{position:absolute; inset:0; width:100%; height:100%; border:0}
  .video video{position:absolute; inset:0; width:100%; height:100%; object-fit:contain; background:#000}
  .video-ph{display:grid; place-items:center; height:100%; text-align:center; padding:24px}
  .video-ph .play{width:66px; height:66px; border-radius:50%; display:grid; place-items:center; background:rgba(58,225,255,.12); border:1px solid rgba(58,225,255,.35); color:var(--cyan); margin:0 auto 16px}
  .video-ph .play .ico{width:26px; height:26px; margin-left:3px}
  .video-ph p{margin:0; color:var(--dim); font-size:15px; max-width:44ch}
  .video-ph .mono{font-family:var(--mono); font-size:12.5px; color:var(--faint); margin-top:8px}

  /* CTA band (page-to-page flow) */
  .cta-band{margin-top:34px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:18px; background:linear-gradient(120deg, rgba(58,225,255,.10), rgba(167,139,250,.08)); border:1px solid rgba(58,225,255,.25); border-radius:18px; padding:24px 26px}
  .cta-band .t{display:flex; align-items:center; gap:14px}
  .cta-band .t .ico{width:26px; height:26px; color:var(--cyan); flex:none}
  .cta-band b{display:block; font-size:18px}
  .cta-band span{color:var(--dim); font-size:14.5px}

  /* transcript */
  .demo{background:var(--panel); border:1px solid var(--line); border-radius:20px; padding:10px}
  .msg{padding:17px 19px; border-radius:14px; margin:8px}
  .msg.user{background:var(--panel-2)}
  .msg .who{display:inline-flex; align-items:center; gap:7px; font-family:var(--mono); font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--dim); margin-bottom:11px}
  .msg.ai .who{color:var(--cyan)}
  .msg .who .ico{width:14px; height:14px}
  .msg p{margin:0 0 9px} .msg p:last-child{margin:0}
  .rec{font-family:var(--mono); font-size:13.5px; line-height:1.75; color:var(--text)}
  .rec .row{display:flex; align-items:flex-start; gap:9px}
  .rec .ico{width:15px; height:15px; margin-top:3px; flex:none}
  .rec .go{color:var(--go)} .rec .login{color:var(--login)} .rec .print{color:var(--print)}

  /* boundaries */
  .bounds{display:grid; grid-template-columns:1fr 1fr; gap:18px}
  @media(max-width:680px){.bounds{grid-template-columns:1fr}}
  .bound{border:1px solid var(--line); border-radius:16px; padding:24px; background:var(--panel)}
  .bound h3{display:flex; align-items:center; gap:11px; font-size:18px; margin:0 0 10px}
  .bound h3 .ico{width:20px; height:20px; color:var(--cyan); flex:none}
  .bound p{margin:0; color:var(--dim); font-size:15px}

  /* ===== guide page ===== */
  .crumb{display:inline-flex; align-items:center; gap:7px; font-family:var(--mono); font-size:12.5px; color:var(--dim)}
  .crumb .ico{width:14px; height:14px}
  .ghero{padding:56px 0 12px; max-width:60ch}
  .hero .ghero{padding:0; max-width:none}
  .ghero h1{font-size:clamp(36px,5.6vw,58px); margin:20px 0 0}
  .ghero .lede{margin-top:20px}
  .toc{display:flex; flex-wrap:wrap; gap:10px; margin-top:26px}
  .toc a{display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:13px; color:var(--dim); background:var(--panel); border:1px solid var(--line); border-radius:999px; padding:8px 14px}
  .toc a:hover{color:var(--cyan); border-color:rgba(58,225,255,.35); text-decoration:none}
  .toc a .ico{width:14px; height:14px}

  .techs{display:grid; grid-template-columns:1fr 1fr; gap:16px}
  @media(max-width:760px){.techs{grid-template-columns:1fr}}
  .tech{background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:22px 24px}
  .tech h3{display:flex; align-items:center; gap:11px; font-size:18px; margin:0 0 8px}
  .tech h3 .ico{width:19px; height:19px; color:var(--cyan); flex:none}
  .tech p{margin:0 0 12px; color:var(--dim); font-size:15px}
  .prompt{font-family:var(--mono); font-size:13px; line-height:1.55; color:var(--text); background:#05080F; border:1px solid var(--line-2); border-radius:11px; padding:12px 14px; display:block}
  .prompt::before{content:"“"; color:var(--cyan)} .prompt::after{content:"”"; color:var(--cyan)}

  .flowlist{display:grid; gap:14px; counter-reset:f}
  .flowstep{display:grid; grid-template-columns:auto minmax(0,1fr); gap:18px; background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:22px 24px}
  .flowstep > div{min-width:0}
  @media(max-width:560px){.flowstep{padding:20px 18px; gap:14px}}
  .flowstep .fn{counter-increment:f; width:38px; height:38px; border-radius:11px; background:rgba(58,225,255,.1); border:1px solid rgba(58,225,255,.28); color:var(--cyan); font-family:var(--mono); font-weight:700; font-size:16px; display:grid; place-items:center}
  .flowstep .fn::before{content:counter(f)}
  .flowstep h3{font-size:17px; margin:6px 0 7px}
  .flowstep p{margin:0 0 10px; color:var(--dim); font-size:15px}
  .flowstep p:last-child{margin:0}
  /* skill badge — recommends the invokable prompt/skill for a play */
  .skilltag{display:inline-flex; align-items:center; gap:7px; margin-top:12px; font-family:var(--mono); font-size:12px; color:var(--violet); background:rgba(167,139,250,.1); border:1px solid rgba(167,139,250,.28); border-radius:8px; padding:6px 11px}
  .skilltag .ico{width:14px; height:14px}
  .skilltag b{color:var(--text); font-weight:600}

  .skillcard{background:linear-gradient(180deg, rgba(167,139,250,.08), rgba(58,225,255,.05)); border:1px solid rgba(167,139,250,.24); border-radius:18px; padding:26px 28px}
  .skillcard h3{display:flex; align-items:center; gap:11px; font-size:21px; margin:0 0 10px}
  .skillcard h3 .ico{width:22px; height:22px; color:var(--violet)}
  .skillcard p{margin:0 0 14px; color:var(--dim); font-size:15.5px}
  .rule{display:flex; align-items:flex-start; gap:11px; background:rgba(61,232,160,.08); border:1px solid rgba(61,232,160,.22); border-radius:12px; padding:14px 16px; margin-top:6px}
  .rule .ico{width:19px; height:19px; color:var(--go); margin-top:2px; flex:none}
  .rule b{color:var(--text)}

  footer{border-top:1px solid var(--line); padding:40px 0 64px; color:var(--dim); font-size:14px}
  footer .wrap{display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; align-items:center}

  .toast{position:fixed; left:50%; bottom:30px; transform:translateX(-50%) translateY(20px); opacity:0; pointer-events:none; z-index:60; background:var(--cyan); color:#04121A; font-family:var(--mono); font-weight:600; font-size:13px; padding:11px 20px; border-radius:999px; box-shadow:0 14px 40px -12px rgba(58,225,255,.8); transition:all .24s cubic-bezier(.2,.7,.2,1)}
  .toast.show{opacity:1; transform:translateX(-50%) translateY(0)}

  @media(prefers-reduced-motion:reduce){
    *{animation:none !important; transition:none !important; scroll-behavior:auto !important}
    .reveal{opacity:1; transform:none}
  }
`;

export const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-graph" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></symbol>
  <symbol id="i-library" viewBox="0 0 24 24"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></symbol>
  <symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></symbol>
  <symbol id="i-ban" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></symbol>
  <symbol id="i-eyeoff" viewBox="0 0 24 24"><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="m2 2 20 20"/></symbol>
  <symbol id="i-branch" viewBox="0 0 24 24"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></symbol>
  <symbol id="i-back" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></symbol>
  <symbol id="i-drag" viewBox="0 0 24 24"><path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M15 19l-3 3-3-3"/><path d="M19 9l3 3-3 3"/><path d="M2 12h20"/><path d="M12 2v20"/></symbol>
  <symbol id="i-terminal" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></symbol>
  <symbol id="i-copy" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></symbol>
  <symbol id="i-trend" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></symbol>
  <symbol id="i-ask" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></symbol>
  <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
  <symbol id="i-layers" viewBox="0 0 24 24"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></symbol>
  <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></symbol>
  <symbol id="i-quote" viewBox="0 0 24 24"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3v2a4 4 0 0 1-4 4h-1a1 1 0 0 0 0 2h1a6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3v2a4 4 0 0 1-4 4H3a1 1 0 0 0 0 2h1a6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></symbol>
  <symbol id="i-external" viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></symbol>
  <symbol id="i-settings" viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></symbol>
</svg>`;

/** <!doctype>…<style>…</style></head><body> + sprite. Write body content after. */
export function pageHead(title: string, description: string, path = "/"): string {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const url = `https://${PUBLIC_HOST}${path}`;
  const image = `https://${PUBLIC_HOST}/og.png`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${t}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${url}" />
<meta name="theme-color" content="#0B1220" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="NTU Library MCP" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${image}" />
<style>${STYLES}</style>
</head>
<body>
${SPRITE}`;
}

/** Sticky header with cross-page nav. `active` marks the current page's link. */
export function siteHeader(active: "home" | "playbook"): string {
  const cls = (p: string) => (p === active ? ' class="active"' : "");
  return `<header class="top">
  <div class="wrap">
    <a class="brand" href="/"><svg class="ico"><use href="#i-graph"/></svg>NTU&nbsp;Library&nbsp;MCP</a>
    <nav>
      <a${cls("home")} href="/#uses">Use it for</a>
      <a href="/#included">What's included</a>
      <a${cls("playbook")} href="/playbook">Playbook</a>
      <a class="go" href="/#setup">Get it <svg class="ico"><use href="#i-arrow"/></svg></a>
    </nav>
  </div>
</header>`;
}

export function siteFooter(): string {
  return `<footer>
  <div class="wrap">
    <a class="brand" href="/"><svg class="ico"><use href="#i-graph"/></svg>NTU&nbsp;Library&nbsp;MCP</a>
    <div>Not affiliated with NTU or Ex Libris · Reads public library data only · <a href="/playbook">Open the Playbook →</a></div>
  </div>
</footer>
<div class="toast" id="toast">Copied to clipboard</div>`;
}

/** A copyable server-URL block. */
function urlBlock(id: string, url: string): string {
  return `<div class="code promptcode urlbar">
        <button class="copy" data-copy="${id}"><svg class="ico"><use href="#i-copy"/></svg>Copy</button>
        <div class="bar"><svg class="ico"><use href="#i-link"/></svg><span class="f">server URL — paste this</span></div>
        <pre id="${id}">${escapeHtml(url)}</pre>
      </div>`;
}
/** Official-guide + YouTube links for a client. */
function docLinks(docUrl: string, docLabel: string, videoQuery: string, extra?: { url: string; label: string }): string {
  const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(videoQuery)}`;
  return `<div class="doclinks">
        <a href="${docUrl}" target="_blank" rel="noopener"><svg class="ico"><use href="#i-book"/></svg>${docLabel}<svg class="ico"><use href="#i-external"/></svg></a>
        <a class="vid" href="${yt}" target="_blank" rel="noopener"><svg class="ico"><use href="#i-play"/></svg>Watch a walkthrough</a>${
    extra
      ? `\n        <a href="${extra.url}" target="_blank" rel="noopener"><svg class="ico"><use href="#i-book"/></svg>${extra.label}<svg class="ico"><use href="#i-external"/></svg></a>`
      : ""
  }
      </div>`;
}

/**
 * Setup tabs + panels (shared by home and Playbook). UI-first: the easy,
 * no-JSON path for Claude / ChatGPT / Gemini leads, with CLI/dev options after.
 * Every panel links the official guide and a video walkthrough.
 */
export function setupTabs(cfg: McpConfigs): string {
  return `<div class="tabs reveal" role="tablist" aria-label="Setup target">
      <button class="tab" role="tab" aria-selected="true" data-tab="claude"><svg class="ico"><use href="#i-sparkles"/></svg>Claude<span class="best">· easiest</span></button>
      <button class="tab" role="tab" aria-selected="false" data-tab="chatgpt"><svg class="ico"><use href="#i-ask"/></svg>ChatGPT</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="gemini"><svg class="ico"><use href="#i-graph"/></svg>Gemini</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="code"><svg class="ico"><use href="#i-terminal"/></svg>Claude Code</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="cursor"><svg class="ico"><use href="#i-settings"/></svg>Cursor / dev</button>
    </div>

    <div class="panel reveal" data-tab="claude" data-active="true">
      <p class="hint">No files to edit. In <b>Claude Desktop, claude.ai, or the mobile app</b>:</p>
      <ol class="steps">
        <li>Open <b>Settings → Connectors</b>.</li>
        <li>Click <b>Add custom connector</b>.</li>
        <li>Paste the <b>server URL</b> below and hit <b>Add</b>. That's it.</li>
      </ol>
      ${urlBlock("url-claude", cfg.mcp)}
      ${docLinks(
        "https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp",
        "Official guide",
        "how to add a custom connector remote MCP Claude",
      )}
      <p class="finenote">Works on <b>Free, Pro, Max, Team &amp; Enterprise</b> (Free = 1 custom connector).</p>
    </div>

    <div class="panel" data-tab="chatgpt" data-active="false">
      <p class="hint">In ChatGPT (<b>Plus, Pro, Business, Enterprise or Edu</b> — not Free):</p>
      <ol class="steps">
        <li>Open <b>Settings → Connectors</b> (on Business/Enterprise, an admin first enables <b>Developer mode</b> under Connectors).</li>
        <li>Click <b>Create</b> / <b>Add custom connector</b>.</li>
        <li>Paste the <b>server URL</b> below, name it “NTU Library”, and save.</li>
      </ol>
      ${urlBlock("url-chatgpt", cfg.mcp)}
      ${docLinks(
        "https://help.openai.com/en/articles/11487775-connectors-in-chatgpt",
        "Connectors in ChatGPT",
        "how to add custom MCP connector ChatGPT developer mode",
        { url: "https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt", label: "Developer mode" },
      )}
      <p class="finenote">Custom connectors aren't on the Free plan. Business/Enterprise need an admin to turn on Developer mode.</p>
    </div>

    <div class="panel" data-tab="gemini" data-active="false">
      <p class="hint">Use the <b>Gemini CLI</b> — one command adds it (no manual file edits):</p>
      <div class="code promptcode">
        <button class="copy" data-copy="cfg-gemini"><svg class="ico"><use href="#i-copy"/></svg>Copy</button>
        <div class="bar"><svg class="ico"><use href="#i-terminal"/></svg><span class="f">terminal</span></div>
        <pre id="cfg-gemini">gemini mcp add -t http ntu-library ${escapeHtml(cfg.mcp)}</pre>
      </div>
      ${docLinks(
        "https://geminicli.com/docs/tools/mcp-server/",
        "Gemini CLI — MCP guide",
        "Gemini CLI add MCP server",
        { url: "https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/set-up-custom-mcp-server", label: "Gemini Enterprise" },
      )}
      <p class="finenote">On <b>Gemini Enterprise</b>, an admin connects a custom MCP data store (see the Enterprise link). The consumer Gemini app doesn't take custom MCP servers yet.</p>
    </div>

    <div class="panel" data-tab="code" data-active="false">
      <p class="hint">One command in your terminal:</p>
      <div class="code promptcode">
        <button class="copy" data-copy="cfg-code"><svg class="ico"><use href="#i-copy"/></svg>Copy</button>
        <div class="bar"><svg class="ico"><use href="#i-terminal"/></svg><span class="f">terminal</span></div>
        <pre id="cfg-code">${escapeHtml(cfg.claudeCodeCmd)}</pre>
      </div>
      ${docLinks(
        "https://docs.claude.com/en/docs/claude-code/mcp",
        "Claude Code — MCP docs",
        "Claude Code add MCP server",
      )}
    </div>

    <div class="panel" data-tab="cursor" data-active="false">
      <p class="hint">Add to <code>~/.cursor/mcp.json</code> (or any MCP client that speaks Streamable HTTP):</p>
      <div class="code">
        <button class="copy" data-copy="cfg-cursor"><svg class="ico"><use href="#i-copy"/></svg>Copy</button>
        <div class="bar"><svg class="ico"><use href="#i-settings"/></svg><span class="f">~/.cursor/mcp.json</span></div>
        <pre id="cfg-cursor">${escapeHtml(cfg.cursorConfig)}</pre>
      </div>
      ${docLinks(
        "https://docs.cursor.com/context/model-context-protocol",
        "Cursor — MCP docs",
        "Cursor add MCP server",
      )}
    </div>`;
}

/** Shared behaviour: tabs, copy-to-clipboard, scroll reveal, count-up. No graph. */
export const SHARED_SCRIPT = `<script>
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tabs=document.querySelectorAll('.tab'), panels=document.querySelectorAll('.panel');
  tabs.forEach(function(t){ t.addEventListener('click',function(){
    var key=t.getAttribute('data-tab');
    tabs.forEach(function(x){x.setAttribute('aria-selected', x===t?'true':'false')});
    panels.forEach(function(p){p.setAttribute('data-active', p.getAttribute('data-tab')===key?'true':'false')});
  }); });

  var toast=document.getElementById('toast'), tt;
  function showToast(){ if(!toast) return; toast.classList.add('show'); clearTimeout(tt); tt=setTimeout(function(){toast.classList.remove('show')},1600); }
  function fallback(text){ var ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy')}catch(e){} document.body.removeChild(ta); }
  document.querySelectorAll('.copy').forEach(function(btn){ btn.addEventListener('click',function(){
    var el=document.getElementById(btn.getAttribute('data-copy')); var text=el?el.textContent:'';
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(showToast).catch(function(){fallback(text);showToast()}); }
    else { fallback(text); showToast(); }
  }); });

  var reveals=document.querySelectorAll('.reveal');
  function fmt(n){ return n.toLocaleString('en-US'); }
  function runCount(el){
    var target=parseInt(el.getAttribute('data-count'),10)||0;
    var pre=el.getAttribute('data-prefix')||'', suf=el.getAttribute('data-suffix')||'';
    if(reduce||target===0){ el.textContent=pre+fmt(target)+suf; return; }
    var start=null, dur=1100;
    function step(ts){ if(!start)start=ts; var p=Math.min((ts-start)/dur,1); var e=1-Math.pow(1-p,3);
      el.textContent=pre+fmt(Math.round(target*e))+suf; if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){
      en.target.classList.add('in'); en.target.querySelectorAll('[data-count]').forEach(runCount); io.unobserve(en.target);
    }}); },{threshold:0.15});
    reveals.forEach(function(r){io.observe(r)});
  } else { reveals.forEach(function(r){ r.classList.add('in'); r.querySelectorAll('[data-count]').forEach(runCount); }); }
})();
</script>`;

/** The interactive 3D knowledge graph (home page only). */
export const GRAPH_SCRIPT = `<script>
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('graph');
  if(!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var W=0, H=0, dpr=Math.min(window.devicePixelRatio||1, 2);
  var N = 46;
  var COLORS = [[58,225,255],[167,139,250],[61,232,160]];
  var nodes = [];
  var gold = Math.PI * (3 - Math.sqrt(5));
  for(var i=0;i<N;i++){
    var y = 1 - (i/(N-1))*2;
    var r = Math.sqrt(1 - y*y);
    var th = gold * i;
    nodes.push({ x:Math.cos(th)*r, y:y, z:Math.sin(th)*r, c:i%3, s:0.6+((i*13)%7)/10 });
  }
  var edges=[];
  for(var a=0;a<N;a++){
    var best=[];
    for(var b=0;b<N;b++){ if(a===b) continue;
      var dx=nodes[a].x-nodes[b].x, dy=nodes[a].y-nodes[b].y, dz=nodes[a].z-nodes[b].z;
      best.push({b:b, d:dx*dx+dy*dy+dz*dz});
    }
    best.sort(function(p,q){return p.d-q.d});
    for(var k=0;k<2;k++){ if(best[k] && a<best[k].b) edges.push([a,best[k].b]); }
  }
  var rotY=0.4, rotX=-0.25, autoV=0.0025;
  var dragging=false, lastX=0, lastY=0, velY=0, velX=0, hover=-1;
  function resize(){ var rect=canvas.getBoundingClientRect(); W=rect.width; H=rect.height; canvas.width=Math.round(W*dpr); canvas.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); }
  function project(n){
    var cy=Math.cos(rotY), sy=Math.sin(rotY);
    var x1=n.x*cy - n.z*sy, z1=n.x*sy + n.z*cy;
    var cx=Math.cos(rotX), sx=Math.sin(rotX);
    var y1=n.y*cx - z1*sx, z2=n.y*sx + z1*cx;
    var R=Math.min(W,H)*0.36, f=2.6, scale=f/(f - z2);
    return { sx:W/2 + x1*R*scale, sy:H/2 + y1*R*scale, depth:z2 };
  }
  function frame(){
    if(!reduce && !dragging){ rotY += autoV + velY; rotX += velX; velY*=0.94; velX*=0.94; }
    ctx.clearRect(0,0,W,H);
    var P = nodes.map(project);
    for(var e=0;e<edges.length;e++){
      var A=P[edges[e][0]], B=P[edges[e][1]];
      var dep=(A.depth+B.depth)/2, al=Math.max(0.04,(dep+1)/2*0.5);
      var lit=(hover===edges[e][0]||hover===edges[e][1]);
      ctx.beginPath(); ctx.moveTo(A.sx,A.sy); ctx.lineTo(B.sx,B.sy);
      ctx.strokeStyle = lit ? 'rgba(58,225,255,'+Math.min(0.9,al+0.5)+')' : 'rgba(120,170,220,'+al+')';
      ctx.lineWidth = lit?1.6:1; ctx.stroke();
    }
    var order = P.map(function(p,idx){return idx}).sort(function(i,j){return P[i].depth-P[j].depth});
    for(var o=0;o<order.length;o++){
      var idx=order[o], p=P[idx], c=COLORS[nodes[idx].c];
      var rad=(2.2+(p.depth+1)*2.4)*nodes[idx].s*(idx===hover?1.7:1);
      var aa=0.35+(p.depth+1)/2*0.6;
      var g=ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,rad*3.2);
      g.addColorStop(0,'rgba('+c[0]+','+c[1]+','+c[2]+','+Math.min(1,aa+0.15)+')');
      g.addColorStop(0.35,'rgba('+c[0]+','+c[1]+','+c[2]+','+(aa*0.5)+')');
      g.addColorStop(1,'rgba('+c[0]+','+c[1]+','+c[2]+',0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.sx,p.sy,rad*3.2,0,6.2832); ctx.fill();
      ctx.fillStyle='rgba('+c[0]+','+c[1]+','+c[2]+','+Math.min(1,aa+0.25)+')';
      ctx.beginPath(); ctx.arc(p.sx,p.sy,rad,0,6.2832); ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  function pos(ev){ var r=canvas.getBoundingClientRect(); var t=ev.touches?ev.touches[0]:ev; return {x:t.clientX-r.left, y:t.clientY-r.top}; }
  function down(ev){ dragging=true; var p=pos(ev); lastX=p.x; lastY=p.y; velY=0; velX=0; }
  function move(ev){
    var p=pos(ev);
    if(dragging){
      var dx=p.x-lastX, dy=p.y-lastY; lastX=p.x; lastY=p.y;
      rotY += dx*0.006; rotX += dy*0.006; rotX=Math.max(-1.2,Math.min(1.2,rotX));
      velY=dx*0.0009; velX=dy*0.0009;
    } else {
      var P=nodes.map(project), bi=-1, bd=1e9;
      for(var i=0;i<P.length;i++){ var d=(P[i].sx-p.x)*(P[i].sx-p.x)+(P[i].sy-p.y)*(P[i].sy-p.y); if(d<bd){bd=d; bi=i;} }
      hover = bd<220 ? bi : -1;
    }
  }
  function up(){ dragging=false; }
  canvas.addEventListener('mousedown',down); window.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
  canvas.addEventListener('mouseleave',function(){hover=-1});
  canvas.addEventListener('touchstart',function(e){down(e)},{passive:true});
  canvas.addEventListener('touchmove',function(e){move(e); e.preventDefault();},{passive:false});
  canvas.addEventListener('touchend',up);
  resize();
  if('ResizeObserver' in window){ new ResizeObserver(resize).observe(canvas); } else window.addEventListener('resize',resize);
  requestAnimationFrame(frame);
})();
</script>`;

/** The interactive "skills orbiting the assistant" 3D model (Playbook page). */
export const ORBIT_SCRIPT = `<script>
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('orbit');
  if(!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var W=0, H=0, dpr=Math.min(window.devicePixelRatio||1, 2);
  var C=[58,225,255], V=[167,139,250], G=[61,232,160];
  // one ring per skill: radius, tilt around X (ax) and Z (az), colour, speed, phase
  var rings=[
    {r:0.52, ax:0.55, az:0.15, col:C, sp:0.0110, ph:0.0},
    {r:0.72, ax:-0.42, az:0.5, col:V, sp:0.0088, ph:1.1},
    {r:0.9,  ax:0.32, az:-0.5, col:G, sp:0.0072, ph:2.3},
    {r:0.83, ax:0.95, az:0.08, col:C, sp:0.0080, ph:3.5},
    {r:0.63, ax:-0.72, az:-0.3, col:V, sp:0.0098, ph:4.7},
    {r:1.02, ax:0.12, az:0.72, col:G, sp:0.0060, ph:0.6}
  ];
  var rotY=0.5, rotX=-0.35, autoV=0.0022;
  var dragging=false, lastX=0, lastY=0, velY=0, velX=0, hover=-1;

  function resize(){ var rc=canvas.getBoundingClientRect(); W=rc.width; H=rc.height; canvas.width=Math.round(W*dpr); canvas.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); }

  function tf(x,y,z, ax, az){
    // ring tilt: rotate X then Z
    var y1=y*Math.cos(ax)-z*Math.sin(ax), z1=y*Math.sin(ax)+z*Math.cos(ax), x1=x;
    var x2=x1*Math.cos(az)-y1*Math.sin(az), y2=x1*Math.sin(az)+y1*Math.cos(az), z2=z1;
    // global rotY then rotX
    var cY=Math.cos(rotY), sY=Math.sin(rotY);
    var x3=x2*cY - z2*sY, z3=x2*sY + z2*cY, y3=y2;
    var cX=Math.cos(rotX), sX=Math.sin(rotX);
    var y4=y3*cX - z3*sX, z4=y3*sX + z3*cX, x4=x3;
    var R=Math.min(W,H)*0.34, f=3, sc=f/(f - z4);
    return { sx:W/2 + x4*R*sc, sy:H/2 + y4*R*sc, depth:z4, sc:sc };
  }
  function orb(i){ var g=ctx.createRadialGradient(i.sx,i.sy,0,i.sx,i.sy,i.rad); for(var k=0;k<i.stops.length;k++) g.addColorStop(i.stops[k][0], i.stops[k][1]); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(i.sx,i.sy,i.rad,0,6.2832); ctx.fill(); }

  function frame(){
    if(!reduce && !dragging){ rotY += autoV + velY; rotX += velX; velY*=0.94; velX*=0.94; }
    ctx.clearRect(0,0,W,H);
    // draw rings back-to-front-ish (just draw all faint)
    for(var ri=0; ri<rings.length; ri++){
      var R=rings[ri]; if(!reduce) R.ph += R.sp;
      ctx.beginPath();
      for(var t=0;t<=64;t++){
        var a=t/64*6.2832;
        var p=tf(Math.cos(a)*R.r, 0, Math.sin(a)*R.r, R.ax, R.az);
        if(t===0) ctx.moveTo(p.sx,p.sy); else ctx.lineTo(p.sx,p.sy);
      }
      var lit=(hover===ri);
      ctx.strokeStyle='rgba('+R.col[0]+','+R.col[1]+','+R.col[2]+','+(lit?0.5:0.16)+')';
      ctx.lineWidth=lit?1.6:1; ctx.stroke();
    }
    // central core
    var core=tf(0,0,0,0,0);
    orb({sx:core.sx, sy:core.sy, rad:Math.min(W,H)*0.12, stops:[[0,'rgba(58,225,255,.9)'],[0.3,'rgba(58,225,255,.35)'],[1,'rgba(58,225,255,0)']]});
    ctx.fillStyle='rgba(220,250,255,.95)'; ctx.beginPath(); ctx.arc(core.sx,core.sy,Math.min(W,H)*0.021,0,6.2832); ctx.fill();
    // travelling skill nodes, sorted by depth
    var pts=[];
    for(var i2=0;i2<rings.length;i2++){ var Rr=rings[i2]; var p=tf(Math.cos(Rr.ph)*Rr.r, 0, Math.sin(Rr.ph)*Rr.r, Rr.ax, Rr.az); p.i=i2; p.col=Rr.col; pts.push(p); }
    pts.sort(function(a,b){return a.depth-b.depth});
    for(var n=0;n<pts.length;n++){
      var p2=pts[n], c=p2.col, big=(p2.i===hover);
      var rad=(3.4+(p2.depth+1)*2.6)*(big?1.6:1);
      var al=0.4+(p2.depth+1)/2*0.6;
      orb({sx:p2.sx, sy:p2.sy, rad:rad*3, stops:[[0,'rgba('+c[0]+','+c[1]+','+c[2]+','+Math.min(1,al+0.15)+')'],[0.4,'rgba('+c[0]+','+c[1]+','+c[2]+','+(al*0.45)+')'],[1,'rgba('+c[0]+','+c[1]+','+c[2]+',0)']]});
      ctx.fillStyle='rgba('+c[0]+','+c[1]+','+c[2]+','+Math.min(1,al+0.3)+')'; ctx.beginPath(); ctx.arc(p2.sx,p2.sy,rad,0,6.2832); ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  function pos(ev){ var r=canvas.getBoundingClientRect(); var t=ev.touches?ev.touches[0]:ev; return {x:t.clientX-r.left, y:t.clientY-r.top}; }
  function down(ev){ dragging=true; var p=pos(ev); lastX=p.x; lastY=p.y; velY=0; velX=0; }
  function move(ev){
    var p=pos(ev);
    if(dragging){
      var dx=p.x-lastX, dy=p.y-lastY; lastX=p.x; lastY=p.y;
      rotY += dx*0.006; rotX += dy*0.006; rotX=Math.max(-1.2,Math.min(1.2,rotX));
      velY=dx*0.0009; velX=dy*0.0009;
    } else {
      var bi=-1, bd=1e9;
      for(var i=0;i<rings.length;i++){ var Rr=rings[i]; var pt=tf(Math.cos(Rr.ph)*Rr.r,0,Math.sin(Rr.ph)*Rr.r,Rr.ax,Rr.az); var d=(pt.sx-p.x)*(pt.sx-p.x)+(pt.sy-p.y)*(pt.sy-p.y); if(d<bd){bd=d; bi=i;} }
      hover = bd<400 ? bi : -1;
    }
  }
  function up(){ dragging=false; }
  canvas.addEventListener('mousedown',down); window.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
  canvas.addEventListener('mouseleave',function(){hover=-1});
  canvas.addEventListener('touchstart',function(e){down(e)},{passive:true});
  canvas.addEventListener('touchmove',function(e){move(e); e.preventDefault();},{passive:false});
  canvas.addEventListener('touchend',up);
  resize();
  if('ResizeObserver' in window){ new ResizeObserver(resize).observe(canvas); } else window.addEventListener('resize',resize);
  requestAnimationFrame(frame);
})();
</script>`;
