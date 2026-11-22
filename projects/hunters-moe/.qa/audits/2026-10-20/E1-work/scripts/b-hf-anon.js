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
  const out=[];
  for (let p=1;p<=5;p++){ await page.goto('https://hunters-sooty.vercel.app/tenders?page='+p); await page.waitForLoadState('networkidle');
    const cards = await page.evaluate(()=>[...document.querySelectorAll('main a[href^="/tenders/"]')].map(a=>{const m=a.innerText.match(/T-\d+\s*\n+\s*([^\n]+)/); return (a.innerText.match(/T-\d+/)||[''])[0]+' '+(m?m[1]:'?')+' '+a.getAttribute('href').slice(9,17)+' imgs:'+[...a.querySelectorAll('img')].map(i=>i.getAttribute('src').split('/').pop().slice(0,30)).join(',');}));
    out.push('p'+p+': '+cards.join(' ; ')); }
  return out.join('\n');
}
