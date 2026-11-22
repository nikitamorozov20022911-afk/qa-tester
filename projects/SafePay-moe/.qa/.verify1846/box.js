const { chromium } = require('../e2e/node_modules/playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch({channel:'chrome'});
 for (const [src,out,w,h,rects] of [
  ['r1-A4-after-chazara.png','../screenshots/1846ecd8/verify-1-A4-after-chazara-provider-page-BOXED-375.png',375,812,[[15,250,265,55],[75,710,285,60]]],
  ['r2-A4-after-chazara.png','../screenshots/1846ecd8/verify-1-A4-after-chazara-provider-page-BOXED-1440.png',1440,900,[[2,2,1436,896]]]]) {
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});
  const data=fs.readFileSync(src).toString('base64');
  await p.setContent(`<body style="margin:0"><img src="data:image/png;base64,${data}" style="width:${w}px;display:block">${rects.map(r=>`<div style="position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;border:3px solid red;box-sizing:border-box"></div>`).join('')}</body>`);
  await p.screenshot({path:out}); }
 await b.close(); })();
