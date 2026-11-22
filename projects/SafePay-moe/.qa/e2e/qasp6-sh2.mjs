import { newBrowser, ctx, go, txt, shot, sleep, redBox } from './qasp6-lib.mjs';
const D='6a86f7b6/';
const b = await newBrowser();
const { p } = await ctx(b, 'client', 375);
const log=(...a)=>console.log(...a);
await go(p, '/wallet');
log('BAL before', (await txt(p)).match(/היתרה שלך\n(₪[\d,.]+)/)?.[1]);
await go(p, '/wallet/shared/new');
// trash on self row
await p.getByRole('button',{name:'הסרת יונתן לוי'}).click(); await sleep(1500);
log('after self-trash:', (await txt(p)).replace(/\n/g,' | ').slice(0,400));
await shot(p, D+'r1-07-self-trash-375');
// close any dialog
await p.keyboard.press('Escape'); await sleep(500);
await p.getByRole('button',{name:'הזמנה מאנשי הקשר'}).click(); await sleep(1000);
await p.getByRole('textbox',{name:'מספר הטלפון של המשתתף'}).fill('0500000005'); await sleep(2500);
await p.getByRole('button',{name:'הוספה'}).click(); await sleep(1500);
const sw=p.getByRole('switch',{name:'הרשאת כרטיס — שירה כהן'});
await sw.click(); await sleep(800);
log('after toggle off:', (await txt(p)).replace(/\n/g,' | ').slice(0,400), 'checked=', await sw.isChecked());
await shot(p, D+'r1-08-toggle-off-375');
await sw.click(); await sleep(800); log('toggle back checked=', await sw.isChecked());
// remove 05 row via trash
await p.getByRole('button',{name:'הסרת שירה כהן'}).click(); await sleep(1500);
log('after 05 trash:', (await txt(p)).replace(/\n/g,' | ').slice(0,400));
await shot(p, D+'r1-09-trash-05-375');
if ((await txt(p)).includes('שירה כהן')) { log('row still there — maybe dialog'); }
await p.keyboard.press('Escape'); await sleep(500);
// whitespace name
await p.getByRole('textbox',{name:'שם הארנק'}).fill('   '); await sleep(500);
log('ws name -> create disabled:', await p.getByRole('button',{name:'אישור ופתיחת ארנק'}).isDisabled());
log(await p.locator('body').ariaSnapshot());
await b.close();
