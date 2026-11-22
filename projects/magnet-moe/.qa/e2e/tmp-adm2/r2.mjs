import {admin,SS,outline} from './h.mjs';
const A=await admin(); const p=A.p;
await p.goto('https://magnet-admin.vercel.app/reports',{waitUntil:'domcontentloaded'});
await p.getByText('QA-AUTO סטורי לדיווח').waitFor({timeout:20000});
const card=p.locator('article,li,[class*=card]').filter({hasText:'QA-AUTO סטורי לדיווח'}).last();
console.log((await card.evaluate(e=>e.outerHTML)).slice(0,5000));
console.log('textareas',await p.locator('textarea,input[type=text]').count());
console.log('imgs',await p.locator('main img').evaluateAll(a=>a.map(i=>i.src.slice(0,120)+' '+i.getBoundingClientRect().width)));
await A.close();
