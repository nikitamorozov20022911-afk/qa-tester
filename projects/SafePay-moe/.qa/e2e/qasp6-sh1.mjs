import { newBrowser, ctx, go, txt, shot, sleep, redBox } from './qasp6-lib.mjs';
const D='6a86f7b6/';
const b = await newBrowser();
const { p } = await ctx(b, 'client', 375);
const log=(...a)=>console.log(...a);
await go(p, '/wallet/shared/new');
const btn = p.getByRole('button',{name:'אישור ופתיחת ארנק'});
log('create disabled initially:', await btn.isDisabled());
await shot(p, D+'r1-01-form-empty-375');
async function addPhone(num){
  await p.getByRole('button',{name:'הזמנה מאנשי הקשר'}).click(); await sleep(1200);
  const tb=p.getByRole('textbox',{name:'מספר הטלפון של המשתתף'});
  await tb.fill(num); await sleep(400);
  const add=p.getByRole('button',{name:'הוספה'});
  log(`[${num}] add disabled:`, await add.isDisabled());
  if(!(await add.isDisabled())){ await add.click(); await sleep(2500);} 
  const t=await txt(p); log(`[${num}] after:`, t.replace(/\n/g,' | ').slice(0,400));
  return t;
}
async function back(){ if(await p.getByRole('textbox',{name:'מספר הטלפון של המשתתף'}).isVisible().catch(()=>false)){ await p.getByRole('button',{name:'חזרה'}).first().click(); await sleep(1200);} }
let t=await addPhone('123'); await shot(p, D+'r1-02-invalid-123-375');
await back();
t=await addPhone('0509999999'); await shot(p, D+'r1-03-unregistered-375');
await back();
t=await addPhone('0500000004'); await shot(p, D+'r1-04-own-375');
await back();
t=await addPhone('050-0000005'); await shot(p, D+'r1-05-added-05-375', true);
t=await addPhone('0500000005'); await shot(p, D+'r1-06-dup-05-375');
await back();
log('URL', p.url());
log(await p.locator('body').ariaSnapshot());
await b.close();
