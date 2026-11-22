import { chromium } from 'playwright';
const b = await chromium.launch();
const c = await b.newContext({ storageState: '../auth/admin.json', viewport:{width:390,height:844} });
const p = await c.newPage();
try {
  await p.goto('https://zichui-harabim.expo.app/admin', { waitUntil:'networkidle' }); await p.waitForTimeout(4000);
  const inp = p.locator('input, textarea').first(); await inp.click(); await inp.pressSequentially('אבות', { delay: 60 }); await p.waitForTimeout(2000);
  const t = await p.locator('body').innerText(); console.log('ADMIN after search:', t.slice(0,600));
  await p.screenshot({ path: '../screenshots/d99a8f-admin-search-avot-mobile.png' });
} finally { await c.storageState({ path: '../auth/admin.json' }); await b.close(); }
