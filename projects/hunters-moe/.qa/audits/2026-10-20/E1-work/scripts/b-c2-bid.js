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
  await page.goto('https://hunters-sooty.vercel.app/tenders?mine=1'); await page.waitForLoadState('networkidle');
  const hdr = await page.evaluate(()=>[...document.querySelectorAll('header button')].map(b=>b.getAttribute('aria-label')).filter(Boolean).join(';'));
  const bt = await bell('73-E1B-bell-company2-new-bid-desktop.png');
  // click the bid notification if present
  let clickRes='no notif';
  const b = page.locator('button[aria-label*="התראות"]').first(); await b.click();
  const panel = page.locator('[role=dialog]').last(); await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  const n = panel.getByText(/QA-AUTO 1020 E1/).first();
  if (await n.count()) { await n.click(); await page.waitForLoadState('networkidle'); await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{}); clickRes = 'URL after click: '+page.url(); } else { await page.keyboard.press('Escape'); await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle'); await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{}); }
  await page.screenshot({path:'screenshots/run-1020/E1/42-E1B-company2-tender-with-bid-desktop.png', fullPage:true});
  const dt = await page.locator('[role=dialog]').allInnerTexts();
  const btns = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button, [role=dialog] a')].filter(e=>e.offsetParent).map(e=>e.tagName+':'+(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')+(e.href?'->'+e.getAttribute('href'):'')).join(' | '));
  return 'HDR '+hdr+'\nBELL:\n'+bt+'\nCLICK: '+clickRes+'\nDLG: '+dt.join('||')+'\nBTNS: '+btns;
}
