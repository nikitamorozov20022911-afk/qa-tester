async page => {
  const MARK = [/E1 Alpha/i, /E1 Bravo/i, /E1 Charlie/i, /1020-e1/i, /102-?0001/, /1020001/, /102-?0002/, /1020002/, /102-?0003/, /1020003/, /linkedin\.com\/in\/qa-auto/i, /qa-auto-1020-e1/i];
  const hits = []; let nResp = 0; const urls = new Set();
  const onResp = async r => { try { const ct = r.headers()['content-type']||''; if (!/json|text|rsc|javascript|x-component/.test(ct)) return; if (/_next\/static/.test(r.url())) return; const t = await r.text(); nResp++; urls.add(r.url().split('?')[0].slice(0,90)); for (const m of MARK) { const i = t.search(m); if (i>=0) hits.push(m.source+' @ '+r.url().slice(0,120)+' :: '+t.slice(Math.max(0,i-80), i+60).replace(/\s+/g,' ')); } } catch(e){} };
  page.on('response', onResp);
  const scanDom = async (label) => { const html = await page.content(); const txt = await page.locator('body').innerText(); const r=[]; for (const m of MARK) { if (html.search(m)>=0) r.push('HTML:'+m.source+' :: '+html.slice(Math.max(0,html.search(m)-80), html.search(m)+60).replace(/\s+/g,' ')); if (txt.search(m)>=0) r.push('TEXT:'+m.source); } return label+': '+(r.length? r.join(' || ') : 'clean'); };

  // open owner's application card by index of anonymous card whose summary contains KEY
  const KEY = 'מהנדס/ת בדיקות אוטומציה';
  await page.goto('https://hunters-sooty.vercel.app/collaborations/d7220429-9b52-4224-92a7-59df07b34af1');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const cards = d.getByRole('button', { name: new RegExp('מועמד/ת אנונימי/ת') });
  const n = await cards.count();
  for (let i=0;i<n;i++) { const t = await cards.nth(i).innerText(); if (t.includes(KEY)) { await cards.nth(i).click(); break; } }
  const dl = page.getByRole('dialog').last();
  await dl.getByText('סטטוס מועמד').waitFor({ timeout: 15000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
    await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-43-owner-sees-answer-privacy2-desktop.png' });
  const dom = await scanDom('card');
  page.off('response', onResp);
  return (await page.getByRole('dialog').last().innerText()).slice(-900) + '\nBTNS ' + JSON.stringify(await page.getByRole('dialog').last().getByRole('button').allInnerTexts()) + '\n' + dom + '\nNET(' + nResp + '): ' + (hits.length ? hits.join('\n') : 'clean');

  return 'n='+n+'\n'+(await page.getByRole('dialog').last().innerText()).slice(-1500);
}
