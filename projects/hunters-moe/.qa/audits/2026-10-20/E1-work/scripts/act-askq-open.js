  await page.getByRole('dialog').last().getByRole('button', { name: 'שאלות נוספות' }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-43-owner-askq-dialog-desktop.png' });
  const all = page.getByRole('dialog'); const c = await all.count();
  const txt = await all.last().innerText();
  const flds = await all.last().locator('textarea,input').evaluateAll(es=>es.map(e=>e.tagName+':'+(e.placeholder||e.getAttribute('aria-label'))));
  return 'dialogs='+c+'\n'+txt.slice(0,1500)+'\nFIELDS '+JSON.stringify(flds);
