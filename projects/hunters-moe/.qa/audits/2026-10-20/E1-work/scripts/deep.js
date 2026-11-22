async page => {
//PII
  await page.goto('__URL__');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '__SHOT__' });
  const ds = page.getByRole('dialog'); const n = await ds.count();
  const t = n ? await ds.last().innerText() : await page.locator('body').innerText();
  const dom = await scanDom('deep');
  page.off('response', onResp);
  return page.url() + ' dialogs=' + n + '\n' + t.slice(0, 300) + ' … ' + t.slice(-500) + '\n' + dom + '\nNET(' + nResp + '): ' + (hits.length ? hits.join('\n') : 'clean');
}
