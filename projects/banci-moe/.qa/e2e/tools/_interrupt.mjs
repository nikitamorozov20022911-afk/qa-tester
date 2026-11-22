import { chromium } from '@playwright/test';
const prof='/Users/avielshnaider/banci-moe/.qa/auth/profiles/empty1', SS='/Users/avielshnaider/banci-moe/.qa/screenshots/';
const ctx = await chromium.launchPersistentContext(prof, { headless:true, locale:'he-IL', viewport:{width:430,height:900} });
let p = ctx.pages()[0] || await ctx.newPage();
const btn=async(t)=>{ await p.getByRole('button',{name:t}).last().click(); await p.waitForTimeout(2500); };
await p.goto('https://banci.expo.app/home?mock=calm'); await p.waitForTimeout(6000);
console.log('acct', (await p.innerText('body')).slice(0,60).replace(/\n/g,' | '));
await p.getByRole('button',{name:/התחלת ניטור/}).first().click(); await p.waitForTimeout(4000);
try{ await btn('עוצמת צפצוף מקסימלית'); }catch{}
try{ await btn('השמעה'); await btn('שמעתי'); }catch{}
await btn('המשך'); await p.waitForTimeout(2000); await btn('המשך'); await p.waitForTimeout(2000);
console.log('step3', p.url(), (await p.innerText('body')).slice(0,200).replace(/\n/g,' | '));
await p.getByRole('button',{name:'התחלת ניטור',exact:true}).last().click(); await p.waitForTimeout(8000);
console.log('live', p.url(), (await p.innerText('body')).slice(0,80).replace(/\n/g,' | '));
const start=new Date().toTimeString().slice(0,5);
await p.close(); await new Promise(r=>setTimeout(r,5000));
p = await ctx.newPage(); await p.goto('https://banci.expo.app/home'); await p.waitForTimeout(8000);
console.log('HOME after reopen:\n'+(await p.innerText('body')).slice(0,900));
await p.screenshot({path:SS+'2026-10-07-finding-home-recent-interrupted.png', fullPage:true});
await p.goto('https://banci.expo.app/history'); await p.waitForTimeout(6000);
console.log('HISTORY:\n'+(await p.innerText('body')).slice(0,600));
await p.screenshot({path:SS+'2026-10-07-finding-history-interrupted.png'});
console.log('started', start); await ctx.close();
