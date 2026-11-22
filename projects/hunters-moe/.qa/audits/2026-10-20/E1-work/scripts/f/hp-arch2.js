async page => {
  const out=[];
  const wait = async()=>{ await page.waitForLoadState('networkidle'); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  await page.goto('https://hunters-sooty.vercel.app/waiting'); await wait();
  const w = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
  out.push('WAITING url='+page.url()+' :: '+w.slice(0,200).replace(/\n+/g,' / ')+' ... E1 hits: '+(w.match(/[^\n]*QA-AUTO 1020 E1[^\n]*/g)||[]).join(' ; '));
  await page.screenshot({path:'screenshots/run-1020/E1/54-E1F-hunter_plus-waiting-after-archive-desktop.png', fullPage:true});
  await page.goto('https://hunters-sooty.vercel.app/tenders'); await wait();
  const bell = async (shot) => {
    const b = page.locator('button[aria-label*="התראות"]').first();
    const label = await b.getAttribute('aria-label');
    await b.click();
    const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
    await panel.waitFor({timeout:8000}).catch(()=>{});
    await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
    if (shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot});
    const t = await panel.innerText().catch(e=>'ERR '+e.message);
    return {label, t, panel}; };

  const r = await bell(null);
  const item = r.panel.getByText(/QA-AUTO 1020 E1 V משרה NDA/).first();
  const href = await item.evaluate(e=>{let a=e; while(a&&a.tagName!=='A') a=a.parentElement; return a?a.getAttribute('href'):'none'});
  await item.click(); await page.waitForURL(/collaborations|404/,{timeout:10000}).catch(()=>{}); await wait();
  await page.screenshot({path:'screenshots/run-1020/E1/74-E1F-hunter_plus-bell-archived-J84-404-desktop.png'});
  out.push('BELL item href='+href+' -> '+page.url()+' :: '+(await page.evaluate(()=>document.body.innerText.slice(0,150))).replace(/\n+/g,' / '));
  return out.join('\n');
}
