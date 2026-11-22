async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations/f7c2a15f-ebaf-495e-a15f-8bbad2157c64');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const panel = await d.innerText();
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-sender-job-panel-desktop.png' });
  const btns = await d.getByRole('button').allInnerTexts();
  return 'PANEL: '+panel.slice(0,1500)+'\nBTNS: '+btns.join(' | ');
}
