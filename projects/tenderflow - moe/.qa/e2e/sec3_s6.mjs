import { chromium } from '@playwright/test';
const OUT='/private/tmp/claude-502/-Users-avielshnaider--claude-spares-spare-ECbffp/983ba125-cf94-4742-895f-2616df89f97c/scratchpad/sec3/site';
const T='https://tenderflow-web-staging.vercel.app/tenders/192fa4c1-6d4c-4e42-b314-96da68e5bcd3/analysis';
const b=await chromium.launch();
const ctx=await b.newContext({storageState:`/Users/avielshnaider/tenderflow - moe/.qa/auth/user.json`,viewport:{width:1920,height:1080},locale:'he-IL'});
const p=await ctx.newPage();
const tabs=['','?tab=compliance','?tab=documents','?tab=tasks','?tab=submission'];
for(let r=0;r<2;r++)for(const t of tabs){
  await p.goto(T+t,{waitUntil:'networkidle'});await p.waitForTimeout(6000);
  const txt=(await p.evaluate(()=>document.querySelector('main')?.innerText||'')).replace(/\s+/g,' ');
  const perm=txt.includes('אין לך הרשאה'); const loading=(txt.match(/טוען[^.]*…/g)||[]);
  console.log(`run${r} ${t||'overview'} perm=${perm} loading=${JSON.stringify(loading)}`);
  if(perm) await p.screenshot({path:`${OUT}/v-perm-${r}-${t.replace(/\W/g,'')}.png`});
}
// admin comparison loading
const c2=await b.newContext({storageState:`/Users/avielshnaider/tenderflow - moe/.qa/auth/admin.json`,viewport:{width:1920,height:1080}});
const q=await c2.newPage();
for(const t of tabs.slice(2)){await q.goto(T+t,{waitUntil:'networkidle'});await q.waitForTimeout(4000);const txt=(await q.evaluate(()=>document.querySelector('main')?.innerText||'')).replace(/\s+/g,' ');console.log(`admin ${t} loading=${JSON.stringify(txt.match(/טוען[^.]*…/g)||[])}`);}
await b.close();
