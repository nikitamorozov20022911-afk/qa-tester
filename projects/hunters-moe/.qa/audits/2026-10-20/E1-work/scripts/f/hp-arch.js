async page => {
  const out=[];
  const wait = async()=>{ await page.waitForLoadState('networkidle'); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  for (const [n,id] of [['J-81','d7220429-9b52-4224-92a7-59df07b34af1'],['J-83','fcf90cb5-d691-490a-b6e2-65a135c0e35e'],['J-84','f7c2a15f-ebaf-495e-a15f-8bbad2157c64']]) {
    await page.goto('https://hunters-sooty.vercel.app/collaborations/'+id); await wait();
    const d = page.locator('[role=dialog]').first(); const has = await d.count();
    const t = has ? (await d.innerText()).slice(0,300) : (await page.evaluate(()=>document.body.innerText.slice(0,200)));
    await page.screenshot({path:'screenshots/run-1020/E1/54-E1F-hunter_plus-direct-'+n+'-archived-desktop.png'});
    out.push(n+' direct: '+t.replace(/\n+/g,' / '));
  }
  for (const [n,id] of [['Alpha','51b1cf64-9202-484d-b666-a9e1bec2a915'],['Charlie','caa83508-9039-4a66-873f-e9da48b485d8']]) {
    await page.goto('https://hunters-sooty.vercel.app/my-candidates/'+id); await wait();
    const t = await page.evaluate(()=>(document.querySelector('[role=dialog]')||document.querySelector('main')||document.body).innerText);
    const i = t.search(/מועמדויות|הגשות|משרות שהוגש/);
    await page.screenshot({path:'screenshots/run-1020/E1/54-E1F-hunter_plus-candidate-'+n+'-after-archive-desktop.png', fullPage:true});
    out.push(n+' cand: '+(i>=0?t.slice(i,i+500):t.slice(0,700)).replace(/\n+/g,' / '));
  }
  return out.join('\n');
}
