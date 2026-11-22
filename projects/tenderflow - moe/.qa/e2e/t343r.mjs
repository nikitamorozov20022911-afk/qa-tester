import { chromium } from '/Users/avielshnaider/tenderflow - moe/.qa/e2e/node_modules/@playwright/test/index.mjs';
const P='https://tenderflow-web-staging-obpygl1k7-aviels-projects.vercel.app';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});const p=await ctx.newPage();
await p.goto(P+'/login');await p.getByText('כניסה לסביבת ההדגמה').first().click();await p.waitForURL(u=>!/login/.test(u.pathname));await p.waitForLoadState('networkidle');
await p.goto(P+'/onboarding',{waitUntil:'networkidle'});
await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.children.length==0&&e.innerText?.trim()==='פרטי חברה');const d=document.createElement('div');d.style.cssText='position:fixed;left:240px;right:0;top:70px;height:130px;border:4px solid red;z-index:99999;pointer-events:none';document.body.appendChild(d)});
await p.screenshot({path:'/Users/avielshnaider/tenderflow - moe/.qa/screenshots/343d8d-5-profile-NO-MARKER-desktop-red.png'});
await b.close();
