async page => {
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.locator('[role=dialog]').first().waitFor({timeout:10000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/F-SHOT1.png', fullPage:true});
  const dl = (await page.locator('[role=dialog]').allInnerTexts()).join('||');
  const btns = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button,[role=dialog] a')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')+(e.getAttribute('href')?'->'+e.getAttribute('href'):'')).join(' | '));
  await page.goto('https://hunters-sooty.vercel.app/tenders?mine=1'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/F-SHOT2.png'});
  const m = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
  const i=m.indexOf('QA-AUTO 1020 E1 מכרז');
  await page.goto('https://hunters-sooty.vercel.app/tenders'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const a = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
  const j=a.indexOf('T-58');
  return 'DLG '+dl.slice(dl.indexOf('דיווח על המכרז')>0?dl.indexOf('על החברה'):0).slice(0,1200)+'\nBTNS '+btns+'\nMINE: '+(i>=0?m.slice(i-60,i+60):'NOT FOUND')+'\nALL: '+(j>=0?a.slice(j-80,j+120):'T-58 NOT IN LIST');
}
