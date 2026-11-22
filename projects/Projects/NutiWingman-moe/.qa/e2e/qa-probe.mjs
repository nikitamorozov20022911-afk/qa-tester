// QA probe: open /home for account, run an in-page JS file (arg 3), print result, save storageState back.
// usage: node qa-probe.mjs <account> <script.js> [out.json]
import { chromium } from 'playwright';
import fs from 'node:fs';
const [acc, scriptFile, outFile] = process.argv.slice(2);
const authFile = `../auth/${acc}.json`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ storageState: authFile, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
let out;
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 30000 });
  await page.getByRole('button', { name: /קו היום/ }).waitFor({ timeout: 15000 });
  const code = fs.readFileSync(scriptFile, 'utf8');
  out = await page.evaluate(code);
} catch (e) { out = { err: String(e).slice(0, 800) }; }
const s = JSON.stringify(out, null, 1);
if (outFile) fs.writeFileSync(outFile, s);
console.log(s.slice(0, 20000));
await ctx.storageState({ path: authFile });
await browser.close();
