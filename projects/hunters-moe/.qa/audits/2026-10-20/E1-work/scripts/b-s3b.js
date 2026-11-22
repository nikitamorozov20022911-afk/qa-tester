async page => {
  const dump = async (shot) => { if(shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot, fullPage:true});
    const t = await page.evaluate(()=>(document.querySelector('main')||document.body).innerText);
    const inputs = await page.evaluate(()=>[...document.querySelectorAll('main input,main textarea,main select,main button,[role=dialog] input,[role=dialog] button')].map(e=>`${e.tagName}|${e.type||''}|${e.name||e.id||''}|${(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||'').slice(0,50).replace(/\n/g,' ')}|${e.checked??''}|${e.disabled?'dis':''}`).join('\n'));
    return `url=${page.url()}\n${t}\n----\n${inputs}`; };
  await page.locator('input[name=title]').fill('QA-AUTO 1020 E1 מכרז');
  await page.locator('textarea[name=description]').fill('QA-AUTO 1020 E1 — מכרז בדיקה אוטומטית (סשן E1B). מחפשים הד האנטר לגיוס מפתח/ת Full Stack לפרויקט. לא להגיש הצעות אמיתיות.');
  const pick = async (n, v) => { await page.locator(`button#${n}`).first().click(); await page.getByRole('option',{name:v, exact:true}).click(); };
  await pick('region','מרכז');
  await pick('validDay','30'); await pick('validMonth','11'); await pick('validYear','2026');
  await page.locator('input[name=pricing_model][value=project]').check();
  const pre = await dump('33-E1B-tender-step3-filled-desktop.png');
  await page.getByRole('button',{name:'המשך'}).click();
  await page.getByText('שלב 4 מתוך 4').waitFor({timeout:15000}).catch(()=>{});
  await page.waitForLoadState('networkidle');
  return pre.split('----')[0].slice(0,600) + '\n=====STEP4=====\n' + await dump('33-E1B-tender-step4-desktop.png');
}
