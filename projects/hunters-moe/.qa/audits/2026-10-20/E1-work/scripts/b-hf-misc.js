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
  const found=[];
  for (let p=1;p<=4;p++){ await page.goto('https://hunters-sooty.vercel.app/tenders?page='+p); await page.waitForLoadState('networkidle');
    const cards = await page.evaluate(()=>[...document.querySelectorAll('main a[href^="/tenders/"]')].map(a=>({h:a.getAttribute('href'),t:a.innerText.replace(/\n+/g,' ').slice(0,160), anon: !!a.querySelector('img[src*="anonymous"]')})));
    for (const c of cards) if (c.anon || /אנונימי|חסוי/.test(c.t)) found.push(JSON.stringify(c)); }
  let anonView='';
  if (found.length){ const h=JSON.parse(found[0]).h; await page.goto('https://hunters-sooty.vercel.app'+h); await page.waitForLoadState('networkidle'); await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{}); anonView=(await page.locator('[role=dialog]').allInnerTexts()).join('||').slice(0,1200); await page.screenshot({path:'screenshots/run-1020/E1/07-E1B-anon-tender-hfree2-desktop.png', fullPage:true}); await page.keyboard.press('Escape'); }
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'); await page.waitForLoadState('networkidle'); await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.getByRole('button',{name:'שדרוג ל-PLUS'}).click(); await page.waitForLoadState('networkidle');
  await page.waitForTimeout(0);
  const after = 'URL '+page.url()+' DLGS: '+(await page.locator('[role=dialog]').allInnerTexts()).map(x=>x.slice(0,1500)).join('\n||\n');
  await page.screenshot({path:'screenshots/run-1020/E1/65-E1B-hfree2-upgrade-from-tender-desktop.png', fullPage:true});
  await page.keyboard.press('Escape');
  return 'ANON: '+found.join('\n')+'\nANONVIEW: '+anonView+'\nUPGRADE: '+after;
}
