import { chromium, devices } from '@playwright/test';
const b=await chromium.launch(); const c=await b.newContext({...devices['iPhone 13'], storageState:'/Users/avielshnaider/banci-moe/.qa/auth/user.json', locale:'he-IL'}); const p=await c.newPage();
await p.goto('https://banci.expo.app/monitor/live'); await p.waitForTimeout(6000);
console.log('url', p.url(), '::', (await p.innerText('body')).replace(/\n/g,' | ').slice(0,200));
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[role=button]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.innerText.trim()).slice(0,30)))));
await b.close();
