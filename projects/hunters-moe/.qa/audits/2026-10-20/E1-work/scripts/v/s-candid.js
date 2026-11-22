async page => {
  await page.goto('https://hunters-sooty.vercel.app/my-candidates');
  await page.waitForLoadState('networkidle').catch(()=>{});
  const links = await page.locator('main a[href*="/my-candidates/"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')+' | '+e.innerText.replace(/\n/g,' ').slice(0,60)));
  return links.filter(l=>/Delta/.test(l)).join('\n') || links.slice(0,5).join('\n');
}
