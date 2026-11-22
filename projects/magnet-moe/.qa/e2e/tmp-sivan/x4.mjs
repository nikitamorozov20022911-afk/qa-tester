import { chromium, devices } from 'playwright';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const b=await chromium.launch({headless:true});
const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},storageState:Q+'/auth/new03-r11map.json',geolocation:{latitude:32.5006,longitude:34.9184},permissions:['geolocation'],locale:'he-IL'});
const p=await ctx.newPage(); let api=null;
p.on('request',q=>{const h=q.headers(); if(!api && /\/(rest|rpc)\//.test(q.url()) && h.authorization && h.apikey && h.authorization!=='Bearer '+h.apikey){api={base:q.url().split('/rest/v1/')[0],apikey:h.apikey,auth:h.authorization};}});
await p.goto('https://magnet.expo.app/discover',{waitUntil:'networkidle'});
const H={apikey:api.apikey,Authorization:api.auth};
for(const path of ['swipes?select=*&order=created_at.desc&limit=30','likes?select=*&limit=30','matches?select=*&limit=10']){const r=await p.request.get(api.base+'/rest/v1/'+path,{headers:H}); console.log(path,r.status(),(await r.text()).slice(0,2500));}
await ctx.storageState({path:Q+'/auth/new03-r11map.json'}); await b.close();
