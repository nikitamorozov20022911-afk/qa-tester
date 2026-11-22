async page => {
  const marks=['הצעה HR','הצעה FREE-PLUS','מיכל לוי','07813975','a1ce92a7','1,000','"amount"','offer'];
  const hits=[]; page.on('response', async r=>{ const ct=r.headers()['content-type']||''; if(!/json|text|rsc|x-component/.test(ct)) return; let b=''; try{b=await r.text()}catch(e){return}; for(const m of marks){ const i=b.indexOf(m); if(i>=0) hits.push(m+' @ '+r.url().slice(0,90)+' :: '+b.slice(Math.max(0,i-80),i+80).replace(/\n/g,' ')); }});
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302'); await page.waitForLoadState('networkidle');
  await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{});
  const html = await page.content(); const dh=[]; for(const m of marks){ let i=html.indexOf(m); if(i>=0) dh.push(m+' :: '+html.slice(Math.max(0,i-80),i+80).replace(/\n/g,' ')); }
  return 'NET HITS:\n'+hits.slice(0,30).join('\n')+'\nDOM HITS:\n'+dh.join('\n');
}
