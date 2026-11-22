async page => {
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first();
  const hr = d.getByText('מיכל לוי', {exact:true}); const c=await hr.count();
  if(c===1){ await hr.click(); await d.getByText('QA-AUTO 1020 E1 הצעה HR').waitFor({timeout:8000}).catch(()=>{}); }
  await page.screenshot({path:'screenshots/run-1020/E1/42-E1F-company2-after-approve-desktop.png', fullPage:true});
  const t = await d.innerText();
  const btns = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')).join(' | '));
  await page.goto('https://hunters-sooty.vercel.app/tenders?mine=1'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/66-E1F-company2-my-tenders-after-approve-desktop.png'});
  const m = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
  const i = m.indexOf('T-58');
  return 'HRc='+c+'\nDLG tail: '+t.slice(t.indexOf('הצעות שהוגשו'))+'\nBTNS '+btns+'\nMY TENDERS around T-58: '+m.slice(Math.max(0,i-200),i+300);
}
