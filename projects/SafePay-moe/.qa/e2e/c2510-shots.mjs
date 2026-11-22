import { chromium, devices } from 'playwright';
const out = '../screenshots/client-2510/';
const b = await chromium.launch();
// splash — без входа, кадры анимации
const g = await b.newContext({ ...devices['iPhone 13'] });
const gp = await g.newPage();
await gp.goto('https://safepay.expo.app/', { waitUntil: 'commit' });
for (const t of [600, 1300, 2000, 2800]) { await gp.waitForTimeout(t === 600 ? 600 : 700); await gp.screenshot({ path: out + `splash-${t}.png` }); }
// профиль с меню + нижняя навигация
const c = await b.newContext({ ...devices['iPhone 13'], storageState: '../auth/client.json' });
const p = await c.newPage();
await p.goto('https://safepay.expo.app/profile', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.screenshot({ path: out + 'profile.png', fullPage: true });
console.log('url', p.url());
console.log((await p.locator('body').innerText()).slice(0, 800));
await b.close();
