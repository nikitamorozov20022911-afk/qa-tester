import { newBrowser, ctx, go, txt, shot, sleep } from './qasp6-lib.mjs';
const K='/wallet/kids/2e7de39a-13d7-4d7d-a22d-d982a9b95971';
const b = await newBrowser();
const { p } = await ctx(b, 'client', 375); const C = await ctx(b, 'client2', 375);
const log=(...a)=>console.log(...a);
const T=(q=p)=>txt(q).then(t=>t.replace(/\n/g,' | '));
async function keys(s){ for(const ch of s) { await p.getByRole('button',{name:ch,exact:true}).click(); await sleep(120);} }
await go(p, K+'/topup'); await keys('99999'); await p.getByRole('button',{name:/טעינה/}).first().click(); await sleep(3000);
log('[parent] topup 99999 submit:', (await T()).slice(0,250)); await shot(p,'6a86f7ce80ac7184/r1-13-kid-topup-over-submit-375');
await go(p, K);
await p.getByRole('button',{name:'עריכת מגבלות'}).click(); await sleep(3000);
log('URL', p.url()); log(await T()); log(await p.locator('body').ariaSnapshot());
await shot(p,'6a86f7c8/r1-01-limits-375', true);
const tbs=p.getByRole('textbox');
log('values', await tbs.nth(0).inputValue(), await tbs.nth(1).inputValue());
const save=p.getByRole('button',{name:'שמירה'});
for (const [a,c] of [['',''],['abc','x'],['-5','-1'],['1.234','2.555']]) { await tbs.nth(0).fill(a); await tbs.nth(1).fill(c); await save.click(); await sleep(1800); log(`save [${a}|${c}]:`, (await T()).slice(0,300), p.url()); }
await shot(p,'6a86f7c8/r1-02-limits-neg-375', true);
await tbs.nth(0).fill('60'); await tbs.nth(1).fill('30'); await save.click(); await sleep(3000);
log('after save 60/30', p.url(), (await T()).slice(0,300));
await shot(p,'6a86f7c8/r1-03-after-save-375', true);
await go(p,'/wallet/kids'); log('[parent] list:', await T()); await shot(p,'6a86f7b2fbf9/r1-04-list-6030-375', true);
log('REQ', p._req, p._console);
await b.close();
