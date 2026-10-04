// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Склейка «как в Figma | как у нас» в одну картинку для тикета.
// node compare.mjs <figma.png> <site.png> <out.png> [подпись Figma] [подпись сайта] [--rtl]
// Пример: node compare.mjs ../screenshots/ab12-header-figma.png ../screenshots/ab12-header-mobile.png ../screenshots/ab12-header-compare.png "Figma (עיצוב)" "באתר (בפועל)" --rtl
import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const rtl = args.includes('--rtl');
const [figma, site, out, labelFigma = 'Figma', labelSite = 'Site'] = args.filter((a) => a !== '--rtl');
if (!figma || !site || !out) {
  console.error('usage: node compare.mjs <figma.png> <site.png> <out.png> [labelFigma] [labelSite] [--rtl]');
  process.exit(1);
}

const dataUri = (p) => {
  const ext = path.extname(p).slice(1).toLowerCase().replace('jpg', 'jpeg') || 'png';
  return `data:image/${ext};base64,${fs.readFileSync(p).toString('base64')}`;
};
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Ширина колонки по формату снимка сайта: десктоп — шире, телефон — уже (размер из заголовка PNG).
const pngSize = (p) => { const b = fs.readFileSync(p); return b.toString('ascii', 1, 4) === 'PNG' ? { w: b.readUInt32BE(16), h: b.readUInt32BE(20) } : { w: 1, h: 1 }; };
const { w, h } = pngSize(site);
const colWidth = w > h ? 820 : 420;

// Обе картинки — одной ширины колонки, по верхнему краю: так разница в отступах и размерах видна сразу.
const col = (label, src, color) => `
  <div class="col">
    <div class="label" style="background:${color}">${esc(label)}</div>
    <img src="${src}">
  </div>`;

const html = `<!doctype html><html dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
  body { margin: 0; background: #fff; font: 600 18px/1.3 -apple-system, Segoe UI, Arial, sans-serif; }
  .wrap { display: flex; gap: 24px; padding: 16px; align-items: flex-start; width: max-content; }
  .col { width: ${colWidth}px; border: 1px solid #d0d0d0; }
  .label { color: #fff; padding: 8px 12px; }
  img { display: block; width: 100%; height: auto; }
</style></head><body><div class="wrap">
  ${col(labelFigma, dataUri(figma), '#6b4eff')}
  ${col(labelSite, dataUri(site), '#d93025')}
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'load' });
await page.locator('.wrap').screenshot({ path: out });
await browser.close();
console.log(out);
