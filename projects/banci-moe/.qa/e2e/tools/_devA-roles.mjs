import { chromium } from '@playwright/test';
const SS='/Users/avielshnaider/banci-moe/.qa/screenshots/recheck/';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA',{headless:true,locale:'he-IL',viewport:{width:430,height:900}});
const p=ctx.pages()[0]||await ctx.newPage(); await p.goto('https://banci.expo.app/account/devices'); await p.waitForTimeout(6000);
console.log('devices:', (await p.innerText('body')).replace(/\n/g,' | ').slice(0,300));
await p.getByRole('button',{name:/iPhone/}).first().click(); await p.waitForTimeout(2500);
const sheet=async()=>p.evaluate(()=>{const d=[...document.querySelectorAll('[role=dialog],[aria-modal=true]')].pop(); return d?d.innerText.replace(/\n/g,' | '):'(none)'});
console.log('primary->iPhone sheet:', await sheet()); console.log('radios:', JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[role=radio]')].map(r=>r.innerText.trim()+':'+r.getAttribute('aria-checked')+':'+(r.getAttribute('aria-disabled')||'enabled')))));
await p.screenshot({path:SS+'ec8ab82d-mac-primary-iphone-sheet.png'});
const rm=p.getByRole('button',{name:/הסרת הטלפון/}); if(await rm.count()){ await rm.last().click(); await p.waitForTimeout(2000); console.log('remove confirm:', await sheet()); await p.screenshot({path:SS+'ec8ab82d-mac-remove-confirm.png'}); await p.getByRole('button',{name:'ביטול',exact:true}).last().click(); await p.waitForTimeout(1500); }
await p.goto('https://banci.expo.app/account/devices'); await p.waitForTimeout(5000); console.log('after cancel:', (await p.innerText('body')).replace(/\n/g,' | ').slice(0,220));
await ctx.close();
