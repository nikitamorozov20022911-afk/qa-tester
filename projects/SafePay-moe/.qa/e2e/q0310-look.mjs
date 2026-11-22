import { newBrowser, ctx, go, txt, shot, sleep } from './q0310-lib.mjs';
const b = await newBrowser();
const { p } = await ctx(b, process.env.R||'client', +(process.env.W||375), 812);
p.setDefaultTimeout(12000);
await go(p, process.env.P);
for (const step of (process.env.CLICK||'').split(';;').filter(Boolean)) {
  const [kind, val] = step.split('=');
  if (kind==='btn') await p.getByRole('button', { name: val }).last().click();
  else if (kind==='text') await p.getByText(val, { exact: true }).last().click();
  else if (kind==='cb') await p.getByRole('checkbox').last().click();
  await sleep(2500);
}
console.log('URL', p.url()); console.log(await txt(p));
console.log(await p.evaluate(() => [...document.querySelectorAll('[role=button],button,[role=checkbox],[role=radio]')].filter((e) => e.offsetParent).map((e) => `${e.getAttribute('role')}:${(e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\n/g, ' / ').slice(0,80)}${e.getAttribute('aria-disabled') === 'true' || e.disabled ? '[disabled]' : ''}${e.getAttribute('aria-checked')!=null?'[ch='+e.getAttribute('aria-checked')+']':''}`)));
if (process.env.SHOT) await shot(p, process.env.DIR||'qa0310', process.env.SHOT, !!process.env.FULL);
console.log('console', p._console, 'req', p._req);
await b.close();
