async page => {
  const urls = ['/applications/7f43af13-0e89-4873-a55a-7ed15f0e8a83', '/collaborations/cc751076?application=7f43af13-0e89-4873-a55a-7ed15f0e8a83', '/my-candidates/51b1cf64-9202-484d-b666-a9e1bec2a915', '/applications/95e1d65a-fc57-411d-95f8-52bab39c7c84'];
  const out = [];
  let i = 0;
  for (const u of urls) {
    i++;
    const resp = await page.goto('https://hunters-sooty.vercel.app' + u).catch(e => null);
    await page.waitForLoadState('networkidle').catch(()=>{});
    await page.waitForTimeout(1500);
    const ds = page.getByRole('dialog'); const n = await ds.count();
    const t = n ? await ds.last().innerText() : await page.locator('main').innerText().catch(()=> '');
    await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-03-access-owner-' + i + '-desktop.png' });
    out.push(i + ') ' + u + ' -> HTTP ' + (resp ? resp.status() : '?') + ' final=' + page.url().replace('https://hunters-sooty.vercel.app','') + ' dialogs=' + n + ' :: ' + t.slice(0, 260).replace(/\n+/g, ' / '));
  }
  return out.join('\n');
}
