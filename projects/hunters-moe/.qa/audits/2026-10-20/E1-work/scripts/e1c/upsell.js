async page => {
  const tag = globalThis.__r || 'talent';
  const SH = n => `/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1C-${n}-${tag}-desktop.png`;
  const out=[];
  const reqs=[]; page.on('request', r => { if (/checkout|payment|stripe|cardcom|tranzila|grow|meshulam|pay/i.test(r.url())) reqs.push(r.method()+' '+r.url().slice(0,150)); });
  await page.goto('https://hunters-sooty.vercel.app/collaborations/77f6896c-9f7c-4cbe-b9e6-1b30ff48344a');
  await page.getByText('מעוניינים במשרה הזאת?').waitFor({ timeout: 15000 });
  const block = page.getByText('מעוניינים במשרה הזאת?').locator('xpath=ancestor::*[.//button][1]');
  out.push('APPLY BLOCK: ' + (await block.innerText()).replace(/\n/g,' | '));
  await block.evaluate(e => e.style.outline='3px solid red');
  await page.screenshot({ path: SH('60-AC02-limit-block') });
  await block.evaluate(e => e.style.outline='');
  const up = block.getByRole('button', { name: 'לשדרוג' });
  out.push('upgrade btns in block: ' + await up.count());
  await up.first().click();
  const d = page.getByRole('dialog').last();
  await d.waitFor({ timeout: 10000 });
  await d.getByText(/./).first().waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  out.push('URL: ' + page.url());
  out.push('DIALOG1: ' + (await d.innerText()).slice(0,2500).replace(/\n/g,' | '));
  out.push('DIALOG1 BTNS: ' + (await d.locator('button,a').evaluateAll(as=>as.map(a=>(a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\n/g,' ').slice(0,60)))).join(' ;; '));
  await page.screenshot({ path: SH('62-upsell-dialog') });
  out.push('PAY REQS: ' + reqs.join(' ; '));
  return out.join('\n');
}
