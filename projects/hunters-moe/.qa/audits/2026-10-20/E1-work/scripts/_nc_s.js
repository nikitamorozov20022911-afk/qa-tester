async page => {
  const pats = ['ביקשו את הפרופיל המלא של QA-AUTO 1020 E1 Alpha', 'עודכן ל„התקבל/ה לעבודה”', 'Bravo במשרה „QA-AUTO 1020 E1 משרה אנונימית” עודכן'];
  const out = [];
  let i = 0;
  for (const p of pats) {
    i++;
    await page.goto('https://hunters-sooty.vercel.app/collaborations');
    await page.waitForLoadState('networkidle').catch(()=>{});
    await page.getByRole('button', { name: /התראות/ }).first().click();
    const it = page.getByText(new RegExp(p)).first();
    await it.waitFor({ timeout: 10000 }).catch(()=>{});
    if (!(await it.count())) { out.push(i+') '+p+' -> not found'); continue; }
    await it.click();
    await page.waitForLoadState('networkidle').catch(()=>{});
    await page.waitForTimeout(2500);
    const ds = page.getByRole('dialog'); const n = await ds.count();
    const t = n ? await ds.last().innerText() : await page.locator('main').innerText();
    await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-74-sender-notif-click-' + i + '-desktop.png' });
    out.push(i + ') ' + p + ' -> ' + page.url().replace('https://hunters-sooty.vercel.app','') + ' dialogs=' + n + ' :: ' + t.slice(0, 160).replace(/\n+/g, ' / '));
  }
  return out.join('\n');
}
