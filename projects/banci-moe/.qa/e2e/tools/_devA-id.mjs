import { chromium } from '@playwright/test';
import fs from 'node:fs';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA',{headless:true});
const p=ctx.pages()[0]||await ctx.newPage(); await p.goto('https://banci.expo.app/welcome'); await p.waitForTimeout(3000);
const id=await p.evaluate(()=>localStorage.getItem('banci.installation_id')); await ctx.close();
const f='/Users/avielshnaider/banci-moe/.qa/auth/user.json'; const st=JSON.parse(fs.readFileSync(f,'utf8'));
const o=st.origins.find(o=>o.origin==='https://banci.expo.app'); o.localStorage=o.localStorage.filter(i=>i.name!=='banci.installation_id'); o.localStorage.push({name:'banci.installation_id',value:id});
fs.writeFileSync(f,JSON.stringify(st)); console.log('installation id set:', id?id.slice(0,8)+'…':'NONE');
