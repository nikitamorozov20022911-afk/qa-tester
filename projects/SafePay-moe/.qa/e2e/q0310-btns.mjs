export const btns = (p) => p.evaluate(() => [...document.querySelectorAll('[role=button],button,[role=checkbox]')].filter((e) => e.offsetParent).map((e) => `${e.getAttribute('role')}:${(e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\n/g, ' / ').slice(0,70)}${e.getAttribute('aria-disabled') === 'true' || e.disabled ? '[disabled]' : ''}${e.getAttribute('aria-checked')!=null?'[ch='+e.getAttribute('aria-checked')+']':''}`));
export const bal = async (p, go) => { await go(p, '/wallet'); const t = await p.evaluate(() => document.body.innerText); const m = t.match(/היתרה שלך\n(₪[\d,]+)\nשמור בנאמנות\n(₪[\d,]+)\nממתין לשחרור\n(₪[\d,]+)/); return m ? { avail: m[1], escrow: m[2], pending: m[3] } : t.slice(0,200); };
export async function rpcAs(p, name, body) {
  // capture headers of the app's own supabase request, then call rpc with same headers
  let hdr = null;
  const h = (r) => { if (!hdr && /supabase\.co\/rest\/v1\//.test(r.url()) && r.headers()['authorization']) hdr = r.headers(); };
  p.on('request', h);
  await p.reload(); for (let i = 0; i < 20 && !hdr; i++) await new Promise(r => setTimeout(r, 300));
  p.off('request', h);
  const base = 'https://jelkhsepxgbckrteujii.supabase.co/rest/v1/rpc/' + name;
  const res = await p.request.post(base, { headers: { apikey: hdr.apikey, authorization: hdr.authorization, 'content-type': 'application/json' }, data: body });
  return { status: res.status(), body: (await res.text()).slice(0, 300) };
}
