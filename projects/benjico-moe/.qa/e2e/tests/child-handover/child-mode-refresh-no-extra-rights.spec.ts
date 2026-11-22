// spec: specs/child-handover.md
// seed: tests/seed.parent-auto.spec.ts
import { test, expect, Page } from '@playwright/test';
import { CHILD_SLOTS, dismissGate, goChildHome, parentGate, saveSlot, slotState } from '../child-slot.helpers';
import { captureSupabase, expectParentZoneHidden, jwtPayload, rest, visibleText } from '../session-auth/session-auth.helpers';

const CHILD = CHILD_SLOTS['QA-R2-V'];
const HOME = `/${CHILD.childId}/home`;
const HOME_RE = new RegExp(`${HOME}(?:[?#]|$)`);
test.use({ storageState: slotState(CHILD) });

test.afterEach(async ({ context }) => {
  await saveSlot(context, CHILD);
});

const randomLetters = (n: number) =>
  Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('').toUpperCase();

/** РЕЖИМ: перезагрузка и проверка current_child_session из запроса приложения. */
async function expectChildModeOnServer(page: Page) {
  const rpcP = page.waitForResponse((r) => r.url().includes('/rest/v1/rpc/current_child_session'), { timeout: 30_000 });
  await page.reload();
  const rpc = await rpcP.catch(() => {
    throw new Error('запрос rpc/current_child_session не найден — уточнить проверку режима');
  });
  expect(rpc.status()).toBe(200);
  const session = await rpc.json();
  expect(
    Array.isArray(session) && session.length > 0,
    'слот parent-auto не в режиме ребёнка на сервере (current_child_session = []) — перевести слот в режим ребёнка QA-R2-V (передача «QA-R2-V, בואו נתחיל!») и сохранить; см. план child-handover §6',
  ).toBe(true);
  if (await parentGate(page).isVisible()) await dismissGate(page);
}

