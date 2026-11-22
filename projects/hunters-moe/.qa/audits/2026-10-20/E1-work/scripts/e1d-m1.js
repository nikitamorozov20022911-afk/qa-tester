async page => {
  await page.setViewportSize({width:1440,height:900});
  await page.locator('canvas').first().waitFor({timeout:40000}).catch(()=>{});
  await page.waitForLoadState('networkidle',{timeout:20000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/miro-open.png'});
  const btns = await page.evaluate(()=>[...document.querySelectorAll('button,[role=button],[role=menuitem]')].map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim().slice(0,60)).filter(Boolean));
  return JSON.stringify({url:page.url(), btns:[...new Set(btns)]});
}
