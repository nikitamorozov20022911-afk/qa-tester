import { chromium } from '@playwright/test';
import fs from 'fs';
const OUT='/private/tmp/claude-502/-Users-avielshnaider--claude-spares-spare-ECbffp/983ba125-cf94-4742-895f-2616df89f97c/scratchpad/sec3/site';
const T='https://tenderflow-web-staging.vercel.app/tenders/192fa4c1-6d4c-4e42-b314-96da68e5bcd3';
const b=await chromium.launch();
const note=s=>console.log(s);
const ctx=await b.newContext({storageState:`/Users/avielshnaider/tenderflow - moe/.qa/auth/user.json`,viewport:{width:1920,height:1080},locale:'he-IL'});
const p=await ctx.newPage();
p.on('pageerror',e=>note(`[pageerror] ${e.message}`));
p.on('response',async r=>{if(r.status()>=400){let body='';try{body=(await r.text()).slice(0,200)}catch{};note(`[http ${r.status()}] ${r.request().method()} ${r.url().slice(0,160)} :: ${body}`)}});
await p.goto(T+'/analysis',{waitUntil:'networkidle'});await p.waitForTimeout(2000);
for(const [t,n] of [['תנאי סף ודגלים אדומים','v1-compliance'],['משימות ושאלות הבהרה','v3-tasks'],['תיק הגשה','v4-submission'],['מרכז מסמכים','v2-docs']]){
  await p.getByRole('tab',{name:t,exact:true}).click();await p.waitForTimeout(10000);
  await p.screenshot({path:`${OUT}/${n}.png`,fullPage:true});
  const txt=await p.evaluate(()=>document.querySelector('main')?.innerText||document.body.innerText);
  fs.writeFileSync(`${OUT}/${n}.txt`,`URL ${p.url()}\n`+txt);
  note(`== ${t} url=${p.url()} :: `+txt.replace(/\s+/g,' ').slice(170,520));
}
await p.goto(T+'/analysis?tab=compliance',{waitUntil:'networkidle'});await p.waitForTimeout(3000);
await p.screenshot({path:`${OUT}/v1b-compliance-directurl.png`});
note('direct compliance: '+(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,300));
await b.close();
