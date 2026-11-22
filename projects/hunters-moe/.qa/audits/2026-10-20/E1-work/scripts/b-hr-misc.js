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
  const href = await page.getByRole('link',{name:'ההצעות שלי'}).getAttribute('href');
  await page.goto('https://hunters-sooty.vercel.app'+href); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1B-hr-my-bids-desktop.png'});
  const t = await page.locator('main').innerText(); const i=t.indexOf('QA-AUTO 1020 E1');
  return 'HREF '+href+' URL '+page.url()+'\n'+(i>=0?t.slice(Math.max(0,i-150),i+350):'NOT FOUND\n'+t.slice(0,800));
}
