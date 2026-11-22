async page => {
  await page.goto('https://hunters-sooty.vercel.app/collaborations/d7220429-9b52-4224-92a7-59df07b34af1');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const t = await d.innerText();
  const i = t.indexOf('ההגשות שלי'); 
  await page.screenshot({ path: 'screenshots/run-1020/E1/E1A-06-sender-job-panel-after-view-desktop.png', fullPage: false });
  const sub = t.match(/(הגשות|ההגשות|המועמדים שהגשתי)[\s\S]{0,600}/);
  return t.slice(0, 200) + '\n...\n' + (sub ? sub[0] : t.slice(t.indexOf('הגשת מועמד'), t.indexOf('הגשת מועמד')+900));
}
