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
  await page.goto('https://hunters-sooty.vercel.app/profile'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  const t = await page.locator('main').innerText().catch(()=>'');
  const m = t.match(/(תחומי התמחות|תחום התמחות|תחומים)[\s\S]{0,250}/);
  return 'URL '+page.url()+'\n'+(m?m[0]:'NO FIELD\n'+t.slice(0,600));
}
