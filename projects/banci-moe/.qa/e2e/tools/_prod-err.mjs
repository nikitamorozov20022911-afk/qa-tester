import { chromium } from '@playwright/test';
const SS='/Users/avielshnaider/banci-moe/.qa/screenshots/recheck/';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA',{headless:true,locale:'he-IL',viewport:{width:390,height:844}});
const p=ctx.pages()[0]||await ctx.newPage();
await p.goto('https://banci.expo.app/products'); await p.waitForTimeout(6000);
await p.route(/supabase\.co\/rest\/v1\/products/, r=>r.abort());
await p.getByText('גלגל ים עם מושב').first().click(); const t0=Date.now();
for(let i=0;i<9;i++){ await p.waitForTimeout(10000); const t=(await p.innerText('body')).replace(/\n/g,' | ').slice(0,140); console.log(Math.round((Date.now()-t0)/1000)+'s', p.url().replace('https://banci.expo.app',''), '::', t); if(/לא הצלחנו|נסו שוב|שגיאה|השתבש/.test(t)) break; }
await p.screenshot({path:SS+'c48aff34-error-long.png'});
await p.unrouteAll({behavior:'ignoreErrors'}); await p.getByRole('button',{name:'נסו שוב'}).click(); await p.waitForTimeout(6000); console.log('after retry:', (await p.innerText('body')).replace(/\n/g,' | ').slice(0,160));
await ctx.close();
