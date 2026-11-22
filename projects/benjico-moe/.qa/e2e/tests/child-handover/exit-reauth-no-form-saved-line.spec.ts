// spec: specs/child-handover.md
// seed: tests/seed.parent-auto.spec.ts
import { test, expect, Page } from '@playwright/test';
import { CHILD_SLOTS, dismissGate, goChildHome, parentGate, saveSlot, slotState } from '../child-slot.helpers';

const CHILD = CHILD_SLOTS['QA-R2-V'];
const HOME = `/${CHILD.childId}/home`;
const HOME_RE = new RegExp(`${HOME}(?:[?#]|$)`);
test.use({ storageState: slotState(CHILD) });

test.afterEach(async ({ context }) => {
  await saveSlot(context, CHILD);
});

const visible = (page: Page, text: string | RegExp) => page.getByText(text, { exact: typeof text === 'string' }).filter({ visible: true });

/** Шаги 2–3: «הורים» → проверить окно «אימות זהות» → «ביטול» (без ввода). */
async function openAndCancelExitDialog(page: Page, label: string) {
  // 2. Нажать «הורים» (вверху страницы)
  await page.getByRole('button', { name: 'הורים', exact: true }).filter({ visible: true }).first().click();
  await expect(visible(page, 'אימות זהות').first(), `${label}: окно «אימות זהות»`).toBeVisible();
  await expect(visible(page, /כדי לצאת ממצב ילד/).first(), `${label}: текст «כדי לצאת ממצב ילד»`).toBeVisible();
  await expect(page.locator('input[type=password]').filter({ visible: true }), `${label}: одно поле пароля`).toHaveCount(1);
  await expect(visible(page, 'שכחתי סיסמה').first(), `${label}: «שכחתי סיסמה»`).toBeVisible();
  await expect(page.getByRole('button', { name: 'אישור', exact: true }).filter({ visible: true }), `${label}: «אישור»`).toBeVisible();
  await expect(page.getByRole('button', { name: 'ביטול', exact: true }).filter({ visible: true }), `${label}: «ביטול»`).toBeVisible();
  await expect(visible(page, /מה שכבר מילאתם בטופס נשמר/), `${label}: строки про форму нет`).toHaveCount(0);

  // 3. Ничего не вводить; нажать «ביטול»
  await page.getByRole('button', { name: 'ביטול', exact: true }).filter({ visible: true }).click();
  await expect(parentGate(page)).toBeHidden();
  await expect(page).toHaveURL(HOME_RE);
  await expect(page.getByRole('tab', { name: 'בית' }).filter({ visible: true }).first()).toBeVisible();
}

test.describe('Режим ребёнка: токен родителя не даёт прав, обход ключом закрыт, окно выхода без строки формы — слот parent-auto (#a1f2c1, #c9d038, #ee2f5b)', () => {
  test('6.5 Окно «אימות זהות» выхода из режима ребёнка: без строки «מה שכבר מילאתם בטופס נשמר», «שכחתי סיסמה» на месте (1440 и 390, без ввода) @desktop @data #ee2f5b', async ({ page }) => {
    // 1. РЕЖИМ
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

    // 2–3. Десктоп 1440
    await openAndCancelExitDialog(page, '1440');

    // 4. Ширина 390: повторить шаги 2–3
    await page.setViewportSize({ width: 390, height: 844 });
    await openAndCancelExitDialog(page, '390');
  });
});
