import { chromium } from 'playwright';
const who=process.argv[2];
const AUTH='auth/'+who+'.json';
const b = await chromium.launch();
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await c.newPage();
const reqs=new Set(); p.on('response',r=>{const u=r.url(); if(u.includes('/rest/v1/')) reqs.add(r.request().method()+' '+u.split('/rest/v1/')[1].slice(0,90)+' '+r.status());});
await p.goto('https://magnet.expo.app/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
console.log(who,p.url());
for (const t of ['הודעות','לייקים']) {
  try{ await p.getByText(t,{exact:true}).last().click(); await p.waitForTimeout(2500); console.log('--',t,p.url()); console.log((await p.evaluate(()=>document.body.innerText)).replace(/\n+/g,' | ').slice(0,500)); }catch(e){console.log('err',t,e.message.slice(0,80));}
}
console.log([...reqs].join('\n'));
await p.screenshot({path:'/private/tmp/claude-502/-Users-avielshnaider--claude-spares-spare-Xwbc7V/d9295d8e-b5d2-4a72-8429-be4dbeea285d/scratchpad/'+who+'.png'});
await c.storageState({path:AUTH}); await b.close();