test.describe('Режим ребёнка: токен родителя не даёт прав, обход ключом закрыт, окно выхода без строки формы — слот parent-auto (#a1f2c1, #c9d038, #ee2f5b)', () => {
  test('6.3 Обновление токена (refresh) не даёт прав: после refresh — то же, режим ребёнка сохранён @desktop @data #a1f2c1', async ({ page, request }, testInfo) => {
    // 1. РЕЖИМ
    await goChildHome(page, CHILD);
    await expect(page).toHaveURL(HOME_RE);
    await expectChildModeOnServer(page);
    const sb0 = await captureSupabase(page, HOME);

    // 2. Из localStorage прочитать ключ benjico\sb-…-auth-token: refresh_token; session_id из access_token
    const storageKey = await page.evaluate(() => Object.keys(localStorage).find((k) => /^benjico\\sb-.*-auth-token$/.test(k)) ?? null);
    expect(storageKey, 'ключ benjico\\sb-…-auth-token в localStorage').not.toBeNull();
    const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k as string) as string), storageKey);
    const refreshToken: string = stored.refresh_token;
    expect(refreshToken, 'refresh_token в сессии').toBeTruthy();
    const sessionIdBefore = jwtPayload(`Bearer ${stored.access_token}`).session_id;

    // 3. POST auth/v1/token?grant_type=refresh_token
    const refreshResp = await request.fetch(`${sb0.base}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { apikey: sb0.apikey, 'content-type': 'application/json' },
      data: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (refreshResp.status() !== 200) {
      throw new Error('refresh-токен слота сгорел — выдать заново: npm run qa-login:manual -- parent-auto');
    }
    const fresh = await refreshResp.json();
    expect(fresh.access_token, 'новый access_token').toBeTruthy();

    // 4. Сразу записать ответ обратно в тот же ключ localStorage; reload
    await page.evaluate(
      ([k, f]) => {
        const cur = JSON.parse(localStorage.getItem(k as string) as string);
        const next = { ...cur };
        for (const field of ['access_token', 'refresh_token', 'expires_at', 'expires_in', 'token_type', 'user']) {
          if ((f as any)[field] !== undefined) next[field] = (f as any)[field];
        }
        localStorage.setItem(k as string, JSON.stringify(next));
      },
      [storageKey, fresh] as const,
    );
    await page.reload();
    if (await parentGate(page).isVisible()) await dismissGate(page);
    await expect(page).toHaveURL(HOME_RE);
    await expect(page.getByRole('tab', { name: 'בית' }).filter({ visible: true }).first()).toBeVisible();
    await expectParentZoneHidden(page);
    await expect(visibleText(page, 'מי מתרגל היום?')).toHaveCount(0);
    await expect(visibleText(page, 'הוספת ילד')).toHaveCount(0);

    // 5. С новым access_token повторить 6.1 (3–5) и 6.2 (3–5)
    const headers = { apikey: sb0.apikey, authorization: `Bearer ${fresh.access_token}` };
    const consents = await rest(request, sb0.base, headers, 'GET', '/rest/v1/consents?select=*');
    expect(consents.status, `consents: ${consents.text}`).toBe(200);
    expect(JSON.parse(consents.text)).toHaveLength(0);
    for (const f of ['user_id', 'family_id', 'purpose', 'policy_version']) expect(consents.text).not.toContain(f);
    const members = await rest(request, sb0.base, headers, 'GET', '/rest/v1/family_members?select=*');
    expect(members.status, `family_members: ${members.text}`).toBe(200);
    expect(JSON.parse(members.text)).toHaveLength(0);
    const families = await rest(request, sb0.base, headers, 'GET', '/rest/v1/families?select=*');
    expect(families.status, `families: ${families.text}`).toBe(403);
    for (const f of ['name', 'email', 'nickname']) expect(families.text).not.toContain(`"${f}"`);
    const children = await rest(request, sb0.base, headers, 'GET', '/rest/v1/children?select=*');
    expect(children.status, `children: ${children.text}`).toBe(200);
    expect(JSON.parse(children.text)).toHaveLength(0);

    const jsonHeaders = { ...headers, 'content-type': 'application/json' };
    const factorsOf = async () => {
      const resp = await request.fetch(`${sb0.base}/auth/v1/user`, { method: 'GET', headers: jsonHeaders });
      expect(resp.status(), 'GET auth/v1/user').toBe(200);
      const body = await resp.json();
      return { count: Array.isArray(body.factors) ? body.factors.length : 0, names: (body.factors ?? []).map((f: any) => f.friendly_name) };
    };
    const before = await factorsOf();
    const friendlyName = `QA-AUTO-${randomLetters(6)}`;
    const create = await request.fetch(`${sb0.base}/auth/v1/factors`, {
      method: 'POST',
      headers: jsonHeaders,
      data: JSON.stringify({ factor_type: 'totp', friendly_name: friendlyName }),
    });
    const createText = await create.text();
    if (create.status() >= 200 && create.status() < 300) {
      let id = '?';
      try {
        id = JSON.parse(createText).id ?? '?';
      } catch {
        /* тело не JSON */
      }
      testInfo.annotations.push({
        type: 'cleanup',
        description: `на аккаунте parent создан TOTP-фактор ${friendlyName} ${id} — удалить вручную в режиме родителя`,
      });
    }
    expect(create.status(), 'POST auth/v1/factors не должен вернуть 2xx').toBeGreaterThanOrEqual(300);
    expect(createText).not.toContain('qr_code');
    expect(createText).not.toContain('"secret"');
    const after = await factorsOf();
    expect(after.count).toBe(before.count);
    expect(after.names).not.toContain(friendlyName);

    // 6. Повторить проверку РЕЖИМ; saveSlot
    await expectChildModeOnServer(page);
    const sessionIdAfter = jwtPayload(`Bearer ${fresh.access_token}`).session_id;
    if (sessionIdAfter !== sessionIdBefore) {
      testInfo.annotations.push({
        type: 'info',
        description: `session_id изменился после refresh (${sessionIdBefore} -> ${sessionIdAfter}) — проверить вручную`,
      });
    }
    await saveSlot(page.context(), CHILD);
  });
});
