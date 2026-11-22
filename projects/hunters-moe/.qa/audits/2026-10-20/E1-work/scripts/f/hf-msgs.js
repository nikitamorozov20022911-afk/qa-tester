async page => {
  const net=[]; page.on('response', async r=>{ const u=r.url(); if(/supabase|rpc|conversation/.test(u)){ let b=''; try{b=(await r.text()).slice(0,200)}catch(e){}; net.push(r.request().method()+' '+r.status()+' '+u.slice(0,140)+' :: '+b.replace(/\n/g,' ')); }});
  await page.goto('https://hunters-sooty.vercel.app/messages'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/07-E1F-hunter_free-messages-desktop.png', fullPage:true});
  return 'URL '+page.url()+'\nBODY '+(await page.evaluate(()=>document.body.innerText.slice(0,900)))+'\nNET '+net.slice(0,8).join('\n');
}
