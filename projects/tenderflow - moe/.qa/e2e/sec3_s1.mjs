import { chromium } from '@playwright/test';
import fs from 'fs';
const OUT='/private/tmp/claude-502/-Users-avielshnaider--claude-spares-spare-ECbffp/983ba125-cf94-4742-895f-2616df89f97c/scratchpad/sec3/site';
const URL='https://tenderflow-web-staging.vercel.app/tenders/192fa4c1-6d4c-4e42-b314-96da68e5bcd3/analysis';
const b=await chromium.launch();
const ctx=await b.newContext({storageState:'/Users/avielshnaider/tenderflow - moe/.qa/auth/admin.json',viewport:{width:1920,height:1080},locale:'he-IL'});
const p=await ctx.newPage();
const log=[];
p.on('console',m=>{if(['error','warning'].includes(m.type()))log.push(`[console.${m.type()}] ${p.url()} :: ${m.text().slice(0,400)}`)});
p.on('pageerror',e=>log.push(`[pageerror] ${p.url()} :: ${e.message}`));
p.on('response',r=>{if(r.status()>=400)log.push(`[http ${r.status()}] ${r.request().method()} ${r.url().slice(0,200)}`)});
await p.goto(URL,{waitUntil:'networkidle'});
await p.waitForTimeout(3000);
await p.screenshot({path:`${OUT}/00-overview-full.png`,fullPage:true});
fs.writeFileSync(`${OUT}/00-overview.txt`, await p.evaluate(()=>document.body.innerText));
const btns=await p.evaluate(()=>[...document.querySelectorAll('button,a,[role=tab]')].map(e=>`${e.tagName}|${(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ')}|${e.getAttribute('href')||''}`).filter(s=>s.length>3));
fs.writeFileSync(`${OUT}/00-controls.txt`, btns.join('\n'));
const tabs=['תנאי סף ודגלים אדומים','מרכז מסמכים','משימות ושאלות הבהרה','תיק הגשה'];
let i=1;
for(const t of tabs){
  const loc=p.getByRole('button',{name:new RegExp(t)}).first();
  try{ await loc.click({timeout:5000}); }catch(e){ log.push(`[tab-missing] ${t}: ${e.message.split('\n')[0]}`); i++; continue;}
  await p.waitForTimeout(2500);
  await p.screenshot({path:`${OUT}/0${i}-tab-full.png`,fullPage:true});
  fs.writeFileSync(`${OUT}/0${i}-tab.txt`, `URL: ${p.url()}\n`+await p.evaluate(()=>document.body.innerText));
  const c=await p.evaluate(()=>[...document.querySelectorAll('button,a,[role=tab],select,input')].map(e=>`${e.tagName}|${(e.innerText||e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').trim().replace(/\s+/g,' ')}|${e.getAttribute('href')||''}`));
  fs.writeFileSync(`${OUT}/0${i}-controls.txt`, c.join('\n'));
  i++;
}
fs.writeFileSync(`${OUT}/console-s1.txt`, log.join('\n'));
await b.close();
