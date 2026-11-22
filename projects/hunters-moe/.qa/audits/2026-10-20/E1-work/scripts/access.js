async page => {
  const urls = __URLS__;
  const out = [];
  let i = 0;
  for (const u of urls) {
    i++;
    const resp = await page.goto('https://hunters-sooty.vercel.app' + u).catch(e => null);
    await page.waitForLoadState('networkidle').catch(()=>{});
    await page.waitForTimeout(1500);
    const ds = page.getByRole('dialog'); const n = await ds.count();
    const t = n ? await ds.last().innerText() : await page.locator('main').innerText().catch(()=> '');
    await page.screenshot({ path: '__PFX__-' + i + '-desktop.png' });
    out.push(i + ') ' + u + ' -> HTTP ' + (resp ? resp.status() : '?') + ' final=' + page.url().replace('https://hunters-sooty.vercel.app','') + ' dialogs=' + n + ' :: ' + t.slice(0, 260).replace(/\n+/g, ' / '));
  }
  return out.join('\n');
}
