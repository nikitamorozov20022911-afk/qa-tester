import { webkit, devices } from '@playwright/test';
const b=await webkit.launch(); const c=await b.newContext({...devices['iPhone 13'],locale:'he-IL'}); const p=await c.newPage();
for (const u of ['/welcome','/sign-in','/sign-up','/design']) { await p.goto('https://banci.expo.app'+u); await p.waitForTimeout(4500);
 const r=await p.evaluate(()=>{const reds=new Set(), bad=[], small=[]; for(const e of document.querySelectorAll('*')){ if(!e.offsetParent) continue; const s=getComputedStyle(e); for(const k of ['color','backgroundColor','borderTopColor','fill','stroke']){ const v=s[k]; if(!v||!v.startsWith('rgb')) continue; const m=v.match(/\d+/g).map(Number); if(m[0]>180&&m[1]<120&&m[2]<120) reds.add(v); if(m[0]===217&&m[1]===45&&m[2]===32) bad.push(k);} }
  for(const e of document.querySelectorAll('[role=button],a,button')){ if(!e.offsetParent) continue; const q=e.getBoundingClientRect(); if(q.width<44||q.height<44) small.push((e.innerText.trim()||e.getAttribute('aria-label')||'?').slice(0,20)+' '+Math.round(q.width)+'×'+Math.round(q.height)); }
  return {reds:[...reds], D92D20:bad.length, small}; }); console.log(u, JSON.stringify(r)); }
await b.close();
