import { chromium } from 'playwright';
import fs from 'fs';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); // {role:[lat,lng]}
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const b=await chromium.launch({headless:true});
const pages={};
for(const [role,[lat,lng]] of Object.entries(cfg)){
 const ctx=await b.newContext({storageState:`${Q}/auth/${role}-r11map.json`,locale:'he-IL',viewport:{width:390,height:844},geolocation:{latitude:lat,longitude:lng,accuracy:10},permissions:['geolocation']});
 const p=await ctx.newPage(); pages[role]={p,ctx};
 p.on('response',async r=>{const u=r.url(); if(/rpc\/(nearby_live|record_location)/.test(u)||(/rest\/v1\/profiles/.test(u)&&r.request().method()==='PATCH')){let t='';try{t=(await r.text());}catch{} let s=t; try{const j=JSON.parse(t); if(Array.isArray(j)) s=JSON.stringify(j.map(x=>({n:x.display_name,d:x.distance_m})));}catch{} log(role,u.split('/rest/v1/')[1].slice(0,40),r.status(),(r.request().postData()||'').slice(0,120),'=>',s.slice(0,400));}});
 await p.goto('https://magnet.expo.app/map',{waitUntil:'networkidle'}).catch(()=>{});
 await p.waitForTimeout(2500);
 const btn=p.getByText('הפעלת שיתוף מיקום',{exact:true});
 if(await btn.isVisible().catch(()=>false)){ await btn.click(); await p.waitForTimeout(2000);
   for(const t of ['הפעלה','אישור','להפעיל','הפעלת שיתוף']){const c=p.getByRole('button',{name:t,exact:true}); if(await c.isVisible().catch(()=>false)){await c.click(); log(role,'confirm',t); break;}}
   await p.waitForTimeout(2000); }
 await p.reload({waitUntil:'networkidle'}).catch(()=>{});
 await p.waitForTimeout(3000);
 const txt=await p.locator('body').innerText(); log(role,'STATE', /שיתוף מיקום פעיל/.test(txt)?'SHARING ON':'not on', txt.replace(/\s+/g,' ').slice(0,160));
 await ctx.storageState({path:`${Q}/auth/${role}-r11map.json`});
}
log('ALL READY');
fs.writeFileSync('hold.ready', new Date().toISOString());
setInterval(async()=>{ for(const [role,{p,ctx}] of Object.entries(pages)){ try{ await p.reload({waitUntil:'networkidle',timeout:60000}); await ctx.storageState({path:`${Q}/auth/${role}-r11map.json`}); }catch(e){log(role,'reload err',e.message);} } }, 240000);
