import { open, gotoEdit, tiles, tileBtn, upload, bodyText } from './_r12p_lib.mjs';
const [acc, authFile, known2, known1] = process.argv.slice(2);
const { p, close } = await open(acc, authFile);
const saveState = async () => p.evaluate(()=>{ const b=[...document.querySelectorAll('[role=button]')].find(e=>e.innerText.trim()==='שמירה'); return b ? (b.getAttribute('aria-disabled')||'')+'/'+getComputedStyle(b).opacity : 'none'; });
try {
await gotoEdit(p);
const t0 = await tiles(p);
const verified0 = /מאומת\/ת/.test(await bodyText(p, 3000));
console.log(acc, 'START photos', t0.photos.length, 'verified', verified0, 'save', await saveState());
let new2 = known2 && known2!=='-' ? known2 : null, new1 = known1 && known1!=='-' ? known1 : null;
let old = t0.photos.filter(s => s!==new2 && s!==new1);
// free slots if needed
const need = (new2?0:1) + (new1?0:1);
while ((await tiles(p)).adds.length < need) {
  const cur = (await tiles(p)).photos; const victim = cur.slice(1).find(s=>old.includes(s));
  console.log('freeing slot by removing', victim.slice(-20));
  await (await tileBtn(p, victim, 'הסרת תמונה')).click(); await p.waitForTimeout(3000);
  old = old.filter(s=>s!==victim);
}
if (!new2) { new2 = await upload(p, '../test-faces/r12-ai/'+acc+'-2.png'); console.log('new2', new2); }
if (!new1) { new1 = await upload(p, '../test-faces/r12-ai/'+acc+'-1.png'); console.log('new1', new1); }
let t = await tiles(p);
if (t.photos[0] !== new2) { await (await tileBtn(p, new2, 'הפיכה לראשית')).click(); await p.waitForTimeout(3000); console.log('made primary; text:', await bodyText(p,120)); }
for (const s of old) {
  const loc = await tileBtn(p, s, 'הסרת תמונה');
  if (!loc) { console.log('no remove btn for', s.slice(-20)); continue; }
  await loc.click(); await p.waitForTimeout(3000);
  const bt = await p.locator('[role=button]').allInnerTexts();
  console.log('removed', s.slice(-20), 'now', (await tiles(p)).photos.length);
}
t = await tiles(p);
// ensure order new2, new1
if (t.photos[0] !== new2) { await (await tileBtn(p, new2, 'הפיכה לראשית')).click(); await p.waitForTimeout(3000); t = await tiles(p); }
console.log('END-EDIT', JSON.stringify(t.photos.map(s=>s===new2?'NEW2':s===new1?'NEW1':'OLD:'+s.slice(-20))), 'save', await saveState());
const ss = await saveState();
if (ss !== 'none' && !/true/.test(ss) && !/^\/0\.[0-5]/.test(ss)) { console.log('clicking save'); await p.getByRole('button',{name:'שמירה'}).click(); await p.waitForTimeout(4000); console.log('after save', p.url(), await bodyText(p,150)); }
// verify after reload
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(3000);
await gotoEdit(p);
const t2 = await tiles(p);
const verified2 = /מאומת\/ת/.test(await bodyText(p, 3000));
console.log('RELOAD', JSON.stringify(t2.photos.map(s=>s===new2?'NEW2':s===new1?'NEW1':'OLD:'+(s||'').slice(-20))), 'verified', verified0, '->', verified2);
await p.screenshot({path:'../screenshots/r12-photos-'+acc+'-edit.png'});
await p.goto('https://magnet.expo.app/profile', {waitUntil:'networkidle'}); await p.waitForTimeout(4000);
await p.screenshot({path:'../screenshots/r12-photos-'+acc+'.png'});
const ok = t2.photos.length===2 && t2.photos[0]===new2 && t2.photos[1]===new1;
console.log('RESULT', acc, ok ? 'OK' : 'FAIL', 'verified', verified0, '->', verified2);
} catch(e) { console.log('ERR', acc, e.message.slice(0,300)); await p.screenshot({path:'../r12p/err-'+acc+'.png'}); }
await close();
