import {app,SS,outline} from './h.mjs';
const tag=process.argv[2];
const A=await app(); const p=A.p; const w=[];
p.on('response',async r=>{const q=r.request(); if(q.method()!=='GET'&&/supabase/.test(r.url())){let b='';try{b=(await r.text()).slice(0,200)}catch{}; w.push(q.method()+' '+r.status()+' '+r.url().slice(40,140)+' '+b)}});
await p.goto('https://magnet.expo.app/social',{waitUntil:'domcontentloaded'});
const post=p.locator('div').filter({hasText:/^עומר/}).first();
await p.getByText('שאלה רצינית').first().waitFor({timeout:20000});
// like counter: find the element with text '3' near the post
const likeBtn=p.getByText('שאלה רצינית').first().locator('xpath=ancestor::div[.//*[text()="3"]][1]').getByText('3',{exact:true}).first();
const box=await likeBtn.boundingBox(); console.log('like box',box);
await likeBtn.click();
await p.waitForResponse(r=>r.request().method()!=='GET'&&/supabase/.test(r.url()),{timeout:8000}).catch(()=>console.log('no write request'));
await outline(p,likeBtn,`app-${tag}-like-attempt-mobile.png`);
console.log('after text',(await p.getByText('שאלה רצינית').first().locator('xpath=ancestor::div[4]').innerText()).replace(/\n+/g,' | ').slice(0,200));
console.log(w.join('\n'));
// revert if liked
if(w.some(x=>/^POST 20/.test(x))){ await likeBtn.click(); await p.waitForResponse(r=>r.request().method()!=='GET'&&/supabase/.test(r.url()),{timeout:8000}).catch(()=>{}); console.log('REVERT',w.slice(-1)); }
await A.close();
