import { chromium, webkit, devices } from 'playwright';
import fs from 'fs';
const URL='https://kfir-dadon.vercel.app/c/qerrEV6IRRuCB_rH7Nt_69ZFGUrNHZG0TStZKd5FPP4';
const which=process.argv[2]||'chromium'; const run=process.argv[3]||'1'; const mode=process.argv[4]||'measure';
const OUT='/Users/avielshnaider/kfirdadon-moe/.qa/screenshots/2026-10-21';
const browser = which==='webkit'? await webkit.launch(): await chromium.launch();
const ctxOpts = which==='webkit'? {...devices['iPhone 13'], viewport:{width:390,height:844}} : {viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true, userAgent: devices['Pixel 7'].userAgent};
const ctx = await browser.newContext({...ctxOpts, locale:'he-IL'});
const aborted=[];
await ctx.route('**/*', r=>{const q=r.request(); if(q.method()!=='GET' && !/candidate_open_link/.test(q.url()+ (q.postData()||''))){aborted.push(q.method()+' '+q.url()); return r.abort();} return r.continue();});
await ctx.addInitScript(()=>{ try{ Object.defineProperty(Navigator.prototype,'mediaDevices',{get:()=>undefined,configurable:true}); }catch(e){} try{ delete navigator.mediaDevices; }catch(e){} });
const page = await ctx.newPage();
await page.goto(URL,{waitUntil:'domcontentloaded'});
if(mode==='explore'){ await page.waitForLoadState('networkidle').catch(()=>{}); await page.screenshot({path:'/private/tmp/claude-502/-Users-avielshnaider-kfirdadon-moe/116138fc-f595-4acc-938d-fb4bd4b55947/scratchpad/v/explore.png'}); console.log(await page.evaluate(()=>document.body.innerText)); console.log('mediaDevices', await page.evaluate(()=>String(navigator.mediaDevices))); console.log(aborted); await browser.close(); process.exit(0);}
const fail=page.getByText('הדפדפן הזה לא מאפשר שימוש במיקרופון').first();
await fail.waitFor({timeout:30000}).catch(async()=>{ /* maybe need click start */ });
const failVisible = await fail.isVisible().catch(()=>false);
await page.getByRole('button',{name:'פנייה לגורם אנושי',exact:true}).last().click();
await page.getByText('צריכים עזרה?').first().waitFor();
await page.waitForTimeout(0);
await page.evaluate(()=>document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}}));
const data = await page.evaluate(()=>{
  const r=e=>{const b=e.getBoundingClientRect();return {x:+b.x.toFixed(1),y:+b.y.toFixed(1),w:+b.width.toFixed(1),h:+b.height.toFixed(1)}};
  const all=[...document.querySelectorAll('button,a,[role=radio],[role=tab],label,span,div,p')];
  const chipTexts=['תקלה טכנית','בקשת התאמה','צורך נגישות'];
  const chips=chipTexts.map(t=>{const el=all.filter(e=>e.textContent.trim()===t).sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0]; if(!el) return {t,missing:true}; const cs=getComputedStyle(el); return {t,tag:el.tagName,...r(el),minH:cs.minHeight,pad:cs.padding}});
  const mail=[...document.querySelectorAll('a')].find(a=>/mailto:/.test(a.href));
  const tel=[...document.querySelectorAll('a')].find(a=>/tel:/.test(a.href));
  const info=el=>{ if(!el) return null; const cs=getComputedStyle(el); const rg=document.createRange(); rg.selectNodeContents(el); const tb=rg.getBoundingClientRect(); return {text:el.textContent.trim(),href:el.getAttribute('href'),box:r(el),textBox:{x:+tb.x.toFixed(1),w:+tb.width.toFixed(1),y:+tb.y.toFixed(1),h:+tb.height.toFixed(1)},display:cs.display,padding:cs.padding,margin:cs.margin}};
  const parent = mail&&mail.parentElement; const pcs=parent&&getComputedStyle(parent);
  return {chips, mail:info(mail), tel:info(tel), parent: parent?{tag:parent.tagName,cls:parent.className,display:pcs.display,gap:pcs.gap,columnGap:pcs.columnGap,box:r(parent),text:parent.innerText}:null, innerW:innerWidth, ua:navigator.userAgent.slice(0,60)};
});
const m=data.mail,t=data.tel;
if(m&&t){ const L=m.textBox.x<t.textBox.x?m:t, R=L===m?t:m; data.textGap=+(R.textBox.x-(L.textBox.x+L.textBox.w)).toFixed(1); data.boxGap=+(R.box.x-(L.box.x+L.box.w)).toFixed(1);}
data.failVisible=failVisible; data.aborted=aborted;
console.log(JSON.stringify(data,null,1));
// annotate
await page.evaluate(({chips,mail,tel})=>{const mk=(b,c)=>{const d=document.createElement('div');d.className='qa-ann';Object.assign(d.style,{position:'fixed',left:b.x-2+'px',top:b.y-2+'px',width:b.w+4+'px',height:b.h+4+'px',border:'2px solid red',zIndex:2147483647,pointerEvents:'none'});const host=document.querySelector('dialog[open]')||document.body;host.appendChild(d);const g=d.getBoundingClientRect();d.style.left=(b.x-2)-(g.x-(b.x-2))+'px';d.style.top=(b.y-2)-(g.y-(b.y-2))+'px';}; chips.forEach(c=>!c.missing&&mk(c)); if(mail&&tel){const xs=[mail.box,tel.box];const x=Math.min(...xs.map(b=>b.x)),y=Math.min(...xs.map(b=>b.y)),x2=Math.max(...xs.map(b=>b.x+b.w)),y2=Math.max(...xs.map(b=>b.y+b.h));mk({x,y,w:x2-x,h:y2-y});}},data);
await page.screenshot({path:`${OUT}/f7124a-v-${which}-r${run}.png`});
const cl=Math.max(0,Math.min(m.box.y,t.box.y)-20);
await page.screenshot({path:`${OUT}/f7124a-v-${which}-r${run}-contacts-crop.png`,clip:{x:0,y:cl,width:390,height:Math.min(80,844-cl)}});
await browser.close();
