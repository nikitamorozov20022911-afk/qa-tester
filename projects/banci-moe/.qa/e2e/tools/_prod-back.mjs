import { chromium } from '@playwright/test';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA',{headless:true,locale:'he-IL',viewport:{width:390,height:844}});
const p=ctx.pages()[0]||await ctx.newPage(); let prod=null;
p.on('response', async r=>{ if(/rest\/v1\/products/.test(r.url())) { try{ const j=await r.json(); prod=Array.isArray(j)?j:[j]; }catch{} }});
await p.goto('https://banci.expo.app/products'); await p.waitForTimeout(6000);
console.log('products:', prod && prod.map(x=>x.name+' img='+(x.image_url||x.image_path||x.photo_url||'none')).join(' ; '));
await p.getByText('כובע שמש לבריכה').first().click(); await p.waitForTimeout(4000); console.log('opened', p.url());
await p.locator('[aria-label="חזרה"]:visible').last().click(); await p.waitForTimeout(3000); console.log('back ->', p.url());
await ctx.close();
