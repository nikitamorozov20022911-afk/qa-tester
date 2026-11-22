async page => {
  const out=[];
  const posts=[]; const h=r=>{ if(r.request().method()!=='GET') posts.push(r.request().method()+' '+r.status()+' '+r.url()); }; page.on('response',h);
  await page.goto('https://hunters-sooty.vercel.app/collaborations/f7c2a15f-ebaf-495e-a15f-8bbad2157c64');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  await d.getByRole('button', { name: 'הגשת QA-AUTO 1020 E1 Delta למשרה' }).click();
  const n = page.getByRole('dialog').filter({ hasText: 'חתימה על הסכם סודיות' }).last();
  await n.waitFor({ timeout: 20000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
  out.push('NDIALOGS='+await page.getByRole('dialog').count());
  out.push('DLG: '+(await n.innerText()).slice(0,2500));
  const btns = await n.locator('button, [role=button], a, input[type=checkbox]').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||'')+'|'+e.innerText.trim()));
  out.push('BTNS: '+JSON.stringify(btns));
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-screen-raw-desktop.png' });
  page.off('response',h);
  out.push('NONGET: '+posts.join('\n'));
  return out.join('\n');
}
