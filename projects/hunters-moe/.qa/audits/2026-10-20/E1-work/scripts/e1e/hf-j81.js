async page => {
  const B='https://hunters-sooty.vercel.app'; const out=[];
  for (const u of ['/collaborations/d7220429-9b52-4224-92a7-59df07b34af1','/collaborations/d7220429-9b52-4224-92a7-59df07b34af1?application=8d25a157-dc89-4202-8993-fd1d003f6a16','/collaborations/fcf90cb5-d691-490a-b6e2-65a135c0e35e','/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302']) {
    await page.goto(B+u); await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
    const d = page.locator('[role=dialog]');
    const n = await d.count();
    const t = n ? (await d.first().innerText()).replace(/\n+/g,' | ') : '(no dialog)';
    const html = await page.content();
    const idx=[...html.matchAll(/8d25a157/g)].map(m=>html.slice(m.index-80,m.index+60).replace(/\s+/g,' '));
    const wp=[...html.matchAll(/Workplace/g)].slice(0,2).map(m=>html.slice(m.index-60,m.index+30).replace(/\s+/g,' '));
    out.push(`## ${u}\nDIALOGS=${n}: ${t.slice(0,2500)}\nID-ctx: ${idx.join(' || ')}\nWorkplace-ctx: ${wp.join(' || ')}`);
    if (n) await d.first().screenshot({path:`/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1E-hfree2-panel-${u.includes('tenders')?'T58':u.includes('fcf9')?'J83':u.includes('application')?'J81-app':'J81'}-desktop.png`}).catch(()=>{});
  }
  return out.join('\n\n');
}
