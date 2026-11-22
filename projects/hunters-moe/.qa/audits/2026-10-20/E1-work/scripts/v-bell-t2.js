async page => {
  const tag = '__TAG__';
  const net = [];
  const h = async r => { const u = r.url(); if (/notif/i.test(u) && r.request().method()==='GET') { try { net.push(u.slice(0,600)+' => '+(await r.text()).slice(0,1500)); } catch(e){} } };
  page.on('response', h);
  await page.goto('https://hunters-sooty.vercel.app/dashboard'); await page.waitForLoadState('networkidle');
  const b = page.locator('button[aria-label*="התראות"]').first();
  const lbl = await b.getAttribute('aria-label');
  await b.click();
  const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
  await panel.waitFor({timeout:8000}).catch(()=>{});
  await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  await panel.evaluate(e=>{e.style.outline='4px solid red';e.style.outlineOffset='2px';}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/verify-73-report-status-bell-'+tag+'.png'});
  const t = await panel.innerText().catch(e=>'ERR '+e.message);
  const links = await panel.evaluate(e=>[...e.querySelectorAll('a')].map(a=>a.innerText.replace(/\n/g,' ').slice(0,80)+' -> '+a.getAttribute('href')).join('\n')).catch(()=>'');
  await page.keyboard.press('Escape');
  page.off('response', h);
  return 'LABEL '+lbl+'\nPANEL:\n'+t+'\nLINKS:\n'+links+'\nNET:\n'+net.join('\n');
}
