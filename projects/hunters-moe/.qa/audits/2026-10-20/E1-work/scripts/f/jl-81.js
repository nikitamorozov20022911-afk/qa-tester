async page => {
  const ID='d7220429-9b52-4224-92a7-59df07b34af1';
  await page.goto('https://hunters-sooty.vercel.app/collaborations/'+ID); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText.slice(0,900));
  const btns = await page.evaluate(()=>[...document.querySelectorAll('main button, main a')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ').slice(0,40)+(e.getAttribute('aria-haspopup')?'[popup]':'')).join(' | '));
  return 'URL '+page.url()+'\nTEXT '+t+'\nBTNS '+btns;
}
