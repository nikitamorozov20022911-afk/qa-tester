async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const RUN = (globalThis.__f2a=(globalThis.__f2a||0)+1);
  await page.goto(B+'/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle').catch(()=>{});
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first(); await d.waitFor({timeout:15000});
  const row = d.getByRole('button').filter({hasText:'מיכל לוי'}).first();
  await row.click(); await d.getByText('QA-AUTO 1020 E1 הצעה HR').waitFor({timeout:8000}).catch(()=>{});
  out.push('RUN '+RUN+' ROWS: '+(await d.innerText()).replace(/\n+/g,' / ').split('הצעות שהוגשו')[1]);
  out.push('BTNS '+(await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')).slice(7).join(' | '))));
  if (RUN===1){ const s=d.getByText('נדחתה',{exact:true}).first(); await s.evaluate(e=>{const p=e.closest('button')||e.parentElement; p.style.outline='4px solid red';}); await page.screenshot({path:'screenshots/run-1020/E1/verify-F2-after-reject-no-undo-company2-desktop.png'}); }
  await page.goto(B+'/tenders?mine=1'); await page.waitForLoadState('networkidle').catch(()=>{});
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const t = await page.evaluate(()=>document.body.innerText); const i=t.indexOf('QA-AUTO 1020 E1 מכרז');
  out.push('MY TENDERS: '+t.slice(Math.max(0,i-150),i+250).replace(/\n+/g,' / '));
  if (RUN===1){ const c=page.getByText('QA-AUTO 1020 E1 מכרז').first(); await c.evaluate(e=>{const p=e.closest('a,article,li,[class*=card]')||e.parentElement.parentElement; p.style.outline='4px solid red';}); await page.screenshot({path:'screenshots/run-1020/E1/verify-F1-company2-my-tenders-still-active-desktop.png'}); }
  return out.join('\n');
}
