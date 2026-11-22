import {admin,SS} from './h.mjs';
import fs from 'fs';
const A=await admin(); const p=A.p; let out=[];
for (const u of ['/users?size=50','/users?size=50&page=2']){
await p.goto('https://magnet-admin.vercel.app'+u,{waitUntil:'networkidle'});
const rows=await p.locator('tr').evaluateAll(trs=>trs.map(tr=>{const a=tr.querySelector('a[href^="/users/"]');return tr.innerText.replace(/\s+/g,' ').trim()+' | '+(a?a.getAttribute('href'):'')}));
out.push(...rows);}
fs.writeFileSync(SS+'allusers.txt',out.join('\n'));
await A.close();
