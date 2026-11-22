async page => {
  const P = globalThis.__p || {};
  const zoomTxt = async()=> parseInt(await page.locator('text=/^\\d+%$/').last().innerText().catch(()=>'0'));
  const zoomTo = async (x,y,target)=>{
    await page.mouse.move(x,y);
    for(let i=0;i<40;i++){ const z=await zoomTxt(); if(Math.abs(z-target)<=target*0.08) break;
      await page.keyboard.down('Control'); await page.mouse.wheel(0, z<target?-60:60); await page.keyboard.up('Control');
      await page.waitForFunction(p=>{const e=[...document.querySelectorAll('*')].reverse().find(n=>/^\d+%$/.test((n.innerText||'').trim())); return e && e.innerText.trim()!==p;}, z+'%',{timeout:3000}).catch(()=>{});
    }
    return zoomTxt();
  };
  const z = await zoomTo(467,275,45);
  await page.waitForLoadState('networkidle',{timeout:5000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/miro-candidacy-45.png'});
  return z;
}
