async page => {
  const B='https://hunters-sooty.vercel.app';
  await page.goto(B+'/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'); await page.waitForLoadState('networkidle').catch(()=>{});
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first(); await d.waitFor({timeout:15000}).catch(()=>{});
  const dt = (await d.innerText().catch(()=>'')).replace(/\n+/g,' / ');
  const lim = d.getByText(/ניצלתם|נותרו לכם/).first();
  if (await lim.count()) await lim.evaluate(e=>{e.style.outline='4px solid red';});
  await page.screenshot({path:'screenshots/run-1020/E1/verify-F1-tender-view-hunter_plus-desktop.png'});
  return new Date().toISOString()+' HP TENDER: '+dt.slice(-450)+' | closed-words: '+(/סגור|הסתיים|לא מקבל/.test(dt)?'YES':'no')+' | inputs '+(await d.locator('input,textarea').filter({visible:true}).count());
}
