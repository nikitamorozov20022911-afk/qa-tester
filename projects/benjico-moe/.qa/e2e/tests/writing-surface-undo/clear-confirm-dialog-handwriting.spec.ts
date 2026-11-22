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

// Stroke drawn with the mouse; ink canvas is a canvas inside [data-testid=ink-canvas]
async function drawStroke(page: Page, fromX: number, fromY: number, toX: number, toY: number) {
  await page.mouse.move(fromX, fromY);
  await page.mouse.down();
  await page.mouse.move(toX, toY, { steps: 12 });
  await page.mouse.up();
}

// Metric: pixel snapshot of the ink canvas (webgl canvas has no readable 2d context)
const snap = (page: Page) => page.getByTestId('ink-canvas').screenshot();

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

  test('«ניקוי» в «כתיבה ביד»: «ביטול» не стирает штрих, «כן, לנקות» стирает @desktop @data #0e3868', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Общие шаги входа; «כתיבה ביד»; один штрих мышью; дождаться «נשמר»
    await goChildHome(page, CHILD);
    await openWriting(page);
    await page.getByTestId('mode-ink').click();
    const canvas = page.getByTestId('ink-canvas');
    await expect(canvas).toBeVisible();
    await clearIfNotEmpty(page);
    const clear = page.getByTestId('writing-clear');
    await expect(clear).toBeDisabled();
    const empty = await snap(page);

    const box = (await canvas.boundingBox())!;
    await drawStroke(page, box.x + box.width * 0.7, box.y + 120, box.x + box.width * 0.3, box.y + 200);
    await expect(clear).toBeEnabled();
    await expect(page.getByTestId('save-saved')).toBeVisible();
    const drawn = await snap(page);
    expect(drawn.equals(empty), 'штрих изменил холст').toBe(false);

    // 2. «ניקוי» → role=dialog «לנקות את הכתיבה?» → «ביטול»
    await clear.click();
    const dialog = page.getByRole('dialog', { name: 'לנקות את הכתיבה?' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'כן, לנקות' })).toBeVisible();
    await dialog.getByRole('button', { name: 'ביטול', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(clear).toBeEnabled();
    await expect(clear).toBeFocused();
    await expect(async () => {
      expect((await snap(page)).equals(drawn), 'штрих на месте после «ביטול»').toBe(true);
    }).toPass();

    // 3. «ניקוי» → «כן, לנקות»
    await clear.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'כן, לנקות' }).click();
    await expect(dialog).toBeHidden();
    // тетрадь пуста: «ניקוי» неактивен, холст как в пустой тетради.
    // NB: «ביטול פעולה» после очистки НЕ неактивен — он возвращает очистку (текст окна: «אפשר להחזיר עם ״ביטול פעולה״»).
    await expect(clear).toBeDisabled();
    await expect(async () => {
      expect((await snap(page)).equals(empty), 'холст пуст после «כן, לנקות»').toBe(true);
    }).toPass();
  });
});
