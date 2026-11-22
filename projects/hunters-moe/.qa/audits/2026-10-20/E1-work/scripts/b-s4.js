async page => {
  const dump = async (shot) => { if(shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot, fullPage:true});
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const inputs = await page.evaluate(()=>[...document.querySelectorAll('main input,main textarea,main select,main button,[role=dialog] input,[role=dialog] button')].map(e=>`${e.tagName}|${e.type||''}|${e.name||e.id||''}|${(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||'').slice(0,50).replace(/\n/g,' ')}|${e.checked??''}|${e.disabled?'dis':''}`).join('\n'));
    return `url=${page.url()}\n${t}\n----\n${inputs}`; };
  for (const n of ['agreeRole','agreeUpdates','agreeTerms']) await page.locator(`input[name=${n}]`).check();
  const c = page.locator('main canvas').first();
  const b = await c.boundingBox();
  await page.mouse.move(b.x+30,b.y+b.height/2); await page.mouse.down();
  for (let i=1;i<=12;i++) await page.mouse.move(b.x+30+i*20, b.y+b.height/2 + (i%2?15:-15));
  await page.mouse.up();
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1B-tender-step4-signed-desktop.png', fullPage:true});
  await page.getByRole('button',{name:'פרסום המכרז'}).click();
  await page.waitForURL(u=>!u.toString().includes('/terms'),{timeout:20000}).catch(()=>{});
  await page.waitForLoadState('networkidle');
  const dlg = await page.locator('[role=dialog]').allInnerTexts();
  return 'canvas='+JSON.stringify(b)+'\nDIALOG:'+dlg.join('||')+'\n'+await dump('33-E1B-tender-after-publish-desktop.png');
}
