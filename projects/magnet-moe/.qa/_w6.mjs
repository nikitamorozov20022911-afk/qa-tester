import { chromium } from 'playwright';
const AUTH=process.argv[2]; const SEND=process.argv[3]==='send';
const b = await chromium.launch();
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await c.newPage();
await p.goto('https://magnet.expo.app/matches', {waitUntil:'networkidle'}); await p.waitForTimeout(3000);
for(let i=0;i<3;i++){const ms=p.locator('[data-testid=match-skip]'); if(await ms.count()){await ms.first().click({force:true}).catch(()=>{}); await p.waitForTimeout(1500);} }
const row=p.getByText('QA רביעית').last();
if(!(await row.count())){ console.log('NO CHAT with user4'); console.log((await p.evaluate(()=>document.body.innerText)).slice(0,600)); }
else {
 await row.click(); await p.waitForTimeout(3000); console.log('chat url', p.url());
 const sk=p.locator("[data-testid=gift-intro-skip]"); if(await sk.count()) await sk.click({force:true}).catch(()=>{});
 await p.waitForTimeout(1500);
 await p.getByRole('button',{name:"פעולות על הצ'אט"}).click();
 await p.getByText(/שליחת מתנה ל/).first().click(); await p.waitForTimeout(2000);
 console.log((await p.locator('button:visible').allInnerTexts()).filter(x=>/מתנה|חינם|₪|יש לך/.test(x)).join(' | '));
 console.log((await p.evaluate(()=>document.body.innerText)).match(/(יש לך[^\n]*|אפשר לשלוח[^\n]*)/g));
 if(SEND){
  const free=p.getByRole('button',{name:/· חינם/}).first();
  if(!(await free.count())) console.log('NO FREE GIFT'); else {
   await free.click(); await p.waitForTimeout(1200);
   await p.locator('input[type=text], textarea, input:not([type])').last().fill('QA-AUTO r12 לבדיקה ידנית 2');
   const blk=(await p.evaluate(()=>document.body.innerText)).match(/אפשר לשלוח עוד[^\n]*/);
   if(blk) console.log('BLOCKED', blk[0]); else { await p.getByRole('button',{name:/שליחת מתנה/}).last().click(); await p.waitForTimeout(3000); console.log('SENT'); }
  }
 }
 await p.screenshot({path:'screenshots/r12-fc49b2-manual-sender.png'});
}
await c.storageState({path:AUTH}); await b.close();
