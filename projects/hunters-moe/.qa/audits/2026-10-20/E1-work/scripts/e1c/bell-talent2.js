async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations');
  const b = page.getByRole('button', { name: /התראות/ }).first();
  await b.waitFor({ timeout: 15000 });
  const label = await b.getAttribute('aria-label');
  await b.click();
  const panel = page.getByRole('dialog').or(page.locator('[data-radix-popper-content-wrapper]')).first();
  await panel.waitFor({ timeout: 10000 });
  await panel.getByText('טוען…').waitFor({ state: 'detached', timeout: 15000 }).catch(()=>{});
  const txt = await panel.innerText();
  const links = await panel.locator('a').evaluateAll(as => as.map(a => a.innerText.slice(0,80).replace(/\n/g,' ') + ' => ' + a.getAttribute('href')).slice(0,15));
  await page.screenshot({ path: '/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1C-bell-talent2-' + 'after-done' + '-desktop.png' });
  await page.keyboard.press('Escape');
  return 'URL: ' + page.url() + '\nLABEL: ' + label + '\n' + txt.slice(0, 2500) + '\nLINKS:\n' + links.join('\n');
}
