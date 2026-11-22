import {admin,SS} from './h.mjs';
const A=await admin(); const p=A.p;
await p.goto('https://magnet-admin.vercel.app/users/937979f0-5564-48f1-b890-d6e84b5f6450',{waitUntil:'domcontentloaded'});
await p.getByText('QA חילונית').first().waitFor({timeout:20000});
await p.locator('main').getByText(/היסטוריית|פעולות/).first().waitFor({timeout:10000}).catch(()=>{});
console.log((await p.locator('main').innerText()).slice(0,4000));
console.log(await p.locator('main button').evaluateAll(a=>a.map(b=>b.innerText.trim()+'|'+(b.getAttribute('aria-label')||''))));
await p.screenshot({path:SS+'2c7c58-user3-before-desktop.png',fullPage:true});
await A.close();
