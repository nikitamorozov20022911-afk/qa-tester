// Run 2 — independent re-check of all checklist points, fresh contexts, desktop 1440 primary + 375 recheck
import { newBrowser, ctx, go, txt, shot, sleep, redBox } from './qasp6-lib.mjs';
const W='/wallet/shared/3bf0fc53-2b78-46d2-9f53-f824c57ceb39', K='/wallet/kids/2e7de39a-13d7-4d7d-a22d-d982a9b95971';
const WD = +(process.env.W||1440);
const b = await newBrowser();
const log=(...a)=>console.log(...a);
const T=(p,n=400)=>txt(p).then(t=>t.replace(/\n/g,' | ').slice(0,n));
const M = await ctx(b,'client',WD), P = await ctx(b,'provider',WD), C = await ctx(b,'client2',WD);
const m=M.p, pr=P.p, k=C.p;
const keys=async(p,s)=>{ for(const ch of s){ await p.getByRole('button',{name:ch,exact:true}).click(); await sleep(120);} };
const bal=async(p)=>{ await go(p,'/wallet'); return (await txt(p)).match(/היתרה שלך\n(₪[\d,.]+)/)?.[1]; };
const tag=`r2-${WD}`;
// --- shared list
await go(m,'/wallet/shared'); log('[M] list', await T(m)); await shot(m,`6a86f7b2/${tag}-list-mgr`);
await go(pr,'/wallet/shared'); log('[P] list', await T(pr)); await shot(pr,`6a86f7b2/${tag}-list-member`);
// --- create form negatives (no creation)
await go(m,'/wallet/shared/new'); log('[M] form', await T(m)); log('[M] create disabled empty', await m.getByRole('button',{name:'אישור ופתיחת ארנק'}).isDisabled());
await m.getByRole('button',{name:'הזמנה מאנשי הקשר'}).click(); await sleep(800);
for (const n of ['0509999999','0500000004']) { await m.getByRole('textbox',{name:'מספר הטלפון של המשתתף'}).fill(n); await sleep(2500); log(`[M] invite ${n}:`, await T(m,250)); }
await m.getByRole('textbox',{name:'מספר הטלפון של המשתתף'}).fill('0500000005'); await sleep(2500); await m.getByRole('button',{name:'הוספה'}).click(); await sleep(1200);
await m.getByRole('button',{name:'הזמנה מאנשי הקשר'}).click(); await sleep(800); await m.getByRole('textbox',{name:'מספר הטלפון של המשתתף'}).fill('0500000005'); await sleep(2500); log('[M] dup:', await T(m,250)); await m.getByRole('button',{name:'חזרה'}).first().click(); await sleep(800);
await m.getByRole('switch',{name:'הרשאת כרטיס — שירה כהן'}).click(); await sleep(500); log('[M] form toggle off:', (await T(m,600)).includes('ללא הרשאת כרטיס'));
await shot(m,`6a86f7b6/${tag}-form-toggle-off`, true);
// --- wallet screen manager
await go(m,W); log('[M] wallet', await T(m,700)); await shot(m,`6a86f7c7/${tag}-mgr-members`, true);
await go(m,W+'?tab=actions'); log('[M] actions', await T(m,700)); await shot(m,`6a86f7c7/${tag}-mgr-actions`, true);
// money: personal & shared
const pb0=await bal(m); await go(m,W); const sb0=(await txt(m)).match(/יתרה משותפת\n(₪[\d,.]+)/)?.[1];
log('[M] personal', pb0, 'shared', sb0);
await go(m,W+'/topup'); await keys(m,'0'); log('[M] topup 0 disabled', await m.getByRole('button',{name:'טעינה'}).isDisabled());
await go(m,W+'/topup'); await keys(m,'10'); await m.getByRole('button',{name:'טעינה'}).click(); await sleep(3500);
const sb1=(await txt(m)).match(/יתרה משותפת\n(₪[\d,.]+)/)?.[1]; const pb1=await bal(m); log('[M] after topup10 shared', sb1, 'personal', pb1);
// member view
await go(pr,W); log('[P] wallet', await T(pr,700)); log(await pr.locator('body').ariaSnapshot()); await shot(pr,`6a86f7c7/${tag}-member-members`, true);
await go(pr,W+'?tab=actions'); log('[P] actions', await T(pr,500)); await shot(pr,`6a86f7c7/${tag}-member-actions`, true);
await go(pr,W+'/withdraw'); await redBox(pr, pr.getByText('כמה תרצו למשוך?'), `6a86f7c7/${tag}-member-withdraw-url-ISSUE`);
log('[P] /withdraw direct URL shows form:', await T(pr,200));
// member API attempts: add member & delete member
const apikeyReq = await new Promise(async res=>{ const h=r=>{ if(r.url().includes('/rest/v1/')){ pr.off('request',h); res(r.headers()['apikey']); } }; pr.on('request',h); await go(pr,W); });
const api = async (method, path, body)=> pr.evaluate(async ({method,path,body,apikey})=>{ const kk=Object.keys(localStorage).find(x=>x.includes('auth-token')); const tok=JSON.parse(localStorage.getItem(kk)); const r=await fetch('https://jelkhsepxgbckrteujii.supabase.co/rest/v1/'+path,{method,headers:{'content-type':'application/json',apikey,authorization:'Bearer '+tok.access_token,prefer:'return=representation'},body}); return r.status+' '+(await r.text()).slice(0,200); },{method,path,body,apikey:apikeyReq});
log('[P] API DELETE manager membership:', await api('DELETE', 'wallet_members?wallet_id=eq.3bf0fc53-2b78-46d2-9f53-f824c57ceb39&role=eq.manager'));
log('[P] API withdraw_wallet:', await api('POST','rpc/withdraw_wallet', JSON.stringify({p_wallet_id:'3bf0fc53-2b78-46d2-9f53-f824c57ceb39',p_amount:1})));
await go(m,W); log('[M] after member API:', await T(m,600));
// toggle off -> member pay / cards
await m.getByRole('switch',{name:'הרשאת כרטיס — שירה כהן'}).click(); await sleep(2500);
await go(pr,W+'/pay'); log('[P] pay when off:', await T(pr)); await shot(pr,`6a86f7ce80791059/${tag}-member-pay-off`);
await go(pr,'/wallet/safepay-cards'); log('[P] cards off:', await T(pr));
await go(m,W); await m.getByRole('switch',{name:'הרשאת כרטיס — שירה כהן'}).click(); await sleep(2500);
await go(pr,W+'/pay'); log('[P] pay when on:', await T(pr));
await go(pr,'/wallet/safepay-cards'); log('[P] cards on:', await T(pr)); await shot(pr,`6a86f7ce80791059/${tag}-member-cards-on`);
await go(m,'/wallet/safepay-cards'); log('[M] cards:', await T(m));
// remove dialog cancel only
await go(m,W); await m.getByRole('button',{name:'הסרת שירה כהן'}).click(); await sleep(1500); log('[M] remove dialog:', (await T(m,900)).split('הסרת משתתף')[1]); await shot(m,`6a86f7c7/${tag}-remove-dialog`);
await m.getByRole('button',{name:'ביטול'}).click(); await sleep(800);
// --- kids
await go(m,'/wallet/kids'); log('[M] kids list', await T(m)); await shot(m,`6a86f7b2fbf9/${tag}-kids-list`, true);
await go(m,'/wallet/kids/new'); await m.getByRole('button',{name:'אישור ופתיחת ארנק'}).click(); await sleep(1200); log('[M] kid form empty submit:', await T(m)); await shot(m,`6a86f7b4/${tag}-kid-form-errors`, true);
await m.getByRole('textbox').nth(0).fill('QA-x'); await m.getByRole('textbox',{name:'מגבלה יומית (ש"ח)'}).fill('50'); await m.getByRole('textbox',{name:'מגבלה לעסקה (ש"ח)'}).fill('25');
await m.getByRole('textbox',{name:'054-1234567'}).fill('0500000003'); await m.getByRole('button',{name:'אישור ופתיחת ארנק'}).click(); await sleep(3000); log('[M] kid form already-bound 03:', await T(m), m.url());
await shot(m,`6a86f7b4/${tag}-kid-already-bound`, true);
await go(m,K); log('[M] kid wallet', await T(m,600)); await shot(m,`6a86f7ce80ac7184/${tag}-kid-wallet-parent`, true);
await go(m,K+'/limits'); log('[M] limits values', await m.getByRole('textbox').nth(0).inputValue(), await m.getByRole('textbox').nth(1).inputValue());
await m.getByRole('textbox').nth(0).fill('70'); await m.getByRole('textbox').nth(1).fill('35'); await m.getByRole('button',{name:'שמירה'}).click(); await sleep(3000);
log('[M] after save 70/35:', await T(m,300)); await go(m,'/wallet/kids'); log('[M] list after', await T(m));
await go(m,K+'/limits'); await m.getByRole('textbox').nth(0).fill('50'); await m.getByRole('textbox').nth(1).fill('25'); await m.getByRole('button',{name:'שמירה'}).click(); await sleep(3000); log('[M] reverted:', await T(m,300));
// kid side
await go(k,'/kid'); log('[K] home', await T(k,600)); await shot(k,`6a86f7bc/${tag}-kid-home`, true);
const nav = await k.evaluate(()=>/הארנק שלי|עסקאות|נותני שירות/.test(document.body.innerText)); log('[K] bottom nav present:', nav);
await go(k,'/kid/pay'); log('[K] pay', await T(k)); await shot(k,`6a86f7bc/${tag}-kid-pay`, true);
await go(k,'/kid/settings'); log('[K] settings', await T(k)); await shot(k,`6a86f7bc/${tag}-kid-settings`, true);
const st = await k.evaluate(()=>{ const out={}; for(const s of ['הגדרות כלליות','יציאה מהחשבון']){ const el=[...document.querySelectorAll('div')].find(e=>e.childElementCount===0&&e.textContent.trim()===s); if(el) out[s]=getComputedStyle(el).color; } return out; }); log('[K] settings colors', st);
for (const path of ['/wallet','/wallet/shared','/deals','/profile']) { await go(k,path,3000); log('[K] direct', path, '->', k.url()); }
log('CONSOLE M', JSON.stringify(m._console)); log('CONSOLE P', JSON.stringify(pr._console)); log('CONSOLE K', JSON.stringify(k._console));
await b.close();
