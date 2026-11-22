import { chromium, devices } from 'playwright';
const out = '../screenshots/client-2510/';
const b = await chromium.launch();
const g = await b.newContext({ ...devices['iPhone 13'] });
const p = await g.newPage();
await p.goto('https://safepay.expo.app/', { waitUntil: 'commit' });
for (const t of [800, 1500, 2200, 3000, 3800]) { await p.waitForTimeout(t === 800 ? 800 : 700); await p.screenshot({ path: out + `vault-${t}.png` }); }
await b.close();
