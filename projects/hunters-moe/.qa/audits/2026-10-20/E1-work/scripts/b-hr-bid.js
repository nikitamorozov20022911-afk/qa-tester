async page => {
  const dump = async (shot) => { if(shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot, fullPage:true});
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const inputs = await page.evaluate(()=>[...document.querySelectorAll('main input,main textarea,main select,main button,[role=dialog] input,[role=dialog] button')].map(e=>`${e.tagName}|${e.type||''}|${e.name||e.id||''}|${(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||'').slice(0,50).replace(/\n/g,' ')}|${e.checked??''}|${e.disabled?'dis':''}`).join('\n'));
    return `url=${page.url()}\n${t}\n----\n${inputs}`; };
  const bell = async (shot) => {
    const b = page.locator('header button[aria-label*="התראות"], button[aria-label*="התראות"], button[aria-label*="notif" i]').first();
    await b.click(); await page.waitForTimeout(0);
    const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
    await panel.waitFor({timeout:8000}).catch(()=>{});
    await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
    if (shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot});
    const t = await panel.innerText().catch(e=>'ERR '+e.message);
    await page.keyboard.press('Escape');
    return t; };
  const net=[]; page.on('response', async r=>{ if(r.request().method()!=='GET'){ let b=''; try{b=(await r.text()).slice(0,300)}catch(e){}; net.push(r.request().method()+' '+r.status()+' '+r.url().slice(0,120)+' :: '+b.replace(/\n/g,' ')); }});
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]');
  await d.locator('input[name=amount]').fill('1000');
  await d.locator('textarea[name=notes]').fill('QA-AUTO 1020 E1 הצעה HR');
  await d.locator('input[name=confirm]').check();
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1B-hr-bid-filled-desktop.png'});
  await d.getByRole('button',{name:'הגשת הצעה'}).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(0);
  await d.getByRole('button',{name:'הגשת הצעה'}).waitFor({state:'detached',timeout:10000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1B-hr-after-bid-desktop.png'});
  const dt = await page.locator('[role=dialog]').allInnerTexts();
  const toasts = await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts();
  return 'DLG: '+dt.join('||')+'\nTOAST: '+toasts.join('||')+'\nNET:\n'+net.join('\n');
}
