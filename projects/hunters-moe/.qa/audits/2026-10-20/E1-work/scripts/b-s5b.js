async page => {
  const dump = async (shot) => { if(shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot, fullPage:true});
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const inputs = await page.evaluate(()=>[...document.querySelectorAll('main input,main textarea,main select,main button,[role=dialog] input,[role=dialog] button')].map(e=>`${e.tagName}|${e.type||''}|${e.name||e.id||''}|${(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||'').slice(0,50).replace(/\n/g,' ')}|${e.checked??''}|${e.disabled?'dis':''}`).join('\n'));
    return `url=${page.url()}\n${t}\n----\n${inputs}`; };
  await page.getByText('טוען…').waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const btns = await page.evaluate(()=>[...document.querySelectorAll('main button, main a, [role=dialog] button, [role=dialog] a')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||e.title||'?').trim().replace(/\n/g,' ')).join(' | '));
  const dlg = await page.locator('[role=dialog]').allInnerTexts();
  return 'BTNS: '+btns + '\nDLG:'+dlg.join('||').slice(0,3000)+'\n' + await dump('33-E1B-tender-owner-view-desktop.png');
}
