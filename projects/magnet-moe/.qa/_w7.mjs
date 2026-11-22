import { chromium } from 'playwright';
const AUTH='auth/user2-r11map.json';
const b = await chromium.launch();
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await c.newPage();
for (const u of ['/profile/09368ba8-1aa9-4233-9fae-d3a7ff587084','/user/09368ba8-1aa9-4233-9fae-d3a7ff587084','/u/09368ba8-1aa9-4233-9fae-d3a7ff587084']){
  await p.goto('https://magnet.expo.app'+u,{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
  const t=await p.evaluate(()=>document.body.innerText);
  console.log(u, p.url(), t.includes('רביעית')?'HAS user4':'-');
  if(t.includes('רביעית')){ console.log((await p.locator('button:visible').evaluateAll(bs=>bs.map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim()).filter(Boolean))).join(' | ')); await p.screenshot({path:'screenshots/r12-match-user2-profile-user4.png'}); break; }
}
await c.storageState({path:AUTH}); await b.close();
