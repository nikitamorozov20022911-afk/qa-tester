// data prep: find deal id by title for client 04
import { newBrowser, ctx, go, sleep } from './q0310-lib.mjs';
const b = await newBrowser(); const { p } = await ctx(b, 'client', 375, 812); p.setDefaultTimeout(15000);
await go(p, '/deals'); await sleep(4000);
const el = p.getByText(process.env.T, { exact: true }).first(); await el.click();
await p.waitForURL(u => /\/deals\/[0-9a-f-]{20,}/.test(u.toString()), { timeout: 20000 });
console.log('URL', p.url()); await b.close();
