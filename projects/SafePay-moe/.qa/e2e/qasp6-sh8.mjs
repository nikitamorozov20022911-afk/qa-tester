import { newBrowser, ctx, go, txt, shot, sleep, redBox } from './qasp6-lib.mjs';
const W='/wallet/shared/3bf0fc53-2b78-46d2-9f53-f824c57ceb39';
const b = await newBrowser();
const { p } = await ctx(b, 'provider', 375);
const log=(...a)=>console.log(...a);
await go(p, W+'/withdraw');
for(const ch of '10'){ await p.getByRole('button',{name:ch,exact:true}).click(); await sleep(150);} 
log('btn disabled', await p.getByRole('button',{name:'משיכה'}).isDisabled());
await redBox(p, p.getByText('הסכום המקסימלי למשיכה הוא', {exact:false}), '6a86f7c7/r1-44-member-withdraw-screen-375');
await p.getByRole('button',{name:'משיכה'}).click(); await sleep(3500);
log('[provider] after withdraw attempt', p.url(), (await txt(p)).replace(/\n/g,' | ').slice(0,400));
await shot(p,'6a86f7c7/r1-45-member-withdraw-result-375');
await go(p, W+'?tab=actions'); log('[provider] shared bal', (await txt(p)).match(/יתרה משותפת\n(₪[\d,.]+)/)?.[1]);
log('CONSOLE', p._console, 'REQ', p._req);
await b.close();
