import { chromium, devices } from 'playwright';
const out = '../screenshots/client-0111/';
const b = await chromium.launch();
const g = await b.newContext({ ...devices['iPhone 13'] });
const p = await g.newPage();
await p.goto('https://safepay.expo.app/', { waitUntil: 'commit' });
let t = 0;
for (const d of [600, 400, 400, 400, 400, 400, 400, 400, 600, 800]) { await p.waitForTimeout(d); t += d; await p.screenshot({ path: out + `splash-${t}.png` }); }
await b.close();
