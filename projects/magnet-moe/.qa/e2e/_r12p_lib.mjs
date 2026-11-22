import { chromium } from 'playwright';
export async function open(acc, authFile) {
  const AUTH = '../auth/' + authFile;
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
  const p = await c.newPage();
  p.on('dialog', async d => { console.log('DIALOG', d.message()); await d.accept(); });
  const close = async () => { await c.storageState({path:AUTH}); await b.close(); };
  return { b, c, p, close, AUTH };
}
export async function gotoEdit(p) {
  await p.goto('https://magnet.expo.app/profile', {waitUntil:'networkidle'}); await p.waitForTimeout(4000);
  const cont = p.getByText('להמשיך לגלות'); if (await cont.count()) { console.log('dismiss match modal'); await cont.first().click({timeout:5000}).catch(()=>{}); await p.waitForTimeout(2500); if(!/profile/.test(p.url())) { await p.goto('https://magnet.expo.app/profile', {waitUntil:'networkidle'}); await p.waitForTimeout(4000);} }
  try { await p.getByRole('button',{name:'עריכת פרופיל'}).last().click({timeout:8000}); } catch(e) { console.log('edit btn fallback'); await p.locator('[data-testid=edit-profile-button]').first().dispatchEvent('click'); } await p.waitForTimeout(4000); if(!/edit-profile/.test(p.url())) { await p.goto('https://magnet.expo.app/edit-profile',{waitUntil:'networkidle'}); await p.waitForTimeout(4000);} 
}
export async function tiles(p) {
  return await p.evaluate(() => {
    const out = [];
    const rm = [...document.querySelectorAll('[aria-label="הסרת תמונה"]')];
    for (const r of rm) {
      let el = r.parentElement, img = null;
      for (let i=0;i<5 && el;i++){ img = el.querySelector('img'); if (img) break; el = el.parentElement; }
      out.push(img ? img.getAttribute('src') : null);
    }
    const adds = [...document.querySelectorAll('[aria-label^="הוספת תמונה"]')].map(e=>e.getAttribute('aria-label'));
    return { photos: out, adds };
  });
}
export async function tileBtn(p, src, label) {
  const ok = await p.evaluate(({src,label}) => {
    document.querySelectorAll('[data-r12]').forEach(e=>e.removeAttribute('data-r12'));
    const img = [...document.querySelectorAll('img')].find(i => i.getAttribute('src') === src && i.closest('[aria-label="ראשית"]') === null);
    const imgs = [...document.querySelectorAll('img')].filter(i => i.getAttribute('src') === src);
    for (const im of imgs) {
      let el = im.parentElement;
      for (let i=0;i<6 && el;i++){ const btn = el.querySelector(`[aria-label="${label}"]`); const cnt = el.querySelectorAll('[aria-label="הסרת תמונה"]').length; if (btn && cnt===1) { btn.setAttribute('data-r12','1'); return true; } el = el.parentElement; }
    }
    return false;
  }, {src,label});
  return ok ? p.locator('[data-r12="1"]') : null;
}
export async function upload(p, file) {
  const before = (await tiles(p)).photos;
  const t = await tiles(p);
  if (!t.adds.length) throw new Error('no free slot');
  const fc = p.waitForEvent('filechooser', {timeout:15000});
  await p.locator(`[aria-label="${t.adds[0]}"]`).click();
  const ch = await fc; await ch.setFiles(file);
  for (let i=0;i<30;i++){ await p.waitForTimeout(1000); const now=(await tiles(p)).photos; const n = now.filter(s=>s && !before.includes(s)); if (n.length && !/^blob|^data/.test(n[0])) { await p.waitForTimeout(1500); return n[0]; } }
  throw new Error('upload did not appear');
}
export async function bodyText(p, n=300){ return (await p.evaluate(()=>document.body.innerText)).slice(0,n).replace(/\n/g,' | '); }
