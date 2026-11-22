import { newBrowser, ctx, go, txt, shot, sleep } from './q0310-lib.mjs';
import { btns } from './q0310-btns.mjs';
const b = await newBrowser();
for (const role of ['client','provider']) { const { p } = await ctx(b, role, 375, 812);
 for (const [t, dir] of [['QA ביטול','6a86f7cdd4002d2fab924eac'],['QA שיפוץ מטבח','6a86f7cd444d05eea4a45199']]) {
  await go(p, '/deals'); await p.getByText(t, { exact: true }).first().click(); await sleep(3500);
  const L=(await txt(p)).split('\n'); console.log(role, t, p.url().slice(-36), L.slice(2,4).join(' | '), '| status:', L[L.indexOf('סטטוס תשלום')+1], '| cancel card?', L.some(l=>l.includes('בקשת ביטול')), await btns(p));
  await shot(p, dir, `r2-old-${t==='QA ביטול'?'bitul-3009':'kitchen-3009'}-${role}-mobile`);
 } }
await b.close();
