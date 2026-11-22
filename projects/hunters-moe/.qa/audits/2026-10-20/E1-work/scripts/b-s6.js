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
    await page.waitForLoadState('networkidle');
    if (shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot});
    const t = await panel.innerText().catch(e=>'ERR '+e.message);
    await page.keyboard.press('Escape');
    return t; };
  await page.goto('https://hunters-sooty.vercel.app/tenders?mine=1'); await page.waitForLoadState('networkidle');
  const card = await page.locator('main').getByText('QA-AUTO 1020 E1 מכרז').first().locator('xpath=ancestor::*[self::a or self::article or self::li][1]').innerText().catch(e=>'ERR');
  await page.screenshot({path:'screenshots/run-1020/E1/35-E1B-my-tenders-company2-desktop.png'});
  const bl = await page.evaluate(()=>[...document.querySelectorAll('header button')].map(b=>b.getAttribute('aria-label')+'/'+b.innerText.trim()).join(' ; '));
  const bt = await bell('73-E1B-bell-company2-after-publish-desktop.png');
  return 'CARD: '+card+'\nHEADER: '+bl+'\nBELL:\n'+bt;
}
