async page => {
  const net=[]; page.on('response', async r=>{ if(r.request().method()!=='GET'){ let b=''; try{b=(await r.text()).slice(0,400)}catch(e){}; net.push(r.request().method()+' '+r.status()+' '+r.url().slice(0,120)+' :: '+b.replace(/\n/g,' ')); }});
  const T='https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302';
  await page.goto(T); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]');
  await d.locator('input[name=amount]').fill('3000');
  await d.locator('textarea[name=notes]').fill('QA-AUTO 1020 E1 הצעה FREE-PLUS');
  await d.locator('input[name=confirm]').check();
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1F-hfree-bid-filled-desktop.png'});
  const t0=Date.now();
  await d.getByRole('button',{name:'הגשת הצעה'}).click();
  await d.getByText('ההצעה שלכם נשלחה').waitFor({timeout:10000}).catch(()=>{});
  const dt=Date.now()-t0;
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1F-hfree-after-bid-desktop.png', fullPage:true});
  const dl = await page.locator('[role=dialog]').allInnerTexts();
  const toasts = await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts();
  return 'ms '+dt+'\nDLG: '+dl.join('||')+'\nTOAST: '+toasts.join('||')+'\nNET:\n'+net.join('\n');
}
