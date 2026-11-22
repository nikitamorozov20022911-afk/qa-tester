const { chromium } = require('../e2e/node_modules/playwright');
(async () => {
  const b = await chromium.launch({channel:'chrome'});
  const ctx = await b.newContext({ storageState: '../auth/client.json', viewport: {width:375,height:812}, deviceScaleFactor:2, isMobile:true, hasTouch:true, locale:'he-IL' });
  await ctx.serviceWorkers?.length;
  const p = await ctx.newPage();
  await p.goto('https://safepay.expo.app/', {waitUntil:'networkidle'});
  console.log('URL', p.url());
  console.log((await p.locator('body').innerText()).slice(0,1500));
  await p.getByText('נותני שירות').first().click();
  await p.waitForTimeout(3000);
  console.log('URL', p.url());
  console.log((await p.locator('body').innerText()).slice(0,2000));
  await b.close();
})();
