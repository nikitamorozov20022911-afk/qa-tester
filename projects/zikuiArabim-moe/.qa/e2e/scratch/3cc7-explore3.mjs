import { open, warm, BASE, SHOTS } from './3cc7-lib.mjs';
const s = await open({});
const { page } = s;
try {
  await warm(page);
  await page.goto(BASE + '/profile');
  await page.getByText('מיקום', { exact: true }).click();
  await page.waitForTimeout(2500);
  console.log(page.url());
  console.log((await page.locator('body').innerText()).slice(0, 1500));
  const inputs = await page.locator('input').evaluateAll(a => a.map(i => ({ ph: i.placeholder, aria: i.getAttribute('aria-label'), v: i.value })));
  console.log(JSON.stringify(inputs));
  const btns = await page.getByRole('button').evaluateAll(a => a.map(b => (b.getAttribute('aria-label') || b.innerText).slice(0, 40)));
  console.log(JSON.stringify(btns));
  await page.screenshot({ path: SHOTS + '3cc7-explore-loc.png' });
} finally { console.log('save', await s.close()); }
