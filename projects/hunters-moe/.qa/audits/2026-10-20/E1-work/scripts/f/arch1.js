async page => {
  const ID='JOBID', NUM='JNUM', TITLE='JTITLE';
  await page.goto('https://hunters-sooty.vercel.app/collaborations/'+ID); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first(); await d.waitFor({timeout:10000});
  const dt = await d.innerText();
  if (!dt.includes(NUM) || !dt.includes(TITLE)) return 'WRONG DIALOG: '+dt.slice(0,300);
  const ab = d.getByRole('button',{name:'פעולות משרה'}); if (await ab.count()!==1) return 'actions btn count '+await ab.count();
  await ab.click();
  const menu = page.locator('[role=menu]').last(); await menu.waitFor({timeout:5000});
  const items = await menu.innerText();
  const it = menu.getByRole('menuitem',{name:'העברה לארכיון'}); if (await it.count()!==1) return 'ITEMS '+items;
  await it.click();
  const cd = page.locator('[role=dialog],[role=alertdialog]').last(); await page.waitForTimeout(0);
  await page.getByText(/ארכיון/).last().waitFor({timeout:5000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/54-E1F-archive-dialog-JNUM-desktop.png'});
  const all = (await page.locator('[role=dialog],[role=alertdialog]').allInnerTexts()).map(x=>x.slice(-600)).join('||');
  const btns = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button,[role=alertdialog] button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ').slice(0,40)).join(' | '));
  return 'MENU ITEMS '+items+'\nDIALOGS '+all+'\nBTNS '+btns;
}
