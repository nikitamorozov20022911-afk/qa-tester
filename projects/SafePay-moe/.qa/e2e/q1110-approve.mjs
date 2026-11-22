// provider 05 approves deal terms ID (data prep for phone test 11.10)
import { newBrowser, ctx, go, txt, sleep } from './q0310-lib.mjs';
const ID = process.env.ID;
const b = await newBrowser();
const { p } = await ctx(b, 'provider', 375, 812); p.setDefaultTimeout(15000);
await go(p, '/deals/edit?id=' + ID); console.log('URL0', p.url()); console.log((await txt(p)).slice(0,300)); console.log(await p.evaluate(()=>[...document.querySelectorAll('[role=button],[role=checkbox]')].map(e=>e.getAttribute('role')+':'+(e.innerText||e.getAttribute('aria-label')||'').slice(0,30))));
for (const cb of await p.getByRole('checkbox', { name: /^אישור סעיף/ }).all()) { if ((await cb.getAttribute('aria-checked')) !== 'true') { await cb.click(); await sleep(300); } }
await p.getByRole('button', { name: 'אישור התנאים' }).last().click(); await sleep(4000);
console.log('url', p.url(), '| req:', p._req.join(' ; '), '| refusal:', (await txt(p)).includes('רק הצד השני'));
await b.close();
