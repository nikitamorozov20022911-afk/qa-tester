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
  await page.keyboard.press('Escape');
  await page.goto('https://hunters-sooty.vercel.app/tenders'); await page.waitForLoadState('networkidle');
  await page.getByRole('link',{name:'ההצעות שלי'}).click(); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const t = await page.locator('main').innerText();
  const i = t.indexOf('QA-AUTO 1020 E1');
  const links = await page.evaluate(()=>[...document.querySelectorAll('main a')].map(a=>a.getAttribute('href')+' '+a.innerText.slice(0,40).replace(/\n/g,' ')).filter(s=>s.includes('E1')||s.includes('37fb')).join('\n'));
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1B-hr-my-bids-desktop.png'});
  return 'URL '+page.url()+'\n'+t.slice(0,300)+'\n...\n'+(i>=0?t.slice(Math.max(0,i-200),i+500):'NOT FOUND')+'\nLINKS '+links;
}
