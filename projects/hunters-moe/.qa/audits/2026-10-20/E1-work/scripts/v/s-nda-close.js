async page => {
  const out=[];
  const n = page.getByRole('dialog').filter({ hasText: 'חתימה על הסכם סודיות' }).last();
  // annotate: outline the only controls (close + sign) in red
  const c = n.getByRole('button', { name: 'סגירה' }); const s = n.getByRole('button', { name: 'חתימה וסיום' });
  await c.evaluate(e=>{e.style.outline='4px solid red'; e.style.outlineOffset='3px';});
  await s.evaluate(e=>{e.style.outline='4px solid red'; e.style.outlineOffset='3px';});
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-screen-no-decline-annot-desktop.png' });
  const posts=[]; const h=r=>{ if(r.request().method()!=='GET') posts.push(r.request().method()+' '+r.status()+' '+r.url()); }; page.on('response',h);
  await c.click();
  await n.waitFor({ state: 'hidden', timeout: 10000 }).catch(()=>out.push('nda dialog still visible'));
  await page.waitForLoadState('networkidle').catch(()=>{});
  page.off('response',h);
  out.push('NDIALOGS='+await page.getByRole('dialog').count()+' URL='+page.url());
  const top = await page.getByRole('dialog').last().innerText().catch(()=>'');
  out.push('TOP: '+top.slice(0,300));
  const toast = await page.getByRole('region', { name: /התראות/ }).innerText().catch(()=> '');
  out.push('TOAST: '+toast);
  out.push('NONGET: '+posts.join('\n'));
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-after-close-desktop.png' });
  return out.join('\n');
}
