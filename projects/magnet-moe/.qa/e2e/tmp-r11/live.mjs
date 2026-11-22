import { chromium, devices } from 'playwright';
import fs from 'fs';
const Q='/Users/avielshnaider/magnet-moe/.qa/auth/';
const ids=process.argv.slice(2);
const b=await chromium.launch({headless:true});
for(const id of ids){
  const src=Q+id+'.json', dst=Q+id+'-r11chk.json';
  if(!fs.existsSync(src)){console.log(id,'NO FILE');continue;}
  fs.copyFileSync(src,dst);
  const ctx=await b.newContext({...devices['iPhone 13'],storageState:dst,locale:'he-IL'});
  const p=await ctx.newPage(); const errs=[];
  p.on('response',r=>{if(/auth\/v1\/token/.test(r.url())) errs.push('token '+r.status());});
  try{ await p.goto('https://magnet.expo.app/',{waitUntil:'domcontentloaded',timeout:45000}); }catch(e){}
  await p.waitForTimeout(9000);
  const url=p.url(); const txt=(await p.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,160);
  console.log(id,'|',url,'|',errs.join(','),'|',txt);
  await ctx.storageState({path:dst}); await ctx.close();
}
await b.close();
