import { webkit, devices } from '@playwright/test';
const b = await webkit.launch(); const ctx = await b.newContext({ ...devices['iPhone 13'], locale: 'he-IL' }); const p = await ctx.newPage();
const tgt = { '/welcome':['כניסה','יצירת חשבון'], '/sign-in':['שכחתי סיסמה?','הרשמה','הצגת הסיסמה','כניסה'], '/sign-up':['כניסה','הצגת הסיסמה'], '/design':['הכל'] };
for (const [u,names] of Object.entries(tgt)) { await p.goto('https://banci.expo.app'+u); await p.waitForTimeout(5000);
  const r = await p.evaluate((names)=>{ const out=[]; const els=[...document.querySelectorAll('[role=button],a,button,[role=link]')].filter(e=>e.offsetParent);
    for (const n of names) for (const e of els) { const t=(e.innerText||'').trim(), l=e.getAttribute('aria-label')||''; if (t===n||l===n) { const r=e.getBoundingClientRect(); out.push(`${n}: ${Math.round(r.width)}×${Math.round(r.height)}`); } }
    const small=els.map(e=>{const r=e.getBoundingClientRect();return {t:((e.innerText||'').trim()||e.getAttribute('aria-label')||'?').slice(0,25),w:Math.round(r.width),h:Math.round(r.height)}}).filter(x=>x.w<44||x.h<44);
    return {out,small}; }, names);
  console.log('== '+u, JSON.stringify(r)); }
// typography on /design + real screens
await p.goto('https://banci.expo.app/welcome'); await p.waitForTimeout(4000);
console.log('welcome h1', await p.evaluate(()=>[...document.querySelectorAll('div,span')].filter(e=>e.children.length===0&&e.innerText&&e.offsetParent).map(e=>{const s=getComputedStyle(e);return s.fontSize+'/'+s.lineHeight+' '+s.fontWeight+' '+e.innerText.slice(0,25)}).slice(0,12)));
await b.close();
