import { open, gotoEdit, tiles, bodyText } from './_r12p_lib.mjs';
const [acc, authFile] = process.argv.slice(2);
const { p, close } = await open(acc, authFile);
try {
await p.goto('https://magnet.expo.app/profile', {waitUntil:'networkidle'}); await p.waitForTimeout(4000);
console.log(p.url(), await bodyText(p, 400));
await p.screenshot({path:'../r12p/peek-'+acc+'.png'});
const hit = await p.evaluate(()=>{ const e=document.querySelector('[data-testid=edit-profile-button]'); if(!e) return 'none'; const r=e.getBoundingClientRect(); const t=document.elementFromPoint(r.x+r.width/2, r.y+r.height/2); return JSON.stringify(r)+' top='+(t&&(t.outerHTML.slice(0,200))); });
console.log(hit);
} catch(e){ console.log('ERR', e.message.slice(0,200)); }
await close();
