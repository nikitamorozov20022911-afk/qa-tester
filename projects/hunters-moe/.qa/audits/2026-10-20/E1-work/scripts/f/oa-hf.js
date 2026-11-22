async page => {
  await page.goto('https://hunters-sooty.vercel.app/my-jobs?archived=1'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/54-E1F-owner-archive-list-hunter_free-desktop.png'});
  const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
  return (t.match(/[^\n]*E1[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*/g)||['none']).join(' ;; ').replace(/\n/g,' / ');
}
