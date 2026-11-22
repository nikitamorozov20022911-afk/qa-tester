import { chromium } from '@playwright/test';
const SS='/Users/avielshnaider/banci-moe/.qa/screenshots/recheck/';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA',{headless:true,locale:'he-IL',viewport:{width:390,height:844}});
const p=ctx.pages()[0]||await ctx.newPage(); const U='https://banci.expo.app/products/4a5e2065-de56-4d5e-82d4-3de290e877a1';
// loading: delay supabase rest
await p.route(/rest\/v1\/(products|suppliers)/, async r=>{ await new Promise(x=>setTimeout(x,6000)); try{ await r.continue(); }catch{} });
await p.goto(U); await p.waitForTimeout(2500); await p.screenshot({path:SS+'c48aff34-loading.png'});
console.log('loading:', JSON.stringify(await p.evaluate(()=>({txt:document.body.innerText.slice(0,120), btns:[...document.querySelectorAll('[role=button]')].map(b=>(b.innerText.trim()||b.getAttribute('aria-label'))+':'+(b.getAttribute('aria-disabled')||'en'))}))));
await p.unrouteAll({behavior:'ignoreErrors'});
await p.route(/rest\/v1\/(products|suppliers)/, r=>r.abort());
await p.goto(U); await p.waitForTimeout(15000); await p.screenshot({path:SS+'c48aff34-error.png'});
console.log('error:', (await p.innerText('body')).replace(/\n/g,' | ').slice(0,200));
await p.unrouteAll({behavior:'ignoreErrors'});
const retry=p.getByRole('button',{name:'נסו שוב'}); if(await retry.count()){ await retry.click(); await p.waitForTimeout(5000); console.log('after retry:', (await p.innerText('body')).replace(/\n/g,' | ').slice(0,120)); }
await p.goto(U); await p.waitForTimeout(5000); await p.screenshot({path:SS+'c48aff34-product-390.png'});
const back=p.locator('[aria-label="חזרה"]').first(); await back.click(); await p.waitForTimeout(3000); console.log('back ->', p.url());
await ctx.close();
