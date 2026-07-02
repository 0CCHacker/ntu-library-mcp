/**
 * Local preview of the marketing site (home + Playbook) — no Cloudflare runtime
 * needed. Serves the real page builders so cross-page links work.
 *
 *   npm run site        → http://localhost:3000
 *
 * For the full Worker (site + MCP tools + /stats), use `npm run dev` (wrangler).
 */
import { createServer } from "node:http";
import { LANDING_PAGE } from "../src/landing";
import { PLAYBOOK_PAGE } from "../src/playbook";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = `localhost:${PORT}`;

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${HOST}`);
  const html =
    url.pathname === "/playbook" || url.pathname === "/guide"
      ? PLAYBOOK_PAGE()
      : url.pathname === "/" || url.pathname === "/index.html"
        ? LANDING_PAGE()
        : null;

  if (html === null) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found. Try / or /playbook");
    return;
  }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`\n  NTU Library MCP — site preview running:\n`);
  console.log(`    Home      →  http://${HOST}/`);
  console.log(`    Playbook  →  http://${HOST}/playbook\n`);
  console.log(`  (Ctrl+C to stop. For the full Worker incl. MCP tools, run: npm run dev)\n`);
});
