async page => {
  await page.goto('https://hunters-sooty.vercel.app/admin/reports?q=QA-AUTO%201020%20E1'); await page.waitForLoadState('networkidle');
  const main = page.locator('main');
  await main.getByText('R-15', {exact:true}).waitFor({timeout:15000});
  const txt = await main.innerText();
  const ids = txt.match(/\bR-\d+\b/g)||[];
  if (!/תוצאה אחת/.test(txt) || ids.length!==1 || ids[0]!=='R-15' || !txt.includes('demo-talent-2@hunters.dev')) return 'ABORT guard';
  const b = main.getByRole('button', {name:'הודעה למשתמש/ת', exact:true});
  if (await b.count()!==1) return 'ABORT btn';
  await b.click();
  const dlg = page.locator('[role=dialog],[role=alertdialog]').last();
  await dlg.waitFor({timeout:5000});
  const d = await dlg.innerText();
  const f = await dlg.evaluate(e=>[...e.querySelectorAll('input,textarea,select,button,[role=combobox],[role=radio],[role=checkbox]')].map(x=>`${x.tagName}|${x.type||x.getAttribute('role')||''}|${x.name||x.id||''}|${(x.innerText||x.value||x.placeholder||x.getAttribute('aria-label')||'').slice(0,60).replace(/\n/g,' ')}|${x.getAttribute('aria-checked')??x.checked??''}`).join('\n'));
  await dlg.evaluate(e=>{e.style.outline='4px solid red';}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/verify-73-report-status-admin-msg-dialog.png'});
  return d+'\n----\n'+f;
}
