async page => {
  const d = page.getByRole('dialog').first();
  const vals = await d.locator('textarea, input[type=text]').evaluateAll(es => es.map(e => e.value));
  const respP = page.waitForResponse(r => r.request().method()==='POST', { timeout: 20000 }).catch(()=>null);
  await d.getByRole('button', { name: 'סיום' }).click();
  const r = await respP;
  await d.waitFor({ state: 'hidden', timeout: 15000 }).catch(()=>{});
  await page.waitForLoadState('networkidle').catch(()=>{});
  const toast = await page.getByRole('region', { name: /התראות/ }).innerText().catch(()=> '');
  const first = await page.locator('main a[href*="/my-candidates/"]').first().getAttribute('href');
  const firstTxt = await page.locator('main article').first().innerText();
  return 'VALUES: ' + JSON.stringify(vals) + '\nPOST ' + (r? r.status():'none') + '\nTOAST: ' + toast + '\nFIRST: ' + first + ' | ' + firstTxt.replace(/\n/g,' / ');
}
