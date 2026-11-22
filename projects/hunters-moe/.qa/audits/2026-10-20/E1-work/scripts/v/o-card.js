async page => {
  const out=[];
  await page.goto('https://hunters-sooty.vercel.app/collaborations/f7c2a15f-ebaf-495e-a15f-8bbad2157c64');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const t = await d.innerText();
  const i = t.indexOf('הצעות שהוגשו למשרה');
  out.push('LIST: '+t.slice(i, i+500));
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-owner-list-'+(globalThis.__tag||'x')+'-desktop.png' });
  const btns = await d.getByRole('button').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||'')+'|'+e.innerText.trim().replace(/\n/g,' / ')).filter(x=>x.length>1));
  out.push('BTNS: '+JSON.stringify(btns.slice(-8)));
  return out.join('\n');
}
