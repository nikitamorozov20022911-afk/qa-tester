import { chromium } from 'playwright';
const [who,uid,tag]=process.argv.slice(2); const AUTH='auth/'+who+'.json';
const SP='/Users/avielshnaider/magnet-moe/.qa/screenshots/r12-4205a8-web-';
const b = await chromium.launch();
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await c.newPage();
const reqs=[]; p.on('response',r=>{ if(/rpc\/swipe|swipe|match/.test(r.url())&&r.request().method()==='POST') reqs.push(r.url().split('/rest/v1/')[1]+' '+r.status()+' '+(r.request().postData()||'').replace(/[0-9a-f-]{36}/g,m=>m.slice(0,8))); });
await p.goto('https://magnet.expo.app/profile/'+uid,{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
console.log(who,p.url());
const btn=p.getByRole('button',{name:'אהבתי'});
if(!(await btn.count())){console.log('NO LIKE BTN:',(await p.evaluate(()=>document.body.innerText)).replace(/\n+/g,' | ').slice(0,400)); await p.screenshot({path:SP+tag+'-nobtn.png'}); await c.storageState({path:AUTH}); await b.close(); process.exit();}
const t0=Date.now(); await btn.first().click();
let anim=null; try{ await p.getByText('יש התאמה עם').first().waitFor({timeout:10000}); anim=Date.now()-t0; }catch(e){}
console.log('anim_ms',anim);
await p.waitForTimeout(800);
console.log((await p.evaluate(()=>document.body.innerText)).replace(/\n+/g,' | ').slice(0,300));
console.log('REQ',reqs.join(' ;; '));
await p.screenshot({path:SP+tag+'.png'});
await c.storageState({path:AUTH}); await b.close();
