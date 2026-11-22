import { open, warm, BASE, SHOTS } from './3cc7-lib.mjs';
const run = process.argv[2] || 'r1';
for (const W of [390, 1440]) {
  const s = await open({ width: W, height: W > 1000 ? 900 : 844 });
  const { page } = s;
  try {
    if (W === 390) await warm(page, s, '/profile');
    await page.route('**/rest/v1/**', async (route) => { await new Promise((r) => setTimeout(r, 15000)); await route.continue().catch(() => {}); });
    await page.goto(BASE + '/home');
    await page.waitForTimeout(2500);
    const steps = [];
    for (let k = 0; k < 4; k++) {
      const info = await page.evaluate((k) => {
        const sc = [...document.querySelectorAll('div')].filter((d) => d.scrollHeight > d.clientHeight + 50 && ['auto', 'scroll'].includes(getComputedStyle(d).overflowY)).sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
        if (sc) sc.scrollTop = k * 600;
        const circ = [...document.querySelectorAll('div')].filter((d) => { const b = d.getBoundingClientRect(); const cs = getComputedStyle(d); return b.width >= 28 && b.width <= 64 && Math.abs(b.width - b.height) < 2 && parseFloat(cs.borderTopLeftRadius) >= b.width / 2 - 1 && b.y > 60 && b.y < innerHeight - 80; }).map((d) => { const b = d.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width) }; });
        return { scrollTop: sc ? sc.scrollTop : null, sh: sc ? sc.scrollHeight : null, circles: circ, text: document.body.innerText.replace(/\n/g, ' | ').slice(0, 200) };
      }, k);
      const p = `${SHOTS}3cc7-${run}-skeleton-scroll${k}-${W}.png`;
      await page.screenshot({ path: p });
      steps.push({ ...info, shot: p });
    }
    console.log(W, JSON.stringify(steps, null, 1));
    await page.unroute('**/rest/v1/**');
    await page.waitForTimeout(16000);
  } finally { console.log('save', await s.close()); }
}
