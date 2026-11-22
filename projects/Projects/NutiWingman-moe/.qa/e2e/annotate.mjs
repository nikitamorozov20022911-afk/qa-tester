// Красная обводка на скриншотах: node annotate.mjs <spec.json>
// spec: [{ in, out, rects: [[x,y,w,h], ...] }]
import { chromium } from '@playwright/test';
import fs from 'node:fs'; import path from 'node:path';
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const opts = { headless: true };
const browser = await chromium.launch(opts).catch(() => chromium.launch({ ...opts, channel: 'chrome' }));
const page = await browser.newPage();
for (const s of spec) {
  const b64 = fs.readFileSync(s.in).toString('base64');
  const out = await page.evaluate(async ({ b64, rects }) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    g.strokeStyle = '#e00000'; g.lineWidth = Math.max(4, Math.round(c.width / 200));
    for (const [x, y, w, h] of rects) g.strokeRect(x, y, w, h);
    return c.toDataURL('image/png').split(',')[1];
  }, { b64, rects: s.rects });
  fs.mkdirSync(path.dirname(s.out), { recursive: true });
  fs.writeFileSync(s.out, Buffer.from(out, 'base64'));
  console.log('ok', s.out);
}
await browser.close();
