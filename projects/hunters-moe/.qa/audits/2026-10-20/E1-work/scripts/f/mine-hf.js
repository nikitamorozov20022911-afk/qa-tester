async page => {
  await page.goto('https://hunters-sooty.vercel.app/tenders?mine=1'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/35-E1F-my-bids-hunter_free-desktop.png', fullPage:true});
  return 'URL '+page.url()+'\n'+await page.evaluate(()=>(document.querySelector('main')||document.body).innerText.slice(0,3000));
}
