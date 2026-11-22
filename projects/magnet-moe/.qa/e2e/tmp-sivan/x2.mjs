import { chromium, devices } from 'playwright';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const b=await chromium.launch({headless:true});
const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},storageState:Q+'/auth/new03-r11map.json',geolocation:{latitude:32.5006,longitude:34.9184},permissions:['geolocation'],locale:'he-IL'});
const p=await ctx.newPage();
p.on('response',async r=>{if(r.url().includes('/rpc/discovery_feed')){const j=await r.json(); console.log(JSON.stringify(j).slice(0,300)); for(const x of (Array.isArray(j)?j:j.items||[])) console.log(x.id||x.user_id, x.display_name||x.name||x.first_name, x.age, x.city);}});
await p.goto('https://magnet.expo.app/discover',{waitUntil:'networkidle'});
await p.waitForTimeout(3000);
await ctx.storageState({path:Q+'/auth/new03-r11map.json'}); await b.close();
