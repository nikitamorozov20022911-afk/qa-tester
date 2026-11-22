async page => {
  await page.goto('https://hunters-sooty.vercel.app/tenders?mine=1'); await page.waitForLoadState('networkidle');
  const bell = async (shot) => {
    const b = page.locator('button[aria-label*="התראות"]').first();
    const label = await b.getAttribute('aria-label');
    await b.click();
    const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
    await panel.waitFor({timeout:8000}).catch(()=>{});
    await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
    if (shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot});
    const t = await panel.innerText().catch(e=>'ERR '+e.message);
    return {label, t, panel}; };

  const r = await bell('73-E1F-bell-company2-desktop.png');
  const n = r.panel.getByText(/QA-AUTO 1020 E1 מכרז/).first();
  let click='none';
  if (await n.count()) { await n.click(); await page.waitForURL(/tenders\//,{timeout:10000}).catch(()=>{}); await page.waitForLoadState('networkidle'); click=page.url(); }
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/42-E1F-company2-bids-list-desktop.png', fullPage:true});
  const dl = await page.locator('[role=dialog]').allInnerTexts();
  return 'BELL label='+r.label+'\n'+r.t+'\nCLICK '+click+'\nDLG '+dl.join('||');
}
