async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations');
  await page.reload();
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
  const items = panel.getByText(/QA-AUTO 1020 E1/);
  const n = await items.count();
  for (let i=0;i<Math.min(n,2);i++) await items.nth(i).evaluate(e=>{e.style.outline='3px solid red'; e.style.outlineOffset='3px';});
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-owner-bell-run3-no-nda-annot-desktop.png' });
  return new Date().toISOString() + ' LABEL: ' + label + '\nhasNDAsigned=' + /חתמו על ה-NDA|NDA נחתם|חתם.*NDA/.test(txt) + '\n' + txt.slice(0, 500);
}
