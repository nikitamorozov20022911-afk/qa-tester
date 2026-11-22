async page => {
  const row = page.locator('main tr').filter({ hasText: '20.10.2026' }).first();
  await row.getByRole('button', { name: 'צפייה' }).or(row.getByRole('link', { name: 'צפייה' })).first().click();
  const d = page.getByRole('dialog').last(); await d.waitFor({ timeout: 10000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-46-owner-nda-view-desktop.png' });
  const t = await d.innerText();
  const imgs = await d.locator('img').evaluateAll(is => is.map(i => i.src.slice(0, 120)));
  return t.slice(0, 2500) + '\nIMGS ' + JSON.stringify(imgs);
}
