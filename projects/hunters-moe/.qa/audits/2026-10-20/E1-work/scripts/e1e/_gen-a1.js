async page => {
  const B='https://hunters-sooty.vercel.app';
  const urls = [["adm-jobs-J81","/admin/jobs?q=J-81"],["adm-jobs-J82","/admin/jobs?q=J-82"],["adm-jobs-J83","/admin/jobs?q=J-83"],["adm-apps-e1","/admin/applications?q=QA-AUTO%201020%20E1"],["adm-tenders-T58","/admin/tenders?q=T-58"],["adm-users-claude","/admin/users?q=claude-test"],["adm-log","/admin/log"],["adm-payments","/admin/payments"]];
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
