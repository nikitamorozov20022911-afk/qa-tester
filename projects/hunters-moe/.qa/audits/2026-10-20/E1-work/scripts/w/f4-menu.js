async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  await page.goto(B+'/my-jobs'); await wait();
  await page.getByRole('button',{name:'החשבון שלי'}).first().click();
  await page.waitForTimeout(800);
  out.push('ACCOUNT MENU: '+(await page.evaluate(()=>[...document.querySelectorAll('[role=menu] a,[role=menu] [role=menuitem],[data-radix-popper-content-wrapper] a')].map(a=>(a.getAttribute('href')||'')+' ='+a.innerText.trim().replace(/\n/g,' ')).join(' ; '))));
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'עוד'}).first().click(); await page.waitForTimeout(800);
  out.push('OD MENU: '+(await page.evaluate(()=>[...document.querySelectorAll('[role=menu] a,[role=menuitem],[data-radix-popper-content-wrapper] a')].map(a=>(a.getAttribute('href')||'')+' ='+a.innerText.trim().replace(/\n/g,' ')).join(' ; '))));
  await page.keyboard.press('Escape');
  return out.join('\n');
}
