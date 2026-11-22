async page => {
  const MARK = [/E1 Alpha/i, /E1 Bravo/i, /E1 Charlie/i, /1020-e1/i, /102-?0001/, /1020001/, /102-?0002/, /1020002/, /102-?0003/, /1020003/, /linkedin\.com\/in\/qa-auto/i, /qa-auto-1020-e1/i];
  const hits = []; let nResp = 0; const urls = new Set();
  const onResp = async r => { try { const ct = r.headers()['content-type']||''; if (!/json|text|rsc|javascript|x-component/.test(ct)) return; if (/_next\/static/.test(r.url())) return; const t = await r.text(); nResp++; urls.add(r.url().split('?')[0].slice(0,90)); for (const m of MARK) { const i = t.search(m); if (i>=0) hits.push(m.source+' @ '+r.url().slice(0,120)+' :: '+t.slice(Math.max(0,i-80), i+60).replace(/\s+/g,' ')); } } catch(e){} };
  page.on('response', onResp);
  const scanDom = async (label) => { const html = await page.content(); const txt = await page.locator('body').innerText(); const r=[]; for (const m of MARK) { if (html.search(m)>=0) r.push('HTML:'+m.source+' :: '+html.slice(Math.max(0,html.search(m)-80), html.search(m)+60).replace(/\s+/g,' ')); if (txt.search(m)>=0) r.push('TEXT:'+m.source); } return label+': '+(r.length? r.join(' || ') : 'clean'); };

  const IDX = 0;
  await page.goto('https://hunters-sooty.vercel.app/collaborations/d7220429-9b52-4224-92a7-59df07b34af1');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const cards = d.getByRole('button', { name: /מועמד\/ת אנונימי\/ת/ });
  await cards.nth(IDX).click();
  await page.waitForTimeout(1000);
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(1500);
  const url = page.url();
  const dl = page.getByRole('dialog').last();
  const t = await dl.innerText().catch(()=> '');
  const btns = await dl.getByRole('button').allInnerTexts().catch(()=>[]);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-42-owner-app'+IDX+'-desktop.png' });
  const dom = await scanDom('app'+IDX);
  page.off('response', onResp);
  return 'URL '+url+'\n'+t.slice(0,2200) + '\nBTNS ' + JSON.stringify(btns) + '\n' + dom + '\nNET('+nResp+'): ' + (hits.length? hits.join('\n') : 'clean') + '\nURLS ' + [...urls].join(' , ');
}
