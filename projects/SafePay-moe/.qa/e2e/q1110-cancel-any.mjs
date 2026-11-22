// client 04 cancels deal ID via menu (any confirm variant) — data prep 11.10
import { newBrowser, ctx, go, txt, sleep } from './q0310-lib.mjs';
const b = await newBrowser(); const { p: c } = await ctx(b, 'client', 375, 812); c.setDefaultTimeout(15000);
await go(c, '/deals/' + process.env.ID); console.log('url', c.url());
await c.getByRole('button', { name: 'פעולות נוספות' }).click(); await sleep(1200);
await c.getByText('ביטול עסקה', { exact: true }).last().click(); await sleep(1800);
const t1 = await txt(c); console.log('modal:', t1.split('\n').slice(-6).join(' | '));
const btn = c.getByRole('button', { name: /שליחת בקשת ביטול|^ביטול העסקה$|אישור ביטול|כן, לבטל/ }).last();
await btn.click(); await sleep(4000); await c.reload(); await sleep(4000);
const t = await txt(c); console.log('state:', ['בוטל','בקשת ביטול נשלחה','ממתין לאישור'].filter(s=>t.includes(s)).join(','), '| req:', c._req.join(' ; '));
await b.close();
