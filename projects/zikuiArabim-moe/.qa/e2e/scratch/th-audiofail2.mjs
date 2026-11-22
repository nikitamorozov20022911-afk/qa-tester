import { chromium } from 'playwright';
const b = await chromium.launch();
const A = await b.newContext({ storageState: '../auth/admin.json', viewport:{width:390,height:844} });
const U = await b.newContext({ storageState: '../auth/user1.json', viewport:{width:390,height:844} });
const a = await A.newPage(), u = await U.newPage();
const errs=[]; u.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,160)); }); u.on('pageerror', e=>errs.push('PAGEERROR '+e.message.slice(0,160)));
const row = async () => { const t=await u.locator('body').innerText(); return (t.match(/האזן להקראה[\s\S]{0,160}/)||[''])[0].replace(/\n/g,' / '); };
const btn = async () => u.evaluate(()=>{ const el=[...document.querySelectorAll('[role=button],button')].find(e=>e.innerText.trim()==='השמע'||e.innerText.trim()==='השהה'); return el? {txt:el.innerText.trim(), dis: el.getAttribute('aria-disabled'), op: getComputedStyle(el).opacity}:null; });
try {
  await a.goto('https://zichui-harabim.expo.app/admin/prayer?key=tehilim_72', { waitUntil:'networkidle' }); await a.waitForTimeout(3500);
  let at = await a.locator('body').innerText(); console.log('ADMIN start:', (at.match(/(הקלטה פעילה|לתפילה הזאת אין עדיין הקלטה)[^\n]*/)||['?'])[0]);
  if (!at.includes('הקלטה פעילה')) {
    await a.getByText('מקור ההקלטה', { exact: true }).locator('xpath=following::input[1]').fill('בדיקת QA');
    const [fc] = await Promise.all([ a.waitForEvent('filechooser'), a.getByText('העלאת קובץ MP3', { exact: true }).first().click() ]); await fc.setFiles('../research/a5decf4a/fixtures/qa-test-recording.mp3');
    await a.waitForTimeout(6000); at = await a.locator('body').innerText();
  }
  console.log('ADMIN after upload:', (at.match(/הקלטה פעילה[^\n]*/)||['NO ACTIVE'])[0]);
  await u.goto('https://zichui-harabim.expo.app/tehilim/72', { waitUntil:'networkidle' }); await u.waitForTimeout(4000);
  console.log('USER normal row:', await row(), '| btn', JSON.stringify(await btn()));
  // now block mp3 and reload
  await U.route(/\.mp3/, r => r.abort('failed'));
  await u.reload({ waitUntil:'networkidle' }); await u.waitForTimeout(4000);
  console.log('USER blocked (before click) row:', await row(), '| btn', JSON.stringify(await btn()));
  const b1 = await btn();
  if (b1 && b1.dis !== 'true') { await u.getByText('השמע', { exact: true }).first().click({ timeout: 5000 }).catch(e=>console.log('click err', e.message.slice(0,80))); await u.waitForTimeout(4000); }
  console.log('USER blocked (after click) row:', await row(), '| btn', JSON.stringify(await btn()));
  const t = await u.locator('body').innerText();
  console.log('Reading OK: first verse', t.includes('לִשְׁלֹמֹה'), '| page len', t.length);
  await u.evaluate(()=>{ const el=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0 && e.textContent.trim()==='האזן להקראה'); if(el){ el.scrollIntoView({block:'center'}); const r=el.parentElement.parentElement.getBoundingClientRect(); const d=document.createElement('div'); Object.assign(d.style,{position:'fixed',left:(r.left-6)+'px',top:(r.top-6)+'px',width:(r.width+12)+'px',height:(r.height+12)+'px',border:'3px solid red',zIndex:99999,pointerEvents:'none'}); document.body.appendChild(d);} });
  await u.screenshot({ path:'../screenshots/th-s25-ac3-audio-fail-row-mobile.png' });
  await u.mouse.wheel(0, 3000); await u.waitForTimeout(800); console.log('scrollY', await u.evaluate(()=>scrollY));
  await u.screenshot({ path:'../screenshots/th-s25-ac3-audio-fail-reading-continues-mobile.png' });
  console.log('USER ERRORS', JSON.stringify(errs));
} finally {
  try { await a.reload({ waitUntil:'networkidle' }); await a.waitForTimeout(3000);
    if ((await a.locator('body').innerText()).includes('הקלטה פעילה')) {
      await a.getByText('הסרת ההקלטה', { exact: true }).first().click(); await a.waitForTimeout(1000);
      await a.getByText('הסרת ההקלטה', { exact: true }).last().click(); await a.waitForTimeout(3000); }
    console.log('ADMIN end:', ((await a.locator('body').innerText()).match(/(הקלטה פעילה|לתפילה הזאת אין עדיין הקלטה)[^\n]*/)||['?'])[0]);
  } catch(e) { console.log('REMOVE FAILED', e.message.slice(0,200)); }
  await A.storageState({ path:'../auth/admin.json' }); await U.storageState({ path:'../auth/user1.json' }); await b.close();
}
