async page => {
//PII
  await page.goto('https://hunters-sooty.vercel.app/collaborations/d7220429-9b52-4224-92a7-59df07b34af1');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const t = await d.innerText();
  const btns = await d.getByRole('button').allInnerTexts();
  const links = await d.locator('a').evaluateAll(as => as.map(a => a.innerText.trim().slice(0,40)+' -> '+a.getAttribute('href')));
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-50-owner-job-panel-desktop.png' });
  const dom = await scanDom('jobpanel');
  page.off('response', onResp);
  return t.slice(0,1800) + '\nBTNS ' + JSON.stringify(btns) + '\nLINKS ' + JSON.stringify(links) + '\n' + dom + '\nNET('+nResp+'): ' + (hits.length? hits.join('\n') : 'clean');
}
