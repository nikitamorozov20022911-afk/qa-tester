import { chromium } from 'playwright';
const b = await chromium.launch();
const A = await b.newContext({ storageState: '../auth/admin.json', viewport:{width:390,height:844} });
const U = await b.newContext({ storageState: '../auth/user1.json', viewport:{width:390,height:844} });
const a = await A.newPage(), u = await U.newPage();
const errs=[]; u.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,150)); });
const ADM='https://zichui-harabim.expo.app/admin/prayer?key=tehilim_72';
try {
  await a.goto(ADM, { waitUntil:'networkidle' }); await a.waitForTimeout(3500);
  const src = a.getByText('מקור ההקלטה', { exact: true }).locator('xpath=following::input[1]');
  await src.fill('בדיקת QA');
  const [fc] = await Promise.all([ a.waitForEvent('filechooser'), a.getByText('העלאת קובץ MP3', { exact: true }).first().click() ]); await fc.setFiles('../research/a5decf4a/fixtures/qa-test-recording.mp3');
  await a.waitForTimeout(6000);
  let t = await a.locator('body').innerText(); console.log('ADMIN after upload:', (t.match(/הקלטה פעילה[^\n]*/)||[''])[0], '|', (t.match(/הועלה[^\n]*/)||[''])[0]);
  await a.screenshot({ path:'../screenshots/th-mp3-admin-uploaded-mobile.png' });
  await u.goto('https://zichui-harabim.expo.app/tehilim/72', { waitUntil:'networkidle' }); await u.waitForTimeout(4000);
  let ut = await u.locator('body').innerText(); console.log('USER row:', (ut.match(/האזן להקראה[\s\S]{0,120}/)||[''])[0].replace(/\n/g,' / '));
  await u.evaluate(()=>{ window.__aud=[]; const P=HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play=function(){ window.__aud.push(this); return P.apply(this,arguments); }; });
const mp3=[]; u.on('response', r=>{ if(/\.mp3/.test(r.url())) mp3.push(r.status()+' '+r.url().slice(-50)); });
const play = u.getByText('השמע', { exact: true }).first(); await play.click(); await u.waitForTimeout(2000);
console.log('MP3 responses:', JSON.stringify(mp3));
console.log('BTN now has השהה:', (await u.locator('body').innerText()).includes('השהה'));
  const st = await u.evaluate(()=>{ const x=[...document.querySelectorAll('audio'), ...(window.__aud||[])]; return x.map(e=>({src:e.currentSrc.slice(-60), t:e.currentTime, paused:e.paused, d:e.duration})); });
  console.log('AUDIO after play:', JSON.stringify(st));
  await u.screenshot({ path:'../screenshots/th-mp3-user-playing-ch72-mobile.png' });
  // remove
  await a.reload({ waitUntil:'networkidle' }); await a.waitForTimeout(3000);
  await a.getByText('הסרת ההקלטה', { exact: true }).first().click(); await a.waitForTimeout(1000);
  await a.getByText('הסרת ההקלטה', { exact: true }).last().click(); await a.waitForTimeout(3000);
  t = await a.locator('body').innerText(); console.log('ADMIN after remove:', (t.match(/לתפילה הזאת אין עדיין הקלטה[^\n]*/)||['STILL ACTIVE?'])[0]);
  await u.reload({ waitUntil:'networkidle' }); await u.waitForTimeout(3000);
  ut = await u.locator('body').innerText(); console.log('USER after remove:', ut.includes('אין הקראה לפרק הזה'));
  console.log('USER CONSOLE ERRORS', errs);
} finally { await A.storageState({ path:'../auth/admin.json' }); await U.storageState({ path:'../auth/user1.json' }); await b.close(); }
