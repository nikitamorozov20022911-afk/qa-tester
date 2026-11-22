import { chromium } from '@playwright/test';
const SS='/Users/avielshnaider/banci-moe/.qa/screenshots/recheck/';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA',{headless:true,locale:'he-IL',viewport:{width:390,height:844}});
const p=ctx.pages()[0]||await ctx.newPage(); await p.goto('https://banci.expo.app/home'); await p.waitForTimeout(5000);
await p.route(/supabase\.co\/rest\/v1\/(devices|subscriptions|profiles)/, async r=>{ await new Promise(x=>setTimeout(x,4000)); try{await r.continue();}catch{} });
await p.getByRole('button',{name:/התחלת ניטור/}).first().click();
for(let i=0;i<12;i++){ if(i===3) await p.screenshot({path:SS+'64586270-mac-slow-network-false-subscription.png'}); await p.waitForTimeout(300); const t=(await p.innerText('body')).replace(/\n/g,' | '); if(/בודקים…|בודקים\.\.\./.test(t)){ console.log('LOADING at', (i+1)*300,'ms ::', t.slice(0,300)); await p.screenshot({path:SS+'64586270-mac-07.1-running.png'}); break; } if(i===11) console.log('no loading seen ::', t.slice(0,200)); }
await p.waitForTimeout(6000); console.log('after:', (await p.innerText('body')).replace(/\n/g,' | ').slice(0,200));
await ctx.close();
