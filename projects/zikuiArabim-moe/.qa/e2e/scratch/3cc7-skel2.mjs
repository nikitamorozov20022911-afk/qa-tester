import { open, BASE, SHOTS } from './3cc7-lib.mjs';
const run = process.argv[2] || 'r1';
for (const W of [390, 1440]) {
  const s = await open({ width: W, height: W > 1000 ? 900 : 844 });
  const { page } = s;
  try {
    const delay = async (route) => { await new Promise((r) => setTimeout(r, 15000)); await route.continue().catch(() => {}); };
    await page.route(/\/rest\/v1\/(reminders|rpc\/generate_reminders)/, delay);
    await page.goto(BASE + '/home');
    const t = page.getByText('תזכורות מהירות', { exact: true });
    await t.waitFor({ timeout: 14000 });
    await t.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const info = await page.evaluate(() => {
      const t = [...document.querySelectorAll('div')].find((e) => e.childElementCount === 0 && e.textContent.trim() === 'תזכורות מהירות');
      const block = t.parentElement.parentElement;
      const bb = block.getBoundingClientRect();
      const circ = [...block.querySelectorAll('div')].filter((d) => { const b = d.getBoundingClientRect(); const cs = getComputedStyle(d); return b.width >= 24 && b.width <= 64 && Math.abs(b.width - b.height) < 2 && parseFloat(cs.borderTopLeftRadius) >= b.width / 2 - 1; }).map((d) => { const b = d.getBoundingClientRect(); return { x: Math.round(b.x), right: Math.round(b.right), y: Math.round(b.y), w: Math.round(b.width) }; });
      return { blockText: block.innerText.replace(/\n/g, ' | '), block: { x: Math.round(bb.x), right: Math.round(bb.right) }, circles: circ };
    });
    const p = `${SHOTS}3cc7-${run}-skeleton-reminders-${W}.png`;
    await page.screenshot({ path: p });
    console.log(W, JSON.stringify({ ...info, shot: p }));
    await page.unroute(/\/rest\/v1\/(reminders|rpc\/generate_reminders)/);
    await page.waitForTimeout(16000);
  } finally { console.log('save', await s.close()); }
}
