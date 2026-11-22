async page => {
  const BTN = '__BTN__', TAG = '__TAG__';
  const log = [];
  page.on('response', async r => { const m=r.request().method(); if (m!=='GET') { let b=''; try{b=(await r.text()).slice(0,400);}catch(e){} log.push(m+' '+r.status()+' '+r.url().slice(0,200)+' body='+(r.request().postData()||'').slice(0,300)+' => '+b); } });
  await page.goto('https://hunters-sooty.vercel.app/admin/reports?q=QA-AUTO%201020%20E1'); await page.waitForLoadState('networkidle');
  const main = page.locator('main');
  await main.getByText('R-15', {exact:true}).waitFor({timeout:15000});
  const txt = await main.innerText();
  if (!/תוצאה אחת/.test(txt)) return 'ABORT: not exactly one result\n'+txt.slice(0,1500);
  const ids = txt.match(/\bR-\d+\b/g)||[];
  if (ids.length!==1 || ids[0]!=='R-15' || !txt.includes('QA-AUTO 1020 E1 – דיווח בדיקה, לא לטפל') || !txt.includes('demo-talent-2@hunters.dev')) return 'ABORT: guard '+ids.join(',');
  const btns = main.getByRole('button', {name: BTN, exact: true});
  const n = await btns.count();
  if (n!==1) return 'ABORT: button "'+BTN+'" count='+n+'\n'+txt.slice(-800);
  const before = (txt.match(/R-15\n(\S+)/)||[])[1];
  await btns.click();
  const dlg = page.locator('[role=dialog],[role=alertdialog]').last();
  let dtext='';
  if (await dlg.isVisible({timeout:3000}).catch(()=>false)) {
    dtext = await dlg.innerText();
    await dlg.evaluate(e=>{e.style.outline='4px solid red';}).catch(()=>{});
    await page.screenshot({path:'screenshots/run-1020/E1/verify-73-report-status-dialog-'+TAG+'.png'});
    const ok = dlg.getByRole('button', {name:'אישור', exact:true});
    if (await ok.count()===1) await ok.click(); else return 'NO_CONFIRM dialog: '+dtext;
  }
  await page.getByText('הסטטוס עודכן').waitFor({timeout:10000}).catch(()=>{});
  await page.waitForTimeout(1500);
  await page.reload(); await page.waitForLoadState('networkidle'); await main.getByText('R-15',{exact:true}).waitFor({timeout:15000});
  const t2 = await main.innerText();
  const card = main.getByText('R-15',{exact:true}).locator('xpath=ancestor::*[.//button][1]');
  await card.evaluate(e=>{e.style.outline='4px solid red';e.style.outlineOffset='2px';}).catch(()=>{});
  await page.screenshot({path:'screenshots/run-1020/E1/verify-73-report-status-admin-'+TAG+'.png'});
  const after = (t2.match(/R-15\n(\S+)/)||[])[1];
  return 'AT '+new Date().toISOString()+'\nBEFORE '+before+' AFTER '+after+'\nDIALOG: '+dtext.replace(/\n/g,' | ')+'\nCARD: '+t2.slice(t2.indexOf('R-15')).replace(/\n/g,' | ').slice(0,700)+'\nNET:\n'+log.join('\n');
}
