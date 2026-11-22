async page => {
  await page.goto('https://hunters-sooty.vercel.app/profile?tab=agreements');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-08-sender-agreements-desktop.png', fullPage: true });
  const m = await page.locator('main').innerText();
  const rows = await page.locator('main tr').allInnerTexts().catch(()=>[]);
  return m.slice(0, 300) + '\nROWS(' + rows.length + '):\n' + rows.slice(0, 8).map(r => r.replace(/\s+/g, ' ')).join('\n');
}
