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
  await page.getByRole('textbox', { name: 'שם המשרה (שדה חובה)' }).fill(globalThis.__title || 'QA-AUTO 1020 E1 משרה אנונימית');
  await page.getByRole('textbox', { name: 'תיאור המשרה (שדה חובה)' }).fill('QA-AUTO 1020 E1 – משרת בדיקה לתרחיש מקצה לקצה בין שני הד האנטרים. לא להגיש מועמדים אמיתיים.');
  await pickCombo('תחום התמחות (שדה חובה)');
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
  for (let i=0;i<10;i++) await page.keyboard.press('ArrowRight');
  out.push('commission: ' + await page.getByRole('status').first().innerText().catch(()=>'?'));
  await pickCombo('היקף משרה (שדה חובה)');
  await pickCombo('סוג משרה (שדה חובה)');
  await pickCombo('אזור (שדה חובה)');
  return out.join('\n');
}
