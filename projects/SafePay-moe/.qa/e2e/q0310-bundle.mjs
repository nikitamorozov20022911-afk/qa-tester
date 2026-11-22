import { newBrowser, ctx, go } from './q0310-lib.mjs';
const b = await newBrowser(); const { p } = await ctx(b, 'client', 375);
const urls = []; p.on('response', r => { if (/\.js(\?|$)/.test(r.url())) urls.push(r.url()); });
await go(p, '/wallet');
for (const u of urls) { const s = await (await fetch(u)).text(); const m = [...new Set(s.match(/rpc\(\s*["'][a-z_]+["']/g) || [])]; if (m.length) console.log(u, m.join(' ')); const m2=[...new Set(s.match(/["'](request|confirm|approve|reject|accept)_(cancel|release)[a-z_]*["']/g)||[])]; if(m2.length) console.log('names', m2.join(' ')); }
await b.close();
