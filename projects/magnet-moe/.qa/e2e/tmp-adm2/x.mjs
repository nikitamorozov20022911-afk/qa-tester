import {admin} from './h.mjs';
const A=await admin(); const p=A.p;
await p.goto('https://magnet-admin.vercel.app/reports',{waitUntil:'domcontentloaded'});
await p.getByText('QA-AUTO סטורי לדיווח').waitFor({timeout:20000});
console.log(await p.getByText('כל הסוגים').first().evaluate(e=>e.parentElement.parentElement.outerHTML.slice(0,2500)));
console.log(await p.getByText('הוסלם').first().evaluate(e=>e.closest('a,button')?.outerHTML.slice(0,400)));
await A.close();
