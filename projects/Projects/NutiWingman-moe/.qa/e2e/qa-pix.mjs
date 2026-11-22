import { chromium } from 'playwright'; import fs from 'node:fs';
const files = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true }); const p = await b.newPage();
for (const f of files) {
  const data = 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  const r = await p.evaluate(async (src) => { const img = new Image(); img.src = src; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); const s = img.width / 390;
    const out = {}; // scan rows of line region y 770..785 (1x), find saturated colors histogram
    const hist = {}; for (let y = Math.round(770 * s); y <= Math.round(785 * s); y++) for (let X = 0; X < img.width; X++) { const [R, G, B] = x.getImageData(X, y, 1, 1).data; const mx = Math.max(R, G, B), mn = Math.min(R, G, B); if (mx - mn < 60) continue; const k = '#' + [R, G, B].map(v => (v >> 3 << 3).toString(16).padStart(2, '0')).join(''); hist[k] = (hist[k] || 0) + 1; }
    return { w: img.width, h: img.height, top: Object.entries(hist).sort((a, b) => b[1] - a[1]).slice(0, 4) }; }, data);
  console.log(f.split('/').pop(), JSON.stringify(r));
}
await b.close();
