async page => {
  const SH = n => `/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1C-${n}-talent2-desktop.png`;
  const out=[]; const resp=[];
  page.on('response', async r => { if (r.request().method()==='POST') { let b=''; try{ b=(await r.text()).slice(0,300);}catch{} resp.push(r.status()+' '+r.url().slice(0,120)+' '+b.replace(/\n/g,' ')); } });
  await page.goto('https://hunters-sooty.vercel.app/collaborations/77f6896c-9f7c-4cbe-b9e6-1b30ff48344a');
  await page.getByRole('button', { name: 'דיווח על המשרה' }).click();
  const d = page.getByRole('dialog').last();
  await d.getByText('אחר', { exact: true }).waitFor({ timeout: 10000 });
  out.push('DIALOG: ' + (await d.innerText()).replace(/\n+/g,' | '));
  const radios = await d.getByRole('radio').evaluateAll(rs=>rs.map(r=>r.getAttribute('aria-label')||r.parentElement.innerText||r.value));
  out.push('RADIOS: ' + radios.join(' ; '));
  await page.screenshot({ path: SH('82-AC02-job-report-reasons') });
  await d.getByText('אחר', { exact: true }).click();
  await d.locator('textarea').fill('QA-AUTO 1020 E1 – דיווח בדיקה, לא לטפל');
  await page.screenshot({ path: SH('82-job-report-filled') });
  const t0 = Date.now();
  const send = d.getByRole('button', { name: /שליחת הדיווח|שליחה/ });
  out.push('send btn: ' + await send.first().innerText());
  const toastP = page.locator('[data-sonner-toast]').first().waitFor({ timeout: 10000 }).then(()=>Date.now()-t0).catch(()=>-1);
  await send.first().click();
  const tt = await toastP;
  const toasts = await page.locator('[data-sonner-toast]').allInnerTexts();
  out.push('TOAST after ' + tt + 'ms: ' + toasts.join(' || '));
  await page.screenshot({ path: SH('82-AC03-job-report-sent') });
  out.push('dialog still open: ' + await page.getByRole('dialog').filter({ hasText: 'פרטים נוספים' }).count());
  out.push('POSTS: ' + resp.join('\n'));
  return out.join('\n');
}
