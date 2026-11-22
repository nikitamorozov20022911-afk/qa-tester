async page => {
  const d2 = page.getByRole('dialog').last();
  const tas = d2.getByPlaceholder('כאן תהיה התשובה');
  await tas.nth(0).fill('QA-AUTO 1020 E1 – תשובה');
  await tas.nth(1).fill('QA-AUTO 1020 E1 – הערת בדיקה של השולח');
  const resps = [];
  const h = r => { if (r.request().method()==='POST') resps.push(r); };
  page.on('response', h);
  await d2.getByRole('button', { name: 'סיום והגשה' }).click();
  await page.waitForTimeout(500);
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(1500);
  page.off('response', h);
  let bodies = [];
  for (const r of resps) { let t=''; try { t = (await r.text()).slice(0,600);} catch(e){} bodies.push(r.status()+' '+r.url()+' :: '+t); }
  const shot = 'screenshots/run-1020/E1/E1A-37-submit-bravo-done-desktop.png';
  await page.screenshot({ path: shot });
  const dl = await page.getByRole('dialog').last().innerText().catch(()=>'');
  const toast = await page.getByRole('region', { name: /התראות/ }).innerText().catch(()=> '');
  return 'TOAST: '+toast+'\nDIALOG: '+dl.slice(0,600)+'\nPOSTS:\n'+bodies.join('\n');
}
