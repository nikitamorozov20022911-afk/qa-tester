async page => {
  await page.mouse.move(720,450);
  await page.mouse.wheel(-450,-80);
  await page.waitForTimeout(700);
  await page.screenshot({path:'screenshots/run-1020/E1/miro-candidacy-42-left.png'});
  return 'ok';
}
