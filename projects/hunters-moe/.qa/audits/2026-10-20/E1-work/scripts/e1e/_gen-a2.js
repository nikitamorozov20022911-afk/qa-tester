async page => {
  const B='https://hunters-sooty.vercel.app';
  const urls = [["adm-job-J81","/admin/jobs/d7220429-9b52-4224-92a7-59df07b34af1"],["adm-job-J83","/admin/jobs/fcf90cb5-d691-490a-b6e2-65a135c0e35e"],["adm-job-J82","/admin/jobs/77f6896c-9f7c-4cbe-b9e6-1b30ff48344a"],["adm-tender-T58","/admin/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302"]];
  const out=[];
  for (const [name,u] of urls) {
    const t0=Date.now();
    const r = await page.goto(B+u).catch(e=>null);
    await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
    const main = page.locator('main').first();
    const txt = (await main.innerText().catch(()=>page.locator('body').innerText())).replace(/\n+/g,' | ');
    const links = await page.$$eval('main a[href]', as=>[...new Set(as.map(a=>a.getAttribute('href')))].filter(h=>/[0-9a-f]{8}-/.test(h)||/admin/.test(h)).slice(0,40));
    const btns = await page.$$eval('main button, main [role=combobox]', bs=>[...new Set(bs.map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim()).filter(Boolean))].slice(0,60));
    await page.screenshot({path:`/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1E-${name}-desktop.png`, fullPage:true});
    out.push(`### ${name} ${u} -> ${page.url()} [${r&&r.status()}] ${Date.now()-t0}ms\nTEXT: ${txt.slice(0,3500)}\nLINKS: ${links.join(' ')}\nBTNS: ${btns.join(' ¦ ')}`);
  }
  return out.join('\n\n');
}
