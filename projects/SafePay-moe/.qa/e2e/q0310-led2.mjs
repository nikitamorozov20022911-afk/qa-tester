import { newBrowser, ctx, go, txt, shot, redBox } from './q0310-lib.mjs';
import { bal } from './q0310-btns.mjs';
const b = await newBrowser();
for (const role of ['client','provider']) { const { p } = await ctx(b, role, 1440, 900);
 console.log(role, await bal(p, go)); const t = await txt(p); console.log(t.slice(t.indexOf('פעולות אחרונות'), t.indexOf('פעולות אחרונות')+260).replace(/\n/g,' | '));
 await redBox(p, p.getByText('פעולות אחרונות').first(), '6a86f7ccc9997bc71194c8a6', `r2-0${role==='client'?'2':'1'}-${role}-ledger-after-release-cancel-desktop`);
 const hs = p.getByText('הצג/י הכל').last(); await hs.click(); await new Promise(r=>setTimeout(r,2500)); console.log(role,'after show-all click url', p.url());
 await shot(p,'6a86f7ccc9997bc71194c8a6', `r2-04-${role}-show-all-desktop`);
 console.log('console', p._console); }
await b.close();
