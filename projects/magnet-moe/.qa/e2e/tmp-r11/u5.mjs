import {admin,SS} from './h.mjs';
import fs from 'fs';
const A=await admin(); const p=A.p;
const lines=fs.readFileSync(SS+'allusers.txt','utf8').split('\n').filter(l=>/\/users\//.test(l)&&!/נמחק/.test(l));
const keys=['מגדר','רוצה להכיר','תאריך לידה','מטרה','דת / שיוך דתי','אונבורדינג','אימות','שיתוף מיקום','מנוי','מצב שקט'];
const res=[];
for(const l of lines){ const href=l.split(' | ')[1];
 await p.goto('https://magnet-admin.vercel.app'+href,{waitUntil:'networkidle'});
 const t=(await p.locator('body').innerText()).split('\n').map(s=>s.trim()).filter(Boolean);
 const o={row:l.split(' | ')[0].slice(0,60),href};
 const i0=t.findIndex(s=>/^U-/.test(s)); o.city=t[i0+1];
 for(const k of keys){const i=t.indexOf(k); o[k]=i>=0?t[i+1]:'?';}
 const ri=t.indexOf('רצף'); o.lastLogin=(t[t.indexOf('כניסה אחרונה')+1]||'');
 res.push(o);
}
fs.writeFileSync(SS+'details.json',JSON.stringify(res,null,1));
for(const o of res) console.log([o.row,o.city,o['מגדר'],o['רוצה להכיר'],o['תאריך לידה'],o['דת / שיוך דתי'],o['אונבורדינג'],o['אימות'],o['שיתוף מיקום'],o['מנוי'],o['מצב שקט'],o.lastLogin].join(' ‖ '));
await A.close();
