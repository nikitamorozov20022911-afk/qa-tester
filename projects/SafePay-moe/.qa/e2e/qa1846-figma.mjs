import { chromium } from 'playwright';
const SS = '/Users/avielshnaider/SafePay-moe/.qa/screenshots/1846ecd8';
const b = await chromium.launch({ headless: false, channel: 'chrome' });
const c = await b.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
const p = await c.newPage();
for (const n of (process.env.NODES || '6072-6117').split(',')) {
  await p.goto(`https://www.figma.com/design/bk5RVsIkwwU4FsVMzh2lP2/SafePay--Deploy-?node-id=${n}&m=dev`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(20000);
  // close popups
  for (const s of ['button:has-text("Close")', '[aria-label="Close"]']) await p.locator(s).first().click({ timeout: 1000 }).catch(() => {});
  await p.keyboard.press('Shift+2').catch(()=>{});
  await p.waitForTimeout(4000);
  await p.screenshot({ path: `${SS}/figma-${n}.png` }); await p.screenshot({ path: `${SS}/figma-${n}-zoom.png`, clip: { x: 405, y: 140, width: 520, height: 770 } });
  console.log(n, p.url(), (await p.title()));
}
await b.close();
