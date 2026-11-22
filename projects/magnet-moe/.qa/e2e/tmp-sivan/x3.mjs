import { chromium, devices } from 'playwright';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const SIV='ea5d7f41-6a81-41d5-b107-ce0314ed5bd6';
const b=await chromium.launch({headless:true});
const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},storageState:Q+'/auth/new03-r11map.json',geolocation:{latitude:32.5006,longitude:34.9184},permissions:['geolocation'],locale:'he-IL'});
const p=await ctx.newPage();
const skipped=[]; let likeRes=null;
await p.route('**/rpc/**',async route=>{const u=route.request().url(); const body=route.request().postData()||'';
  if(/rpc\/(swipe|like|super)/i.test(u)){
    const isPass=/pass|dislike|left|skip|nope/i.test(body);
    if(!body.includes(SIV) && !isPass){console.log('BLOCKED',u,body); return route.abort();}
    if(body.includes(SIV) && /super/i.test(u+body)){console.log('BLOCKED super',body); return route.abort();}
  }
  return route.continue();});
p.on('response',async r=>{const u=r.url(); if(/discovery_(feed|quota)/.test(u)){console.log('FEEDRESP',r.status(),(await r.text().catch(()=>'')).slice(0,150));} if(/rpc\/(swipe|like)/i.test(u)){const t=await r.text().catch(()=>''); console.log('RESP',r.status(),u.split('/rpc/')[1],r.request().postData(),t.slice(0,300)); if((r.request().postData()||'').includes(SIV)) likeRes={status:r.status(),body:t,at:new Date().toISOString()};}});
await p.goto('https://magnet.expo.app/discover',{waitUntil:'networkidle'});
await p.waitForTimeout(3000);
const name=async()=>{const t=await p.locator('body').innerText(); const m=t.match(/([^\n,]+),\s*(\d{2})\s*\n/); return m?m[1]+', '+m[2]:null;};
async function drag(x1,x2){await p.mouse.move(x1,520); await p.mouse.down(); for(let i=1;i<=12;i++){await p.mouse.move(x1+(x2-x1)*i/12,520+i); await p.waitForTimeout(16);} await p.mouse.up(); await p.waitForTimeout(1800);}
for(let i=0;i<15;i++){
  const n=await name(); console.log('CARD',i,n);
  if(!n){console.log(JSON.stringify((await p.locator("body").innerText()).slice(0,400))); await p.screenshot({path:'none'+i+'.png'}); break;}
  if(n.startsWith('סיון')){await p.screenshot({path:'sivan.png'}); await drag(80,370); await p.waitForTimeout(2500); await p.screenshot({path:'after-like.png'}); console.log('AFTER',await name()); break;}
  await drag(320,20);
  const n2=await name(); if(n2===n){console.log('no change, stop'); await p.screenshot({path:'stuck.png'}); break;}
  skipped.push(n);
}
console.log('SKIPPED',JSON.stringify(skipped)); console.log('LIKE',JSON.stringify(likeRes));
await ctx.storageState({path:Q+'/auth/new03-r11map.json'}); await b.close();
