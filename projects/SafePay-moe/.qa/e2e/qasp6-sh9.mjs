import { newBrowser, ctx, go, txt, shot, sleep, redBox } from './qasp6-lib.mjs';
const W='/wallet/shared/3bf0fc53-2b78-46d2-9f53-f824c57ceb39';
const b = await newBrowser();
const M = await ctx(b, 'client', 375); const P = await ctx(b, 'provider', 375);
const log=(...a)=>console.log(...a);
let captured=null;
M.p.on('request', r=>{ if(r.url().includes('/rpc/') && !r.url().includes('find_user')) { captured={url:r.url(), body:r.postData(), headers:r.headers()}; }});
await go(M.p, W);
await M.p.getByRole('switch',{name:'הרשאת כרטיס — שירה כהן'}).click(); await sleep(2500);
log('[manager] after off:', (await txt(M.p)).replace(/\n/g,' | ').slice(150,500));
await shot(M.p,'6a86f7c7/r1-46-manager-toggle-off-375', true);
log('captured', captured?.url, captured?.body);
await go(P.p, W); log('[provider] wallet:', (await txt(P.p)).replace(/\n/g,' | ').slice(0,500));
await shot(P.p,'6a86f7c7/r1-47-member-sees-off-375', true);
await go(P.p, W+'/pay'); log('[provider] /pay off:', (await txt(P.p)).replace(/\n/g,' | '));
await shot(P.p,'6a86f7ce80791059/r1-48-member-pay-off-375', true);
await go(P.p, '/wallet/safepay-cards'); log('[provider] cards:', (await txt(P.p)).replace(/\n/g,' | ').slice(0,700));
await shot(P.p,'6a86f7ce80791059/r1-49-member-cards-off-375', true);
// API attempt by provider to re-enable self
if (captured) {
  const body = captured.body.replace(/false/, 'true');
  const res = await P.p.evaluate(async ({url, body})=>{
    const k = Object.keys(localStorage).find(k=>k.includes('auth-token')); const tok = JSON.parse(localStorage.getItem(k)||'{}');
    const apikey = tok?.access_token ? null : null;
    return {k, has: !!tok.access_token};
  }, {url: captured.url, body});
  log('provider token', res);
  const r2 = await P.p.evaluate(async ({url, body, apikey})=>{
    const k = Object.keys(localStorage).find(k=>k.includes('auth-token')); const tok = JSON.parse(localStorage.getItem(k));
    const r = await fetch(url,{method:'POST',headers:{'content-type':'application/json',apikey, authorization:'Bearer '+tok.access_token},body});
    return {status:r.status, text:(await r.text()).slice(0,300)};
  }, {url: captured.url, body, apikey: captured.headers['apikey']});
  log('[provider] API self-enable:', body, JSON.stringify(r2));
}
await go(M.p, W); log('[manager] state after provider API:', (await txt(M.p)).replace(/\n/g,' | ').slice(150,500));
await b.close();
