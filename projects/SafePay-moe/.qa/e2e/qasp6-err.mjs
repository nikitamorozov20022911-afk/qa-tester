import { newBrowser, ctx, go, txt, shot, sleep } from './qasp6-lib.mjs';
const W='/wallet/shared/3bf0fc53-2b78-46d2-9f53-f824c57ceb39', K='/wallet/kids/2e7de39a-13d7-4d7d-a22d-d982a9b95971';
const RUN=process.env.RUN||'r1';
const b = await newBrowser();
const log=(...a)=>console.log(...a);
const T=(p)=>txt(p).then(t=>t.replace(/\n/g,' | ').slice(0,300));
async function listErr(role, path, dir, name){
  const { c, p } = await ctx(b, role, 375);
  await go(p, '/profile', 3000);
  await p.route(/supabase\.co\/rest\/v1\/(?!rpc\/find)/, r=>r.abort());
  await go(p, path, 45000);
  log(`[${role}] ${path} ERROR:`, await T(p)); await shot(p, `${dir}/${RUN}-err-${name}`);
  await p.unroute(/supabase\.co\/rest\/v1\/(?!rpc\/find)/);
  const retry = p.getByText('נסו שוב').first();
  if (await retry.isVisible().catch(()=>false)) { await retry.click(); await sleep(4000); log(`[${role}] ${path} after retry:`, await T(p)); await shot(p, `${dir}/${RUN}-err-${name}-retry`);} else log('no retry button');
  if(process.env.LISTONLY){ await c.close(); return; }
  // loading: delay
  await p.route(/supabase\.co\/rest\/v1\//, async r=>{ await sleep(4000); r.continue().catch(()=>{}); });
  await p.goto('https://safepay.expo.app'+path); await sleep(1500);
  log(`[${role}] ${path} LOADING:`, await T(p), 'spinner?', await p.locator('[role=progressbar], [aria-busy=true]').count()); await shot(p, `${dir}/${RUN}-loading-${name}`);
  await c.close();
}
await listErr('client','/wallet/shared','6a86f7b2','shared-list');
await listErr('client','/wallet/kids','6a86f7b2fbf9','kids-list');
await listErr('client', W, '6a86f7c7','wallet-mgr');
await listErr('client', K+'/limits', '6a86f7c8','limits');
await listErr('client2','/kid','6a86f7bc','kid-home');
if(!process.env.LISTONLY){
  const { c, p } = await ctx(b, 'client', 375);
  await go(p, W+'/topup');
  await p.route(/rpc\/fund_wallet/, r=>r.abort());
  for (const ch of '10') await p.getByRole('button',{name:ch,exact:true}).click();
  await p.getByRole('button',{name:'טעינה'}).click(); await sleep(3000); log('topup net err:', await T(p)); await shot(p,'6a86f7c7/'+RUN+'-err-topup');
  await go(p, W);
  await p.route(/wallet_members/, r=> r.request().method()==='PATCH' ? r.abort() : r.continue());
  await p.getByRole('switch',{name:'הרשאת כרטיס — שירה כהן'}).click(); await sleep(2500); log('toggle net err:', await T(p), 'checked', await p.getByRole('switch',{name:'הרשאת כרטיס — שירה כהן'}).isChecked()); await shot(p,'6a86f7c7/'+RUN+'-err-toggle');
  await go(p, '/wallet/shared/new');
  await p.route(/rpc\/create_shared_wallet/, r=>r.abort());
  await p.getByRole('textbox',{name:'שם הארנק'}).fill('QA-netfail');
  await p.getByRole('button',{name:'אישור ופתיחת ארנק'}).click(); await sleep(3000); log('create shared net err:', await T(p), p.url()); await shot(p,'6a86f7b6/'+RUN+'-err-create');
  await go(p, '/wallet/kids/new');
  await p.route(/rpc\/create_child_wallet/, r=>r.abort());
  await p.getByRole('textbox').nth(0).fill('QA-netfail'); await p.getByRole('textbox',{name:'054-1234567'}).fill('0500000003');
  await p.getByRole('textbox',{name:'מגבלה יומית (ש"ח)'}).fill('50'); await p.getByRole('textbox',{name:'מגבלה לעסקה (ש"ח)'}).fill('25');
  await p.getByRole('button',{name:'אישור ופתיחת ארנק'}).click(); await sleep(3000); log('create kid net err:', await T(p), p.url()); await shot(p,'6a86f7b4/'+RUN+'-err-create');
  await go(p, K+'/limits');
  await p.route(/rest\/v1\/wallets/, r=> r.request().method()==='PATCH' ? r.abort() : r.continue());
  await p.getByRole('textbox').nth(0).fill('51'); await p.getByRole('button',{name:'שמירה'}).click(); await sleep(3000); log('limits save net err:', await T(p), p.url()); await shot(p,'6a86f7c8/'+RUN+'-err-save');
  log('REQ', p._req);
  await c.close();
}
await b.close();
