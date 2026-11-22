import { newBrowser, ctx, go, txt, shot, sleep, redBox } from './q0310-lib.mjs';
import { btns } from './q0310-btns.mjs';
const W='6a86f7ccc9997bc71194c8a6', RUN=process.env.RUN||'r1', WD=+(process.env.W||375), DEV=WD<768?'mobile':'desktop';
const b = await newBrowser();
const { p: c } = await ctx(b, 'client', WD, 860); c.setDefaultTimeout(12000);
const key = async (pg, s) => { for (const ch of s) { await pg.getByRole('button', { name: new RegExp('^' + ch) }).first().click(); await sleep(150); } };
const nextState = (pg) => pg.getByRole('button', { name: 'הבא' }).first().getAttribute('aria-disabled');
// load
await go(c, '/wallet/load'); console.log('load 0 next disabled', await nextState(c));
await key(c, '5'); console.log('load 5 next disabled', await nextState(c), (await txt(c)).split('\n').slice(0,4));
await c.getByRole('button', { name: 'הבא' }).first().click(); await sleep(2500);
console.log('LOAD STEP2', c.url(), (await txt(c)).split('\n').slice(0,30)); console.log(await btns(c));
await shot(c, W, `${RUN}-07-load-method-${DEV}`);
// withdraw
await go(c, '/wallet/withdraw'); console.log('wd 0 next disabled', await nextState(c));
await key(c, '999'); await sleep(500);
const t = await txt(c); console.log('wd 999', t.split('\n').slice(0,5), 'next disabled', await nextState(c));
const hint = c.getByText(/הסכום המקסימלי למשיכה/).first();
console.log('hint color', await hint.evaluate(el => getComputedStyle(el).color), 'amount color', await c.getByText('₪999').first().evaluate(el => getComputedStyle(el).color).catch(()=>'n/a'));
await redBox(c, hint, W, `${RUN}-08-withdraw-over-limit-${DEV}`);
for (let i=0;i<3;i++){ await c.getByRole('button', { name: 'מחיקה' }).click(); await sleep(150);} 
await key(c, '1'); console.log('wd 1 next disabled', await nextState(c));
await c.getByRole('button', { name: 'הבא' }).first().click(); await sleep(2500);
console.log('WD STEP2', c.url(), (await txt(c)).split('\n').slice(0,25)); console.log(await btns(c));
await shot(c, W, `${RUN}-09-withdraw-step2-${DEV}`);
console.log('console', c._console);
await b.close();
