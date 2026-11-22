import { chromium } from 'playwright';
const b = await chromium.launch();
const c = await b.newContext({ storageState: '/Users/avielshnaider/magnet-moe/.qa/auth/admin-r11.json', viewport:{width:1440,height:900} });
const p = await c.newPage();
await p.goto('https://magnet-admin.vercel.app/', {waitUntil:'networkidle'});
await p.waitForTimeout(2000);
console.log(await p.evaluate(()=>document.body.innerText.slice(0,800)));
await c.storageState({path:'/Users/avielshnaider/magnet-moe/.qa/auth/admin-r11.json'});
await b.close();
