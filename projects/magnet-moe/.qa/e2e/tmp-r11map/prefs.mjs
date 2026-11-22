import { chromium } from 'playwright';
import fs from 'fs';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const spec=JSON.parse(process.argv[2]); // {role:{field:val}}
const b=await chromium.launch({headless:true});
for(const [role,patch] of Object.entries(spec)){
 const ctx=await b.newContext({storageState:`${Q}/auth/${role}-r11map.json`});
 const p=await ctx.newPage(); let api=null;
 p.on('request',q=>{const h=q.headers(); if(!api&&q.url().includes('/rest/v1/')&&h.apikey&&h.authorization&&h.authorization!=='Bearer '+h.apikey) api={base:q.url().split('/rest/v1/')[0],h:{apikey:h.apikey,Authorization:h.authorization}};});
 await p.goto('https://magnet.expo.app/profile',{waitUntil:'networkidle'}).catch(()=>{});
 const id=JSON.parse(Buffer.from(api.h.Authorization.split('.')[1],'base64url')).sub;
 const sel=Object.keys(patch).join(',');
 const before=(await (await p.request.get(`${api.base}/rest/v1/profiles?id=eq.${id}&select=${sel}`,{headers:api.h})).json())[0];
 const r=await p.request.patch(`${api.base}/rest/v1/profiles?id=eq.${id}`,{headers:{...api.h,'Content-Type':'application/json',Prefer:'return=representation'},data:patch,failOnStatusCode:false});
 const after=await r.text();
 console.log(role,'BEFORE',JSON.stringify(before),'PATCH',r.status(),after.slice(0,0));
 fs.appendFileSync('orig-prefs.log',`${new Date().toISOString()} ${role} ${id} before=${JSON.stringify(before)} set=${JSON.stringify(patch)} status=${r.status()}\n`);
 await ctx.storageState({path:`${Q}/auth/${role}-r11map.json`}); await ctx.close();
}
await b.close();
