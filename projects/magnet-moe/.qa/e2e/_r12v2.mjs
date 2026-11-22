import { chromium } from 'playwright';
const A='/Users/avielshnaider/magnet-moe/.qa/auth/admin-r11.json';
const b=await chromium.launch(); const c=await b.newContext({storageState:A,viewport:{width:1440,height:900}}); const p=await c.newPage();
await p.goto('https://magnet-admin.vercel.app/verifications',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
if(!(await p.getByText('QA r10 0017').count())){console.log('NO PENDING 0017');process.exit(0);}
await p.getByRole('button',{name:'דחייה'}).first().click(); await p.waitForTimeout(1200);
await p.locator('textarea').fill('QA-AUTO r12: הפנים לא נראות בבירור, נסו שוב באור טוב'); await p.getByRole('button',{name:'דחיית האימות'}).click(); await p.waitForTimeout(3000); console.log('AFTER',(await p.evaluate(()=>document.body.innerText)).match(/ממתינים[^]*?נדחו\n\d+/)?.[0]?.replace(/\n/g,' ')); console.log('DIALOG',(await p.locator('[role=dialog]').allInnerTexts()).join('\n').slice(0,800));
const opts=p.locator('[role=dialog] button, [role=dialog] [role=radio], [role=dialog] label');
console.log('OPTS',(await opts.allInnerTexts()).join(' | '));
await p.screenshot({path:'/Users/avielshnaider/magnet-moe/.qa/screenshots/r12-d29e8b-adm-02-reject-dialog.png'});
await c.storageState({path:A}); await b.close();
