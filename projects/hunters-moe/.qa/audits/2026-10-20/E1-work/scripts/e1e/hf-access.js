async page => {
  const B='https://hunters-sooty.vercel.app';
  const M=['E1 Alpha','E1 Bravo','E1 Charlie','Alpha','Bravo','Charlie','1020-e1','102-0001','102-0002','102-0003','1020001','1020002','1020003','linkedin.com/in/qa-auto','Workplace','QA-AUTO 1020 E1 – תשובה','הערת בדיקה','שאלה נוספת','8d25a157','29bd04ad','95e1d65a','51b1cf64','060763f9','caa83508','נועם כהן'];
  const urls=[
   ['app-alpha','/applications/8d25a157-dc89-4202-8993-fd1d003f6a16'],
   ['app-bravo','/applications/29bd04ad-e749-45d0-a3a8-8941f8d069a8'],
   ['app-charlie','/applications/95e1d65a-fc57-411d-95f8-52bab39c7c84'],
   ['cand-alpha','/my-candidates/51b1cf64-9202-484d-b666-a9e1bec2a915'],
   ['cand-bravo','/my-candidates/060763f9-f3db-4310-937c-ad991eee3e68'],
   ['cand-charlie','/my-candidates/caa83508-9039-4a66-873f-e9da48b485d8'],
   ['J81-app-alpha','/collaborations/d7220429-9b52-4224-92a7-59df07b34af1?application=8d25a157-dc89-4202-8993-fd1d003f6a16'],
   ['J81-app-bravo','/collaborations/d7220429-9b52-4224-92a7-59df07b34af1?application=29bd04ad-e749-45d0-a3a8-8941f8d069a8'],
   ['J83-app-charlie','/collaborations/fcf90cb5-d691-490a-b6e2-65a135c0e35e?application=95e1d65a-fc57-411d-95f8-52bab39c7c84'],
   ['J81','/collaborations/d7220429-9b52-4224-92a7-59df07b34af1'],
   ['J83','/collaborations/fcf90cb5-d691-490a-b6e2-65a135c0e35e'],
   ['T58','/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'],
  ];
  const out=[]; const supa=new Set();
  for (const [name,u] of urls) {
    const bodies=[];
    const h = async r => { try { const ct=r.headers()['content-type']||''; const url=r.url(); if(/supabase\.co/.test(url)) supa.add(r.request().method()+' '+url.split('?')[0]+' '+r.status()); if(!/json|text|x-component/.test(ct) || /\.(js|css)(\?|$)/.test(url)) return; bodies.push([url, await r.text()]); } catch(e){} };
    page.on('response', h);
    const r = await page.goto(B+u).catch(()=>null);
    await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
    page.off('response', h);
    const html = await page.content();
    const txt = (await page.locator('main').first().innerText().catch(()=>page.locator('body').innerText())).replace(/\n+/g,' | ');
    const dom = M.filter(m=>txt.includes(m));
    const inHtml = M.filter(m=>html.includes(m));
    const net = M.filter(m=>bodies.some(([,b])=>b.includes(m))).map(m=>m+'@'+bodies.filter(([,b])=>b.includes(m)).map(([x])=>x.replace(B,'').slice(0,60)).join(','));
    await page.screenshot({path:`/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1E-hfree2-${name}-desktop.png`, fullPage:true});
    out.push(`### ${name} ${u}\n-> ${page.url()} [${r&&r.status()}] bodies=${bodies.length}\nDOM: ${dom.join(',')||'—'} | HTML: ${inHtml.join(',')||'—'} | NET: ${net.join(' ; ')||'—'}\nTEXT: ${txt.slice(0,1500)}`);
  }
  out.push('SUPABASE: '+[...supa].join('\n'));
  return out.join('\n\n');
}
