async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations');
  await page.waitForLoadState('networkidle').catch(()=>{});
  const b = page.getByRole('button', { name: /התראות/ }).first();
  await b.waitFor({ timeout: 15000 });
  const label = await b.getAttribute('aria-label');
  await b.click();
  const panel = page.getByRole('dialog').or(page.locator('[data-radix-popper-content-wrapper]')).first();
  await panel.waitFor({ timeout: 10000 });
  await panel.getByText('טוען…').waitFor({ state: 'detached', timeout: 20000 }).catch(()=>{});
  await page.waitForLoadState('networkidle').catch(()=>{});
  const txt = await panel.innerText();
  globalThis.__shot="screenshots/run-1020/E1/verify-nda-owner-bell-after-sign-before-submit-desktop.png"; if (globalThis.__shot) await page.screenshot({ path: globalThis.__shot });
  return new Date().toISOString() + ' LABEL: ' + label + '\n' + txt.slice(0, 3000);
}
