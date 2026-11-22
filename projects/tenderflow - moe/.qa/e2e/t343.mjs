import { chromium } from '/Users/avielshnaider/tenderflow - moe/.qa/e2e/node_modules/@playwright/test/index.mjs';
const P='https://tenderflow-web-staging-obpygl1k7-aviels-projects.vercel.app';
const S='/Users/avielshnaider/tenderflow - moe/.qa/screenshots/343d8d-';
const out=[];const log=(...a)=>{console.log(...a)};
const b=await chromium.launch();
for(const [dev,w,h] of [['desktop',1440,900],['mobile',390,844]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},serviceWorkers:'block'});
  const p=await ctx.newPage(); const cons=[];
  p.on('console',m=>{if(['error','warning'].includes(m.type()))cons.push(m.type()+': '+m.text().slice(0,200))});
  p.on('pageerror',e=>cons.push('pageerror: '+e.message));
  const chk=async(name)=>{const t=await p.evaluate(()=>({url:location.href,title:document.title,il:/Tenderflow IL/i.test(document.body.innerText+document.title),taqo:/TAQO/.test(document.body.innerText),demo:(document.body.innerText.match(/נתוני הדגמה|הדגמה/g)||[]).length,sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));log(dev,name,JSON.stringify(t));return t};
  await p.goto(P,{waitUntil:'networkidle'}); await chk('root');
  await p.goto(P+'/login',{waitUntil:'networkidle'}); await chk('login');
  log(dev,'LOGINTEXT',(await p.innerText('body')).replace(/\n+/g,' | ').slice(0,600));
  await p.screenshot({path:S+'2-login-'+dev+'.png',fullPage:true});
  await p.getByText('כניסה לסביבת ההדגמה').first().click();
  await p.waitForFunction(()=>/אופק מערכות/.test(document.body.innerText),null,{timeout:20000}).catch(()=>{log('NO אופק')});
  await p.waitForLoadState('networkidle'); await chk('feed');
  log(dev,'FEEDTEXT',(await p.innerText('body')).replace(/\n+/g,' | ').slice(0,1500));
  await p.screenshot({path:S+'3-feed-'+dev+'.png',fullPage:true});
  log(dev,'CONSOLE',JSON.stringify(cons));
  await ctx.storageState({path:`/private/tmp/claude-502/st-${dev}.json`});
  await ctx.close();
}
await b.close();
