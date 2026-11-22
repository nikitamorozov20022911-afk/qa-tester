import { newBrowser, ctx, go } from './qasp6-lib.mjs';
const b = await newBrowser(); const { p } = await ctx(b,'client2',320);
await go(p,'/kid/pay',4000);
console.log(await p.evaluate(()=>{ const els=[...document.querySelectorAll('div')].filter(e=>{const r=e.getBoundingClientRect(); return r.right>innerWidth+1 && r.height>100 && r.height<400;}); const c=els[els.length-1]; c.style.outline='3px solid red'; c.style.outlineOffset='-3px'; const r=c.getBoundingClientRect(); return JSON.stringify({l:r.left,r:r.right,w:r.width,h:r.height,sw:document.documentElement.scrollWidth}); }));
await p.screenshot({path:'/Users/avielshnaider/SafePay-moe/.qa/screenshots/6a86f7bc/ISSUE-kid-pay-overflow-320.png'});
await b.close();
