import { chromium } from 'playwright';
import fs from 'fs';
const AUTH = new URL('../../auth/user2.json', import.meta.url).pathname;
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH, viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
try {
  await page.goto('https://zichui-harabim.expo.app/home'); await page.waitForTimeout(6000);
  const home = await page.locator('body').innerText();
  console.log('HOME:', home.slice(0, 600).replace(/\n+/g, ' | '));
  await page.goto('https://zichui-harabim.expo.app/prayer/mincha_ashkenaz'); await page.waitForTimeout(6000);
  const btns = await page.locator('button,[role=button]').allInnerTexts();
  console.log('BUTTONS:', JSON.stringify(btns.map(b => b.trim()).filter(Boolean).slice(0, 60)));
  const t = await page.locator('body').innerText();
  console.log('PRAYER head:', t.slice(0, 300).replace(/\n+/g, ' | '));
  console.log('PRAYER tail:', t.slice(-500).replace(/\n+/g, ' | '));
} finally {
  const ns = await ctx.storageState();
  const o = ns.origins.find(x => x.origin.includes('expo.app'));
  if (o && o.localStorage.some(i => i.name.includes('auth-token'))) fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2));
  await browser.close();
}
