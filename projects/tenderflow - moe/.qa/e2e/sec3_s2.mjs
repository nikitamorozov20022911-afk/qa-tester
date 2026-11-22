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
await p.waitForTimeout(2500);
const info=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/תנאי סף|משימות|תיק הגשה|מרכז מסמכים|סקירה/.test(b.innerText)).map(b=>{const r=b.getBoundingClientRect();return {t:b.innerText.trim(),x:r.x,y:r.y,w:r.width,h:r.height,dis:b.disabled,role:b.getAttribute('role'),aria:b.getAttribute('aria-selected')}}));

const tabs=[['תנאי סף ודגלים אדומים','01'],['מרכז מסמכים','02'],['משימות ושאלות הבהרה','03'],['תיק הגשה','04']];
for(const [t,n] of tabs){
  const loc=p.getByRole('tab',{name:t,exact:true}).first();
  try{ await loc.click({timeout:4000}); }catch(e){ log.push(`[tab-click-fail] ${t}: ${e.message.split('\n').slice(0,8).join(' | ')}`); try{await loc.click({force:true,timeout:3000});}catch(e2){log.push('force fail '+e2.message.split('\n')[0])} }
  await p.waitForTimeout(2500);
  await p.screenshot({path:`${OUT}/${n}-tab-full.png`,fullPage:true});
  fs.writeFileSync(`${OUT}/${n}-tab.txt`, `URL: ${p.url()}\n`+await p.evaluate(()=>document.querySelector('main')?.innerText||document.body.innerText));
  const c=await p.evaluate(()=>[...document.querySelectorAll('main button,main a,main [role=tab],main select,main input')].map(e=>`${e.tagName}|${(e.innerText||e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').trim().replace(/\s+/g,' ')}|${e.getAttribute('href')||''}|vis=${!!e.offsetParent}`));
  fs.writeFileSync(`${OUT}/${n}-controls.txt`, c.join('\n'));
}
fs.writeFileSync(`${OUT}/console-s2.txt`, log.join('\n'));
await b.close();
