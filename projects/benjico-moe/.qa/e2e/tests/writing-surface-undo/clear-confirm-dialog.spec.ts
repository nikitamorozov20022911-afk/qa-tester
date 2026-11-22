// spec: specs/writing-surface-undo.md
// seed: tests/seed.parent-3.spec.ts
import { test, expect, Page } from '@playwright/test';
import { ChildSlot, goChildHome, saveSlot, slotState } from '../child-slot.helpers';

const CHILD: ChildSlot = { slot: 'parent-3', account: 'parent', childId: 'b9ef1552-4cc7-4d72-a9c3-d02d66d19af1', nickname: 'QA-R2-1' };
test.use({ storageState: slotState(CHILD) });

const WRITING_BTN = 'תרגול כתיבה מתרגלים אותיות, מילים ומשפטים';

async function muteSound(page: Page) {
  await page.addInitScript(() => {
    try {
      window.speechSynthesis.speak = () => {};
    } catch {}
    HTMLMediaElement.prototype.play = function () {
      this.muted = true;
      this.volume = 0;
      return Promise.resolve();
    };
  });
}

async function openWriting(page: Page) {
  await page.getByRole('button', { name: WRITING_BTN }).filter({ visible: true }).first().click();
  await expect(page.getByTestId('mode-text')).toBeVisible();
}

async function clearIfNotEmpty(page: Page) {
  const clear = page.getByTestId('writing-clear');
  if ((await clear.isVisible()) && (await clear.isEnabled())) {
    await clear.click();
    await page.getByRole('dialog', { name: 'לנקות את הכתיבה?' }).getByRole('button', { name: 'כן, לנקות' }).click();
    await expect(clear).toBeDisabled();
  }
}

test.describe('Диалоги «ניקוי» и «לסיים תרגול» (веб)', () => {
  test.beforeEach(async ({ page }) => {
    await muteSound(page);
  });

  test.afterEach(async ({ page, context }) => {
    if (page.url().includes('/writing/')) {
      await clearIfNotEmpty(page).catch(() => {});
    }
    await saveSlot(context, CHILD);
  });

  test('«ניקוי»: окно «לנקות את הכתיבה?», «ביטול» ничего не стирает, «כן, לנקות» стирает @desktop @data #0e3868', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const TEXT = 'QA-AUTO ניקוי';

    // 1. Общие шаги входа; «הקלדה»; ввести текст; дождаться «נשמר»
    await goChildHome(page, CHILD);
    await openWriting(page);
    await page.getByTestId('mode-text').click();
    const input = page.getByRole('textbox', { name: 'אזור ההקלדה' });
    await expect(input).toBeVisible();
    await clearIfNotEmpty(page);
    await expect(input).toHaveValue('');
    await input.fill(TEXT);
    await expect(page.getByTestId('save-saved')).toBeVisible();

    // 2. «ניקוי» → окно «לנקות את הכתיבה?» → «ביטול»
    const clear = page.getByTestId('writing-clear');
    await clear.click();
    const dialog = page.getByRole('dialog', { name: 'לנקות את הכתיבה?' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'לנקות את הכתיבה?' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'כן, לנקות' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'ביטול', exact: true })).toBeVisible();
    await dialog.getByRole('button', { name: 'ביטול', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(input).toHaveValue(TEXT);
    // фокус вернулся на «ניקוי»
    await expect(clear).toBeFocused();

    // 3. «ניקוי» → «כן, לנקות»
    await clear.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'כן, לנקות' }).click();
    await expect(dialog).toBeHidden();
    await expect(input).toHaveValue('');
    await expect(page.getByTestId('save-saved')).toBeVisible();

    // после «בית» и возврата тетрадь пуста
    await page.getByRole('tab', { name: 'בית' }).click();
    await expect(page).toHaveURL(/\/home$/);
    await openWriting(page);
    if (!(await page.getByTestId('mode-text').isChecked())) {
      await page.getByTestId('mode-text').click();
    }
    await expect(input).toHaveValue('');
  });
});
