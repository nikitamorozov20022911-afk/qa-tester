// spec: specs/child-handover.md
// seed: tests/seed.parent-auto.spec.ts
import { test, expect, Page } from '@playwright/test';
import { CHILD_SLOTS, dismissGate, goChildHome, parentGate, saveSlot, slotState } from '../child-slot.helpers';
import { expectParentZoneHidden } from '../session-auth/session-auth.helpers';

const CHILD = CHILD_SLOTS['QA-R2-V'];
const OTHER_CHILD_ID = CHILD_SLOTS['QA-R2-1'].childId;
const HOME = `/${CHILD.childId}/home`;
const HOME_RE = new RegExp(`${HOME}(?:[?#]|$)`);
test.use({ storageState: slotState(CHILD) });

test.afterEach(async ({ context }) => {
  await saveSlot(context, CHILD);
});

const visible = (page: Page, text: string | RegExp) => page.getByText(text, { exact: typeof text === 'string' }).filter({ visible: true });

test.describe('Режим ребёнка: токен родителя не даёт прав, обход ключом закрыт, окно выхода без строки формы — слот parent-auto (#a1f2c1, #c9d038, #ee2f5b)', () => {
  test('6.4 Ключ удалён → профиль другого ребёнка семьи: дом QA-R2-V и гейт, профиль QA-R2-1 не показан @desktop @data #c9d038', async ({ page }) => {
    // 1. РЕЖИМ. Удалить из localStorage benjico\child-context, проверить, что ключа нет
    await goChildHome(page, CHILD);
    await expect(page).toHaveURL(HOME_RE);
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

    const removeKey = async () => {
      const left = await page.evaluate(() => {
        localStorage.removeItem('benjico\\child-context');
        return localStorage.getItem('benjico\\child-context');
      });
      expect(left, 'ключ benjico\\child-context удалён').toBeNull();
    };
    await removeKey();

    // 2. Открыть /children/<QA-R2-1> (другой ребёнок той же семьи)
    await page.goto(`/children/${OTHER_CHILD_ID}`);

    // ГЕЙТ: дом QA-R2-V, окно «אימות זהות» с полем пароля, профиль QA-R2-1 не показан
    await expect(page).toHaveURL(HOME_RE);
    await expect(visible(page, 'אימות זהות').first()).toBeVisible();
    await expect(page.locator('input[type=password]').filter({ visible: true })).toHaveCount(1);
    for (const t of ['עריכת פרופיל', 'רמות נוכחיות (להורה בלבד)', 'רמת קריאה משוערת', 'QA-R2-1']) {
      await expect(visible(page, t), `«${t}» не виден`).toHaveCount(0);
    }

    // 3. Закрыть гейт «ביטול»; удалить ключ ещё раз; открыть /children/<QA-R2-1>/handover (кнопку не нажимать)
    await dismissGate(page);
    await removeKey();
    await page.goto(`/children/${OTHER_CHILD_ID}/handover`);
    await expect(page).toHaveURL(HOME_RE);
    await expect(page.getByRole('button', { name: 'QA-R2-1, בואו נתחיל!' }).filter({ visible: true })).toHaveCount(0);
    await expect(visible(page, 'QA-R2-1')).toHaveCount(0);
    if (await parentGate(page).isVisible()) await dismissGate(page);
    await expectParentZoneHidden(page);
  });
});
