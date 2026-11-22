async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations');
  await page.waitForLoadState('networkidle').catch(()=>{});
  const b = page.getByRole('button', { name: /התראות/ }).first();
  const label = await b.getAttribute('aria-label');
  await b.click();
  const panel = page.getByRole('dialog').or(page.locator('[data-radix-popper-content-wrapper]')).first();
  await panel.waitFor({ timeout: 10000 });
  await page.waitForTimeout(800);
  const txt = await panel.innerText();
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-73-sender-bell-nda-desktop.png' });
  return 'LABEL: ' + label + '\n' + txt.slice(0, 2500);
}
