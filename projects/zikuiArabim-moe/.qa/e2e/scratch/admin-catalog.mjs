import { chromium } from 'playwright';
const b = await chromium.launch();
const c = await b.newContext({ storageState: '../auth/admin.json', viewport:{width:390,height:844} });
const p = await c.newPage();
try {
  await p.goto('https://zichui-harabim.expo.app/admin', { waitUntil: 'networkidle' });
  await p.waitForTimeout(4000);
  for (let i=0;i<15;i++){ await p.mouse.wheel(0,3000); await p.waitForTimeout(400); }
  console.log(await p.locator('body').innerText());
  const links = await p.$$eval('a', as => as.map(a => a.getAttribute('href')).filter(h => h && h.includes('admin')));
  console.log('LINKS', JSON.stringify([...new Set(links)]));
} finally {
  await c.storageState({ path: '../auth/admin.json' });
  await b.close();
}
