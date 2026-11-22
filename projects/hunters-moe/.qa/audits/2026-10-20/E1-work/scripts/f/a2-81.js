async page => {
  const ID='d7220429-9b52-4224-92a7-59df07b34af1', NUM='J-81', TITLE='QA-AUTO 1020 E1 משרה אנונימית';
  await page.goto('https://hunters-sooty.vercel.app/collaborations/'+ID); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d = page.locator('[role=dialog]').first(); await d.waitFor({timeout:10000});
  const dt = await d.innerText();
  if (!dt.includes(NUM) || !dt.includes(TITLE)) return 'WRONG DIALOG: '+dt.slice(0,300);
  const ab = d.getByRole('button',{name:'פעולות משרה'}); if (await ab.count()!==1) return 'actions btn count '+await ab.count();
  await ab.click();
  const menu = page.locator('[role=menu]').last(); await menu.waitFor({timeout:5000});
  const items = await menu.innerText();
  const it = menu.getByRole('menuitem',{name:'העברה לארכיון'}); if (await it.count()!==1) return 'ITEMS '+items;
  await it.click();
  const cd = page.locator('[role=dialog],[role=alertdialog]').last(); await page.waitForTimeout(0);
  await page.getByText(/ארכיון/).last().waitFor({timeout:5000}).catch(()=>{});
  const cdlg = page.locator('[role=alertdialog],[role=dialog]').filter({hasText:'להעביר את המשרה לארכיון?'}).last();
  await cdlg.waitFor({timeout:5000});
  const cb = cdlg.getByRole('button',{name:'העברה לארכיון',exact:true}); if (await cb.count()!==1) return 'confirm btns '+await cb.count();
  await cb.click();
  await cdlg.waitFor({state:'detached',timeout:10000}).catch(()=>{});
  const toast = await page.locator('[data-sonner-toast],[role=status]').allInnerTexts().catch(()=>[]);
  await page.screenshot({path:'screenshots/run-1020/E1/54-E1F-archived-J-81-owner-desktop.png'});
  await page.goto('https://hunters-sooty.vercel.app/collaborations/'+ID); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const d2 = page.locator('[role=dialog]').first(); await d2.waitFor({timeout:10000}).catch(()=>{});
  const t2 = await d2.innerText().catch(()=>'no dialog: '+page.url());
  const st = t2.slice(t2.indexOf(TITLE), t2.indexOf(TITLE)+120);
  return 'MENU '+items.replace(/\n/g,'/')+'\nTOAST '+toast.join('|')+'\nAFTER RELOAD: '+st;
}
