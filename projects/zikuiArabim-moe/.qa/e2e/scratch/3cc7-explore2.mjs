import { open, warm, BASE, SHOTS } from './3cc7-lib.mjs';
const s = await open({});
const { page, log } = s;
const urls = [];
page.on('request', (r) => { const u = r.url(); if (u.includes('/rest/v1/') ) urls.push(r.method() + ' ' + u.replace(/^https:\/\/[^/]+/, '').slice(0, 220)); });
try {
  await warm(page);
  await page.goto(BASE + '/profile');
  await page.waitForTimeout(5000);
  const txt = await page.locator('body').innerText();
  console.log(txt.slice(0, 2500));
  const loc = page.getByText('מיקום', { exact: true });
  console.log('loc count', await loc.count());
  await page.screenshot({ path: SHOTS + '3cc7-explore-profile.png', fullPage: true });
  console.log(urls.join('\n'));
} finally { console.log('save', await s.close()); }
