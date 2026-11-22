// QA helper: вызовы Supabase от имени тестового пользователя (только access_token, refresh НЕ делаем).
// node api.mjs <account> <METHOD> <path> [jsonBody]
//   path: rest/v1/rpc/<fn> | rest/v1/<table>?select=* | functions/v1/<fn>
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://siodtucasjpxpsfuvlfc.supabase.co';
const KEY = fs.readFileSync(path.resolve(here, '../auth/.sbkey'), 'utf8').trim();
const [acc, method = 'GET', p, body] = process.argv.slice(2);
let token = KEY, uid = null;
if (acc !== 'anon') {
  const s = JSON.parse(fs.readFileSync(path.resolve(here, `../auth/${acc}.json`), 'utf8'));
  for (const o of s.origins) for (const i of o.localStorage) if (/auth-token$/.test(i.name)) { const v = JSON.parse(i.value); token = v.access_token; uid = v.user.id;
    if (v.expires_at * 1000 < Date.now()) { console.error('TOKEN_EXPIRED for', acc); process.exit(3); } }
}
const r = await fetch(`${BASE}/${p}`, { method, headers: { apikey: KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: body ?? undefined });
const t = await r.text();
console.log(JSON.stringify({ status: r.status, uid, body: (() => { try { return JSON.parse(t); } catch { return t; } })() }, null, 1));
