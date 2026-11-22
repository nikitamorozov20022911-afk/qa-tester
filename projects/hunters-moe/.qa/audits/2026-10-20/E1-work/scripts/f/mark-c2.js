async page => {
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first();
  await d.getByText('מיכל לוי',{exact:true}).click(); await d.getByText('QA-AUTO 1020 E1 הצעה HR').waitFor({timeout:8000});
  const mark = async loc => loc.evaluate(e=>{e.style.outline='3px solid red'; e.style.outlineOffset='2px';});
  await mark(d.getByText('אושרה',{exact:true}).first());
  await mark(d.getByRole('button',{name:'אישור ההצעה'}));
  await mark(d.getByRole('button',{name:'דחיית ההצעה'}));
  await d.getByText('אושרה',{exact:true}).first().scrollIntoViewIfNeeded();
  await page.screenshot({path:'screenshots/run-1020/E1/42-E1F-FINDING-second-bid-still-open-after-approve-desktop.png'});
  return 'ok';
}
