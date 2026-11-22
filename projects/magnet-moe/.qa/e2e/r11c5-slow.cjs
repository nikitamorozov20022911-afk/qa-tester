const {chromium,devices}=require('playwright-core'); const fs=require('fs');
const [,, SCREEN, RUN, MODE] = process.argv; // MODE: inapp | direct
const AUTH='/Users/avielshnaider/magnet-moe/.qa/auth/reg2-r11map.json';
const dir='/Users/avielshnaider/magnet-moe/.qa/screenshots/r11-7ad572-fr/'; fs.mkdirSync(dir,{recursive:true});
const URLS={likes:'/likes',matches:'/matches',chat:'/chat/6f470d29-11f8-4b68-a503-0ec97db12bac'};
const SLOW={offline:false,latency:400,downloadThroughput:500*1024/8,uploadThroughput:500*1024/8};
const FAST={offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1};
(async()=>{
  const b=await chromium.launch(); const d=devices['Pixel 7'];
  const ctx=await b.newContext({...d,viewport:{width:375,height:812},storageState:AUTH,locale:'he-IL'});
  const page=await ctx.newPage(); const cdp=await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await page.goto('https://magnet.expo.app/discover',{waitUntil:'domcontentloaded'});
  await page.getByText('הודעות',{exact:true}).first().waitFor({timeout:60000});
  await page.evaluate(async()=>{try{for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister();for(const k of await caches.keys())await caches.delete(k);}catch(e){}});
  await cdp.send('Network.clearBrowserCache'); await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',SLOW);
  const stat=()=>page.evaluate(()=>{let a=0;for(const e of document.querySelectorAll('*')){const n=getComputedStyle(e).animationName;if(n&&n!=='none')a++;}const tx=document.body.innerText.replace(/\s+/g,' ');return{u:location.pathname,len:tx.length,tx:tx.slice(0,70),anim:a,els:document.querySelectorAll('*').length};});
  const bodyTxt=()=>page.evaluate(()=>document.body.innerText);
  let T0=Date.now(), loadMs=null, startAction;
  if(MODE==='direct'){
    startAction=async()=>{ page.goto('https://magnet.expo.app'+URLS[SCREEN],{waitUntil:'commit'}).catch(()=>{}); };
  } else {
    await page.goto('https://magnet.expo.app/discover',{waitUntil:'commit'});
    await page.getByText('הודעות',{exact:true}).first().waitFor({timeout:170000});
    await page.waitForFunction(()=>{const els=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim()==='לייקים');return els.some(e=>{const r=e.getBoundingClientRect();if(!r.width)return false;const t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return t&&(e===t||e.contains(t)||t.contains(e)||t.closest('*')===e.closest('*'))&&!!t&&e.contains(t);});},null,{timeout:170000,polling:100});
    loadMs=Date.now()-T0;
    if(SCREEN==='chat'){
      await page.getByText('הודעות',{exact:true}).first().click();
      await page.getByText('QA П3 0012').last().waitFor({timeout:120000});
    }
    startAction= SCREEN==='chat' ? async()=>{page.getByText('QA П3 0012').last().click().catch(()=>{});}
      : async()=>{page.getByText(SCREEN==='likes'?'לייקים':'הודעות',{exact:true}).first().click().catch(()=>{});};
  }
  const doneRe = SCREEN==='chat'?/לפרופיל של|איך לפתוח|הקלד|כתבו/:SCREEN==='likes'?/בעניין שלך/:/התאמות חדשות/;
  const wantUrl = URLS[SCREEN].split('/').slice(0,2).join('/');
  const t0=Date.now(); await startAction(); const frames=[]; let doneAt=null;
  for(let i=0;i<1500;i++){
    const t=Date.now()-t0; let s,shot;
    try{ s=await stat(); }catch(e){ s={u:'?',len:-1,tx:'(evaluate fail '+e.message.slice(0,30)+')',anim:0,els:0}; }
    try{ const r=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:45}); fs.writeFileSync(`${dir}${SCREEN}-${MODE}-run${RUN}-f${String(i).padStart(3,'0')}-${t}ms.jpg`,Buffer.from(r.data,'base64')); }catch(e){}
    frames.push(`${i}|${t}|${s.u}|len${s.len}|anim${s.anim}|els${s.els}|${s.tx}`);
    let bt=''; try{bt=await bodyTxt();}catch(e){}
    if(s.u.startsWith(wantUrl) && doneRe.test(bt)){ doneAt=t; break; }
    if(t>100000) break;
  }
  await cdp.send('Network.emulateNetworkConditions',FAST);
  await ctx.storageState({path:AUTH});
  await b.close();
  console.log(JSON.stringify({SCREEN,RUN,MODE,loadMs,doneAt},null,0)); console.log(frames.join('\n'));
})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
