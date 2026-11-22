import { chromium } from '/Users/avielshnaider/tenderflow - moe/.qa/e2e/node_modules/@playwright/test/index.mjs';
const M='https://tenderflow-web-staging.vercel.app';
const S='/Users/avielshnaider/tenderflow - moe/.qa/screenshots/343d8d-';
const b=await chromium.launch();
for(const [dev,w,h] of [['desktop',1440,900],['mobile',390,844]]){
 const ctx=await b.newContext({viewport:{width:w,height:h},serviceWorkers:'block'});const p=await ctx.newPage();const cons=[];
 p.on('console',m=>{if(['error','warning'].includes(m.type()))cons.push(m.text().slice(0,150))});
 await p.goto(M+'/login',{waitUntil:'networkidle'});
 const r=await p.evaluate(()=>({title:document.title,il:/Tenderflow\s*IL/i.test(document.body.innerText+document.documentElement.outerHTML),taqo:/TAQO/.test(document.body.innerText),demoBtn:/כניסה לסביבת ההדגמה/.test(document.body.innerText),demoText:/הדגמה/.test(document.body.innerText),sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bundle:[...document.scripts].map(s=>s.src.split('/').pop()).join(',')}));
 console.log(dev,JSON.stringify(r),JSON.stringify(cons));
 console.log(dev,(await p.innerText('body')).replace(/\n+/g,' | ').slice(0,400));
 await p.screenshot({path:S+'8-staging-login-'+dev+'.png',fullPage:true});
 await ctx.close();}
await b.close();
