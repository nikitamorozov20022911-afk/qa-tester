// #22c9d541: user1 (rank 10) in a clean browser (no `journey` key) must not see «עלית דרגה»
import { chromium, webkit } from 'playwright';
import fs from 'fs';
const AUTH = new URL('../../auth/user1.json', import.meta.url).pathname;
const SHOTS = new URL('../../screenshots/', import.meta.url).pathname;
const engine = process.argv[2] === 'webkit' ? webkit : chromium;
const tag = process.argv[2] || 'chromium';
const width = +(process.argv[3] || 390);
const orig = JSON.parse(fs.readFileSync(AUTH, 'utf8'));
const journeyOrig = orig.origins[0].localStorage.find(i => i.name === 'journey');
const state = JSON.parse(JSON.stringify(orig));
state.origins[0].localStorage = state.origins[0].localStorage.filter(i => i.name !== 'journey');
const browser = await engine.launch();
const ctx = await browser.newContext({ storageState: state, viewport: { width, height: 844 }, locale: 'he-IL' });
const page = await ctx.newPage();
const res = { tag, width, steps: [] };
async function check(label) {
  await page.waitForTimeout(6000);
  const txt = await page.locator('body').innerText();
  const shown = /עלית דרגה/.test(txt);
  const js = await page.evaluate(() => localStorage.getItem('journey'));
  await page.screenshot({ path: `${SHOTS}rankup-22c9-${tag}-${width}-${label}.png` });
  res.steps.push({ label, url: page.url(), rankupShown: shown, journeyKey: js, rungText: (txt.match(/דרגה[^\n]{0,40}/g) || []).slice(0, 4) });
}
await page.goto('https://zichui-harabim.expo.app/journey'); await check('first');
await page.reload(); await check('reload');
await page.goto('https://zichui-harabim.expo.app/home'); await page.waitForTimeout(2000);
await page.goto('https://zichui-harabim.expo.app/journey'); await check('renav');
// save rotated session back, keep original journey key
const ns = await ctx.storageState();
const o = ns.origins.find(x => x.origin.includes('zichui-harabim.expo.app'));
if (o && o.localStorage.some(i => i.name.includes('auth-token'))) {
  o.localStorage = o.localStorage.filter(i => i.name !== 'journey');
  if (journeyOrig) o.localStorage.push(journeyOrig);
  fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2)); res.saved = true;
}
await browser.close();
console.log(JSON.stringify(res, null, 1));
