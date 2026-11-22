async page => {
  const bodies=[]; page.on('response', async r=>{ const ct=r.headers()['content-type']||''; if(!/json|text|component/.test(ct)) return; try{bodies.push(r.url().slice(0,80)+' '+(await r.text()))}catch(e){} });
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first();
  await d.getByText('הד האנטר דמו 2', {exact:true}).click();
  await d.getByText('QA-AUTO 1020 E1 הצעה FREE-PLUS').waitFor({timeout:8000});
  const links = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] a')].map(a=>a.innerText.trim().slice(0,30)+'->'+a.getAttribute('href')).join(' | '));
  const all = bodies.join('\n')+(await page.content());
  const emails=[...new Set(all.match(/[\w.+-]+@[\w-]+\.[a-z.]+/g)||[])];
  const phones=[...new Set(all.match(/05\d-?\d{3}-?\d{4}/g)||[])];
  const keys=[...new Set(all.match(/\\?"(phone|email|linkedin|whatsapp)\\?"\s*:\s*\\?"[^"\\]{3,40}/gi)||[])].slice(0,10);
  return 'LINKS '+links+'\nEMAILS '+emails.join(', ')+'\nPHONES '+phones.join(', ')+'\nKEYS '+keys.join(' ; ');
}
