import { chromium } from '/Users/avielshnaider/tenderflow - moe/.qa/e2e/node_modules/@playwright/test/index.mjs';
const P='https://tenderflow-web-staging-obpygl1k7-aviels-projects.vercel.app';
const S='/Users/avielshnaider/tenderflow - moe/.qa/screenshots/343d8d-';
const b=await chromium.launch();
for(const [dev,w,h] of [['desktop',1440,900],['mobile',390,844]]){
const ctx=await b.newContext({viewport:{width:w,height:h},serviceWorkers:'block'});const p=await ctx.newPage();
await p.goto(P+'/login');await p.getByText('כניסה לסביבת ההדגמה').first().click();await p.waitForURL(u=>!/login/.test(u.pathname));await p.waitForLoadState('networkidle');
await p.goto(P+'/onboarding',{waitUntil:'networkidle'});
for(const t of ['פרטי חברה','מידע להתאמת מכרזים','גורמים מקצועיים קבועים','מסמכים קבועים']){
 await p.getByText(t,{exact:false}).first().click().catch(()=>console.log('noclick',t));await p.waitForLoadState('networkidle');
 const r=await p.evaluate(()=>{const t=document.body.innerText;return{marker:/נתוני הדגמה/.test(t),anyDemo:(t.match(/[^\n]*הדגמה[^\n]*/g)||[]).slice(0,5),il:/Tenderflow\s*IL/i.test(document.documentElement.outerHTML),sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}});
 console.log(dev,t,JSON.stringify(r));
 await p.screenshot({path:S+`5-profile-${t.slice(0,6).replace(/ /g,'_')}-${dev}.png`,fullPage:true});
}
await ctx.close();}
await b.close();
