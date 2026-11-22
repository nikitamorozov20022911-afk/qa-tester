import { chromium } from 'playwright';
const b = await chromium.launch();
const A = await b.newContext({ storageState: '../auth/admin.json', viewport:{width:390,height:844} });
const U = await b.newContext({ storageState: '../auth/user1.json', viewport:{width:390,height:844} });
const a = await A.newPage(), u = await U.newPage();
const errs=[]; u.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,160)); }); u.on('pageerror', e=>errs.push('PAGEERROR '+e.message.slice(0,160)));
const mark = (p, s) => p.evaluate(s=>{ const el=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0 && e.textContent.trim().startsWith(s)); if(!el) return false; el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); const d=document.createElement('div'); Object.assign(d.style,{position:'fixed',left:(r.left-6)+'px',top:(r.top-6)+'px',width:(r.width+12)+'px',height:(r.height+12)+'px',border:'3px solid red',zIndex:99999,pointerEvents:'none'}); document.body.appendChild(d); return true; }, s);
try {
  await a.goto('https://zichui-harabim.expo.app/admin/prayer?key=tehilim_72', { waitUntil:'networkidle' }); await a.waitForTimeout(3500);
  await a.getByText('מקור ההקלטה', { exact: true }).locator('xpath=following::input[1]').fill('בדיקת QA');
  const [fc] = await Promise.all([ a.waitForEvent('filechooser'), a.getByText('העלאת קובץ MP3', { exact: true }).first().click() ]); await fc.setFiles('../research/a5decf4a/fixtures/qa-test-recording.mp3');
  await a.waitForTimeout(6000);
  console.log('ADMIN:', ((await a.locator('body').innerText()).match(/הקלטה פעילה[^\n]*/)||['NO ACTIVE'])[0]);
  // user: block mp3
  await U.route(/\.mp3(\?|$)/, r => r.abort('failed'));
  await u.goto('https://zichui-harabim.expo.app/tehilim/72', { waitUntil:'networkidle' }); await u.waitForTimeout(4000);
  const before = (await u.locator('body').innerText()).length;
  await u.getByText('השמע', { exact: true }).first().click(); await u.waitForTimeout(4000);
  const t = await u.locator('body').innerText();
  console.log('URL', u.url(), '| text len before/after', before, t.length);
  console.log('ROW:', (t.match(/האזן להקראה[\s\S]{0,200}/)||[''])[0].replace(/\n/g,' / '));
  console.log('Has verse text:', t.includes('לִשְׁלֹמֹה'), '| has last verse 72:', /תַּמּוּ תְפִלּוֹת/.test(t));
  await mark(u, 'האזן להקראה'); await u.screenshot({ path:'../screenshots/th-s25-ac3-audio-fail-row-mobile.png' });
  await u.mouse.wheel(0, 2500); await u.waitForTimeout(800);
  const scrolled = await u.evaluate(()=>window.scrollY); console.log('scrollY after scroll', scrolled);
  await u.screenshot({ path:'../screenshots/th-s25-ac3-audio-fail-reading-continues-mobile.png' });
  console.log('USER ERRORS', JSON.stringify(errs));
} finally {
  try { await a.reload({ waitUntil:'networkidle' }); await a.waitForTimeout(3000);
    await a.getByText('הסרת ההקלטה', { exact: true }).first().click(); await a.waitForTimeout(1000);
    await a.getByText('הסרת ההקלטה', { exact: true }).last().click(); await a.waitForTimeout(3000);
    console.log('ADMIN after remove:', ((await a.locator('body').innerText()).match(/לתפילה הזאת אין עדיין הקלטה[^\n]*/)||['STILL ACTIVE!'])[0]);
  } catch(e) { console.log('REMOVE FAILED', e.message.slice(0,200)); }
  await A.storageState({ path:'../auth/admin.json' }); await U.storageState({ path:'../auth/user1.json' }); await b.close();
}
