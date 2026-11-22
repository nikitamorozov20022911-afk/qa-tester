import {admin,SS} from './h.mjs';
import fs from 'fs';
const A=await admin(); const p=A.p;
await p.goto('https://magnet-admin.vercel.app/users/ea5d7f41-6a81-41d5-b107-ce0314ed5bd6',{waitUntil:'networkidle'});
fs.writeFileSync(SS+'sivan.txt',await p.locator('main').innerText().catch(async()=>await p.locator('body').innerText()));
const tabs=await p.locator('[role=tab], button').evaluateAll(b=>b.map(x=>x.textContent.trim()).filter(Boolean));
console.log('BUTTONS:',tabs.join(' | '));
await p.screenshot({path:SS+'sivan.png',fullPage:true});
await A.close();
