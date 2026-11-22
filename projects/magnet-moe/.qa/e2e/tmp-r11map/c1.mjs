import { chromium } from 'playwright';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const roles=process.argv.slice(2);
const b=await chromium.launch({headless:true});
for(const role of roles){
 const ctx=await b.newContext({storageState:`${Q}/auth/${role}-r11map.json`,locale:'he-IL'});
 const p=await ctx.newPage(); let api=null;
 p.on('request',q=>{const h=q.headers(); if(!api&&q.url().includes('/rest/v1/')&&h.apikey&&h.authorization&&h.authorization!=='Bearer '+h.apikey) api={base:q.url().split('/rest/v1/')[0],h:{apikey:h.apikey,Authorization:h.authorization}};});
 await p.goto('https://magnet.expo.app/discover',{waitUntil:'networkidle',timeout:45000}).catch(()=>{});
 let row=null;
 if(api){ const id=JSON.parse(Buffer.from(api.h.Authorization.split('.')[1],'base64url')).sub;
  const r=await p.request.get(`${api.base}/rest/v1/profiles?id=eq.${id}&select=id,display_name,birth_date,gender,interested_in,self_definition,region,pref_age_min,pref_age_max,pref_distance_km,share_location,nearby_opt_in,onboarding_step,status,is_verified`,{headers:api.h}); row=(await r.json())[0]; }
 console.log(role,'|',p.url(),'|',JSON.stringify(row));
 if(api) await ctx.storageState({path:`${Q}/auth/${role}-r11map.json`});
 await ctx.close();
}
await b.close();
