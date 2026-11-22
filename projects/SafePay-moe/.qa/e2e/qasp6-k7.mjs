import { newBrowser, ctx, go, txt, shot, sleep } from './qasp6-lib.mjs';
const K='/wallet/kids/2e7de39a-13d7-4d7d-a22d-d982a9b95971';
const b = await newBrowser();
const { p } = await ctx(b, 'client', 375); const C = await ctx(b, 'client2', 375);
const log=(...a)=>console.log(...a);
const T=(q=p)=>txt(q).then(t=>t.replace(/\n/g,' | '));
let cap=[]; p.on('request', r=>{ if(['PATCH','POST'].includes(r.method())) cap.push({m:r.method(),url:r.url(),body:r.postData(),apikey:r.headers()['apikey']}); });
async function save(a,c){ await go(p, K+'/limits'); const tbs=p.getByRole('textbox'); await tbs.nth(0).fill(a); await tbs.nth(1).fill(c); await p.getByRole('button',{name:'שמירה'}).click(); await sleep(3000); return (await T()).slice(0,260); }
log('save 0/5:', await save('0','5'));
log('save 20/30:', await save('20','30'));
await shot(p,'6a86f7c8/r1-04-tx-gt-daily-375', true);
log('save 50/25:', await save('50','25'));
const patch = cap.find(c=>c.m==='PATCH'); log('PATCH', patch?.url, patch?.body);
// kid API attempts
await go(C.p,'/kid');
const call = async (m,url,body,apikey)=> C.p.evaluate(async ({m,url,body,apikey})=>{ const k=Object.keys(localStorage).find(k=>k.includes('auth-token')); const tok=JSON.parse(localStorage.getItem(k)); const r=await fetch(url,{method:m,headers:{'content-type':'application/json',apikey,authorization:'Bearer '+tok.access_token,prefer:'return=representation'},body}); return r.status+' '+(await r.text()).slice(0,200); },{m,url,body,apikey});
if (patch) log('[kid] PATCH limits 999/999:', await call('PATCH', patch.url, patch.body.replace(/50/,'999').replace(/25/,'999'), patch.apikey));
const base = patch.url.split('/rest/v1/')[0];
log('[kid] rpc fund_wallet:', await call('POST', base+'/rest/v1/rpc/fund_wallet', JSON.stringify({p_wallet_id:'2e7de39a-13d7-4d7d-a22d-d982a9b95971', p_amount:1}), patch.apikey));
log('[kid] rpc withdraw_wallet:', await call('POST', base+'/rest/v1/rpc/withdraw_wallet', JSON.stringify({p_wallet_id:'2e7de39a-13d7-4d7d-a22d-d982a9b95971', p_amount:1}), patch.apikey));
await go(p, K); log('[parent] after kid API:', (await T()).slice(0,300));
const fund = cap.find(c=>c.url.includes('fund_wallet')); log('fund body format', fund?.body);
await b.close();
