async page => {
  const out = [];
  const pickCombo = async (name, optText) => {
    await page.getByRole('combobox', { name }).click();
    const opts = page.getByRole('option');
    await opts.first().waitFor({ timeout: 10000 });
    const all = await opts.allInnerTexts();
    let target = optText ? opts.filter({ hasText: optText }).first() : opts.first();
    const t = await target.innerText();
    await target.click();
    out.push(`${name}: [${all.slice(0,8).join(' | ')}] -> ${t}`);
  };
  await page.getByRole('textbox', { name: 'שם המשרה (שדה חובה)' }).fill('QA-AUTO 1020 E1 משרה NDA');
  await page.getByRole('textbox', { name: 'תיאור המשרה (שדה חובה)' }).fill('QA-AUTO 1020 E1 – משרת בדיקה לתרחיש מקצה לקצה בין שני הד האנטרים. לא להגיש מועמדים אמיתיים.');
  await pickCombo('תחום התמחות (שדה חובה)', 'פיננסים');
  await page.getByRole('button', { name: 'תפקידים (שדה חובה)' }).click();
  const cb = page.getByRole('checkbox').or(page.getByRole('menuitemcheckbox')).or(page.getByRole('option'));
  await cb.first().waitFor({ timeout: 10000 });
  out.push('roles: ' + (await cb.allInnerTexts()).slice(0,6).join(' | '));
  await cb.first().click();
  await page.keyboard.press('Escape');
  await page.getByRole('textbox', { name: 'מ-' }).fill('15000');
  await page.getByRole('textbox', { name: 'עד' }).fill('20000');
  const slider = page.getByRole('slider', { name: /עמלת/ });
  await slider.focus();
  for (let i=0;i<10;i++) await page.keyboard.press('ArrowLeft');
  out.push('commission: ' + await page.getByRole('status').first().innerText().catch(()=>'?'));
  await pickCombo('היקף משרה (שדה חובה)');
  await pickCombo('סוג משרה (שדה חובה)');
  await pickCombo('אזור (שדה חובה)');
  await pickCombo('האם נדרשת חתימה על NDA לפני הגשת מועמד?', 'כן');
  await page.screenshot({path:'screenshots/run-1020/E1/E1A-45-job2-step1-nda-yes-desktop.png', fullPage:true});
  out.push('BODY '+(await page.locator('body').innerText()).slice(-700));
  return out.join('\n');
}
