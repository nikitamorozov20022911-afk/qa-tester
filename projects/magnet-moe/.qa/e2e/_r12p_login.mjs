import { chromium } from 'playwright';
const list = JSON.parse(process.argv[2]);
const b = await chromium.launch();
for (const [acc, phone] of Object.entries(list)) {
const c = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await c.newPage();
const dump = async (tag) => { console.log(acc,'['+tag+']', p.url(), '::', (await p.evaluate(()=>document.body.innerText)).slice(0,200).replace(/\n/g,' | ')); };
try {
await p.goto('https://magnet.expo.app/welcome', {waitUntil:'networkidle'}); await p.waitForTimeout(2500);
await p.getByText('התחברות', {exact:false}).last().click(); await p.waitForTimeout(2000);
await p.getByText('כניסה עם מספר טלפון').click(); await p.waitForTimeout(2500);
const inp = p.locator('input').first();
await inp.click(); await inp.fill(phone); await p.waitForTimeout(800);
await p.getByText('שליחת קוד').click(); await p.waitForTimeout(4000);
await dump('otp');
console.log('inputs', await p.locator('input').count());
await p.locator('input').last().focus();
await p.keyboard.type('123456', {delay:150});
for (let i=0;i<20;i++){ await p.waitForTimeout(1000); if(!/otp|phone|verify-code|code/.test(p.url())) break; }
await p.waitForTimeout(4000);
await dump('after');
const tok = await p.evaluate(()=>Object.keys(localStorage).filter(k=>/auth-token/.test(k)).map(k=>localStorage.getItem(k).length));
console.log(acc,'token', tok);
await p.screenshot({path:'../r12p/login-'+acc+'.png'});
if (tok.length && tok[0]>100) { await c.storageState({path:'../auth/'+acc+'-r12.json'}); console.log(acc,'SAVED'); }
} catch(e){ console.log(acc,'ERR',e.message.slice(0,200)); await p.screenshot({path:'../r12p/loginerr-'+acc+'.png'}); }
await c.close();
}
await b.close();
