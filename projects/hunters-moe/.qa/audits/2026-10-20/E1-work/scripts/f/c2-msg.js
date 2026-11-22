async page => {
  const net=[]; page.on('response', async r=>{ const u=r.url(); if(/supabase|messages|conversation/.test(u)){ let b=''; try{b=(await r.text()).slice(0,200)}catch(e){}; net.push(r.request().method()+' '+r.status()+' '+u.slice(0,140)+' :: '+b.replace(/\n/g,' ')); }});
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first();
  const row = d.getByText('הד האנטר דמו 2', {exact:true}); if (await row.count()!==1) return 'row?';
  await row.click();
  const mb = d.getByRole('button',{name:'שליחת הודעה'}).or(d.getByRole('link',{name:'שליחת הודעה'}));
  if (await mb.count()!==1) return 'msg btns='+await mb.count();
  const before=page.url();
  await mb.click();
  await page.waitForURL(u=>u.toString()!==before,{timeout:10000}).catch(()=>{});
  await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/07-E1F-company2-send-message-click-desktop.png', fullPage:true});
  const body = await page.evaluate(()=>document.body.innerText.slice(0,1200));
  const dl = (await page.locator('[role=dialog]').allInnerTexts()).join('||').slice(0,800);
  return 'URL '+page.url()+'\nDLG '+dl+'\nBODY '+body+'\nNET '+net.slice(0,10).join('\n');
}
