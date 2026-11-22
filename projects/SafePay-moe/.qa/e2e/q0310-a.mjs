import { newBrowser, ctx, go, txt, shot, sleep } from './q0310-lib.mjs';
const b = await newBrowser();
for (const role of ['client','provider']) {
  const { c, p } = await ctx(b, role, 375);
  await go(p, '/wallet');
  console.log('=== ', role, p.url()); console.log(await txt(p));
  const sw = await p.evaluate(async () => (navigator.serviceWorker ? (await navigator.serviceWorker.getRegistrations()).length : -1));
  console.log('SW regs', sw);
  await shot(p, 'qa0310', `${role}-wallet-before`, true);
  await go(p, '/deals');
  console.log('--- deals', p.url()); console.log((await txt(p)).slice(0,3000));
  console.log('console:', p._console.slice(0,10));
  await c.close();
}
await b.close();
