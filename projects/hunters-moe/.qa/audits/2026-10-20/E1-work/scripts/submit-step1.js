async page => {
  const C = globalThis.__c;
  await page.goto('https://hunters-sooty.vercel.app/collaborations/' + globalThis.__job);
  await page.getByRole('dialog').first().waitFor();
  await page.getByRole('button', { name: new RegExp(C) }).click();
  const d = page.getByRole('dialog').last();
  await d.getByText('פרופיל אנונימי', { exact: true }).waitFor();
  await d.getByText('פרופיל אנונימי', { exact: true }).click();
  await d.getByText('אין צורך ב-NDA').first().click();
  await d.getByRole('button', { name: 'המשך', exact: true }).click();
  await page.getByRole('dialog').last().getByRole('button', { name: 'סיום והגשה' }).waitFor({ timeout: 20000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
  return (await page.getByRole('dialog').last().innerText()).slice(0, 800);
}
