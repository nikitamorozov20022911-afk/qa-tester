import {app,SS,outline} from './h.mjs';
const A=await app(); const p=A.p;
const reqs=[]; p.on('response',async r=>{if(/comments/.test(r.url())) {let b='';try{b=(await r.text()).slice(0,600)}catch{}; reqs.push(r.status()+' '+r.url().slice(0,200)+' '+b)}});
await p.goto('https://magnet.expo.app/social',{waitUntil:'domcontentloaded'});
await p.getByText('QA-AUTO פוסט לדיווח').first().waitFor({timeout:25000}).catch(()=>console.log('post not found'));
console.log(p.url()); console.log((await p.locator('body').innerText()).slice(0,1500));
await p.screenshot({path:SS+'a1.png'});
const post=p.getByText('QA-AUTO פוסט לדיווח').first();
if(await post.count()){ await post.click(); await p.getByText(/תגובות|תגובה/).first().waitFor({timeout:10000}).catch(()=>{});
 console.log('AFTER CLICK',p.url(),(await p.locator('body').innerText()).slice(0,1500)); await p.screenshot({path:SS+'a1b.png'}); }
console.log(reqs.join('\n'));
await A.close();
