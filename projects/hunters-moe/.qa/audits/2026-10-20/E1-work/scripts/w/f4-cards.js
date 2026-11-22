async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  const C=[['Alpha','51b1cf64-9202-484d-b666-a9e1bec2a915'],['Bravo','060763f9-f3db-4310-937c-ad991eee3e68'],['Charlie','caa83508-9039-4a66-873f-e9da48b485d8'],['Delta','2508b9ba-5352-4c4d-985d-9dd6133509dc'],['C2-glui2','52078fd2-90ea-456b-ae33-1ecbccbd1fa4'],['C2-anon1','3281a0b2-eb88-442c-ba10-b62ccb141c22'],['f70a38','0934edbe-9a10-4eb6-a908-6ebd0fec2926']];
  for (const [n,id] of C) {
    await page.goto(B+'/my-candidates/'+id); await wait();
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const tabs = await page.evaluate(()=>[...document.querySelectorAll('[role=tab],button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\n/g,' ')).filter(Boolean).join(' | '));
    out.push('### '+n+' '+page.url()+'\nTEXT '+t.replace(/\n+/g,' / ').slice(0,1800)+'\nBTNS '+tabs.slice(0,600));
  }
  return out.join('\n');
}
