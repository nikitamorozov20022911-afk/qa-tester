async page => {
  const urls = ['/applications/8d25a157-dc89-4202-8993-fd1d003f6a16', '/applications/29bd04ad-e749-45d0-a3a8-8941f8d069a8', '/applications/33f73783-396d-40f7-a90b-e7a8b01872a3', '/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584?application=33f73783-396d-40f7-a90b-e7a8b01872a3'];
  const out = [];
  let i = 0;
  for (const u of urls) {
    i++;
    const resp = await page.goto('https://hunters-sooty.vercel.app' + u).catch(e => null);
    await page.waitForLoadState('networkidle').catch(()=>{});
    await page.waitForTimeout(1500);
    const ds = page.getByRole('dialog'); const n = await ds.count();
    const t = n ? await ds.last().innerText() : await page.locator('main').innerText().catch(()=> '');
    await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-03-access-sender-' + i + '-desktop.png' });
    out.push(i + ') ' + u + ' -> HTTP ' + (resp ? resp.status() : '?') + ' final=' + page.url().replace('https://hunters-sooty.vercel.app','') + ' dialogs=' + n + ' :: ' + t.slice(0, 260).replace(/\n+/g, ' / '));
  }
  return out.join('\n');
}
