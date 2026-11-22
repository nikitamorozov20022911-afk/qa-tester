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

test.describe('«כתיבה ביד»: штрих справа налево и линии на всю ширину (веб)', () => {
  test.beforeEach(async ({ page }) => {
    await muteSound(page);
  });

  test.afterEach(async ({ page, context }) => {
    if (page.url().includes('/writing/')) {
      await clearIfNotEmpty(page).catch(() => {});
    }
    await saveSlot(context, CHILD);
  });

  test('Линии тетради на всю ширину при 1194×834 @desktop @data #0e3868', async ({ page }) => {
    await page.setViewportSize({ width: 1194, height: 834 });

    // 1. Общие шаги входа → «כתיבה ביד»
    await goChildHome(page, CHILD);
    await openWriting(page);
    await page.getByTestId('mode-ink').click();
    const notebook = page.getByRole('img', { name: 'משטח כתיבה ביד' });
    await expect(notebook).toBeVisible();
    await expect(page.getByTestId('ink-canvas')).toBeVisible();

    // 2. Измерить тетрадь и крайние точки линий (линии — 1px div'ы внутри тетради)
    const box = (await notebook.boundingBox())!;
    const m = await page.evaluate(() => {
      const nb = document.querySelector('[aria-label="משטח כתיבה ביד"]')!.getBoundingClientRect();
      const rules = [...document.querySelectorAll('div')]
        .map((e) => e.getBoundingClientRect())
        .filter((b) => b.height === 1 && b.width > 100 && b.y >= nb.y && b.y <= nb.bottom && b.x >= nb.x - 2 && b.right <= nb.right + 2);
      return {
        count: rules.length,
        left: Math.min(...rules.map((r) => r.x)),
        right: Math.max(...rules.map((r) => r.right)),
        minWidth: Math.min(...rules.map((r) => r.width)),
      };
    });

    expect(m.count, 'линии найдены').toBeGreaterThanOrEqual(5);
    expect(Math.abs(m.right - (box.x + box.width)), 'правый край линий = правый край тетради').toBeLessThanOrEqual(3);
    expect(Math.abs(m.left - box.x), 'левый край линий = левый край тетради').toBeLessThanOrEqual(3);
    expect(m.minWidth, 'ширина линий ≥ ширина тетради − 6').toBeGreaterThanOrEqual(box.width - 6);
  });
});
