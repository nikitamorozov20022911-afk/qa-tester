import { newBrowser, ctx, go, txt, shot, sleep } from './q0310-lib.mjs';
const id = process.env.ID;
const b = await newBrowser();
const { p } = await ctx(b, 'provider', 375, 812);
p.setDefaultTimeout(15000);
await go(p, '/deals/' + id);
console.log(await txt(p));
const btns = await p.evaluate(() => [...document.querySelectorAll('[role=button],button,[role=checkbox]')].filter((e) => e.offsetParent).map((e) => `${e.getAttribute('role')}:${(e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\n/g, ' / ')}${e.getAttribute('aria-disabled') === 'true' || e.disabled ? '[disabled]' : ''}${e.getAttribute('aria-checked')!=null?'[checked='+e.getAttribute('aria-checked')+']':''}`));
console.log(btns);
if (process.env.GO) {
  await p.getByRole('button', { name: 'עריכת תנאי עסקה' }).first().click(); await sleep(2500);
  console.log('---after edit click', p.url()); console.log(await txt(p));
  const cbs = await p.evaluate(() => [...document.querySelectorAll('[role=checkbox]')].filter(e=>e.offsetParent).map(e => (e.getAttribute('aria-label')||e.innerText||'').slice(0,60)+'|'+e.getAttribute('aria-checked')));
  console.log('checkboxes', cbs);
  await shot(p, 'qa0310', 'prov-terms-' + id.slice(0,8), true);
}
await b.close();
