async page => {
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first();
  const rows = d.getByText('הד האנטר דמו 2', {exact:true});
  const cnt = await rows.count();
  if (cnt!==1) return 'rows='+cnt;
  await rows.click();
  await d.getByText('QA-AUTO 1020 E1 הצעה FREE-PLUS').waitFor({timeout:8000});
  await page.screenshot({path:'screenshots/run-1020/E1/42-E1F-company2-hfree-bid-expanded-desktop.png', fullPage:true});
  const exp = await d.innerText();
  const btns = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')).join(' | '));
  const ap = d.getByRole('button',{name:'אישור ההצעה'});
  const apc = await ap.count();
  if (apc!==1) return 'approve btns='+apc+'\n'+exp.slice(-800)+'\nBTNS '+btns;
  await ap.click();
  const cd = page.locator('[role=alertdialog]').or(page.locator('[role=dialog]').nth(1));
  await cd.first().waitFor({timeout:8000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/42-E1F-company2-approve-confirm-desktop.png'});
  const all = await page.locator('[role=dialog],[role=alertdialog]').allInnerTexts();
  const btns2 = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button,[role=alertdialog] button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')).join(' | '));
  return 'EXP tail: '+exp.slice(-700)+'\nBTNS '+btns+'\nAFTER CLICK DIALOGS: '+all.map(x=>x.slice(-500)).join('||')+'\nBTNS2 '+btns2;
}
