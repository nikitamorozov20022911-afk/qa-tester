import { newBrowser, ctx, go, txt, shot, sleep } from './qasp6-lib.mjs';
const W='/wallet/shared/3bf0fc53-2b78-46d2-9f53-f824c57ceb39';
const b = await newBrowser();
const { p } = await ctx(b, 'provider', 375);
const log=(...a)=>console.log(...a);
const bal=async()=>{await go(p,'/wallet'); return (await txt(p)).match(/היתרה שלך\n(₪[\d,.]+)/)?.[1];};
log('[provider] personal before', await bal());
await go(p,'/wallet/shared'); log('[provider] list:', (await txt(p)).replace(/\n/g,' | '));
await shot(p,'6a86f7b2/r1-40-list-provider-375');
await p.getByText('QA-ארנק משותף 03.10').click(); await sleep(3500);
log('[provider] URL', p.url()); log(await p.locator('body').ariaSnapshot());
await shot(p,'6a86f7c7/r1-41-member-view-375', true);
// direct URL attempts
await go(p, W+'/withdraw'); log('[provider] /withdraw ->', p.url(), (await txt(p)).replace(/\n/g,' | ').slice(0,300));
await shot(p,'6a86f7c7/r1-42-member-withdraw-url-375');
await go(p, W+'/topup');
for(const ch of '10'){ await p.getByRole('button',{name:ch,exact:true}).click(); await sleep(150);} 
await p.getByRole('button',{name:'טעינה'}).click(); await sleep(3500);
log('[provider] after topup10', p.url(), (await txt(p)).replace(/\n/g,' | ').slice(0,400));
log('[provider] personal after', await bal());
await go(p, W+'/pay'); log('[provider] /pay', p.url(), (await txt(p)).replace(/\n/g,' | ').slice(0,500));
await shot(p,'6a86f7c7/r1-43-member-pay-on-375', true);
log('CONSOLE', p._console, 'REQ', p._req);
await b.close();
