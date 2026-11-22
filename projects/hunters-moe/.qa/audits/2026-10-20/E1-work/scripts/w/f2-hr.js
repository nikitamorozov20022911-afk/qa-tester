async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const RUN = (globalThis.__hr=(globalThis.__hr||0)+1);
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  await page.goto(B+'/tenders?mine=1'); await wait();
  const b = page.locator('button[aria-label*="התראות"]').first();
  out.push('RUN '+RUN+' '+new Date().toISOString()+' bell label: '+(await b.getAttribute('aria-label')));
  await b.click();
  const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
  await panel.waitFor({timeout:8000}).catch(()=>{}); await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  await page.waitForTimeout(500);
  const items = await panel.evaluate(p=>[...p.querySelectorAll('a,li,[role=menuitem]')].map(a=>(a.getAttribute('href')||'')+' = '+a.innerText.replace(/\n/g,' ').slice(0,160)));
  out.push('BELL top: '+items.slice(0,6).join('\n   '));
  const rej = panel.getByText(/לא אישרו|נדחת|דחו/).first();
  if (RUN===1){ if (await rej.count()) await rej.evaluate(e=>{(e.closest('a,li')||e).style.outline='4px solid red';}); await page.screenshot({path:'screenshots/run-1020/E1/verify-F2-bell-company_6-after-reject-desktop.png'}); }
  await page.keyboard.press('Escape');
  await page.goto(B+'/tenders?mine=1'); await wait();
  const t = await page.evaluate(()=>document.body.innerText); const i=t.indexOf('QA-AUTO 1020 E1 מכרז');
  out.push('MY BIDS: '+(i>=0?t.slice(Math.max(0,i-120),i+120).replace(/\n+/g,' / '):'T-58 NOT FOUND'));
  if (RUN===1 && i>=0){ const c=page.getByText('QA-AUTO 1020 E1 מכרז').first(); await c.evaluate(e=>{const p=e.closest('a,article,li')||e.parentElement.parentElement; p.style.outline='4px solid red';}); await page.screenshot({path:'screenshots/run-1020/E1/verify-F2-my-bids-company_6-after-reject-desktop.png'}); }
  await page.goto(B+'/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'); await wait();
  const d = page.locator('[role=dialog]').first(); await d.waitFor({timeout:15000}).catch(()=>{});
  const dt = (await d.innerText().catch(()=>'')).replace(/\n+/g,' / ');
  out.push('TENDER VIEW HR: '+dt.slice(dt.indexOf('מס׳ הצעות'), dt.indexOf('מס׳ הצעות')+120)+' ... '+dt.slice(-400));
  out.push('form inputs visible: '+(await d.locator('input,textarea').filter({visible:true}).count())+' | submit btn: '+(await d.getByRole('button',{name:/הגשת הצעה/}).count()));
  if (RUN===1) await page.screenshot({path:'screenshots/run-1020/E1/verify-F1-tender-view-company_6-after-reject-desktop.png'});
  return out.join('\n');
}
