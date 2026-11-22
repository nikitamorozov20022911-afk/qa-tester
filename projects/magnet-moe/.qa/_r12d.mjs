import { chromium } from 'playwright';
const b = await chromium.launch();
for (const who of process.argv.slice(2)) {
const AUTH='auth/'+who+'.json';
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true });
const p = await c.newPage();
await p.goto('https://magnet.expo.app/matches',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
const t=(await p.evaluate(()=>document.body.innerText)).replace(/\n+/g,' | ');
console.log(who,p.url().replace('https://magnet.expo.app',''),'| has0012:',t.includes('0012'),'|',t.slice(0,150));
await c.storageState({path:AUTH}); await c.close();
}
await b.close();
