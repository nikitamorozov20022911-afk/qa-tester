import { newBrowser, ctx, go } from './qasp6-lib.mjs';
import fs from 'fs';
const b = await newBrowser(); const { p } = await ctx(b, 'client', 375);
const urls=[]; p.on('response', r=>{ if(r.url().endsWith('.js')) urls.push(r.url()); });
await go(p,'/wallet/kids/new', 5000);
let all=''; for(const u of urls){ try{ all += await (await fetch(u)).text(); }catch{} }
fs.writeFileSync('/private/tmp/claude-502/-Users-avielshnaider-SafePay-moe/3634dcad-42f2-4068-b1b0-dc1224f1ebc6/scratchpad/bundle.js', all);
console.log(urls.length, all.length);
await b.close();
