import fs from 'fs';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const api=JSON.parse(fs.readFileSync('api.json'));
const spec=JSON.parse(process.argv[2]);
for(const [role,patch] of Object.entries(spec)){
 const st=JSON.parse(fs.readFileSync(`${Q}/auth/${role}-r11map.json`));
 let tok=null; for(const o of st.origins) for(const kv of o.localStorage) if(/auth-token/.test(kv.name)) tok=JSON.parse(kv.value).access_token;
 const id=JSON.parse(Buffer.from(tok.split('.')[1],'base64url')).sub;
 const H={apikey:api.apikey,Authorization:'Bearer '+tok,'Content-Type':'application/json'};
 const sel=Object.keys(patch).join(',');
 const before=(await (await fetch(`${api.base}/rest/v1/profiles?id=eq.${id}&select=${sel}`,{headers:H})).json())[0];
 const r=await fetch(`${api.base}/rest/v1/profiles?id=eq.${id}`,{method:'PATCH',headers:{...H,Prefer:'return=representation'},body:JSON.stringify(patch)});
 const rows=await r.json(); const after=Array.isArray(rows)&&rows[0]?Object.fromEntries(Object.keys(patch).map(k=>[k,rows[0][k]])):rows;
 console.log(role,r.status,'before',JSON.stringify(before),'after',JSON.stringify(after));
 fs.appendFileSync('orig-prefs.log',`${new Date().toISOString()} ${role} ${id} before=${JSON.stringify(before)} set=${JSON.stringify(patch)} status=${r.status}\n`);
}
