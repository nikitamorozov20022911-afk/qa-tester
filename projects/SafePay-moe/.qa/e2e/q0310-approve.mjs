import { newBrowser, ctx, go, txt, shot, sleep } from './q0310-lib.mjs';
const b = await newBrowser();
const { p } = await ctx(b, 'provider', +(process.env.W||375), 900);
p.setDefaultTimeout(15000);
let id = process.env.ID;
if (!id) { await go(p, '/deals'); await p.getByText(process.env.T, { exact: true }).first().click(); await sleep(3000); id = p.url().split('/deals/')[1]; }
console.log('ID', id);
await go(p, '/deals/edit?id=' + id);
const cbs = p.getByRole('checkbox', { name: /אישור סעיף/ });
const n = await cbs.count();
for (let i = 0; i < n; i++) { await cbs.nth(i).click(); await sleep(400); }
console.log('btn disabled', await p.getByTestId('approve-terms').getAttribute('aria-disabled'));
console.log('checked', await p.evaluate(() => [...document.querySelectorAll('[role=checkbox]')].map(e=>e.getAttribute('aria-checked'))));
await p.getByRole('button', { name: 'אישור התנאים' }).click(); await sleep(4000);
console.log('URL', p.url()); console.log((await txt(p)).slice(0,1500)); console.log(p._req, p._console);
await b.close();
