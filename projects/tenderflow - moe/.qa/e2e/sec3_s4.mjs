import { chromium } from '@playwright/test';
import fs from 'fs';
const OUT='/private/tmp/claude-502/-Users-avielshnaider--claude-spares-spare-ECbffp/983ba125-cf94-4742-895f-2616df89f97c/scratchpad/sec3/site';
const T='https://tenderflow-web-staging.vercel.app/tenders/192fa4c1-6d4c-4e42-b314-96da68e5bcd3';
const b=await chromium.launch();
const note=s=>console.log(s);
for(const role of ['admin','user']){
const ctx=await b.newContext({storageState:`/Users/avielshnaider/tenderflow - moe/.qa/auth/${role}.json`,viewport:{width:1920,height:1080},locale:'he-IL'});
const p=await ctx.newPage();
p.on('console',m=>{if(m.type()==='error')note(`[${role} console.error] ${p.url()} :: ${m.text().slice(0,300)}`)});
p.on('pageerror',e=>note(`[${role} pageerror] ${e.message}`));
p.on('response',r=>{if(r.status()>=400)note(`[${role} http ${r.status()}] ${r.url().slice(0,160)}`)});
await p.goto(T+'/analysis',{waitUntil:'networkidle'});await p.waitForTimeout(2000);
if(role==='admin'){
 const side=await p.evaluate(()=>[...document.querySelectorAll('aside *, nav *')].filter(e=>/^(המכרזים שלי|מאגר מסמכים|הגדרות|תמיכה|פיד מכרזים)$/.test(e.innerText?.trim())&&e.children.length<3).map(e=>{const c=e.closest('a,button');return `${e.innerText.trim()} -> ${c?c.tagName+' '+(c.getAttribute('href')||'')+' disabled='+(c.disabled||c.getAttribute('aria-disabled')):'NOT CLICKABLE ('+e.tagName+')'}`}));
 note('sidebar: '+JSON.stringify([...new Set(side)]));
 await p.goto(T+'/analysis?tab=submission',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
 const rows=p.locator('main').getByText(/^(טפסים ממולאים|מסמכי חברה קבועים|מסמכים למכרז)$/);
 note('folder rows '+await rows.count());
 for(let i=0;i<await rows.count();i++){const t=await rows.nth(i).evaluate(e=>{const c=e.closest('button,summary,[role=button]');return c?c.tagName+' expanded='+c.getAttribute('aria-expanded'):'none'});note('row '+i+' clickable:'+t);await rows.nth(i).click().catch(()=>{});}
 await p.waitForTimeout(800);await p.screenshot({path:`${OUT}/12-submission-click-folders.png`,fullPage:true});
} else {
 for(const [tab,n] of [['','u0-overview'],['?tab=compliance','u1-compliance'],['?tab=documents','u2-docs'],['?tab=tasks','u3-tasks'],['?tab=submission','u4-submission']]){
  await p.goto(T+'/analysis'+tab,{waitUntil:'networkidle'});await p.waitForTimeout(1800);
  await p.screenshot({path:`${OUT}/${n}.png`,fullPage:true});
  fs.writeFileSync(`${OUT}/${n}.txt`,`URL ${p.url()}\n`+await p.evaluate(()=>document.querySelector('main')?.innerText||document.body.innerText));
 }
}
await ctx.close();}
await b.close();
