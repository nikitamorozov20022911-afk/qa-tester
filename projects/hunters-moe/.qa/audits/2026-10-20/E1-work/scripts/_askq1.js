async page => {
  // open owner's application card by index of anonymous card whose summary contains KEY
  const KEY = 'מהנדס/ת בדיקות אוטומציה';
  await page.goto('https://hunters-sooty.vercel.app/collaborations/d7220429-9b52-4224-92a7-59df07b34af1');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const cards = d.getByRole('button', { name: new RegExp('מועמד/ת אנונימי/ת') });
  const n = await cards.count();
  for (let i=0;i<n;i++) { const t = await cards.nth(i).innerText(); if (t.includes(KEY)) { await cards.nth(i).click(); break; } }
  const dl = page.getByRole('dialog').last();
  await dl.getByText('סטטוס מועמד').waitFor({ timeout: 15000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
    await page.getByRole('dialog').last().getByRole('button', { name: 'שאלות נוספות' }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-43-owner-askq-dialog-desktop.png' });
  const all = page.getByRole('dialog'); const c = await all.count();
  const txt = await all.last().innerText();
  const flds = await all.last().locator('textarea,input').evaluateAll(es=>es.map(e=>e.tagName+':'+(e.placeholder||e.getAttribute('aria-label'))));
  return 'dialogs='+c+'\n'+txt.slice(0,1500)+'\nFIELDS '+JSON.stringify(flds);

  return 'n='+n+'\n'+(await page.getByRole('dialog').last().innerText()).slice(-1500);
}
