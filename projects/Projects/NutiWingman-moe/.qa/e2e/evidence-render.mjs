// QA: render request/response (or text/code) evidence cards to PNG with red outline on key parts.
// usage: node evidence-render.mjs <spec.mjs>   — spec default-exports [{ file, title, blocks:[...] }]
// block: { kind:'req', method, path, body, account, note } | { kind:'resp', status, json, note }
//        { kind:'text', label, text } | { kind:'code', label, text }
// highlight: any string in block.hl[] is wrapped with a red outline (matched on escaped text).
import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const specPath = path.resolve(process.argv[2]);
const shots = (await import(pathToFileURL(specPath).href)).default;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hl = (html, list = []) => { for (const h of list) html = html.split(esc(h)).join(`<span class="hl">${esc(h)}</span>`); return html; };
const blockHtml = b => {
  if (b.kind === 'req') {
    const t = `${b.method} ${b.path}\naccount: ${b.account}` + (b.body !== undefined ? `\nbody: ${typeof b.body === 'string' ? b.body : JSON.stringify(b.body)}` : '');
    return `<h2>בקשה / Request</h2>${b.note ? `<p class="note" dir="auto">${esc(b.note)}</p>` : ''}<pre>${hl(esc(t), b.hl)}</pre>`;
  }
  if (b.kind === 'resp') {
    const t = `HTTP ${b.status}\n` + JSON.stringify(b.json, null, 2);
    return `<h2>תשובה / Response</h2>${b.note ? `<p class="note" dir="auto">${esc(b.note)}</p>` : ''}<pre>${hl(esc(t), b.hl)}</pre>`;
  }
  return `<h2 dir="auto">${esc(b.label)}</h2><pre class="${b.kind === 'code' ? 'code' : 'txt'}">${hl(esc(b.text), b.hl)}</pre>`;
};
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 900, height: 400 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
for (const s of shots) {
  const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#fff;color:#111;font:14px/1.45 Consolas,'Courier New',monospace;width:900px}
  .wrap{padding:18px 22px}
  h1{font-size:17px;margin:0 0 6px;font-family:Arial,sans-serif}
  .meta{color:#555;font-size:12px;margin-bottom:10px;font-family:Arial,sans-serif}
  h2{font-size:14px;margin:14px 0 4px;font-family:Arial,sans-serif;color:#234}
  pre{background:#f6f8fa;border:1px solid #d0d7de;border-radius:4px;padding:10px 12px;margin:0;white-space:pre-wrap;word-break:break-word}
  pre.txt{unicode-bidi:plaintext}
  .note{margin:2px 0 4px;color:#444;font-family:Arial,sans-serif;font-size:13px}
  .hl{outline:3px solid red;outline-offset:1px;border-radius:2px}
  </style><div class="wrap"><h1 dir="auto">${esc(s.title)}</h1><div class="meta">${esc(s.meta ?? 'NutriWingman QA · https://siodtucasjpxpsfuvlfc.supabase.co · 2026-11-11')}</div>${s.blocks.map(blockHtml).join('')}</div>`;
  await page.setContent(html);
  const h = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width: 900, height: Math.max(200, h) });
  await page.screenshot({ path: s.file, fullPage: true });
  console.log('saved', s.file, h);
}
await browser.close();
