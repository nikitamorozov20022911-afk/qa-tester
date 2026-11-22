import { chromium } from 'playwright';
const [acc, url] = process.argv.slice(2);
const AUTH='../auth/'+acc+'-r12.json';
const b = await chromium.launch();
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await c.newPage();
await p.goto('https://magnet.expo.app/profile', {waitUntil:'networkidle'}); await p.waitForTimeout(4000); if(url){ await p.getByRole('button',{name:url}).last().click(); await p.waitForTimeout(3500);} 
console.log(p.url()); console.log((await p.evaluate(()=>document.body.innerText)).slice(0,1500));
const els = await p.evaluate(()=>[...document.querySelectorAll('[role=button],a,[aria-label],img,input')].map(e=>`${e.tagName} role=${e.getAttribute('role')} al=${e.getAttribute('aria-label')} href=${e.getAttribute('href')} src=${(e.getAttribute('src')||'').slice(0,90)} txt=${(e.innerText||'').slice(0,30).replace(/\n/g,' ')}`));
console.log(els.join('\n'));
await p.screenshot({path:'../r12p/explore-'+acc+'.png'});
await c.storageState({path:AUTH}); await b.close();
