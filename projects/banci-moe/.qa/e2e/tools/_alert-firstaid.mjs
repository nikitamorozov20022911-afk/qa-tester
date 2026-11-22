import { chromium } from '@playwright/test';
const SS='/Users/avielshnaider/banci-moe/.qa/screenshots/recheck/';
const ctx=await chromium.launchPersistentContext('/Users/avielshnaider/banci-moe/.qa/auth/profiles/devA',{headless:true,locale:'he-IL',viewport:{width:430,height:900}});
const p=ctx.pages()[0]||await ctx.newPage(); const btn=async(n,o={})=>{await p.getByRole('button',{name:n,...o}).last().click(); await p.waitForTimeout(2500);};
await p.goto('https://banci.expo.app/home?mock=headUnder'); await p.waitForTimeout(6000);
await p.getByRole('button',{name:/התחלת ניטור/}).first().click(); await p.waitForTimeout(4000);
try{await btn('עוצמת צפצוף מקסימלית');}catch{} try{await btn('השמעה'); await btn('שמעתי');}catch{}
await btn('המשך'); await btn('המשך'); try{await btn('בחירת כולם');}catch{} await btn('התחלת ניטור',{exact:true});
await p.waitForTimeout(24000);
const alertOn=async()=>p.evaluate(()=>{const e=[...document.querySelectorAll('div')].find(x=>!x.children.length&&x.innerText.trim()==='זוהתה סכנה בבריכה'&&x.offsetParent); return !!e});
console.log('alert visible:', await alertOn());
await btn('עזרה ראשונה והחייאה'); await p.waitForTimeout(3000);
console.log('url:', p.url(), 'alert still on top:', await alertOn());
const top=await p.evaluate(()=>{const el=document.elementFromPoint(215,600); return (el.innerText||el.getAttribute('aria-label')||el.tagName).slice(0,60)}); console.log('element at center-bottom:', top);
const cpr=await p.evaluate(()=>{const e=[...document.querySelectorAll('[role=button]')].find(x=>x.innerText.includes('החייאה')&&x.innerText.includes('עיסויים')); if(!e) return 'no cpr row'; const r=e.getBoundingClientRect(); const at=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2); return 'cpr row covered by other element: '+!e.contains(at)});
console.log(cpr); await p.screenshot({path:SS+'e824b3d3-mac-run2-alert-covers-firstaid.png'});
await p.waitForTimeout(10000); console.log('+10s alert still:', await alertOn());
// cleanup: false alarm + end
await p.goto('https://banci.expo.app/monitor/live'); await p.waitForTimeout(3000); await ctx.close();
