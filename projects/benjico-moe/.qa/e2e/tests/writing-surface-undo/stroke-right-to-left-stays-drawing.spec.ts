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

// Metric: pixel snapshot of the ink canvas (webgl canvas has no readable 2d context)
const snap = (page: Page) => page.getByTestId('ink-canvas').screenshot();

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

  test('Штрих справа налево (быстрый, у правого края) остаётся рисунком, URL не меняется @desktop @data #0e3868', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Общие шаги входа; «כתיבה ביד»; запомнить URL; метрика рисунка
    await goChildHome(page, CHILD);
    await openWriting(page);
    await page.getByTestId('mode-ink').click();
    const canvas = page.getByTestId('ink-canvas');
    await expect(canvas).toBeVisible();
    await clearIfNotEmpty(page);
    const undo = page.getByTestId('writing-undo');
    await expect(undo).toBeDisabled();
    const url = page.url();
    expect(url).toContain('/writing/');
    const box = (await canvas.boundingBox())!;

    // линии 1, 3, 5, 7: rules в DOM — 1px div'ы, берём их y
    const ys = await page.evaluate(() => {
      const c = document.querySelector('[data-testid="ink-canvas"]')!.getBoundingClientRect();
      return [...document.querySelectorAll('div')]
        .map((e) => e.getBoundingClientRect())
        .filter((b) => b.height === 1 && b.width > 100 && b.x >= c.x - 2 && b.right <= c.right + 2)
        .map((b) => b.y)
        .sort((a, b) => a - b);
    });
    const rows = [0, 2, 4, 6].map((i) => ys[i] - 15);

    // 2. 4 раза: быстрый штрих справа налево у правого края (120–300px)
    const lengths = [120, 180, 240, 300];
    let prev = await snap(page);
    for (let i = 0; i < 4; i++) {
      const startX = box.x + box.width - 12;
      await page.mouse.move(startX, rows[i]);
      await page.mouse.down();
      await page.mouse.move(startX - lengths[i], rows[i] + 10, { steps: 4 });
      await page.mouse.up();

      // URL не менялся, страница задания на месте
      await expect(page).toHaveURL(url);
      await expect(page.getByTestId('mode-ink')).toBeVisible();
      // метрика выросла: холст изменился после каждого штриха
      await expect(async () => {
        expect((await snap(page)).equals(prev), `холст изменился после штриха ${i + 1}`).toBe(false);
      }).toPass();
      prev = await snap(page);
    }

    // 3. Дождаться «נשמר»
    await expect(page.getByTestId('save-saved')).toBeVisible();
    await expect(page).toHaveURL(url);
    await expect(undo).toBeEnabled();
  });
});
