async page => {
  const T='https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302';
  await page.goto(T); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/F-SHOT.png', fullPage:true});
  const dl = await page.locator('[role=dialog]').allInnerTexts();
  const main = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText.slice(0,1500));
  const inputs = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] input,[role=dialog] textarea,[role=dialog] button')].map(e=>`${e.tagName}|${e.type||''}|${e.name||''}|${(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||'').slice(0,50).replace(/\n/g,' ')}|${e.disabled?'dis':''}`).join('\n'));
  return 'URL '+page.url()+'\nDLG: '+dl.join('||')+'\nINPUTS:\n'+inputs+'\nMAIN: '+main;
}
