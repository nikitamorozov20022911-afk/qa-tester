import { webkit, devices } from '@playwright/test';
const b = await webkit.launch(); const ctx = await b.newContext({ ...devices['iPhone 13'], locale: 'he-IL' }); const p = await ctx.newPage();
await p.goto('https://banci.expo.app/design'); await p.waitForTimeout(5000);
const r = await p.evaluate(()=>{ const m=new Map(); for (const e of document.querySelectorAll('div,span')) { if (e.children.length||!e.offsetParent||!e.innerText.trim()) continue; const s=getComputedStyle(e); const k=s.fontSize+'/'+s.lineHeight+' '+s.fontFamily.split(',')[0]; if(!m.has(k)) m.set(k,e.innerText.trim().slice(0,30)); } return [...m.entries()].map(x=>x.join('  ← '))});
console.log(r.join('\n'));
const tbl = await p.evaluate(()=>{const t=document.body.innerText; const i=t.search(/Display|Heading/); return t.slice(i,i+900)}); console.log('--- table\n'+tbl);
await b.close();
