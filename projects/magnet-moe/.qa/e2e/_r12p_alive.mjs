import { chromium } from 'playwright';
const files = JSON.parse(process.argv[2]);
const b = await chromium.launch();
for (const [acc, f] of Object.entries(files)) {
  const AUTH = '../auth/' + f;
  const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
  const p = await c.newPage();
  try {
    await p.goto('https://magnet.expo.app/', {waitUntil:'networkidle', timeout:45000}); await p.waitForTimeout(4000);
    const url = p.url();
    const t = (await p.evaluate(()=>document.body.innerText)).slice(0,120).replace(/\n/g,' | ');
    console.log(acc, f, '=>', url, '::', t);
    if (!/welcome|phone|login/.test(url)) await c.storageState({path:AUTH});
  } catch(e) { console.log(acc, 'ERR', e.message.slice(0,100)); }
  await c.close();
}
await b.close();
