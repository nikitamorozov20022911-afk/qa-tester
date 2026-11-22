import { chromium } from 'playwright';
const A='/Users/avielshnaider/magnet-moe/.qa/auth/admin-r11.json';
const b=await chromium.launch(); const c=await b.newContext({storageState:A,viewport:{width:1440,height:900}}); const p=await c.newPage();
await p.goto('https://magnet-admin.vercel.app/verifications',{waitUntil:'networkidle'}); await p.waitForTimeout(3000);
console.log(p.url()); console.log((await p.evaluate(()=>document.body.innerText)).slice(0,2500));
console.log('BTNS',(await p.locator('button:visible').allInnerTexts()).filter(x=>x.trim()).join(' | ').slice(0,800));
await p.screenshot({path:'/Users/avielshnaider/magnet-moe/.qa/screenshots/r12-d29e8b-adm-01-queue.png'});
await c.storageState({path:A}); await b.close();
