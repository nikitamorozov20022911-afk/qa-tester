async page => {
  const r = await page.goto('https://hunters-sooty.vercel.app/notifications'); await page.waitForLoadState('networkidle');
  const t1 = page.url()+' status '+(r&&r.status())+'\n'+(await page.locator('main').innerText().catch(()=>'')).slice(0,600);
  await page.goto('https://hunters-sooty.vercel.app/dashboard'); await page.waitForLoadState('networkidle');
  await page.locator('button[aria-label*="התראות"]').first().click();
  const panel = page.locator('[role=dialog]').last(); await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  await panel.getByText('הגדרות התראות').click(); await page.waitForLoadState('networkidle');
  const st = page.url()+'\n'+(await page.locator('main').innerText().catch(()=>'')).slice(0,2500);
  const checks = await page.evaluate(()=>[...document.querySelectorAll('input[type=checkbox],[role=switch]')].map(e=>(e.getAttribute('aria-label')||e.id||e.name||'')+'='+(e.getAttribute('aria-checked')??e.checked)).join(', '));
  await page.screenshot({path:'screenshots/run-1020/E1/verify-73-report-status-settings-t2.png', fullPage:true});
  return t1+'\n=====SETTINGS\n'+st+'\nCHECKS '+checks;
}
