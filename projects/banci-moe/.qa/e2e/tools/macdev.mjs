// Headed "second device" window with persistent profile; user logs in manually.
// Commands: write JSON {id, op:'goto'|'eval'|'offline'|'shot'|'text', arg} to .qa/live/<profile>.cmd ; result -> .qa/live/<profile>.res
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [profile='devA', start='/sign-in'] = process.argv.slice(2);
const prof=`/Users/avielshnaider/banci-moe/.qa/auth/profiles/${profile}`, live='/Users/avielshnaider/banci-moe/.qa/live';
const cmdF=`${live}/${profile}.cmd`, resF=`${live}/${profile}.res`;
const ctx = await chromium.launchPersistentContext(prof, { headless:false, locale:'he-IL', viewport:{width:430,height:640} });
const p = ctx.pages()[0] || await ctx.newPage();
await p.goto('https://banci.expo.app'+start);
let last='';
for(;;){ await p.waitForTimeout(700);
  try{ fs.writeFileSync(`${live}/${profile}.txt`, p.url()+'\n'+(await p.innerText('body')).slice(0,3000)); }catch{}
  if(!fs.existsSync(cmdF)) continue; let c; try{ c=JSON.parse(fs.readFileSync(cmdF,'utf8')); }catch{ continue; }
  if(c.id===last) continue; last=c.id; let out;
  try{ if(c.op==='goto'){ await p.goto('https://banci.expo.app'+c.arg); await p.waitForTimeout(4000); out=p.url(); }
   else if(c.op==='eval') out=await p.evaluate(c.arg);
   else if(c.op==='offline'){ await ctx.setOffline(!!c.arg); out='offline='+!!c.arg; }
   else if(c.op==='shot'){ await p.screenshot({path:`/Users/avielshnaider/banci-moe/.qa/screenshots/${c.arg}`}); out='ok'; }
   else if(c.op==='click'){ await p.getByRole('button',{name:c.arg,exact:true}).last().click(); await p.waitForTimeout(1500); out='clicked'; }
   else if(c.op==='quit'){ fs.writeFileSync(resF,JSON.stringify({id:c.id,out:'bye'})); await ctx.close(); process.exit(0); }
  }catch(e){ out='ERR '+e.message.slice(0,300); }
  fs.writeFileSync(resF, JSON.stringify({id:c.id,out}));
}
