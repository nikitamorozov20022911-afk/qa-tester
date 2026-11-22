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
  const bodies=[]; page.on('response', async r=>{ try{ const ct=r.headers()['content-type']||''; if(/json|x-component|text/.test(ct)) bodies.push(await r.text()); }catch(e){} });
  await page.goto('https://hunters-sooty.vercel.app/tenders/8fab642c'.length? 'https://hunters-sooty.vercel.app/tenders?page=2':''); await page.waitForLoadState('networkidle');
  const h = await page.locator('main a[href^="/tenders/8fab642c"]').first().getAttribute('href');
  await page.goto('https://hunters-sooty.vercel.app'+h); await page.waitForLoadState('networkidle'); await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const dt=(await page.locator('[role=dialog]').allInnerTexts()).join('||');
  await page.screenshot({path:'screenshots/run-1020/E1/07-E1B-anon-tender-T22-hr-desktop.png', fullPage:true});
  const all = (await page.content()) + bodies.join('\n');
  const names = ['סופר פארם','demo-company-1','superpharm','super-pharm'].map(n=>n+':'+(all.split(n).length-1)).join(' ');
  const ids = [...new Set(all.match(/\\?"(company_?[Ii]d|publisher_?[Ii]d|owner_?[Ii]d|companyName|company_name|publisherName)\\?":\\?"[^"\\]*/g)||[])].slice(0,10).join(' ; ');
  await page.keyboard.press('Escape');
  return 'HREF '+h+'\n'+dt.slice(0,1500)+'\nNAMES '+names+'\nIDS '+ids+'\nemails '+[...new Set(all.match(/[\w.+-]+@[\w-]+\.[a-z.]+/g)||[])].join(',');
}
