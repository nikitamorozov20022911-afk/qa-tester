import { chromium, devices } from 'playwright';
import http from 'http'; import fs from 'fs';
const Q='/Users/avielshnaider/magnet-moe/.qa'; const SS=Q+'/screenshots/p5n/';
const b=await chromium.launch({headless:true});
const S={}; // acc -> {ctx,p,net}
const scrub=s=>s?String(s).replace(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g,'<JWT>'):s;
async function open(acc,opts={}){
  const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width:opts.w||390,height:844},storageState:Q+'/auth/'+acc+'.json',locale:'he-IL',colorScheme:'dark',...(opts.ctx||{})});
  const p=await ctx.newPage(); const net=[];
  p.on('request',q=>{ if(/supabase\.co/.test(q.url())){ const h=q.headers(); const auth=h['authorization']||''; let tt='none'; if(auth){ try{const pl=JSON.parse(Buffer.from(auth.split(' ')[1].split('.')[1],'base64url').toString()); tt=pl.role+(pl.sub?'(sub='+pl.sub+')':'');}catch{tt='non-jwt'} }
     q._e={t:new Date().toISOString(),m:q.method(),u:q.url().replace(/https:\/\/[^/]+/,''),tok:tt,body:scrub(q.postData())?.slice(0,1500)}; net.push(q._e);} });
  p.on('response',async r=>{const e=r.request()._e; if(e){e.s=r.status(); try{e.resp=scrub((await r.text())).slice(0,2500)}catch{}}});
  p.on('requestfailed',q=>{const e=q._e; if(e) e.fail=q.failure()?.errorText;});
  p.on('console',m=>{if(m.type()==='error') net.push({console:m.text().slice(0,300),t:new Date().toISOString()})});
  S[acc]={ctx,p,net}; return 'opened '+acc;
}
async function outline(p,loc,file,full=false){ try{const el=typeof loc==='string'?p.locator(loc).first():loc; await el.evaluate(e=>{e.style.outline='3px solid red';e.style.outlineOffset='2px';});}catch(e){} await p.screenshot({path:SS+file,fullPage:full}); try{const el=typeof loc==='string'?p.locator(loc).first():loc; await el.evaluate(e=>{e.style.outline='';});}catch{} return SS+file; }
async function save(acc){ await S[acc].ctx.storageState({path:Q+'/auth/'+acc+'.json'}); fs.writeFileSync(SS+'network-'+acc+'.json',JSON.stringify(S[acc].net,null,1)); return 'saved '+acc; }
async function close(acc){ await save(acc); await S[acc].ctx.close(); delete S[acc]; return 'closed '+acc; }
const AsyncF=Object.getPrototypeOf(async function(){}).constructor;
http.createServer((req,res)=>{let d='';req.on('data',c=>d+=c);req.on('end',async()=>{
  let out; try{ const f=new AsyncF('S','open','outline','save','close','SS','fs','b',d); out=await f(S,open,outline,save,close,SS,fs,b); }catch(e){out='ERR '+e.stack?.slice(0,800)}
  res.end(typeof out==='string'?out:JSON.stringify(out,null,1));
  if(d.includes('__EXIT__')){ await b.close(); process.exit(0);} })}).listen(9477,()=>console.log('drv up'));
