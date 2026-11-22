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
  const res=[];
  for (let run=1; run<=2; run++){
    await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'); await page.waitForLoadState('networkidle'); await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
    await page.getByRole('button',{name:'שדרוג ל-PLUS'}).click();
    const d = page.locator('[role=dialog]').filter({hasText:'בחירת חבילה'});
    await d.waitFor({timeout:10000});
    const ok = await d.getByText(/₪\s?\d{2,}/).first().waitFor({timeout:10000}).then(()=>true).catch(()=>false);
    const t = await d.innerText();
    const plus = t.slice(t.indexOf('PLUS'), t.indexOf('PLUS')+25).replace(/\n/g,' ');
    const prem = t.slice(t.indexOf('PREMIUM'), t.indexOf('PREMIUM')+25).replace(/\n/g,' ');
    if (run===2) {
      await page.evaluate(()=>{ const dd=[...document.querySelectorAll('[role=dialog]')].find(x=>x.innerText.includes('בחירת חבילה')); [...dd.querySelectorAll('*')].filter(e=>e.children.length===0 && (e.textContent||'').trim()==='—').forEach(e=>{ e.style.outline='3px solid red'; e.style.outlineOffset='4px'; }); });
      await page.screenshot({path:'screenshots/run-1020/E1/65-E1B-hfree2-plans-no-price-desktop.png'});
    }
    res.push(`run${run}: priceVisibleWithin10s=${ok} | ${plus} | ${prem}`);
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  }
  return res.join('\n');
}
