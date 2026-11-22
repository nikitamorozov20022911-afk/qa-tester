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
  const bodies=[]; page.on('response', async r=>{ try{ if(r.url().includes('8fab642c')) bodies.push(r.url()+'\n'+await r.text()); }catch(e){} });
  await page.goto('https://hunters-sooty.vercel.app/tenders/8fab642c-be3e-473d-88db-9e75fcedc0f6'); await page.waitForLoadState('networkidle');
  const all = (await page.content()) + bodies.join('\n');
  const idx=[]; let k=-1; while((k=all.indexOf('סופר פארם',k+1))>=0) idx.push(all.slice(Math.max(0,k-200),k+60).replace(/\s+/g,' '));
  const c = all.indexOf('רשת פארם מובילה');
  return 'count '+idx.length+'\n'+idx.slice(0,4).join('\n---\n')+'\nNEAR anon name: '+all.slice(c-300,c+600).replace(/\s+/g,' ');
}
