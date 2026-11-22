import { chromium } from 'playwright';
const SS = '/Users/avielshnaider/SafePay-moe/.qa/screenshots/sp6-figma';
const b = await chromium.launch({ headless: false, channel: 'chrome' });
const c = await b.newContext({ viewport: { width: 2800, height: 1500 }, deviceScaleFactor: 1.5 });
const p = await c.newPage();
let first = true;
for (const n of process.env.NODES.split(',')) {
  await p.goto(`https://www.figma.com/design/bk5RVsIkwwU4FsVMzh2lP2/SafePay--Deploy-?node-id=${n}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(first ? 25000 : 15000); first = false;
  for (const s of ['button:has-text("Close")', '[aria-label="Close"]']) await p.locator(s).first().click({ timeout: 1000 }).catch(() => {});
  await p.mouse.click(800, 500).catch(()=>{});
  await p.goto(`https://www.figma.com/design/bk5RVsIkwwU4FsVMzh2lP2/SafePay--Deploy-?node-id=${n}`, { waitUntil: 'domcontentloaded' }).catch(()=>{});
  await p.waitForTimeout(12000);
  await p.keyboard.press('Shift+2').catch(()=>{});
  await p.waitForTimeout(4000);
  await p.screenshot({ path: `${SS}/wide-${n}.png` });
  // layer panel text for structure
  const layers = await p.evaluate(() => document.body.innerText.slice(0, 1500)).catch(()=> '');
  console.log('##', n, p.url(), '\n', layers.replace(/\n+/g,' | ').slice(0,600));
}
await b.close();
