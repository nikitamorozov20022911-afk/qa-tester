import { webkit, devices } from '@playwright/test';
const b=await webkit.launch(); const c=await b.newContext({...devices['iPhone 13'],locale:'he-IL'}); const p=await c.newPage();
await p.goto('https://banci.expo.app/design'); await p.waitForTimeout(4500);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.offsetParent&&['color','backgroundColor','borderTopColor'].some(k=>getComputedStyle(e)[k]==='rgb(181, 71, 8)')).map(e=>(e.innerText||e.getAttribute('aria-label')||e.tagName).trim().slice(0,50)).slice(0,8))));
await b.close();
