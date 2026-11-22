async page => {
  const sw = await page.evaluate(async()=> (await navigator.serviceWorker?.getRegistrations?.()||[]).length);
  await page.goto('https://hunters-sooty.vercel.app/publish/tender');
  await page.waitForLoadState('networkidle');
  await page.screenshot({path:'screenshots/run-1020/E1/33-E1B-tender-step1-desktop.png', fullPage:true});
  const t = await page.evaluate(()=>document.querySelector('main')?.innerText || document.body.innerText);
  const inputs = await page.evaluate(()=>[...document.querySelectorAll('input,textarea,select,button,[role=radio],[role=checkbox]')].map(e=>`${e.tagName}|${e.type||''}|${e.name||''}|${e.getAttribute('role')||''}|${(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||'').slice(0,60).replace(/\n/g,' ')}|${e.checked??''}`).join('\n'));
  return `sw=${sw} url=${page.url()}\n${t}\n----\n${inputs}`;
}
