async page => {
  let notifBody = '', hdrs = null;
  const h = async r => { if (/rest\/v1\/notifications/.test(r.url())) { hdrs = r.request().headers(); try { notifBody = await r.text(); } catch(e){} } };
  page.on('response', h);
  await page.goto('https://hunters-sooty.vercel.app/collaborations');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.getByRole('button', { name: /התראות/ }).first().click();
  await page.waitForTimeout(2500);
  page.off('response', h);
  const MARK = [/E1 Alpha/i, /E1 Bravo/i, /E1 Charlie/i, /1020-e1/i, /102-?000[123]/, /102000[123]/];
  const scan = t => MARK.filter(m => m.test(t)).map(m => m.source + ' :: ' + t.slice(Math.max(0,t.search(m)-120), t.search(m)+60)).join(' || ') || 'clean';
  const out = ['NOTIF(' + notifBody.length + '): ' + scan(notifBody)];
  if (!hdrs) return out.join('\n') + '\nno headers';
  const base = 'https://ygsbiphiwwalvqjctbmh.supabase.co/rest/v1/';
  const H = { apikey: hdrs['apikey'], authorization: hdrs['authorization'] };
  const probes = ['job_applications?id=eq.8d25a157-dc89-4202-8993-fd1d003f6a16&select=*', 'job_applications?job_id=eq.d7220429-9b52-4224-92a7-59df07b34af1&select=*', 'job_applications?id=eq.8d25a157-dc89-4202-8993-fd1d003f6a16&select=*,candidates(*)'];
  for (const p of probes) {
    const res = await page.evaluate(async ({ u, H }) => { const r = await fetch(u, { headers: H }); return r.status + ' ' + (await r.text()).slice(0, 20000); }, { u: base + p, H });
    out.push('GET ' + p + ' -> ' + res.slice(0, 3) + ' len=' + res.length + ' ' + scan(res) + ' | ' + res.slice(4, 1500).replace(/\s+/g,' '));
  }
  return out.join('\n');
}
