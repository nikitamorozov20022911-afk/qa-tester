async page => {
  const target = globalThis.__st; // 'בטיפול' | 'טופל'
  const out=[];
  await page.goto('https://hunters-sooty.vercel.app/admin/reports?q=' + encodeURIComponent('QA-AUTO 1020 E1 – דיווח בדיקה'));
  await page.getByText('R-15', { exact: true }).first().waitFor({ timeout: 15000 });
  const main = page.locator('main');
  const res = await main.getByText(/תוצאה אחת|\d+ תוצאות/).first().innerText();
  const rcount = await main.getByText(/^R-\d+$/).count();
  out.push('results: ' + res + ' / R-ids on page: ' + rcount);
  if (rcount !== 1 || !(await main.getByText('R-15', { exact: true }).count())) return out.join('\n') + '\nABORT not single';
  const card = main.getByText('R-15', { exact: true }).locator('xpath=ancestor::*[.//button[normalize-space()="טופל"]][1]');
  const ctext = await card.innerText();
  if (!ctext.includes('QA-AUTO 1020 E1 – דיווח בדיקה, לא לטפל') || !ctext.includes('demo-talent-2')) return out.join('\n')+'\nABORT card mismatch: '+ctext.slice(0,200);
  out.push('BEFORE: ' + ctext.replace(/\n+/g,' | '));
  const btn = card.getByRole('button', { name: target, exact: true });
  out.push('btn count: ' + await btn.count() + ' pressed/aria: ' + await btn.getAttribute('aria-pressed') + ' disabled: ' + await btn.isDisabled());
  await btn.click();
  const dlg = page.getByRole('dialog');
  if (await dlg.first().waitFor({ timeout: 3000 }).then(()=>1).catch(()=>0)) {
    out.push('DIALOG: ' + (await dlg.first().innerText()).replace(/\n+/g,' | '));
    await page.screenshot({ path: `/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1C-83-AC04-dialog-${target==='טופל'?'done':'inprogress'}-desktop.png` });
    return out.join('\n') + '\nDIALOG OPEN - waiting';
  }
  const toast = await page.locator('[data-sonner-toast]').first().waitFor({timeout:8000}).then(()=>page.locator('[data-sonner-toast]').allInnerTexts()).catch(()=>[]);
  out.push('TOAST: ' + toast.join(' || '));
  await page.reload(); await page.getByText('R-15', { exact: true }).first().waitFor({ timeout: 15000 });
  out.push('AFTER: ' + (await card.innerText()).replace(/\n+/g,' | '));
  await page.screenshot({ path: `/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1C-83-AC04-after-${target==='טופל'?'done':'inprogress'}-desktop.png`, fullPage: true });
  return out.join('\n');
}
