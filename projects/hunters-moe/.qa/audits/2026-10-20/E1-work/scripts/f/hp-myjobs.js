async page => {
  const out=[];
  for (const u of ['/my-jobs','/collaborations?mine=1','/my-jobs?tab=sent','/my-jobs?archived=1']) {
    await page.goto('https://hunters-sooty.vercel.app'+u); await page.waitForLoadState('networkidle');
    await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const tabs = await page.evaluate(()=>[...document.querySelectorAll('main a, main [role=tab]')].slice(0,12).map(a=>a.innerText.trim().slice(0,20)+'->'+(a.getAttribute('href')||'')).join(' | '));
    out.push(u+' => '+page.url()+'\n  head: '+t.slice(0,160).replace(/\n+/g,' / ')+'\n  tabs: '+tabs+'\n  E1: '+(t.match(/[^\n]*E1[^\n]*/g)||[]).join(' ; '));
  }
  return out.join('\n');
}
