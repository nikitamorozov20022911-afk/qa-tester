async page => {
  const dump = async (shot) => { if(shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot, fullPage:true});
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const inputs = await page.evaluate(()=>[...document.querySelectorAll('main input,main textarea,main select,main button,[role=dialog] input,[role=dialog] button')].map(e=>`${e.tagName}|${e.type||''}|${e.name||e.id||''}|${(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||'').slice(0,50).replace(/\n/g,' ')}|${e.checked??''}|${e.disabled?'dis':''}`).join('\n'));
    return `url=${page.url()}\n${t}\n----\n${inputs}`; };
  await page.getByRole('link',{name:'למכרז שלי'}).click();
  await page.waitForURL(/\/tenders\//,{timeout:15000});
  await page.waitForLoadState('networkidle');
  const btns = await page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\n/g,' ')).filter(Boolean).join(' | '));
  return btns + '\n' + await dump('33-E1B-tender-owner-view-desktop.png');
}
