async page => {
  const reqs = [];
  const h = r => { if (/supabase\.co/.test(r.url())) reqs.push(r.request().method()+' '+r.status()+' '+r.url().slice(0,200)); };
  page.on('response', h);
  await page.goto('https://hunters-sooty.vercel.app/collaborations');

  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.getByRole('button', { name: /התראות/ }).first().click();
  await page.waitForTimeout(2000);
  page.off('response', h);
  return reqs.join('\n');
}
