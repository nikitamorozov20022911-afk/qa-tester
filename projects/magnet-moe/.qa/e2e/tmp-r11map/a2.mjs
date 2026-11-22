import { chromium } from 'playwright';
import fs from 'fs';
const Q='/Users/avielshnaider/magnet-moe/.qa';
const b=await chromium.launch({headless:true});
const ctx=await b.newContext({storageState:Q+'/auth/admin-r11b.json',viewport:{width:1440,height:900},locale:'he-IL'});
const p=await ctx.newPage();
await p.goto('https://magnet-admin.vercel.app/users',{waitUntil:'networkidle'});
const ck=(await ctx.cookies()).filter(c=>c.name.startsWith('sb-'));
let v=ck.sort((a,b)=>a.name.localeCompare(b.name)).map(c=>c.value).join('');
if(v.startsWith('base64-')) v=Buffer.from(v.slice(7),'base64').toString();
const tok=JSON.parse(v).access_token;
await ctx.storageState({path:Q+'/auth/admin-r11b.json'});
// apikey from app
const c2=await b.newContext(); const p2=await c2.newPage(); let key=null;
p2.on('request',q=>{const h=q.headers(); if(!key&&h.apikey) key=h.apikey;});
await p2.goto('https://magnet.expo.app/welcome',{waitUntil:'networkidle'}).catch(()=>{});
if(!key){ // search js
  const html=await p2.content(); }
console.log('key',!!key,'tok',!!tok);
fs.writeFileSync('api.json',JSON.stringify({base:'https://nhiqtgupncikobhbjhfs.supabase.co',apikey:key,auth:'Bearer '+tok}));
await b.close();
