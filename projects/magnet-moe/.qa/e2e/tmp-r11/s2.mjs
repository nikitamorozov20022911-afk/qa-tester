import { chromium, devices } from 'playwright';
const st='/Users/avielshnaider/magnet-moe/.qa/auth/reg6-r11chk.json';
const b=await chromium.launch({headless:true});
const ctx=await b.newContext({...devices['iPhone 13'],storageState:st,locale:'he-IL'});
const p=await ctx.newPage();
await p.goto('https://magnet.expo.app/discover',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(6000);
const r=await p.evaluate(async()=>{
 const k=Object.keys(localStorage).find(k=>/^sb-.*-auth-token$/.test(k)); const s=JSON.parse(localStorage.getItem(k));
 const base='https://nhiqtgupncikobhbjhfs.supabase.co/rest/v1/';
 // find anon key from a script? use apikey header captured: fall back to access token
 return {tok:s.access_token.slice(0,10), k};
});
let apikey=null;
p.on('request',q=>{const h=q.headers(); if(h.apikey) apikey=h.apikey;});
await p.reload({waitUntil:'domcontentloaded'}); await p.waitForTimeout(6000);
const out=await p.evaluate(async(apikey)=>{
 const k=Object.keys(localStorage).find(k=>/^sb-.*-auth-token$/.test(k)); const s=JSON.parse(localStorage.getItem(k));
 const H={apikey,Authorization:'Bearer '+s.access_token};
 const base='https://nhiqtgupncikobhbjhfs.supabase.co/rest/v1/';
 const g=async u=>{const r=await fetch(base+u,{headers:H}); return r.status+' '+(await r.text()).slice(0,4000);};
 return {
  swipes: await g('swipes?select=target_id,direction,created_at&actor_id=eq.'+s.user.id+'&order=created_at.desc&limit=200'),
  swipes2: await g('swipes?select=*&actor_id=eq.'+s.user.id+'&limit=1'),
  matches: await g('rpc/my_matches'),
  pub: await g('public_profiles?select=id,display_name,gender,interested_in,self_definition,region,birth_date&limit=100'),
 };
},apikey);
for(const [k,v] of Object.entries(out)) console.log('=== '+k+'\n'+v.replace(/-?\d{1,3}\.\d{4,}/g,'<num>'));
await ctx.storageState({path:st}); await b.close();
