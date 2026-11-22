import { chromium } from 'playwright'; import fs from 'node:fs';
const f = process.argv[2];
const b = await chromium.launch({ channel: 'chrome', headless: true }); const p = await b.newPage();
const out = await p.evaluate(async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0);
 const hx = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); };
 const res = []; for (let y = 36; y < 56; y++) for (let x = 0; x < i.width; x++) { const d = g.getImageData(x, y, 1, 1).data; if (d[0] + d[1] + d[2] < 250 && d[3] > 200) res.push([x, y, hx(x, y)]); }
 return { size: [i.width, i.height], dark: res.filter(r => r[0] > 180), track: [60, 100, 300, 350].map(x => hx(x, 46)) }; }, fs.readFileSync(f).toString('base64'));
console.log(JSON.stringify(out)); await b.close();
