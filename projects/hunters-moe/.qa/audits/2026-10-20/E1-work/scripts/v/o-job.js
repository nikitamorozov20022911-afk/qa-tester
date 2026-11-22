async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations/f7c2a15f-ebaf-495e-a15f-8bbad2157c64');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  if (globalThis.__shot) await page.screenshot({ path: globalThis.__shot });
  return (await d.innerText()).slice(0,2500);
}
