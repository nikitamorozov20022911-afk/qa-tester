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
  await page.goto('https://hunters-sooty.vercel.app/tenders/90dc3d0b-4f09-4da5-bc00-b66b09dda203?from=mine'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const html = await page.content();
  const offers = (html.match(/\\"offers\\":\[[^\]]*\]/)||[''])[0].replace(/\\"avatar\\":\\"[^\\]*\\",/g,'').slice(0,1500);
  const dt = (await page.locator('[role=dialog]').allInnerTexts()).join('||');
  await page.screenshot({path:'screenshots/run-1020/E1/66-E1B-closed-tender-T52-owner-desktop.png', fullPage:true});
  await page.keyboard.press('Escape');
  await page.goto('https://hunters-sooty.vercel.app/tenders'); await page.waitForLoadState('networkidle');
  await page.getByRole('button',{name:'+ פרסום'}).click();
  const menu = page.locator('[role=menu],[role=dialog]').last(); await menu.waitFor({timeout:8000});
  await page.screenshot({path:'screenshots/run-1020/E1/34-E1B-publish-type-menu-desktop.png'});
  const mt = await menu.innerText(); const role = await menu.getAttribute('role');
  await page.keyboard.press('Escape');
  return 'T52: '+dt.slice(0,1800)+'\nOFFERS '+offers+'\nMENU('+role+'): '+mt;
}
