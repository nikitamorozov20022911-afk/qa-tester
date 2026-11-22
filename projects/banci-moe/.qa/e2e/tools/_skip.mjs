import { webkit, devices } from '@playwright/test';
const b = await webkit.launch(); const ctx = await b.newContext({ ...devices['iPhone 13'], locale: 'he-IL' }); const p = await ctx.newPage();
for (const u of ['/onboarding','/intro','/welcome/intro','/onboarding/intro']) { await p.goto('https://banci.expo.app'+u); await p.waitForTimeout(4000);
 const r=await p.evaluate(()=>[...document.querySelectorAll('[role=button],a,button')].filter(e=>e.offsetParent&&/דילוג/.test(e.innerText)).map(e=>{const r=e.getBoundingClientRect();return Math.round(r.width)+'×'+Math.round(r.height)}));
 console.log(u, p.url(), r, (await p.innerText('body')).slice(0,80).replace(/\n/g,' | ')); }
await b.close();
