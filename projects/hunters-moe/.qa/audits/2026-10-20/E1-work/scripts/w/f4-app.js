async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  for (const [n,id] of [['Alpha','8d25a157-dc89-4202-8993-fd1d003f6a16'],['Bravo','29bd04ad-e749-45d0-a3a8-8941f8d069a8'],['Charlie','95e1d65a-fc57-411d-95f8-52bab39c7c84'],['Delta','152d3162-b809-4970-b2bb-6ef41de34bee']]) {
    await page.goto(B+'/applications/'+id); await wait();
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const btns = await page.evaluate(()=>[...document.querySelectorAll('main button, main a')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('href')||'')+'='+(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\n/g,' ')).join(' | '));
    out.push('### '+n+'\n'+t.replace(/\n+/g,' / ').slice(0,1500)+'\nBTNS '+btns.slice(0,500));
  }
  return out.join('\n');
}
