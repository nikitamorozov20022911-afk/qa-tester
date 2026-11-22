import * as L from './qa1846-lib.mjs';
const RUN = process.env.RUN || 'r1'; const W = +(process.env.W || 375); const DEV = W < 768 ? 'mobile' : 'desktop';
const b = await L.newBrowser(); const { p } = await L.ctx(b, 'provider', W, W < 768 ? 812 : 900);
p.setDefaultTimeout(15000);
const out = {};
await p.goto(L.BASE + '/deals'); await L.sleep(5000);
const t = await L.visText(p);
out.header = t.slice(0, 60);
out.rows = t.split('\n').map((l, i, a) => l.includes('QA 1846') ? a.slice(i, i + 4).join(' | ') : null).filter(Boolean);
const titles = (process.env.TITLES || '').split(';').filter(Boolean);
for (const ti of titles) out['occ ' + ti] = t.split(ti).length - 1;
if (titles[0]) {
  await L.redBox(p, p.getByText(titles[0]), `${RUN}-P1-provider-list-${DEV}`);
  await p.getByText(titles[0]).first().click(); await L.sleep(4000);
  out.detailsUrl = p.url(); out.details = (await L.visText(p)).split('\n').filter(Boolean).slice(0, 40);
  out.btns = await p.evaluate(() => [...document.querySelectorAll('[role=button],button')].filter((e) => e.offsetParent).map((e) => (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\n/g,' / ') + (e.getAttribute('aria-disabled')==='true'?'[disabled]':'')).filter(Boolean));
  await L.shot(p, `${RUN}-P2-provider-details-${DEV}`);
}
out.console = p._console;
console.log(JSON.stringify(out, null, 1));
await b.close();
