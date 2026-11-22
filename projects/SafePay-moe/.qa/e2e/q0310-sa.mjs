import { newBrowser, ctx, go, txt, sleep, redBox } from './q0310-lib.mjs';
const b = await newBrowser(); const { p } = await ctx(b, 'provider', 375, 812);
await go(p, '/wallet');
const n = async () => ((await txt(p)).match(/לפני|עכשיו|שלשום|אתמול/g)||[]).length;
const links = p.getByText('הצג/י הכל', { exact: true });
console.log('count links', await links.count(), 'rows', await n());
for (let i=0;i<await links.count();i++){ await go(p,'/wallet'); const l=p.getByText('הצג/י הכל',{exact:true}).nth(i); const info = await l.evaluate(e=>({tag:e.tagName, role:e.getAttribute('role'), cursor:getComputedStyle(e).cursor, pcursor:getComputedStyle(e.parentElement).cursor})); await l.click(); await sleep(2500); console.log(i, info, '->', p.url(), 'rows', await n()); if (i===1) { await go(p,'/wallet'); await redBox(p, p.getByText('הצג/י הכל',{exact:true}).nth(1), '6a86f7ccc9997bc71194c8a6','r1-06-ledger-show-all-noop-mobile'); } }
// notification card clickable?
await go(p, '/notifications'); const card = p.getByText('הצד השני', { exact: false }).first();
console.log('notif card', await card.evaluate(e=>{ let n=e, out=[]; for(let k=0;k<5&&n;k++){ out.push(n.tagName+':'+(n.getAttribute('role')||'')+':'+getComputedStyle(n).cursor); n=n.parentElement;} return out; }));
await redBox(p, card, '6a86f7cdd4002d2fab924eac', 'r2-14-notification-card-not-clickable-mobile');
await b.close();
