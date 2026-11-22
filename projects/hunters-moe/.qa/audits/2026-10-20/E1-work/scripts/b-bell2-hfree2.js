async page => {
  const dump = async (shot) => { if(shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot, fullPage:true});
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const inputs = await page.evaluate(()=>[...document.querySelectorAll('main input,main textarea,main select,main button,[role=dialog] input,[role=dialog] button')].map(e=>`${e.tagName}|${e.type||''}|${e.name||e.id||''}|${(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||'').slice(0,50).replace(/\n/g,' ')}|${e.checked??''}|${e.disabled?'dis':''}`).join('\n'));
    return `url=${page.url()}\n${t}\n----\n${inputs}`; };
  const bell = async (shot) => {
    const b = page.locator('header button[aria-label*="התראות"], button[aria-label*="התראות"], button[aria-label*="notif" i]').first();
    await b.click(); await page.waitForTimeout(0);
    const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
    await panel.waitFor({timeout:8000}).catch(()=>{});
    await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
    if (shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot});
    const t = await panel.innerText().catch(e=>'ERR '+e.message);
    await page.keyboard.press('Escape');
    return t; };
  await page.goto('https://hunters-sooty.vercel.app/tenders'); await page.waitForLoadState('networkidle');
  const bt = await bell('73-E1B-bell-hfree2-recheck-desktop.png');
  const b = page.locator('button[aria-label*="התראות"]').first(); await b.click();
  const panel = page.locator('[role=dialog]').last(); await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  await panel.getByText('הגדרות התראות').click(); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  const st = await page.locator('main').innerText().catch(()=>'');
  const dl = (await page.locator('[role=dialog]').allInnerTexts()).join('||');
  const checks = await page.evaluate(()=>[...document.querySelectorAll('input[type=checkbox],[role=switch]')].map(e=>(e.getAttribute('aria-label')||e.name||'')+'='+(e.checked??e.getAttribute('aria-checked'))).join(', '));
  await page.screenshot({path:'screenshots/run-1020/E1/73-E1B-notif-settings-hfree2-desktop.png', fullPage:true});
  return 'BELL:\n'+bt+'\nSETTINGS URL '+page.url()+'\n'+(dl||st).slice(0,1500)+'\nCHECKS '+checks;
}
