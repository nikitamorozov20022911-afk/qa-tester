async page => {
  const zoomTxt = async()=> parseInt(await page.locator('text=/^\\d+%$/').last().innerText().catch(()=>'0'));
  const zoomTo = async (target)=>{ for(let i=0;i<40;i++){ const z=await zoomTxt(); if(Math.abs(z-target)<=Math.max(2,target*0.06)) break;
      await page.keyboard.down('Control'); await page.mouse.wheel(0, z<target?-50:50); await page.keyboard.up('Control'); await page.waitForTimeout(120);} return zoomTxt(); };
  const res=[];
  for (const [x,y,n,t] of [[930,780,'roles-hh-company',55],[560,740,'roles-plans-he',55]]){
    await page.mouse.move(x,y); res.push(n+':'+await zoomTo(t)); await page.waitForTimeout(900);
    await page.screenshot({path:'screenshots/run-1020/E1/miro-'+n+'.png'});
    await page.mouse.move(x,y); await zoomTo(26); await page.waitForTimeout(300);
  }
  return res.join(',');
}
