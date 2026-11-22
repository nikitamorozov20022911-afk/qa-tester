// client 04 sends cancel request on deal ID (data prep for phone test 11.10)
import { newBrowser, ctx, go, txt, sleep } from './q0310-lib.mjs';
const ID = process.env.ID;
const b = await newBrowser();
const { p: c } = await ctx(b, 'client', 375, 812); c.setDefaultTimeout(15000);
await go(c, '/deals/' + ID);
await c.getByRole('button', { name: 'פעולות נוספות' }).click(); await sleep(1200);
await c.getByText('ביטול עסקה', { exact: true }).last().click(); await sleep(1800);
await c.getByRole('button', { name: 'שליחת בקשת ביטול' }).last().click(); await sleep(4000);
await c.reload(); await sleep(4000);
const t = await txt(c); console.log('banner:', t.includes('בקשת ביטול נשלחה'), '| req:', c._req.join(' ; '));
await b.close();
