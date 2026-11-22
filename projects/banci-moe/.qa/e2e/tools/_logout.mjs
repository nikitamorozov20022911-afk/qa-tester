import { chromium } from '@playwright/test';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/empty1',{headless:true,locale:'he-IL',viewport:{width:430,height:900}});
const p=ctx.pages()[0]||await ctx.newPage(); await p.goto('https://banci.expo.app/account'); await p.waitForTimeout(6000);
console.log('acct:', (await p.innerText('body')).slice(0,80).replace(/\n/g,' | '));
await p.getByRole('button',{name:/יציאה מהחשבון/}).last().click(); await p.waitForTimeout(2500);
const dlg=await p.evaluate(()=>{const d=[...document.querySelectorAll('[role=dialog],[aria-modal=true]')].pop(); return d?d.innerText:'(no dialog) '+document.body.innerText.slice(0,200)}); console.log('after tap:', dlg.replace(/\n/g,' | '));
const b=p.getByRole('button',{name:/^יציאה/}); const n=await b.count(); if(n>1){ await b.last().click(); await p.waitForTimeout(4000);} console.log('url:', p.url(), (await p.innerText('body')).slice(0,60).replace(/\n/g,' | '));
await p.screenshot({path:'/Users/avielshnaider/banci-moe/.qa/screenshots/2026-10-07-fb3b8d53-mac-after-logout.png'}); await ctx.close();
