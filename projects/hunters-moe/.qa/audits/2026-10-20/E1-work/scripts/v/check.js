async page => { await page.waitForLoadState('networkidle').catch(()=>{}); return page.url() + '\n' + (await page.locator('header').innerText().catch(()=>'')).slice(0,300); }
