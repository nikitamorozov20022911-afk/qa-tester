import {admin,SS} from './h.mjs';
import fs from 'fs';
const A=await admin(); const p=A.p;
await p.goto('https://magnet-admin.vercel.app/users',{waitUntil:'networkidle'});
let t=await p.locator('body').innerText(); fs.writeFileSync(SS+'users1.txt',t);
const links=await p.locator('a').evaluateAll(as=>as.map(a=>a.textContent.trim().replace(/\s+/g,' ')+' -> '+a.getAttribute('href')));
fs.writeFileSync(SS+'users1-links.txt',links.join('\n'));
await p.screenshot({path:SS+'users1.png',fullPage:true});
await A.close();
