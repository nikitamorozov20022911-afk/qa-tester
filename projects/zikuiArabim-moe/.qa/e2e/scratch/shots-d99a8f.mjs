import { chromium } from 'playwright';
const b = await chromium.launch();
async function run(state, fn){ const c = await b.newContext({ storageState: state, viewport:{width:390,height:844} }); const p = await c.newPage(); try { await fn(p); } finally { await c.storageState({ path: state }); await c.close(); } }
const mark = (p, sel) => p.evaluate(s=>{ const el=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0 && e.textContent.trim()===s); if(el){ const r=el.getBoundingClientRect(); const d=document.createElement('div'); Object.assign(d.style,{position:'fixed',left:(r.left-6)+'px',top:(r.top-6)+'px',width:(r.width+12)+'px',height:(r.height+12)+'px',border:'3px solid red',zIndex:99999,pointerEvents:'none'}); document.body.appendChild(d);} return !!el; }, sel);
await run('../auth/user1.json', async p => {
  await p.goto('https://zichui-harabim.expo.app/tehilim', { waitUntil:'networkidle' }); await p.waitForTimeout(4000);
  const t = await p.locator('body').innerText();
  console.log('USER URL', p.url()); console.log(t.slice(0,700));
  console.log('has פרקי אבות:', t.includes('פרקי אבות'), '| has נושא:', /נושא/.test(t));
  await p.screenshot({ path: '../screenshots/d99a8f-user-tehilim-list-no-avot-topics-mobile.png' });
});
await run('../auth/admin.json', async p => {
  await p.goto('https://zichui-harabim.expo.app/admin', { waitUntil:'networkidle' }); await p.waitForTimeout(4000);
  const s = p.getByPlaceholder(/חיפוש/); await s.first().fill('אבות'); await p.waitForTimeout(1500);
  const t = await p.locator('body').innerText(); console.log('ADMIN after search:', t.slice(0,500));
  await p.screenshot({ path: '../screenshots/d99a8f-admin-search-avot-mobile.png' });
});
await b.close();
