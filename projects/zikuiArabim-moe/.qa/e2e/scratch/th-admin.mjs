import { chromium } from 'playwright';
const b = await chromium.launch();
const c = await b.newContext({ storageState: '../auth/admin.json', viewport:{width:390,height:844} });
const p = await c.newPage();
const errs=[]; p.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,150)); });
const box = (txt) => p.evaluate(s=>{ const el=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0 && e.textContent.trim().startsWith(s)); if(!el) return false; el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); const d=document.createElement('div'); Object.assign(d.style,{position:'fixed',left:(r.left-6)+'px',top:(r.top-6)+'px',width:(r.width+12)+'px',height:(r.height+12)+'px',border:'3px solid red',zIndex:99999,pointerEvents:'none'}); document.body.appendChild(d); return true; }, txt);
try {
  for (const key of ['tehilim_72','tehilim_39']) {
    await p.goto(`https://zichui-harabim.expo.app/admin/prayer?key=${key}`, { waitUntil:'networkidle' }); await p.waitForTimeout(4000);
    const t = await p.locator('body').innerText();
    console.log(`=== ${key} URL ${p.url()}\n`, t.slice(0,900));
    console.log('HAS MP3 card:', /MP3|הקלטת/.test(t), '| HAS explain:', t.includes('הסבר וטיפ'));
    const ok = await box('הקלטת') || await box('קטעי');
    await p.screenshot({ path: `../screenshots/th-admin-${key}-mobile.png`, fullPage: true });
  }
  // editor for 72
  const link = p.locator('text=קטע').first();
  await p.goto('https://zichui-harabim.expo.app/admin/prayer?key=tehilim_72', { waitUntil:'networkidle' }); await p.waitForTimeout(3000);
  const hrefs = await p.$$eval('a', as=>as.map(a=>a.getAttribute('href')).filter(Boolean));
  console.log('LINKS', hrefs.filter(h=>h.includes('edit')).slice(0,5));
  const ed = hrefs.find(h=>h.includes('edit'));
  if (ed) { await p.goto('https://zichui-harabim.expo.app'+ed, { waitUntil:'networkidle' }); await p.waitForTimeout(3000);
    const t2 = await p.locator('body').innerText(); console.log('=== EDITOR\n', t2.slice(0,900));
    const btns = await p.$$eval('button,[role=button]', bs=>bs.map(b=>b.innerText.trim()).filter(Boolean)); console.log('BUTTONS', JSON.stringify(btns));
    await p.screenshot({ path: '../screenshots/th-admin-tehilim_72-editor-mobile.png' }); }
  console.log('CONSOLE ERRORS', errs);
} finally { await c.storageState({ path: '../auth/admin.json' }); await b.close(); }
