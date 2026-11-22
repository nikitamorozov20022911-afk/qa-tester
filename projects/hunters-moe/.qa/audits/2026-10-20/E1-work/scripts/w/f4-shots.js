async page => {
  const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  await page.goto(B+'/applications/8d25a157-dc89-4202-8993-fd1d003f6a16'); await wait();
  const s = page.getByRole('button',{name:'התקבל/ה לעבודה'}).first();
  await s.evaluate(e=>{e.style.outline='4px solid red';e.style.outlineOffset='3px';});
  await page.screenshot({path:'screenshots/run-1020/E1/verify-F4-applications-Alpha-direct-url-shows-hired-no-job-desktop.png'});
  await page.goto(B+'/my-jobs'); await wait();
  await page.locator('button[aria-label*="התראות"]').first().click();
  const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
  await panel.waitFor({timeout:8000}).catch(()=>{}); await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  const it = panel.getByText(/QA-AUTO 1020 E1 Alpha במשרה .* עודכן ל/).first();
  await it.scrollIntoViewIfNeeded().catch(()=>{});
  await it.evaluate(e=>{(e.closest('a')||e).style.outline='4px solid red';});
  await page.screenshot({path:'screenshots/run-1020/E1/verify-F4-bell-hunter_plus-status-text-link-to-archived-desktop.png'});
  return 'ok';
}
