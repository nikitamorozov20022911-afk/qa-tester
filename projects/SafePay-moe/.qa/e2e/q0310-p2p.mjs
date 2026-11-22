import { newBrowser, ctx, go, txt, shot, sleep, redBox } from './q0310-lib.mjs';
import { btns, bal } from './q0310-btns.mjs';
const W='6a86f7ccc9997bc71194c8a6', RUN=process.env.RUN||'r1', WD=+(process.env.W||375), DEV=WD<768?'mobile':'desktop';
const FROM = process.env.FROM||'client', TO_NAME = process.env.TO||'שירה כהן';
const b = await newBrowser();
const { p: c } = await ctx(b, FROM, WD, 860); c.setDefaultTimeout(12000);
console.log(FROM, 'bal before', await bal(c, go));
await go(c, '/wallet/transfer');
await c.getByRole('button', { name: new RegExp(TO_NAME) }).first().click(); await sleep(2500);
console.log('STEP2', c.url(), (await txt(c)).split('\n').slice(0,6), 'next', await c.getByRole('button', { name: /הבא|המשך|העברה/ }).last().getAttribute('aria-disabled'));
console.log(await btns(c));
for (const ch of (process.env.AMT||'1')) { await c.getByRole('button', { name: new RegExp('^'+ch) }).first().click(); await sleep(200); }
const nb = c.getByRole('button', { name: 'אישור וביצוע העברה' }).last();
console.log('after 1 next disabled', await nb.getAttribute('aria-disabled'));
await shot(c, W, `${RUN}-10-p2p-amount-${FROM}-${DEV}`);
if (process.env.SEND) {
  c._req.length=0; await nb.click(); await sleep(3500);
  console.log('req', c._req); console.log('DONE', c.url(), (await txt(c)).split('\n').slice(0,10));
  await shot(c, W, `${RUN}-10c-p2p-success-${FROM}-${DEV}`);
  console.log(FROM, 'bal after', await bal(c, go)); const t = await txt(c); console.log(t.slice(t.indexOf('פעולות אחרונות'), t.indexOf('פעולות אחרונות')+120));
}
console.log('console', c._console);
await b.close();
