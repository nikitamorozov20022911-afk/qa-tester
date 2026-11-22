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
  const net=[]; page.on('request', r=>{ if(r.method()!=='GET') net.push(r.method()+' '+r.url().slice(0,120)); });
  const u0 = page.url();
  await page.getByRole('button',{name:/מיכל לוי/}).first().click();
  await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/42-E1B-company2-bid-detail-desktop.png', fullPage:true});
  const dt = await page.locator('[role=dialog]').allInnerTexts();
  const btns = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button, [role=dialog] a, main a')].filter(e=>e.offsetParent).map(e=>e.tagName+':'+(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ').slice(0,50)+(e.getAttribute('href')?'->'+e.getAttribute('href'):'')).join(' | '));
  return 'URL0 '+u0+'\nURL '+page.url()+'\nDLGS('+dt.length+'): '+dt.map(x=>x.slice(-1500)).join('\n||\n')+'\nBTNS: '+btns+'\nNET '+net.join('\n');
}
