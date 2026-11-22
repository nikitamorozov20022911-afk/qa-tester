import { newBrowser, ctx, go, txt } from './q0310-lib.mjs';
const b = await newBrowser();
const { p } = await ctx(b, process.env.R||'client', 375, 812);
await go(p, '/deals');
const t = await txt(p); const lines=t.split('\n');
lines.forEach((l,i)=>{ if (l.includes('03.10')) console.log(lines.slice(i,i+4).join(' | ')); });
await b.close();
