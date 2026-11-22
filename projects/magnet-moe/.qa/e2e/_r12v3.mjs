import { chromium } from 'playwright';
const A='/Users/avielshnaider/magnet-moe/.qa/auth/admin-r11.json';
const b=await chromium.launch(); const c=await b.newContext({storageState:A,viewport:{width:1440,height:900}}); const p=await c.newPage();
await p.goto('https://magnet-admin.vercel.app/verifications',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
if(!(await p.getByText('QA r10 0017').count())){console.log('NO PENDING 0017');} else {
 await p.getByRole('button',{name:'אישור האימות'}).first().click(); await p.waitForTimeout(1500);
 await p.getByRole('button',{name:'אישור האימות'}).last().click();
 await p.waitForTimeout(3000);
 console.log('AFTER',(await p.evaluate(()=>document.body.innerText)).match(/ממתינים[^]*?נדחו\n\d+/)?.[0]?.replace(/\n/g,' '));
}
await p.screenshot({path:'/Users/avielshnaider/magnet-moe/.qa/screenshots/r12-d29e8b-adm-03-approved.png'});
await c.storageState({path:A}); await b.close();
