  await page.waitForTimeout(1500);
  await page.screenshot({ path: '__SHOTX__' });
  const dom = await scanDom('card');
  page.off('response', onResp);
  return (await page.getByRole('dialog').last().innerText()).slice(-900) + '\nBTNS ' + JSON.stringify(await page.getByRole('dialog').last().getByRole('button').allInnerTexts()) + '\n' + dom + '\nNET(' + nResp + '): ' + (hits.length ? hits.join('\n') : 'clean');
