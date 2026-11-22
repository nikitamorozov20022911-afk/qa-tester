async page => {
//PII
  const IDX = __IDX__;
  await page.goto('https://hunters-sooty.vercel.app/collaborations/d7220429-9b52-4224-92a7-59df07b34af1');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const cards = d.getByRole('button', { name: /מועמד\/ת אנונימי\/ת/ });
  await cards.nth(IDX).click();
  await page.waitForTimeout(1000);
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(1500);
  const url = page.url();
  const dl = page.getByRole('dialog').last();
  const t = await dl.innerText().catch(()=> '');
  const btns = await dl.getByRole('button').allInnerTexts().catch(()=>[]);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-42-owner-app'+IDX+'-desktop.png' });
  const dom = await scanDom('app'+IDX);
  page.off('response', onResp);
  return 'URL '+url+'\n'+t.slice(0,2200) + '\nBTNS ' + JSON.stringify(btns) + '\n' + dom + '\nNET('+nResp+'): ' + (hits.length? hits.join('\n') : 'clean') + '\nURLS ' + [...urls].join(' , ');
}
