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
  const resp=[]; page.on('response', async r=>{ try{ const ct=r.headers()['content-type']||''; if(/json|x-component|text\/plain/.test(ct)){ const b=await r.text(); if(b.includes('37fb9213')||b.includes('QA-AUTO 1020 E1')) resp.push(r.url().slice(0,140)+' :: '+b.length+' :: email='+/@hunters\.dev|demo-company-2/.test(b)+' phone='+/0\d{1,2}-?\d{7}/.test(b)); }}catch(e){} });
  await page.goto('https://hunters-sooty.vercel.app/tenders'); await page.waitForLoadState('networkidle');
  const list = page.locator('main');
  const has = await list.getByText('QA-AUTO 1020 E1 מכרז').count();
  const pos = await page.evaluate(()=>{ const all=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0 && /^T-\d+$/.test(e.innerText?.trim())).map(e=>e.innerText.trim()); return all.slice(0,10).join(','); });
  await page.screenshot({path:'screenshots/run-1020/E1/35-E1B-all-tenders-hr-desktop.png'});
  let card='';
  if (has) { card = await list.getByText('QA-AUTO 1020 E1 מכרז').first().locator('xpath=ancestor::*[self::a or self::article or self::li][1]').innerText().catch(e=>'ERR'); }
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const dlg = await page.locator('[role=dialog]').allInnerTexts();
  const btns = await page.evaluate(()=>[...document.querySelectorAll('main button, main a, [role=dialog] button, [role=dialog] a, [role=dialog] input, [role=dialog] textarea')].filter(e=>e.offsetParent).map(e=>e.tagName+':'+(e.innerText||e.placeholder||e.name||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')).join(' | '));
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1B-tender-view-hr-desktop.png', fullPage:true});
  const html = await page.content();
  const leak = { email: /demo-company-2@/.test(html), techno: (html.match(/טכנו-סייבר/g)||[]).length };
  await page.goto('https://hunters-sooty.vercel.app/tenders'); await page.waitForLoadState('networkidle');
  const bt = await bell('73-E1B-bell-hr-desktop.png');
  return 'IN LIST: '+has+' firstTs: '+pos+'\nCARD: '+card+'\nURL '+page.url()+'\nDLG: '+dlg.join('||')+'\nBTNS: '+btns+'\nLEAK '+JSON.stringify(leak)+'\nRESP '+resp.join('\n')+'\nBELL:\n'+bt;
}
