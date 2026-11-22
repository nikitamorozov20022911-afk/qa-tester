  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-43-owner-sees-answer-privacy2-desktop.png' });
  const dom = await scanDom('card');
  page.off('response', onResp);
  return (await page.getByRole('dialog').last().innerText()).slice(-900) + '\nBTNS ' + JSON.stringify(await page.getByRole('dialog').last().getByRole('button').allInnerTexts()) + '\n' + dom + '\nNET(' + nResp + '): ' + (hits.length ? hits.join('\n') : 'clean');
