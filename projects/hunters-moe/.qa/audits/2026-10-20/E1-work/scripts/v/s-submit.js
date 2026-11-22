async page => {
  const out=[];
  const posts=[]; const h=async r=>{ if(r.request().method()!=='GET'){ let t=''; try{t=(await r.text()).slice(0,300);}catch(e){} posts.push(new Date().toISOString().slice(11,19)+' '+r.request().method()+' '+r.status()+' '+r.url()+' :: '+t);} }; page.on('response',h);
  const d = page.getByRole('dialog').last();
  await d.getByText('פרופיל אנונימי', { exact: true }).click();
  await d.getByText('אין צורך ב-NDA').first().click();
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-submit-step1-no-paid-nda-desktop.png' });
  await d.getByRole('button', { name: 'המשך', exact: true }).click();
  const d2 = page.getByRole('dialog').last();
  await d2.getByRole('button', { name: 'סיום והגשה' }).waitFor({ timeout: 20000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
  out.push('STEP2: '+(await d2.innerText()).slice(0,700));
  const tas = d2.getByPlaceholder('כאן תהיה התשובה');
  const k = await tas.count();
  for (let i=0;i<k;i++) await tas.nth(i).fill(i==0?'QA-AUTO 1020 E1 V – תשובה':'QA-AUTO 1020 E1 V – הערת בדיקה של השולח');
  await d2.getByRole('button', { name: 'סיום והגשה' }).click();
  out.push('SUBMITTED_AT '+new Date().toISOString());
  await d2.waitFor({ state: 'hidden', timeout: 20000 }).catch(()=>{});
  await page.waitForLoadState('networkidle').catch(()=>{});
  const toast = await page.getByRole('region', { name: /התראות/ }).innerText().catch(()=> '');
  out.push('TOAST: '+toast);
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-submit-done-desktop.png' });
  page.off('response',h);
  out.push('NONGET:\n'+posts.join('\n'));
  return out.join('\n');
}
