import {admin,SS} from './h.mjs';
const A=await admin(); const p=A.p;
await p.goto('https://magnet-admin.vercel.app/reports',{waitUntil:'domcontentloaded'});
await p.getByText('QA').first().waitFor({timeout:20000}).catch(e=>console.log('noQA'));
console.log((await p.locator('main').innerText()).slice(0,8000));
await p.screenshot({path:SS+'r1.png',fullPage:true});
console.log(JSON.stringify(A.net.slice(0,20)));
await A.close();
