import {app,SS,outline} from './h.mjs';
const tag=process.argv[2]; const paths=(process.argv[3]||'/,/notifications,/profile').split(',');
const A=await app(); const p=A.p; let hdr=null;
p.on('request',q=>{if(/supabase\.co\/rest/.test(q.url())&&!hdr) hdr=q.headers()});
for(const path of paths){
  await p.goto('https://magnet.expo.app'+path,{waitUntil:'domcontentloaded'});
  await p.locator('body').getByText(/\S{3,}/).first().waitFor({timeout:20000}).catch(()=>{});
  await p.waitForFunction(()=>document.body.innerText.trim().length>40,null,{timeout:20000}).catch(()=>{});
  await p.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});
  const t=(await p.locator('body').innerText()).replace(/\n+/g,' | ');
  console.log('PATH',path,'->',p.url(),'\n ',t.slice(0,700));
  await p.screenshot({path:SS+`app-${tag}-${path.replace(/\W/g,'')||'home'}-mobile.png`});
}
if(process.argv[4]==='comment' && hdr){
  const r=await p.request.get('https://nhiqtgupncikobhbjhfs.supabase.co/rest/v1/feed_comments?select=*&id=eq.17abf1a0-eb2d-4f01-99ee-e200599dcd60',{headers:{apikey:hdr.apikey,authorization:hdr.authorization}});
  console.log('COMMENT LOOKUP',r.status(),await r.text());
}
console.log('ERR',JSON.stringify(A.net.filter(x=>x.s>=400).slice(0,10)));
await A.close(process.argv[5]!=='nosave');
