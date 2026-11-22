import { chromium } from '@playwright/test';
const SS='/Users/avielshnaider/banci-moe/.qa/screenshots/recheck/';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA',{headless:true,locale:'he-IL',viewport:{width:390,height:844}});
const p=ctx.pages()[0]||await ctx.newPage(); await p.goto('https://banci.expo.app/home'); 
const t0=Date.now(); let got=false;
while(Date.now()-t0<150000){ await p.waitForTimeout(700); const t=await p.innerText('body').catch(()=>''); if(/ראיתי, אני בדרך/.test(t)){ got=true; console.log('RECEIVER ALERT at', new Date().toTimeString().slice(0,8), '::', t.replace(/\n/g,' | ').slice(0,200)); break; } }
if(got){ await p.screenshot({path:SS+'50a86b6e-mac-receiver-alert.png'}); await p.getByRole('button',{name:/ראיתי, אני בדרך/}).last().click(); console.log('ACK clicked at', new Date().toTimeString().slice(0,8)); await p.waitForTimeout(4000); console.log('receiver after ack:', (await p.innerText('body')).replace(/\n/g,' | ').slice(0,200)); await p.screenshot({path:SS+'50a86b6e-mac-receiver-after-ack.png'}); }
else console.log('no alert on receiver');
await ctx.close();
