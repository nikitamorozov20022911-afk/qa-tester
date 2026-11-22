async page => {
  await page.goto('https://hunters-sooty.vercel.app/tenders'); await page.waitForLoadState('networkidle');
  const more = page.getByRole('button',{name:'עוד'}).first(); if (await more.count()) { await more.click(); await page.waitForTimeout(0); await page.locator('[role=menu]').first().waitFor({timeout:4000}).catch(()=>{}); }
  return [...new Set(await page.evaluate(()=>[...document.querySelectorAll('a[href^="/"]')].map(a=>a.innerText.trim().replace(/\n/g,' ').slice(0,25)+'->'+a.getAttribute('href'))))].filter(x=>!x.includes('/tenders/')).join(' | ');
}
