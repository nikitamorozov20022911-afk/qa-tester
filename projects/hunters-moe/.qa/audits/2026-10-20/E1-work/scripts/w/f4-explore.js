async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  await page.goto(B+'/my-candidates'); await wait();
  out.push('URL '+page.url());
  const links = await page.evaluate(()=>[...new Set([...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')+' ='+(a.innerText||'').trim().slice(0,30).replace(/\n/g,' ')))]);
  out.push('LINKS '+links.join(' ; '));
  out.push('BODY '+(await page.evaluate(()=>document.body.innerText)).slice(0,2500).replace(/\n+/g,' / '));
  return out.join('\n');
}
