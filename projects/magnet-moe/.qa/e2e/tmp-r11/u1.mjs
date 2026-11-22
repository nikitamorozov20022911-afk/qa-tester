import {admin,SS} from './h.mjs';
const A=await admin(); const p=A.p;
await p.goto('https://magnet-admin.vercel.app/',{waitUntil:'networkidle'});
console.log(p.url()); console.log((await p.locator('body').innerText()).slice(0,1500));
const links=await p.locator('a').evaluateAll(as=>as.map(a=>a.textContent.trim()+' -> '+a.getAttribute('href')));
console.log(links.join('\n'));
await A.close();
