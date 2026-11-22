import { newBrowser, ctx, go, txt, shot, sleep, BASE } from './q0310-lib.mjs';
import { fillForm, submitBtn } from './qa1846-lib.mjs';
const title = process.env.T;
const b = await newBrowser();
const { p } = await ctx(b, 'client', +(process.env.W||375), 900);
p.setDefaultTimeout(15000);
await go(p, '/deals/new?providerId=' + (process.env.P||'1929b054-5ae2-40ee-bee0-bfba608ac1fa') + '');

await fillForm(p, { title, terms: title + ' — תנאי בדיקה', amount: +(process.env.A||100), start: '12/10/2026', end: '20/10/2026' });
await (await submitBtn(p)).click();
await p.waitForURL((u) => /\/deals\/[0-9a-f-]{20,}/.test(u.toString()), { timeout: 20000 });
await sleep(3500);
console.log('URL', p.url());
console.log(await txt(p));
await shot(p, '2026-10-11-phone', 'created-' + (process.env.S||'x'), true);
console.log(p._console, p._req);
await b.close();
