import { newBrowser, ctx, go, txt, shot, sleep } from './qasp6-lib.mjs';
const W='/wallet/shared/3bf0fc53-2b78-46d2-9f53-f824c57ceb39';
const b = await newBrowser();
const M = await ctx(b, 'client', 375); const P = await ctx(b, 'provider', 375);
const log=(...a)=>console.log(...a);
let captured=null;
M.p.on('request', r=>{ if(!['GET','OPTIONS'].includes(r.method()) && !r.url().includes('find_user')) { captured={m:r.method(),url:r.url(), body:r.postData(), headers:r.headers()}; }});
// provider cards with ON state later; first try API self-enable with manager's toggle ON request captured
await go(M.p, W);
await M.p.getByRole('switch',{name:'הרשאת כרטיס — שירה כהן'}).click(); await sleep(2500);
log('[manager] after on:', (await txt(M.p)).replace(/\n/g,' | ').slice(150,500));
log('captured', captured?.m, captured?.url, captured?.body);
await go(P.p, W+'/pay'); log('[provider] /pay on:', (await txt(P.p)).replace(/\n/g,' | '));
await go(P.p, '/wallet/safepay-cards'); await shot(P.p,'6a86f7ce80791059/r1-50-member-cards-on-375', true);
log('[provider] cards on:', (await txt(P.p)).replace(/\n/g,' | '));
const cards = await P.p.evaluate(()=>[...document.querySelectorAll('div')].filter(d=>d.childElementCount===0 && /QA-ארנק|הכרטיס שלי|V-M2/.test(d.textContent)).map(d=>{const r=d.getBoundingClientRect(); return d.textContent+'@'+Math.round(r.x)+','+Math.round(r.y);}));
log('card labels', cards);
// provider tries to DISABLE herself / manager via same API
if (captured) {
  const body = captured.body.replace(/true/, 'false');
  const r2 = await P.p.evaluate(async ({m,url, body, apikey})=>{
    const k = Object.keys(localStorage).find(k=>k.includes('auth-token')); const tok = JSON.parse(localStorage.getItem(k));
    const r = await fetch(url,{method:m,headers:{'content-type':'application/json',apikey, authorization:'Bearer '+tok.access_token, prefer:'return=representation'},body});
    return {status:r.status, text:(await r.text()).slice(0,300)};
  }, {m:captured.m, url: captured.url, body, apikey: captured.headers['apikey']});
  log('[provider] API toggle attempt:', body, JSON.stringify(r2));
}
await go(M.p, W); log('[manager] state after provider API:', (await txt(M.p)).replace(/\n/g,' | ').slice(150,500));
await b.close();
