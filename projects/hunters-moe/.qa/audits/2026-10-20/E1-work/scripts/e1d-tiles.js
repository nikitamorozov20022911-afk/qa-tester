async page => {
  const zoomTxt = async()=> parseInt(await page.locator('text=/^\\d+%$/').last().innerText().catch(()=>'0'));
  const zoomTo = async (target)=>{ for(let i=0;i<40;i++){ const z=await zoomTxt(); if(Math.abs(z-target)<=Math.max(2,target*0.06)) break;
      await page.keyboard.down('Control'); await page.mouse.wheel(0, z<target?-50:50); await page.keyboard.up('Control'); await page.waitForTimeout(120);} return zoomTxt(); };
  const pts=[[470,215,'c-top-1'],[700,225,'c-top-2'],[900,200,'c-top-3'],[1080,250,'c-top-4'],[520,360,'c-bot-1'],[780,370,'c-bot-2'],[1000,350,'c-bot-3'],[520,505,'wr-1'],[830,510,'wr-2']];
  const res=[];
  for (const [x,y,n] of pts){
    await page.mouse.move(x,y);
    const z=await zoomTo(78);
    await page.waitForTimeout(900);
    await page.screenshot({path:'screenshots/run-1020/E1/miro-'+n+'.png'});
    res.push(n+':'+z);
    await page.mouse.move(x,y);
    await zoomTo(26);
    await page.waitForTimeout(400);
  }
  return res.join(',');
}
