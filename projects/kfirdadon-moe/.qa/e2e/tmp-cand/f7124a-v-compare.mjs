import { chromium } from 'playwright'; import fs from 'fs';
const Q='/Users/avielshnaider/kfirdadon-moe/.qa/';
const b64=p=>'data:image/png;base64,'+fs.readFileSync(Q+p).toString('base64');
const box=(l,t,w,h)=>`<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;border:2px solid red"></div>`;
const html=`<body style="margin:0;background:#fff;font:14px sans-serif"><div style="display:flex;gap:20px;padding:10px">
<div><div>Figma 827:2940 — chips 46px; links: hit-areas gap 8, text gap 32</div><div style="position:relative;width:390px;height:844px"><img src="${b64('research/67983c2cf6fb3e0dfbf7124a/figma-827-2940-help-sheet-390.png')}" width=390 height=844>${box(32,460,302,50)}${box(58,708,312,40)}</div></div>
<div><div>Site Chromium 390 — chips 44px; email/phone gap 0 px</div><div style="position:relative;width:390px;height:844px"><img src="${b64('screenshots/2026-10-21/f7124a-v-chromium-r3.png')}" width=390 height=844></div></div></div></body>`;
const br=await chromium.launch(); const p=await br.newPage({viewport:{width:840,height:884}}); await p.setContent(html); await p.screenshot({path:Q+'screenshots/2026-10-21/f7124a-v-compare.png'}); await br.close();
