import { chromium } from '@playwright/test';
import fs from 'node:fs';
const prof='/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA';
const st=JSON.parse(fs.readFileSync('/Users/avielshnaider/banci-moe/.qa/auth/user.json','utf8'));
const o=st.origins.find(o=>o.origin==='https://banci.expo.app'); const tok=o.localStorage.find(i=>i.name.includes('auth-token'));
const ctx = await chromium.launchPersistentContext(prof, { headless: true, locale: 'he-IL', viewport: { width: 430, height: 900 } });
await ctx.addInitScript(([k,v])=>{ if(!localStorage.getItem(k)) localStorage.setItem(k,v); },[tok.name,tok.value]);
const p = ctx.pages()[0] || await ctx.newPage();
p.on('response', r=>{ if(r.url().includes('/auth/v1/token')) console.log('auth', r.status()); });
for (const u of (process.argv[2]||'/account,/account/devices').split(',')) { await p.goto('https://banci.expo.app'+u); await p.waitForTimeout(7000);
 console.log('== '+u+'\n'+(await p.innerText('body'))); await p.screenshot({path:`/Users/avielshnaider/banci-moe/.qa/screenshots/2026-10-06-ec8ab82d-mac-devA${u.replace(/\//g,'-')}.png`}); }
const ls=await p.evaluate(k=>localStorage.getItem(k),tok.name); if(ls&&ls!==tok.value){ o.localStorage.find(i=>i.name===tok.name).value=ls; fs.writeFileSync('/Users/avielshnaider/banci-moe/.qa/auth/user.json',JSON.stringify(st)); console.log('token refreshed->user.json'); }
await ctx.close();
