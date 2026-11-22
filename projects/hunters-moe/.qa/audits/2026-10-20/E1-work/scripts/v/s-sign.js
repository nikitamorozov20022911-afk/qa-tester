async page => {
  const out=[];
  const posts=[]; const h=r=>{ if(r.request().method()!=='GET') posts.push(new Date().toISOString().slice(11,19)+' '+r.request().method()+' '+r.status()+' '+r.url()); }; page.on('response',h);
  await page.goto('https://hunters-sooty.vercel.app/collaborations/f7c2a15f-ebaf-495e-a15f-8bbad2157c64');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  await d.getByRole('button', { name: 'הגשת QA-AUTO 1020 E1 Delta למשרה' }).click();
  const n = page.getByRole('dialog').filter({ hasText: 'חתימה על הסכם סודיות' }).last();
  await n.waitFor({ timeout: 20000 });
  const cv = n.locator('canvas').first();
  await cv.scrollIntoViewIfNeeded();
  const b = await cv.boundingBox();
  await page.mouse.move(b.x+40, b.y+b.height/2);
  await page.mouse.down();
  for (let i=1;i<=20;i++) await page.mouse.move(b.x+40+i*12, b.y+b.height/2 + (i%2? -20: 20), { steps: 3 });
  await page.mouse.up();
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-signed-pad-desktop.png' });
  await n.getByRole('button', { name: 'חתימה וסיום' }).click();
  out.push('SIGNED_AT '+new Date().toISOString());
  await n.waitFor({ state: 'hidden', timeout: 20000 }).catch(()=>out.push('nda still visible'));
  const s = page.getByRole('dialog').last();
  await s.getByText('פרופיל אנונימי', { exact: true }).waitFor({ timeout: 20000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
  out.push('SUBMIT DLG: '+(await s.innerText()).slice(0,1200));
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-after-sign-desktop.png' });
  page.off('response',h);
  out.push('NONGET: '+posts.join('\n'));
  return out.join('\n');
}
