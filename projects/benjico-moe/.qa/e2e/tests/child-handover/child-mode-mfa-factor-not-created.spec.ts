// spec: specs/child-handover.md
// seed: tests/seed.parent-auto.spec.ts
import { test, expect } from '@playwright/test';
import { CHILD_SLOTS, dismissGate, goChildHome, parentGate, saveSlot, slotState } from '../child-slot.helpers';
import { captureSupabase, userHeaders } from '../session-auth/session-auth.helpers';

const CHILD = CHILD_SLOTS['QA-R2-V'];
const HOME = `/${CHILD.childId}/home`;
test.use({ storageState: slotState(CHILD) });

test.afterEach(async ({ context }) => {
  await saveSlot(context, CHILD);
});

const randomLetters = (n: number) =>
  Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('').toUpperCase();

test.describe('Режим ребёнка: токен родителя не даёт прав, обход ключом закрыт, окно выхода без строки формы — слот parent-auto (#a1f2c1, #c9d038, #ee2f5b)', () => {
  test('6.2 MFA токеном родителя в режиме ребёнка: фактор не создаётся @desktop @data #a1f2c1', async ({ page, request }, testInfo) => {
    // 1. РЕЖИМ: режим ребёнка подтверждён сервером
    await goChildHome(page, CHILD);
    await expect(page).toHaveURL(new RegExp(`${HOME}(?:[?#]|$)`));
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

    // 2. Взять заголовки Supabase из запроса приложения
    const sb = await captureSupabase(page, HOME);
    const headers = { ...userHeaders(sb), 'content-type': 'application/json' };

    // 3. GET auth/v1/user — запомнить число factors
    const factorsOf = async () => {
      const resp = await request.fetch(`${sb.base}/auth/v1/user`, { method: 'GET', headers });
      expect(resp.status(), 'GET auth/v1/user').toBe(200);
      const body = await resp.json();
      return { count: Array.isArray(body.factors) ? body.factors.length : 0, names: (body.factors ?? []).map((f: any) => f.friendly_name) };
    };
    const before = await factorsOf();

    // 4. POST auth/v1/factors
    const friendlyName = `QA-AUTO-${randomLetters(6)}`;
    const create = await request.fetch(`${sb.base}/auth/v1/factors`, {
      method: 'POST',
      headers,
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
    expect(createText).not.toContain('"id"');

    // 5. Снова GET auth/v1/user
    const after = await factorsOf();
    expect(after.count).toBe(before.count);
    expect(after.names).not.toContain(friendlyName);
  });
});
