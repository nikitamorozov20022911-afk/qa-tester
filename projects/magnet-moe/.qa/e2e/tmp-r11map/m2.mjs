import { chromium } from 'playwright';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const [role,lat,lng]=process.argv.slice(2);
const b=await chromium.launch({headless:true});
const ctx=await b.newContext({storageState:`${Q}/auth/${role}-r11map.json`,locale:'he-IL',viewport:{width:390,height:844},geolocation:{latitude:+lat,longitude:+lng,accuracy:10},permissions:['geolocation']});
const p=await ctx.newPage();
p.on('response',async r=>{ const u=r.url(); if(/rpc\/(nearby_live|record_location)|rest\/v1\/profiles/.test(u)&&r.request().method()!=='GET'||/rpc\/nearby_live/.test(u)){ let t=''; try{t=(await r.text()).slice(0,1500);}catch{} console.log('RES',r.request().method(),u.split('/rest/v1/')[1]?.slice(0,60),r.status(),(r.request().postData()||'').slice(0,200),'=>',t);} });
await p.goto('https://magnet.expo.app/map',{waitUntil:'networkidle'}).catch(()=>{});
const btn=p.getByText('הפעלת שיתוף מיקום',{exact:true});
if(await btn.isVisible().catch(()=>false)){ await btn.click(); await p.waitForTimeout(2500);
  const body=await p.locator('body').innerText(); console.log('AFTER CLICK:',body.slice(0,500)); }
await p.waitForTimeout(3000);
await p.reload({waitUntil:'networkidle'}).catch(()=>{});
await p.waitForTimeout(5000);
await p.screenshot({path:`m2-${role}.png`});
console.log((await p.locator('body').innerText()).slice(0,500));
await ctx.storageState({path:`${Q}/auth/${role}-r11map.json`});
await b.close();
