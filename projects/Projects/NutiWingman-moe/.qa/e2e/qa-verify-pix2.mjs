import { chromium } from 'playwright'; import fs from 'node:fs';
const [f, x0, y0, x1, y1, outp] = process.argv.slice(2).map((v, i) => i && i < 5 ? +v : v);
const b = await chromium.launch({ channel: 'chrome', headless: true }); const p = await b.newPage();
const out = await p.evaluate(async ({ b64, x0, y0, x1, y1 }) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0);
 const res = []; for (let y = y0; y < y1; y++) { let s = ''; for (let x = x0; x < x1; x++) { const d = g.getImageData(x, y, 1, 1).data; const L = d[0] + d[1] + d[2]; s += L < 200 ? '#' : L > 740 ? 'o' : (d[1] > d[0] + 30 ? 'g' : (L > 690 ? '.' : '+')); } res.push(s); }
 return { size: [i.width, i.height], art: res }; }, { b64: fs.readFileSync(f).toString('base64'), x0, y0, x1, y1 });
console.log(out.size.join('x')); console.log(out.art.join('\n')); await b.close();
