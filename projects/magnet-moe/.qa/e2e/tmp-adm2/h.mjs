import { chromium, devices } from 'playwright';
import fs from 'fs';
export const Q='/Users/avielshnaider/magnet-moe/.qa';
export const SS=Q+'/screenshots/adm2/';
export const ADMIN='https://magnet-admin.vercel.app';
export async function admin(){
  const b=await chromium.launch({headless:true});
  const ctx=await b.newContext({storageState:Q+'/auth/admin.json',viewport:{width:1440,height:900},locale:'he-IL'});
  const p=await ctx.newPage(); const net=[];
  p.on('response',r=>{const q=r.request(); if(q.resourceType()==='document'||q.method()==='POST'||r.status()>=400) net.push({m:q.method(),u:r.url(),s:r.status(),a:q.headers()['next-action']||''});});
  p.on('console',m=>{if(m.type()==='error') net.push({console:m.text().slice(0,200)})});
  return {b,ctx,p,net,async close(){await ctx.storageState({path:Q+'/auth/admin.json'}); await b.close();}};
}
export async function app(){
  const b=await chromium.launch({headless:true});
  const ctx=await b.newContext({...devices['iPhone 13'],storageState:Q+'/auth/user3.json',locale:'he-IL'});
  const p=await ctx.newPage(); const net=[];
  p.on('response',r=>{const q=r.request(); if(r.status()>=400 || /supabase/.test(r.url()) && q.method()!=='GET') net.push({m:q.method(),u:r.url().slice(0,160),s:r.status()});});
  return {b,ctx,p,net,async close(save=true){if(save) await ctx.storageState({path:Q+'/auth/user3.json'}); await b.close();}};
}
export async function outline(p,loc,file,full=false){
  try{ const el=typeof loc==='string'?p.locator(loc).first():loc; await el.evaluate(e=>{e.style.outline='3px solid red';e.style.outlineOffset='2px';}); }catch(e){}
  await p.screenshot({path:SS+file,fullPage:full});
}
export function dump(o){fs.writeFileSync(SS+'last.json',JSON.stringify(o,null,1));}
