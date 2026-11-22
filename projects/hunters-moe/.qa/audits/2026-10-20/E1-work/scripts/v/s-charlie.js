async page => {
  await page.goto('https://hunters-sooty.vercel.app/applications/95e1d65a-fc57-411d-95f8-52bab39c7c84');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.getByText('סטטוס מועמד').first().waitFor({ timeout: 15000 }).catch(()=>{});
  const t = await page.locator('body').innerText();
  const html = await page.content();
  globalThis.__shot="screenshots/run-1020/E1/verify-nda-sender-charlie-app-desktop.png"; if (globalThis.__shot) await page.screenshot({ path: globalThis.__shot, fullPage: true });
  const hits = (html.match(/nda[A-Za-z_]*/gi)||[]).filter((v,i,a)=>a.indexOf(v)===i);
  const ndaCtx = (t.match(/.{0,60}NDA.{0,60}/g)||[]);
  return 'URL '+page.url()+'\nTEXT: '+t.slice(0,2000)+'\nNDA-in-text: '+JSON.stringify(ndaCtx)+'\nnda-keys-in-html: '+JSON.stringify(hits);
}
