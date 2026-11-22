async page => {
  const zoomTxt = async()=> parseInt(await page.locator('text=/^\\d+%$/').last().innerText().catch(()=>'0'));
  await page.mouse.move(720,450);
  await page.mouse.wheel(-500,0);
  await page.mouse.move(600,300);
  for(let i=0;i<30;i++){ const z=await zoomTxt(); if(z<=26) break;
    await page.keyboard.down('Control'); await page.mouse.wheel(0,60); await page.keyboard.up('Control');
    await page.waitForTimeout(150); }
  await page.waitForTimeout(800);
  await page.screenshot({path:'screenshots/run-1020/E1/miro-candidacy-overview.png'});
  return await zoomTxt();
}
