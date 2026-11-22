import { newBrowser, ctx, go, txt, shot, sleep, redBox } from './q0310-lib.mjs';
const W='6a86f7ccc9997bc71194c8a6', RUN=process.env.RUN||'r1', WD=+(process.env.W||375), DEV=WD<768?'mobile':'desktop';
const b = await newBrowser();
for (const role of ['client','provider']) {
  const { p } = await ctx(b, role, WD, 900); p.setDefaultTimeout(12000);
  await go(p, '/wallet');
  const sa = p.getByText('הצג/י הכל').last(); await sa.click(); await sleep(3000);
  console.log('===', role, p.url());
  const items = await p.evaluate(() => { const out=[]; const els=[...document.querySelectorAll('div')].filter(e=>/^[+\-−]?₪[\d,]+$/.test((e.innerText||'').trim()) && e.children.length===0 || (/^[+\-]₪/.test((e.innerText||'').trim()) && e.childElementCount===0)); for (const e of els) out.push((e.innerText||'').trim()+' color='+getComputedStyle(e).color); return out.slice(0,60); });
  const t = await txt(p); console.log(t.slice(0, 2500));
  console.log('amount colors', [...new Set(items)].slice(0,30));
  await shot(p, W, `${RUN}-04-${role}-full-ledger-${DEV}`, true);
  // dispute deal read
  await go(p, '/deals'); await p.getByText('QA מחלוקת ניקיון', { exact: true }).first().click().catch(async()=>{ await p.getByText(/מחלוקת ניקיון/).first().click(); }); await sleep(3500);
  console.log('dispute deal', p.url(), (await txt(p)).split('\n').slice(0,20).join(' | '));
  await p.getByText('היסטוריה', { exact: true }).click(); await sleep(2000); console.log('history', (await txt(p)).split('\n').slice(0,30).join(' | '));
  await shot(p, W, `${RUN}-05-${role}-dispute-deal-history-${DEV}`, true);
  console.log('console', p._console);
}
await b.close();
