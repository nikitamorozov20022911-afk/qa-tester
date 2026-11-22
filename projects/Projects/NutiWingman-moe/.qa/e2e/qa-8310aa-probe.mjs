// one-off guest probe for #8310aa: goal UI
import { chromium } from 'playwright'; import fs from 'node:fs';
const OUT='C:/Users/nekit/Documents/projects/NutiWingman-moe/.qa/research/shots/8310aa';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const dump = async (tag) => { console.log('==', tag, page.url()); console.log((await page.evaluate(() => document.body.innerText)).slice(0, 1500));
  console.log('BTN', await page.evaluate(() => [...document.querySelectorAll('[role=button],button,a,input')].map(e => (e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText || '').trim().slice(0, 40)).filter(Boolean).join(' | ')));
  await page.screenshot({ path: `${OUT}/probe-${tag}.png` }); };
await page.goto('https://nutriwingman.expo.app/', { waitUntil: 'networkidle' });
const ta = page.getByPlaceholder('לשאול או לספר מה אכלת'); await ta.waitFor();
const r = page.waitForResponse(r => /functions\/v1\/chat/.test(r.url()), { timeout: 60000 }).catch(() => null);
await ta.fill('היי'); await ta.press('Enter'); await r;
const line = page.getByRole('button', { name: /קו היום/ }); await line.waitFor({ timeout: 20000 });
await line.click(); await page.getByText('לקבוע יעד').first().waitFor({ timeout: 10000 }).catch(() => {}); await dump('line');
await page.getByText('לקבוע יעד').first().click(); await page.waitForLoadState('networkidle'); await page.waitForFunction(()=>!/•••/.test(document.body.innerText)&&document.body.innerText.length>200,null,{timeout:30000}).catch(()=>{}); await page.waitForLoadState('networkidle'); await dump('goal');
await browser.close();
