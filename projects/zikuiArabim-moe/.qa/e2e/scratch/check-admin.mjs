import { chromium } from 'playwright';
const b = await chromium.launch();
const c = await b.newContext({ storageState: '../auth/admin.json', viewport:{width:390,height:844} });
const p = await c.newPage();
await p.goto('https://zichui-harabim.expo.app/admin', { waitUntil: 'networkidle' });
await p.waitForTimeout(4000);
console.log((await p.locator('body').innerText()).slice(0,800));

await b.close();
