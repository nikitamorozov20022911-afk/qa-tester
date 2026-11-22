import { chromium } from 'playwright';
const NEW03='1ca43f5f-6154-4bc2-88dc-3d88f715fea3';
for (const who of process.argv.slice(2)) {
const AUTH='auth/'+who+'.json';
const b = await chromium.launch();
const c = await b.newContext({ storageState: AUTH, viewport:{width:390,height:844}, isMobile:true });
const p = await c.newPage();
let hdr=null; p.on('request',r=>{ if(r.url().includes('/rest/v1/rpc/my_matches')) hdr=r.headers(); });
await p.goto('https://magnet.expo.app/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
const url=p.url();
if(!hdr){console.log(who,url,'NO SESSION'); await b.close(); continue;}
const out=await p.evaluate(async ([h,id])=>{
 const base='https://nhiqtgupncikobhbjhfs.supabase.co/rest/v1/';
 const H={apikey:h.apikey,authorization:h.authorization,'content-type':'application/json'};
 const m=await (await fetch(base+'rpc/my_matches',{method:'POST',headers:H,body:'{}'})).json();
 const s=await (await fetch(base+'swipes?select=*&actor_id=eq.'+id.me+'&limit=1',{headers:H})).text();
 const me=await (await fetch(base+'swipes?select=*&limit=3&actor_id=eq.'+id.me,{headers:H})).text();
 return {m:JSON.stringify(m).slice(0,300), mlen:Array.isArray(m)?m.length:null, has:JSON.stringify(m).includes(id.n3), s:s.slice(0,300)};
},[hdr,{me:JSON.parse(hdr.authorization?'{}':'{}').x||'',n3:NEW03}]);
console.log(who,url,JSON.stringify(out));
await c.storageState({path:AUTH}); await b.close();
}
