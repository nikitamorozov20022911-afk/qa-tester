import { open, warm, BASE, SHOTS } from './3cc7-lib.mjs';
const s = await open({});
const { page } = s;
try {
  await page.goto(BASE + '/zmanim');
  await page.waitForTimeout(6000);
  console.log((await page.locator('body').innerText()).slice(0, 700));
} finally { console.log('save', await s.close()); }
