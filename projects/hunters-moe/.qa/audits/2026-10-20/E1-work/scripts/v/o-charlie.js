async page => {
  const out=[];
  await page.goto('https://hunters-sooty.vercel.app/collaborations/fcf90cb5-d691-490a-b6e2-65a135c0e35e');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  await d.getByRole('button', { name: /מועמד\/ת אנונימי\/ת/ }).first().click();
  const dl = page.getByRole('dialog').last();
  await dl.getByText('סטטוס מועמד').waitFor({ timeout: 15000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
  const t = await dl.innerText();
  out.push('CARD: '+t.slice(0,3000));
  out.push('NDA mentions: '+JSON.stringify(t.match(/.{0,50}NDA.{0,50}/g)||[]));
  // annotate status timeline
  const st = dl.getByText('סטטוס מועמד').first();
  const box = st.locator('xpath=..');
  await box.evaluate(e=>{e.style.outline='4px solid red'; e.style.outlineOffset='4px';}).catch(()=>{});
  await page.screenshot({ path: 'screenshots/run-1020/E1/verify-nda-owner-charlie-card-desktop.png' });
  return out.join('\n');
}
