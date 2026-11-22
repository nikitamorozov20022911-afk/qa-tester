// QA: создаёт отдельные слоты входа auth/<role>-<n>.json (новая сессия на каждый слот)
const { chromium } = require('playwright');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../accounts.env') });
(async () => {
  const [role, ...slots] = process.argv.slice(2);
  const R = role.toUpperCase();
  const browser = await chromium.launch();
  for (const s of slots) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('https://app.techory.ai/login');
    await page.locator('#email').fill(process.env[`QA_USER_${R}_EMAIL`]);
    await page.locator('#password').fill(process.env[`QA_USER_${R}_PASSWORD`]);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(u => !/\/login|\/home$/.test(u.pathname), { timeout: 30000 });
    await page.waitForFunction(() => Object.keys(localStorage).some(k => k.includes('auth-token')), null, { timeout: 30000 });
    await ctx.storageState({ path: path.resolve(__dirname, `../auth/${role}-${s}.json`) });
    console.log('saved', `${role}-${s}`);
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
