import { webkit, devices } from '@playwright/test';
const b=await webkit.launch(); const c=await b.newContext({...devices['iPhone 13'],locale:'he-IL'}); const p=await c.newPage();
await p.goto('https://banci.expo.app/'); await p.waitForTimeout(5000); console.log('root ->', p.url(), (await p.innerText('body')).replace(/\n/g,' | ').slice(0,120));
for (const [btn,u] of [['כניסה','/sign-in'],['יצירת חשבון','/sign-up']]) { await p.goto('https://banci.expo.app/welcome'); await p.waitForTimeout(3000); await p.getByRole('button',{name:btn,exact:true}).last().click(); await p.waitForTimeout(2500);
 const back=await p.locator('[aria-label="חזרה"]').count(); console.log(btn,'->',p.url(),'back:',back); if(back){ await p.locator('[aria-label="חזרה"]').first().click(); await p.waitForTimeout(2000); console.log('  after back ->',p.url()); } }
await p.goto('https://banci.expo.app/home'); await p.waitForTimeout(4000); console.log('guest /home ->', p.url());
console.log('html', await p.evaluate(()=>document.documentElement.lang+' '+document.documentElement.dir));
await b.close();
