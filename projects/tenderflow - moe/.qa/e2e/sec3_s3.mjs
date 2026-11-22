import { chromium } from '@playwright/test';
import fs from 'fs';
const OUT='/private/tmp/claude-502/-Users-avielshnaider--claude-spares-spare-ECbffp/983ba125-cf94-4742-895f-2616df89f97c/scratchpad/sec3/site';
const T='https://tenderflow-web-staging.vercel.app/tenders/192fa4c1-6d4c-4e42-b314-96da68e5bcd3';
const b=await chromium.launch();
const ctx=await b.newContext({storageState:'/Users/avielshnaider/tenderflow - moe/.qa/auth/admin.json',viewport:{width:1920,height:1080},locale:'he-IL'});
const p=await ctx.newPage();
const log=[];const note=s=>{log.push(s);console.log(s)};
p.on('console',m=>{if(['error','warning'].includes(m.type()))note(`[console.${m.type()}] ${p.url()} :: ${m.text().slice(0,300)}`)});
p.on('pageerror',e=>note(`[pageerror] ${p.url()} :: ${e.message}`));
p.on('response',r=>{if(r.status()>=400)note(`[http ${r.status()}] ${r.request().method()} ${r.url().slice(0,200)}`)});
p.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))note(`[req ${r.method()}] ${r.url().slice(0,200)}`)});
const shot=async n=>{await p.screenshot({path:`${OUT}/${n}.png`});};
// overview shortcuts
await p.goto(T+'/analysis',{waitUntil:'networkidle'});await p.waitForTimeout(2000);
note('copilot elements: '+await p.locator('text=/Copilot|קופיילוט|צ׳אט|צ\'אט/i').count());
await p.getByRole('button',{name:'טיוטת שאלות הבהרה',exact:true}).click();await p.waitForTimeout(1500);
note('after shortcut טיוטת שאלות הבהרה url='+p.url()+' selectedTab='+await p.locator('[role=tab][aria-selected=true]').innerText());
await p.goto(T+'/analysis',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
await p.locator('main').getByRole('button',{name:'מרכז מסמכים',exact:true}).last().click();await p.waitForTimeout(1500);
note('after shortcut מרכז מסמכים url='+p.url()+' selectedTab='+await p.locator('[role=tab][aria-selected=true]').innerText());
// deadline chip
const chip=p.getByText('מועד הגשה לא צוין').first(); note('deadline chip tag='+await chip.evaluate(e=>e.closest('button,a')?.tagName||e.tagName));
// documents tab
await p.goto(T+'/analysis?tab=documents',{waitUntil:'networkidle'});await p.waitForTimeout(2000);
const chk=p.getByRole('button',{name:'בדוק עדכונים כעת'});
note('check-updates disabled='+await chk.isDisabled()+' aria-disabled='+await chk.getAttribute('aria-disabled')+' title='+await chk.getAttribute('title'));
if(!(await chk.isDisabled())){await chk.click();await p.waitForTimeout(3000);await shot('10-docs-after-check-updates');note('after check text: '+(await p.locator('main').innerText()).slice(-400));}
// official doc button/eye
const docBtn=p.getByRole('button',{name:/מכרז פומבי 14-2026/}).first();
const pagesBefore=ctx.pages().length;
await docBtn.click();await p.waitForTimeout(3000);
note('after doc click url='+p.url()+' pages='+ctx.pages().length+' (before '+pagesBefore+')');
await shot('11-docs-official-doc-click');
const dlg=await p.locator('[role=dialog]').count(); note('dialogs open='+dlg);
if(dlg){fs.writeFileSync(`${OUT}/11-dialog.txt`,await p.locator('[role=dialog]').first().innerText());}
if(ctx.pages().length>pagesBefore){const np=ctx.pages().at(-1);await np.waitForTimeout(3000);note('new tab url='+np.url());await np.screenshot({path:`${OUT}/11b-newtab.png`});await np.close();}
await p.keyboard.press('Escape');await p.waitForTimeout(800);
// eye icon
const eye=p.locator('main button[aria-label], main a[aria-label]');
note('aria-labeled controls in main: '+JSON.stringify(await eye.evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')))));
// submission tab expand
await p.goto(T+'/analysis?tab=submission',{waitUntil:'networkidle'});await p.waitForTimeout(2000);
const folders=p.locator('main [aria-expanded]');note('expandable count='+await folders.count());
for(let i=0;i<await folders.count();i++){await folders.nth(i).click().catch(e=>note('expand fail '+e.message.split('\n')[0]));}
await p.waitForTimeout(1000);await p.screenshot({path:`${OUT}/12-submission-expanded.png`,fullPage:true});
note('ZIP/binder controls: '+await p.locator('text=/ZIP|צפה בתיק|הפק תיק/').count());
// forms review
await p.goto(T+'/forms/review',{waitUntil:'networkidle'});await p.waitForTimeout(2500);
await p.screenshot({path:`${OUT}/13-forms-review.png`,fullPage:true});
fs.writeFileSync(`${OUT}/13-forms-review.txt`,await p.evaluate(()=>document.body.innerText));
// my tenders list
await p.goto('https://tenderflow-web-staging.vercel.app/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
await p.getByRole('link',{name:'המכרזים שלי'}).first().click().catch(e=>note('my tenders link fail'));
await p.waitForTimeout(2500);note('my tenders url='+p.url());
await p.screenshot({path:`${OUT}/14-my-tenders.png`,fullPage:true});
const links=await p.evaluate(()=>[...new Set([...document.querySelectorAll('a[href*="/tenders/"]')].map(a=>a.getAttribute('href')))]);
note('tender links: '+JSON.stringify(links));
fs.writeFileSync(`${OUT}/console-s3.txt`,log.join('\n'));
await b.close();
