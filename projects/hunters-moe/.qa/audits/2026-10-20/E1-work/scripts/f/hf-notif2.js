async page => {
  await page.goto('https://hunters-sooty.vercel.app/my-candidates'); await page.waitForLoadState('networkidle');
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

  const r = await bell(null);
  const info = await r.panel.evaluate(p=>{ const el=[...p.querySelectorAll('*')].find(e=>e.innerText&&e.innerText.startsWith('איזה כיף!')&&e.children.length<6); if(!el) return 'nf'; let a=el; while(a&&!['A','BUTTON'].includes(a.tagName)) a=a.parentElement; return (a?a.tagName+' href='+a.getAttribute('href')+' role='+a.getAttribute('role'):'no anchor')+' | '+el.outerHTML.slice(0,400); });
  const item = r.panel.getByText(/איזה כיף!/).first();
  const before = page.url();
  await item.click();
  await page.waitForURL(u=>u.toString()!==before,{timeout:10000}).catch(()=>{});
  await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/74-E1F-hunter_free-accepted-notif-click-desktop.png', fullPage:true});
  const body = await page.evaluate(()=>document.body.innerText.slice(0,1500));
  return 'INFO '+info+'\nURL after '+page.url()+'\nBODY '+body;
}
