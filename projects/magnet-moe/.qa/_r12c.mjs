import { chromium } from 'playwright';
const who=process.argv[2]; const AUTH='auth/'+who+'.json';
const b = await chromium.launch();
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await c.newPage();
for (const path of ['/matches','/likes','/profile']) {
 await p.goto('https://magnet.expo.app'+path,{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
 console.log('--',who,path,p.url()); console.log((await p.evaluate(()=>document.body.innerText)).replace(/\n+/g,' | ').slice(0,700));
}
await c.storageState({path:AUTH}); await b.close();
