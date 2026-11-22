const { chromium } = require('../e2e/node_modules/playwright');
(async () => {
  const b = await chromium.launch({channel:'chrome'});
  const ctx = await b.newContext({ storageState: '../auth/client.json', viewport: {width:375,height:812}, deviceScaleFactor:2, isMobile:true, hasTouch:true, locale:'he-IL' });
  const p = await ctx.newPage();
  await p.goto('https://safepay.expo.app/deals/new?providerId=1929b054-5ae2-40ee-bee0-bfba608ac1fa', {waitUntil:'networkidle'});
  await p.waitForTimeout(2000);
  await p.getByRole('button',{name:/סוג העסקה/}).click();
  await p.waitForTimeout(1000);
  console.log(await p.locator('body').ariaSnapshot());
  await b.close();
})();
