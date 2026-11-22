import { newBrowser, ctx, go, shot, sleep } from './qasp6-lib.mjs';
const RUN=process.env.RUN||'r1';
const W='/wallet/shared/3bf0fc53-2b78-46d2-9f53-f824c57ceb39', K='/wallet/kids/2e7de39a-13d7-4d7d-a22d-d982a9b95971';
const plan = {
  client: [['6a86f7b2','/wallet/shared'],['6a86f7b6','/wallet/shared/new'],['6a86f7c7',W],['6a86f7c7',W+'?tab=actions'],['6a86f7c7',W+'/topup'],['6a86f7c7',W+'/withdraw'],['6a86f7c7',W+'/pay'],['6a86f7b2fbf9','/wallet/kids'],['6a86f7b4','/wallet/kids/new'],['6a86f7ce80ac7184',K],['6a86f7c8',K+'/limits']],
  provider: [['6a86f7b2','/wallet/shared'],['6a86f7c7',W],['6a86f7c7',W+'?tab=actions'],['6a86f7c7',W+'/pay']],
  client2: [['6a86f7bc','/kid'],['6a86f7bc','/kid/pay'],['6a86f7bc','/kid/settings']],
};
const b = await newBrowser();
for (const w of (process.env.WS||'320,375,1440').split(',').map(Number)) {
  for (const [role, items] of Object.entries(plan)) {
    const { c, p } = await ctx(b, role, w, w>1000?900:760);
    for (const [dir, path] of items) {
      await go(p, path, 3500);
      const m = await p.evaluate(() => {
        const iw = innerWidth; const bad=[];
        for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (r.width && r.height && (r.right > iw + 1 || r.left < -1) && getComputedStyle(el).visibility!=='hidden') { const t=(el.innerText||'').trim().slice(0,30); if(t) bad.push(t+'['+Math.round(r.left)+'..'+Math.round(r.right)+']'); } }
        // text truncation
        const trunc=[]; for (const el of document.querySelectorAll('div')) { if (el.childElementCount===0 && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow==='hidden') trunc.push(el.textContent.slice(0,30)); }
        return { sw: document.documentElement.scrollWidth, iw, bad: [...new Set(bad)].slice(0,6), trunc: trunc.slice(0,6) };
      });
      const tag = `${RUN}-resp-${role}-${path.replace(W,'W').replace(K,'K').replace(/[\/?=]/g,'_')}-${w}`;
      await shot(p, `${dir}/${tag}`, true);
      console.log(role, w, path.replace(W,'W').replace(K,'K'), '->', p.url().replace('https://safepay.expo.app',''), JSON.stringify(m));
    }
    console.log('CONSOLE', role, w, JSON.stringify(p._console));
    await c.close();
  }
}
await b.close();
