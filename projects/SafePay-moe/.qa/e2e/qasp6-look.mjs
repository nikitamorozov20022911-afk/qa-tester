// usage: ROLE=client W=375 PATHS=/wallet/shared,/wallet/kids SS=dir/prefix node qasp6-look.mjs
import { newBrowser, ctx, go, txt, shot, overflow } from './qasp6-lib.mjs';
const b = await newBrowser();
const { p } = await ctx(b, process.env.ROLE || 'client', +(process.env.W || 375));
for (const path of process.env.PATHS.split(',')) {
  await go(p, path, +(process.env.WAIT || 4000));
  const name = (process.env.SS || 'tmp/x') + path.replace(/[\/?=&]/g, '_');
  await shot(p, name, !!process.env.FULL);
  console.log('### ', path, '->', p.url(), JSON.stringify(await overflow(p)));
  console.log((await txt(p)).slice(0, 2500));
}
console.log('CONSOLE', JSON.stringify(p._console.slice(0, 15)));
await b.close();
