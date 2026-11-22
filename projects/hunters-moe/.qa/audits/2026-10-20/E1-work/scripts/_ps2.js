async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations');
  await page.waitForLoadState('networkidle').catch(()=>{});
  let btn = page.getByRole('button', { name: /ממתינים/ }).or(page.getByRole('link', { name: /ממתינים/ }));
  let via = 'direct';
  if (!(await btn.count())) { await page.getByRole('button', { name: /^עוד/ }).click(); await page.waitForTimeout(600); btn = page.getByRole('menuitem', { name: /ממתינים/ }).or(page.getByText(/ממתינים/)); via='menu עוד'; }
  const lbl = await btn.first().innerText();
  await btn.first().click();
  const dl = page.getByRole('dialog').last(); await dl.waitFor({ timeout: 10000 });
  await page.waitForTimeout(1500);
  const tabs = await dl.getByRole('tab').allInnerTexts().catch(()=>[]);
  const out = ['via '+via+' label='+lbl.replace(/\n/g,' '), 'TABS '+JSON.stringify(tabs)];
  out.push('TAB0: ' + (await dl.innerText()).slice(0, 1200));
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-44-sender-pending-fullreq-tab1-desktop.png' });
  const t = dl.getByRole('tab');
  if (await t.count() > 1) { await t.nth(1).click(); await page.waitForTimeout(1200); out.push('TAB1: ' + (await dl.innerText()).slice(0, 1200)); await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-44-sender-pending-fullreq-tab2-desktop.png' }); }
  return out.join('\n');
}
