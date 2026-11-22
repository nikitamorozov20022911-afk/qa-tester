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

  const r = await bell('73-E1F-bell-hunter_free-accepted-desktop.png');
  const n = r.panel.getByText(/QA-AUTO 1020 E1 מכרז|טכנו-סייבר/).first();
  let click='none', ntext='';
  if (await n.count()) { ntext=await n.innerText(); await n.click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(0); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); click=page.url(); }
  await page.screenshot({path:'screenshots/run-1020/E1/74-E1F-hunter_free-after-notif-click-desktop.png', fullPage:true});
  const dl = await page.locator('[role=dialog]').allInnerTexts();
  const btns = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button,[role=dialog] a')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')+(e.getAttribute('href')?'->'+e.getAttribute('href'):'')).join(' | '));
  const html = await page.content(); const pii=[]; for (const m of ['@','05','phone','email']) { /* collected below */ }
  const emails = [...new Set((html.match(/[\w.+-]+@[\w-]+\.[\w.]+/g)||[]))].slice(0,10);
  return 'BELL label='+r.label+'\n'+r.t.slice(0,600)+'\nNOTIF: '+ntext+'\nCLICK '+click+'\nDLG '+dl.join('||').slice(0,1800)+'\nBTNS '+btns+'\nEMAILS in html: '+emails.join(', ');
}
