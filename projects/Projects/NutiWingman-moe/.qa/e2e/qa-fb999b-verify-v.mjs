// QA #456c00/#9021c3/#84ff30: open /home for account, run in-page async body (file) with ARGS, save storageState back.
// usage: node qa-mem-run.mjs <account> <body.js> <out.json> [args.json] [shot.png]
import { chromium } from 'playwright';
import fs from 'node:fs';
const [acc, bodyFile, outFile, argsFile, shot] = process.argv.slice(2);
const authFile = `../auth/${acc}.json`;
const args = argsFile && argsFile!=="-" ? fs.readFileSync(argsFile, 'utf8') : '{}';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ storageState: authFile, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
let out;
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 30000 });
  await page.getByRole('button', { name: /קו היום/ }).waitFor({ timeout: 15000 });
  const prelude = `const ARGS=${args};const KEY='sb_publishable_t5bugQ0sFJYTuAqyZMC3aA_hcsX-sg6';const BASE='https://siodtucasjpxpsfuvlfc.supabase.co';
const sess=()=>{for(const k of Object.keys(localStorage)) if(/auth-token$/.test(k)) return JSON.parse(localStorage.getItem(k));};
const rest=async(method,p,body,prefer='return=representation')=>{const s=sess();const r=await fetch(BASE+'/'+p,{method,headers:{apikey:KEY,Authorization:'Bearer '+s.access_token,'Content-Type':'application/json',Prefer:prefer},body:body?JSON.stringify(body):undefined});const t=await r.text();let b;try{b=JSON.parse(t)}catch{b=t}return {status:r.status,body:b};};
const api=__r(807).api;const catchErr=async f=>{try{return {ok:await f()}}catch(e){return {err:e?.name+': '+(e?.message||String(e)),code:e?.code}}};`;
  const code = `(async()=>{${prelude}\n${fs.readFileSync(bodyFile, 'utf8')}\n})()`;
  out = await page.evaluate(code);
  if (shot) { await page.evaluate(o => { document.body.innerHTML = "<pre style=\"font:12px monospace;white-space:pre-wrap;direction:ltr;padding:8px;background:#fff;color:#000\">" + JSON.stringify(o.summary ?? o, null, 1).replace(/</g, "&lt;") + "</pre>"; }, out); await page.screenshot({ path: shot, fullPage: true }); }
} catch (e) { out = { err: String(e).slice(0, 1500) }; }
fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out).slice(0, 3000));
await ctx.storageState({ path: authFile });
await browser.close();
