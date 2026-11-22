// 11.10: есть ли кнопка/вход на список событий (חשבון client, 375)
import { newBrowser, ctx, go, txt, shot, redBox, sleep } from './q0310-lib.mjs';
const b = await newBrowser();
const { p } = await ctx(b, 'client', 375, 812);
const out = {};
for (const [name, path] of [['home', '/wallet'], ['profile', '/profile']]) {
  await go(p, path);
  out[name] = { url: p.url(), text: (await txt(p)).slice(0, 1500) };
  await shot(p, 'events-nav', `events-nav-${name}-client-375`, true);
}
// red box on "יצירת אירוע" in profile
await go(p, '/profile');
await redBox(p, p.getByText('יצירת אירוע', { exact: true }), 'events-nav', 'events-nav-profile-create-only-client-375');
for (const path of ['/events', '/events/']) { await go(p, path); out['try' + path] = { url: p.url(), text: (await txt(p)).slice(0, 300) }; }
console.log(JSON.stringify(out, null, 1));
await b.close();
