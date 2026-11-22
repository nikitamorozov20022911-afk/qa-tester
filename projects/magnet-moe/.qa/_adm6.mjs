import { chromium } from 'playwright';
const mode = process.argv[2]||'read';
const b = await chromium.launch();
const c = await b.newContext({ storageState: '/Users/avielshnaider/magnet-moe/.qa/auth/admin-r11.json', viewport:{width:1440,height:900} });
const p = await c.newPage();
const id = process.argv[3]||'09368ba8-1aa9-4233-9fae-d3a7ff587084';
await p.goto('https://magnet-admin.vercel.app/subscriptions/'+id, {waitUntil:'networkidle'});
await p.waitForTimeout(2500);
const cnt = async()=> (await p.evaluate(()=>document.body.innerText)).match(/מתנות חינם\n(\d+)/)?.[1];
console.log('free gifts counter before', await cnt());
if(mode==='grant'){
  await p.getByRole('button',{name:'הענקת מתנה'}).first().click();
  await p.waitForTimeout(800);
  await p.screenshot({path:`screenshots/r12-${process.argv[4]}-adm-grant-dialog.png`});
  await p.getByRole('button',{name:'הענקה'}).last().click();
  await p.waitForTimeout(3500);
  console.log('counter after (no reload)', await cnt());
  await p.screenshot({path:`screenshots/r12-${process.argv[4]}-adm-grant-after.png`});
}
await c.storageState({path:'/Users/avielshnaider/magnet-moe/.qa/auth/admin-r11.json'});
await b.close();
