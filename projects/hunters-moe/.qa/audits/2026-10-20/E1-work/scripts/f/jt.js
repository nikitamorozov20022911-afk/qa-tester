async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations/f7c2a15f-ebaf-495e-a15f-8bbad2157c64'); await page.waitForLoadState('networkidle');
  const d = page.locator('[role=dialog]').first(); await d.waitFor({timeout:10000});
  await d.getByText('טוען…').first().waitFor({state:'detached',timeout:10000}).catch(()=>{});
  return (await d.innerText()).slice(0,400);
}
