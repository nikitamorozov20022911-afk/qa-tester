import { chromium } from '/Users/avielshnaider/tenderflow - moe/.qa/e2e/node_modules/@playwright/test/index.mjs';
const P='https://tenderflow-web-staging-obpygl1k7-aviels-projects.vercel.app';
const S='/Users/avielshnaider/tenderflow - moe/.qa/screenshots/343d8d-';
const [dev,w,h]=process.argv[2]==='m'?['mobile',390,844]:['desktop',1440,900];
const L=(...a)=>console.log(dev,...a);
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:w,height:h},serviceWorkers:'block'});
const p=await ctx.newPage(); const cons=[];
p.on('console',m=>{if(['error','warning'].includes(m.type()))cons.push(m.type()+': '+m.text().slice(0,200)+' @'+p.url().slice(-40))});
p.on('pageerror',e=>cons.push('pageerror: '+e.message));
p.on('response',r=>{if(r.status()>=400)cons.push('HTTP '+r.status()+' '+r.url().slice(0,120))});
const info=async()=>{for(let k=0;k<4;k++){try{return await info0()}catch(e){await p.waitForLoadState('networkidle')}}};
const info0=async()=>p.evaluate(()=>{const html=document.documentElement.outerHTML;return{il:/Tenderflow\s*IL/i.test(document.body.innerText+document.title+html),demo:/נתוני הדגמה/.test(document.body.innerText),title:document.title,sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bsw:document.body.scrollWidth}});
const shot=(n)=>p.screenshot({path:S+n+'-'+dev+'.png',fullPage:true});
const login=async()=>{await p.goto(P+'/login',{waitUntil:'networkidle'});await p.getByText('כניסה לסביבת ההדגמה').first().click();await p.waitForURL(u=>!/login/.test(u.pathname));await p.waitForFunction(()=>/חיפוש מכרזים/.test(document.body.innerText));await p.waitForLoadState('networkidle');};
const feedSnap=async()=>p.evaluate(()=>({titles:[...document.querySelectorAll('a[href*="/tenders/"]')].map(a=>a.innerText.trim()).filter(t=>t.length>12&&!/התחל/.test(t)).map(t=>t.slice(0,50)),deadlines:[...document.body.innerText.matchAll(/מועד הגשה\n([^\n]+)/g)].map(m=>m[1]),tabs:[...document.querySelectorAll('button')].map(x=>x.innerText.replace(/\n/g,' ')).filter(t=>/\d$/.test(t)).slice(0,6)}));
await login();
L('FEED',JSON.stringify(await info()));
const f1=await feedSnap();L('FEEDSNAP',JSON.stringify(f1));
await shot('3-feed');
// tabs
const ids=await p.$$eval('a[href*="/analysis"]',a=>[...new Set(a.map(x=>x.getAttribute('href')))]);
L('IDS',ids.length);
const tabNames=['סקירה ומועדים','תנאי סף ודגלים אדומים','מרכז מסמכים','משימות ושאלות הבהרה','תיק הגשה'];
for(const [i,href] of ids.entries()){
  await p.goto(P+href,{waitUntil:'networkidle'});
  const res=[];
  for(const [j,t] of tabNames.entries()){
    await p.getByRole('tab',{name:t}).or(p.getByRole('button',{name:t,exact:true})).or(p.getByText(t,{exact:true})).first().click().catch(e=>res.push('CLICKFAIL '+t));
    await p.waitForLoadState('networkidle');
    const x=await info();res.push(`${j+1}:${x.demo?'M':'-'}${x.il?'IL!':''}${x.sw>x.cw?'HS':''}`);
    if(i===0||!x.demo) await shot(`5-tender${i+1}-tab${j+1}`);
  }
  L('TENDER',i+1,href.split('/')[2].slice(-3),'url',p.url().split('/').slice(-1)[0],res.join(' '));
}
// profile
await p.goto(P+'/onboarding',{waitUntil:'networkidle'});
let x=await info();L('PROFILE',p.url(),JSON.stringify(x));L('PROFILETEXT',(await p.innerText('body')).replace(/\n+/g,' | ').slice(0,700));await shot('5-profile');
const prof1=(await p.innerText('body'));
// other pages
for(const u of ['/users','/vault','/settings']){await p.goto(P+u,{waitUntil:'networkidle'});const y=await info();L('PAGE',u,p.url().slice(-25),JSON.stringify(y));}
// persistence: reload
await p.goto(P+'/',{waitUntil:'networkidle'});await p.reload({waitUntil:'networkidle'});
const f2=await feedSnap();L('AFTER-RELOAD same feed',JSON.stringify(f2)===JSON.stringify(f1),f2.titles.length);
await shot('4-after-reload');
// sign out
await p.goto(P+'/',{waitUntil:'networkidle'});
L('LOGOUT cands',JSON.stringify(await p.$$eval('button,a',a=>a.map(x=>x.innerText.trim()+'|'+(x.getAttribute('aria-label')||'')).filter(t=>/יציאה|התנתק|logout|sign/i.test(t)))));
await b.close();
console.log(dev,'CONSOLE',JSON.stringify(cons));
