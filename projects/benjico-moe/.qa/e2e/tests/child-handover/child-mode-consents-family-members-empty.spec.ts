// spec: specs/child-handover.md
// seed: tests/seed.parent-auto.spec.ts
import { test, expect } from '@playwright/test';
import { CHILD_SLOTS, dismissGate, goChildHome, parentGate, saveSlot, slotState } from '../child-slot.helpers';
import { captureSupabase, rest, userHeaders } from '../session-auth/session-auth.helpers';

const CHILD = CHILD_SLOTS['QA-R2-V'];
const HOME = `/${CHILD.childId}/home`;
test.use({ storageState: slotState(CHILD) });

test.afterEach(async ({ context }) => {
  await saveSlot(context, CHILD);
});

test.describe('Режим ребёнка: токен родителя не даёт прав, обход ключом закрыт, окно выхода без строки формы — слот parent-auto (#a1f2c1, #c9d038, #ee2f5b)', () => {
  test('6.1 consents и family_members токеном родителя в режиме ребёнка: 200 и пусто; families 403, children пусто @desktop @data #a1f2c1', async ({ page, request }) => {
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
    const headers = userHeaders(sb); // x-child-session не добавляем

    // 3. GET rest/v1/consents?select=*
    const consents = await rest(request, sb.base, headers, 'GET', '/rest/v1/consents?select=*');
    expect(consents.status, `таблица consents: ${consents.text}`).not.toBe(404);
    expect(consents.status, `consents: ${consents.text}`).toBe(200);
    expect(JSON.parse(consents.text)).toHaveLength(0);
    for (const f of ['user_id', 'family_id', 'purpose', 'policy_version']) {
      expect(consents.text).not.toContain(f);
    }

    // 4. GET rest/v1/family_members?select=*
    const members = await rest(request, sb.base, headers, 'GET', '/rest/v1/family_members?select=*');
    expect(members.status, `таблица family_members: ${members.text}`).not.toBe(404);
    expect(members.status, `family_members: ${members.text}`).toBe(200);
    expect(JSON.parse(members.text)).toHaveLength(0);

    // 5. Контроль: families и children
    const families = await rest(request, sb.base, headers, 'GET', '/rest/v1/families?select=*');
    expect(families.status, `families: ${families.text}`).toBe(403);
    for (const f of ['name', 'email', 'nickname']) {
      expect(families.text).not.toContain(`"${f}"`);
    }
    const children = await rest(request, sb.base, headers, 'GET', '/rest/v1/children?select=*');
    expect(children.status, `children: ${children.text}`).toBe(200);
    expect(JSON.parse(children.text)).toHaveLength(0);
  });
});
