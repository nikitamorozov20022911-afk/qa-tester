async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  await page.goto(B+'/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle').catch(()=>{});
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first(); await d.waitFor({timeout:15000});
  out.push('DLG '+(await d.innerText()).replace(/\n+/g,' / ').slice(0,1800));
  const rows = d.getByText('מיכל לוי',{exact:true}); out.push('HR rows='+(await rows.count()));
  await rows.first().click();
  await d.getByText('QA-AUTO 1020 E1 הצעה HR').waitFor({timeout:8000}).catch(()=>out.push('no HR note'));
  out.push('EXP '+(await d.innerText()).replace(/\n+/g,' / ').slice(-700));
  out.push('BTNS '+(await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'?').trim().replace(/\n/g,' ')).join(' | '))));
  return out.join('\n');
}
