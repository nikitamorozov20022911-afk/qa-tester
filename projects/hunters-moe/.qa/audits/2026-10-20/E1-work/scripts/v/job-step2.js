async page => {
  const out=[];
  await page.getByRole('textbox').first().fill('QA-AUTO 1020 E1 V – כמה שנות ניסיון?');
  await page.getByRole('button', { name: 'המשך', exact: true }).click();
  await page.waitForURL(/done/, { timeout: 30000 }).catch(()=>{});
  await page.waitForLoadState('networkidle').catch(()=>{});
  out.push('URL '+page.url());
  const dlg = page.getByRole('dialog').first();
  await dlg.waitFor({ timeout: 10000 }).catch(()=>{});
  out.push('DIALOG: '+(await dlg.innerText().catch(()=>'none')).slice(0,800));
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-job-done-desktop.png' });
  const no = page.getByRole('button', { name: 'לא תודה' });
  if (await no.count()) { await no.first().click(); await page.waitForLoadState('networkidle').catch(()=>{}); }
  out.push('AFTER '+page.url()+'\n'+(await page.locator('main').innerText()).slice(0,500));
  return out.join('\n');
}
