import { newBrowser, ctx, go, txt, sleep } from './q0310-lib.mjs';
import { btns } from './q0310-btns.mjs';
const b = await newBrowser(); const { p } = await ctx(b, 'client', 375, 812);
await go(p, '/notifications');
console.log((await btns(p)).slice(0,10));
const btn = p.locator('[role=button]').filter({ hasText: 'QA ביטול 03.10 ב' }).first();
p._req.length=0; await btn.click(); await sleep(5000); console.log('->', p.url(), p._req);
await go(p, '/wallet'); const w = p.locator('[role=button]').filter({ hasText: 'הובלה מהמרקטפלייס' }).first(); await w.click(); await sleep(4000); console.log('wallet pending item ->', p.url());
await b.close();
