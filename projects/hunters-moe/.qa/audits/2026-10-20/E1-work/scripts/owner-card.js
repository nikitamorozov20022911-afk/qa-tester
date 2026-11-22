async page => {
//PII
  // open owner's application card by index of anonymous card whose summary contains KEY
  const KEY = '__KEY__';
  await page.goto('https://hunters-sooty.vercel.app/collaborations/__JOB__');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const cards = d.getByRole('button', { name: new RegExp('__CARDRE__') });
  const n = await cards.count();
  for (let i=0;i<n;i++) { const t = await cards.nth(i).innerText(); if (t.includes(KEY)) { await cards.nth(i).click(); break; } }
  const dl = page.getByRole('dialog').last();
  await dl.getByText('סטטוס מועמד').waitFor({ timeout: 15000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
  //ACTION
  return 'n='+n+'\n'+(await page.getByRole('dialog').last().innerText()).slice(-1500);
}
