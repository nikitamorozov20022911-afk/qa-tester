// #8310aa AC6/AC7 on throwaway guests: node qa-8310aa-guest.mjs <bmi|preg> [storageState|-] [runTag]
import { chromium } from 'playwright'; import fs from 'node:fs';
const OUT='C:/Users/nekit/Documents/projects/NutiWingman-moe/.qa/research/shots/8310aa';
const KEY=fs.readFileSync('C:/Users/nekit/Documents/projects/NutiWingman-moe/.qa/auth/.sbkey','utf8').trim();
const mode=process.argv[2]; const TAG=process.argv[4]||""; const P=`${mode}${TAG?"-"+TAG:""}`; const res={mode,tag:TAG}; const T0=Date.now();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ST=process.argv[3]==="-"?"":process.argv[3]; const ctx = await browser.newContext({ ...(ST&&fs.existsSync(ST)?{storageState:ST}:{}), viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage(); const net=[];
page.on('response', async r => { if (/rest\/v1\/(profiles|safe_zone)/.test(r.url()) && r.request().method()!=='OPTIONS') net.push(`+${Date.now()-T0}ms ${r.request().method()} ${r.url().split('/rest/v1/')[1].slice(0,80)} -> ${r.status()} ${(r.request().postData()||'').slice(0,700)}`); });
const text = () => page.evaluate(() => document.body.innerText);
const rest = (path, method='GET', body) => page.evaluate(async ({KEY,path,method,body}) => { const k=Object.keys(localStorage).find(k=>/auth-token$/.test(k)); const s=JSON.parse(localStorage.getItem(k));
  const r=await fetch('https://siodtucasjpxpsfuvlfc.supabase.co/rest/v1/'+path,{method,headers:{apikey:KEY,Authorization:'Bearer '+s.access_token,'Content-Type':'application/json',Prefer:'return=representation'},body:body?JSON.stringify(body):undefined}); return {uid:s.user.id, anon:s.user.is_anonymous, status:r.status, body:(await r.text()).slice(0,900)}; }, {KEY,path,method,body});
try {
  await page.goto('https://nutriwingman.expo.app/', { waitUntil: 'networkidle' });
  const ta = page.getByPlaceholder('לשאול או לספר מה אכלת'); await ta.waitFor();
  const api = (fn, arg) => page.evaluate(async ({fn,arg}) => { try { const [a,b]=fn.split('.'); const v=await __r(807).api[a][b](arg); return JSON.parse(JSON.stringify(v??null)); } catch(e){ return {err:String(e&&e.message||e), code:e&&e.code, fields:e&&e.fields}; } }, {fn,arg});
  if (mode==='bmi') res.setBody = await api('profile.setBody', { sex:'female', heightCm:170, ageYears:30, weightKg:50 }); // BMI 17.3
  else { res.setBody = await api('profile.setBody', { sex:'female', heightCm:165, ageYears:30, weightKg:70 }); // BMI 25.7
         res.layer = await api('profile.updateLayer', { layer: 'medical', op: 'add', condition: 'pregnancy' }); }
  await page.waitForFunction(()=>{const k=Object.keys(localStorage).find(k=>/auth-token$/.test(k)); try{return k&&JSON.parse(localStorage.getItem(k)).access_token}catch{return false}},null,{timeout:20000}).catch(()=>{res.noToken=true});
  res.safeZoneAsGuest = await rest('safe_zone_settings?select=*');
  res.profBefore = await rest('profiles?select=goal,body,layers->medical');
  const r = page.waitForResponse(r => /functions\/v1\/chat/.test(r.url()), { timeout: 60000 }).catch(() => null);
  await ta.fill('היי'); await ta.press('Enter'); await r;
  const line = page.getByRole('button', { name: /קו היום/ }); await line.waitFor({ timeout: 20000 });
  await line.click(); await page.getByText('לקבוע יעד').first().click();
  await page.getByRole('button', { name: 'לרדת במשקל' }).waitFor({ timeout: 30000 });
  res.questionText = (await text()).split('היי').pop().slice(0, 300);
  await page.screenshot({ path: `${OUT}/${P}-1-goal-question.png` });
  const t0 = Date.now();
  await page.getByRole('button', { name: 'לרדת במשקל' }).click();
  await page.waitForFunction(() => !document.body.innerText.includes('ומה המטרה שלך?') || /לא נכון|מחוץ לגבולות|איש מקצוע|שמירה על המשקל/.test(document.body.innerText), null, { timeout: 30000 }).catch(() => { res.waitTimeout = true; });
  await page.waitForLoadState('networkidle');
  res.ms = Date.now() - t0;
  res.after = (await text()).slice(0, 1500);
  await page.screenshot({ path: `${OUT}/${P}-2-after-lose-weight.png` });
  await page.screenshot({ path: `${OUT}/${P}-2-after-lose-weight-full.png`, fullPage: true });
  // settle: all requests + 3 s, then read what the onboarding actually saved (before any guard/setGoal probe)
  await page.waitForLoadState('networkidle'); await page.waitForTimeout(3000); await page.waitForLoadState('networkidle');
  res.afterSettled = (await text()).slice(0, 1500);
  res.goalAfterOnboarding = await rest('profiles?select=onboarded,goal');
  res.netAtSettle = net.slice();
  res.highlighted = await page.evaluate(() => { const re=/מחוץ לגבולות|Safe Zone|איש מקצוע|שמירה על המשקל|אני כאן|יעד|לרדת/; let best=null;
    for (const el of document.querySelectorAll('div,span,p')) { const t=(el.innerText||'').trim(); if (re.test(t) && t.length<400 && el.offsetHeight>0 && (!best || t.length<best.innerText.trim().length)) best=el; }
    if (!best) return null; const box=best.parentElement||best; box.style.outline='4px solid red'; box.style.outlineOffset='3px'; box.scrollIntoView({block:'center'}); return box.innerText.slice(0,400); });
  await page.screenshot({ path: `${OUT}/${P}-3-settled.png` });
  // real user path: the optional «עוד כמה פרטים?» sheet shown after the goal -> enter body like a user, then settle and re-read
  if (process.env.FILLBODY && await page.getByText('עוד כמה פרטים?').isVisible().catch(()=>false)) {
    const [h,w] = mode==='bmi' ? ['170','50'] : ['165','70'];
    await page.evaluate(()=>document.querySelectorAll('[style*="outline"]').forEach(e=>e.style.outline=''));
    await page.getByRole('button', { name: 'נקבה' }).click().catch(()=>{});
    await page.getByPlaceholder(/165/).fill(h); await page.getByPlaceholder(/70/).fill(w); for (const inp of await page.locator('input:visible').all()) { if (!(await inp.inputValue())) { await inp.fill('30'); break; } }
    await page.screenshot({ path: `${OUT}/${P}-4-body-form.png` });
    await page.getByRole('button', { name: 'המשך' }).click();
    await page.waitForLoadState('networkidle'); await page.waitForTimeout(3000); await page.waitForLoadState('networkidle');
    res.afterBodyForm = (await text()).slice(0, 1500);
    res.goalAfterBodyForm = await rest('profiles?select=onboarded,goal,body,layers->medical');
    res.highlighted2 = await page.evaluate(() => { const re=/מחוץ לגבולות|Safe Zone|איש מקצוע|שמירה על המשקל|יעד יומי|לרדת/; let best=null;
      for (const el of document.querySelectorAll('div,span,p')) { const t=(el.innerText||'').trim(); if (re.test(t) && t.length<400 && el.offsetHeight>0 && (!best || t.length<best.innerText.trim().length)) best=el; }
      if (!best) return null; const box=best.parentElement||best; box.style.outline='4px solid red'; box.style.outlineOffset='3px'; box.scrollIntoView({block:'center'}); return box.innerText.slice(0,400); });
    await page.screenshot({ path: `${OUT}/${P}-5-after-body-form.png` });
  }
  res.profAfter = await rest('profiles?select=goal,body,layers->medical');
  res.getProfileGoal = (await api('profile.getProfile'))?.goal;
  // DB guard: direct PATCH own profile goal -> lose_weight
  const own = JSON.parse(res.profAfter.body)[0] || {};
  res.guard = await rest('profiles?id=eq.' + res.profAfter.uid, 'PATCH', { goal: { ...(own.goal||{}), kind: 'lose_weight' } });
  res.profAfterGuard = await rest('profiles?select=goal');
  // client setGoal path
  res.setGoal = await api('profile.setGoal', { kind: 'lose_weight' });
  await page.waitForLoadState('networkidle'); await page.waitForTimeout(3000);
  res.goalFinal = await rest('profiles?select=onboarded,goal');
  res.net = net;
} catch (e) { res.err = String(e).slice(0, 500); await page.screenshot({ path: `${OUT}/${P}-err.png` }); res.net = net; }
if(ST) await ctx.storageState({path:ST}); fs.writeFileSync(`${OUT}/${P}-result.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1));
await browser.close();
