import { chromium } from 'playwright'; import fs from 'node:fs';
const [f, ...pts] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true }); const p = await b.newPage();
const data = 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
console.log(f.split('/').pop(), JSON.stringify(await p.evaluate(async ([src, pts]) => { const img = new Image(); img.src = src; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  return pts.map(s => { const [X, Y] = s.split(',').map(Number); const d = x.getImageData(X, Y, 1, 1).data; return s + '=#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); }); }, [data, pts])));
await b.close();
