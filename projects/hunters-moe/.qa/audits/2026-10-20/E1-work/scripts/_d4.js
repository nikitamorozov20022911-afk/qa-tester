async page => {
  const MARK = [/E1 Alpha/i, /E1 Bravo/i, /E1 Charlie/i, /1020-e1/i, /102-?0001/, /1020001/, /102-?0002/, /1020002/, /102-?0003/, /1020003/, /linkedin\.com\/in\/qa-auto/i, /qa-auto-1020-e1/i];
  const hits = []; let nResp = 0; const urls = new Set();
  const onResp = async r => { try { const ct = r.headers()['content-type']||''; if (!/json|text|rsc|javascript|x-component/.test(ct)) return; if (/_next\/static/.test(r.url())) return; const t = await r.text(); nResp++; urls.add(r.url().split('?')[0].slice(0,90)); for (const m of MARK) { const i = t.search(m); if (i>=0) hits.push(m.source+' @ '+r.url().slice(0,120)+' :: '+t.slice(Math.max(0,i-80), i+60).replace(/\s+/g,' ')); } } catch(e){} };
  page.on('response', onResp);
  const scanDom = async (label) => { const html = await page.content(); const txt = await page.locator('body').innerText(); const r=[]; for (const m of MARK) { if (html.search(m)>=0) r.push('HTML:'+m.source+' :: '+html.slice(Math.max(0,html.search(m)-80), html.search(m)+60).replace(/\s+/g,' ')); if (txt.search(m)>=0) r.push('TEXT:'+m.source); } return label+': '+(r.length? r.join(' || ') : 'clean'); };

  await page.goto('https://hunters-sooty.vercel.app/applications/29bd04ad-e749-45d0-a3a8-8941f8d069a8');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-07-owner-direct-bravo-applications-desktop.png' });
  const ds = page.getByRole('dialog'); const n = await ds.count();
  const t = n ? await ds.last().innerText() : await page.locator('body').innerText();
  const dom = await scanDom('deep');
  page.off('response', onResp);
  return page.url() + ' dialogs=' + n + '\n' + t.slice(0, 300) + ' … ' + t.slice(-500) + '\n' + dom + '\nNET(' + nResp + '): ' + (hits.length ? hits.join('\n') : 'clean');
}
