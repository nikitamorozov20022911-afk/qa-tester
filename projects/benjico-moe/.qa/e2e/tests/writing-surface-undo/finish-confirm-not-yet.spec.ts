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

  test('«לסיים תרגול»: окно «לשלוח לבנג׳י?», «עוד לא» ничего не отправляет, текст цел @desktop @data #0e3868', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const TEXT = 'QA-AUTO סיום';
    const submits: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('submit_writing_attempt')) submits.push(req.url());
    });

    // 1. Общие шаги входа; «הקלדה»; ввести текст; дождаться «נשמר»
    await goChildHome(page, CHILD);
    await openWriting(page);
    await page.getByTestId('mode-text').click();
    const input = page.getByRole('textbox', { name: 'אזור ההקלדה' });
    await expect(input).toBeVisible();
    await clearIfNotEmpty(page);
    await input.fill(TEXT);
    await expect(page.getByTestId('save-saved')).toBeVisible();
    const urlBefore = page.url();

    // 2. «לסיים תרגול» → окно «לשלוח לבנג׳י?» → «עוד לא» (кнопку «לשלוח» не нажимать)
    await page.getByTestId('writing-finish').click();
    const dialog = page.getByRole('dialog', { name: 'לשלוח לבנג׳י?' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'לשלוח לבנג׳י?' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'לשלוח', exact: true })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'עוד לא' })).toBeVisible();
    await dialog.getByRole('button', { name: 'עוד לא' }).click();

    await expect(dialog).toBeHidden();
    await expect(input).toHaveValue(TEXT);
    await expect(page).toHaveURL(urlBefore);
    await expect(page.getByText(/בנג.י קורא/)).toHaveCount(0);
    expect(submits, 'запросов submit_writing_attempt нет').toHaveLength(0);

    // 3. Очистка: «ניקוי» → «כן, לנקות»
    await page.getByTestId('writing-clear').click();
    await page.getByRole('dialog', { name: 'לנקות את הכתיבה?' }).getByRole('button', { name: 'כן, לנקות' }).click();
    await expect(input).toHaveValue('');
    expect(submits).toHaveLength(0);
  });
});
