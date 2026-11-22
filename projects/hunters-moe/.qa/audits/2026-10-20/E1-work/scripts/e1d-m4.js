async page => {
  await page.mouse.move(720,450);
  await page.screenshot({path:'screenshots/run-1020/E1/miro-overview.png'});
  return await page.locator('text=/^\\d+%$/').last().innerText().catch(()=>'?');
}
