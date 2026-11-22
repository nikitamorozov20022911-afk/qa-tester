import { chromium } from 'playwright';
const AUTH='auth/user2-r11map.json'; const SEND=process.argv[2]==='send';
const b = await chromium.launch();
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await c.newPage();
await p.goto('https://magnet.expo.app/profile/09368ba8-1aa9-4233-9fae-d3a7ff587084',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
for(let i=0;i<3;i++){const ms=p.locator('[data-testid=match-skip]'); if(await ms.count()){await ms.first().click({force:true}).catch(()=>{}); await p.waitForTimeout(1200);} }
await p.getByRole('button',{name:'מתנה'}).click(); await p.waitForTimeout(2500);
const txt=await p.evaluate(()=>document.body.innerText);
console.log('URL',p.url()); console.log('INFO',JSON.stringify(txt.match(/(יש לך[^\n]*|אפשר לשלוח[^\n]*|חינם[^\n]*)/g)));
console.log('BTNS',(await p.locator('button:visible').evaluateAll(bs=>bs.map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim()).filter(Boolean))).join(' | ').slice(0,900));
if(SEND){
  const free=p.getByRole('button',{name:/· חינם/}).first();
  if(!(await free.count())) console.log('NO FREE'); else {
    await free.click(); await p.waitForTimeout(1200);
    const f=p.locator('input[type=text], textarea, input:not([type])').last(); if(await f.count()) await f.fill('QA-AUTO r12 מתנה לבדיקה');
    const blk=(await p.evaluate(()=>document.body.innerText)).match(/אפשר לשלוח עוד[^\n]*/);
    if(blk) console.log('BLOCKED',blk[0]); else { await p.getByRole('button',{name:/שליחת מתנה/}).last().click(); await p.waitForTimeout(3500); console.log('SENT'); }
  }
}
await p.screenshot({path:'screenshots/r12-fc49b2-manual-user2-gift.png'});
await c.storageState({path:AUTH}); await b.close();
