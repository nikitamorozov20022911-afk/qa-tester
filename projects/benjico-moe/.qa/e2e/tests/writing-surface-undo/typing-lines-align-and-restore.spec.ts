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

// Baseline of each text line vs notebook rules (1px divs spanning the textarea width).
async function measure(page: Page) {
  return page.evaluate(() => {
    const t = document.querySelector('[data-testid="writing-practice-input"]') as HTMLTextAreaElement;
    const r = t.getBoundingClientRect();
    const cs = getComputedStyle(t);
    const m = document.createElement('div');
    m.style.cssText = `position:fixed;visibility:hidden;box-sizing:border-box;white-space:pre-wrap;left:${r.x}px;top:${r.y - t.scrollTop}px;width:${r.width}px;`;
    m.style.font = cs.font;
    m.style.lineHeight = cs.lineHeight;
    m.style.padding = cs.padding;
    m.style.direction = cs.direction;
    m.style.textAlign = cs.textAlign;
    m.innerHTML = t.value
      .split('\n')
      .map((l) => '<div>' + l + '<span style="display:inline-block;width:0;height:0"></span></div>')
      .join('');
    document.body.appendChild(m);
    const baselines = [...m.querySelectorAll('span')].map((s) => s.getBoundingClientRect().bottom);
    const rights = [...m.querySelectorAll('div')].map((d) => {
      const rg = document.createRange();
      rg.selectNodeContents(d);
      return rg.getBoundingClientRect().right;
    });
    m.remove();
    const rules = [...document.querySelectorAll('div')]
      .map((e) => e.getBoundingClientRect())
      .filter((b) => b.height === 1 && b.width > 100 && b.x >= r.x - 2 && b.right <= r.right + 2)
      .map((b) => b.y)
      .sort((a, b) => a - b);
    return { baselines, rights, rules, textRight: r.right, value: t.value };
  });
}

function expectAligned(m: Awaited<ReturnType<typeof measure>>) {
  // rules[0] is the top rule above the first line; text line N sits on rules[N]
  for (let n = 1; n <= 4; n++) {
    const baseline = m.baselines[n - 1];
    const rule = m.rules[n];
    expect(Math.abs(baseline - rule), `строка ${n}: baseline ${baseline} vs линия ${rule}`).toBeLessThanOrEqual(3);
  }
  // RTL: text starts near the right edge
  expect(m.textRight - m.rights[0]).toBeLessThan(80);
}

test.describe('«הקלדה»: строки на линиях и черновик (веб)', () => {
  test.beforeEach(async ({ page }) => {
    await muteSound(page);
  });

  test.afterEach(async ({ page, context }) => {
    if (page.url().includes('/writing/')) {
      await clearIfNotEmpty(page).catch(() => {});
    }
    await saveSlot(context, CHILD);
  });

  test('Набор 4+ строк: низ текста строки N совпадает с линией N (±3px); после «בית» и возврата — то же, черновик восстановлен @desktop @data #0e3868', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const lines = ['QA-AUTO שורה 1', 'QA-AUTO שורה 2', 'QA-AUTO שורה 3', 'QA-AUTO שורה 4'];

    // 1. Общие шаги входа; переключатель → «הקלדה»; очистить тетрадь, если не пуста
    await goChildHome(page, CHILD);
    await openWriting(page);
    await page.getByTestId('mode-text').click();
    const input = page.getByRole('textbox', { name: 'אזור ההקלדה' });
    await expect(input).toBeVisible();
    await clearIfNotEmpty(page);
    await expect(input).toHaveValue('');

    // 2. Ввести 4 строки по Enter; дождаться «נשמר»
    await input.click();
    await input.fill(lines.join('\n'));
    await expect(page.getByTestId('save-saved')).toBeVisible();

    // 3. Измерить низ текста и линии
    expectAligned(await measure(page));

    // 4. «בית» → снова «תרגול כתיבה» → то же задание → «הקלדה»
    await page.getByRole('tab', { name: 'בית' }).click();
    await expect(page).toHaveURL(/\/home$/);
    await openWriting(page);
    if (!(await page.getByTestId('mode-text').isChecked())) {
      await page.getByTestId('mode-text').click();
    }

    // 5. Повторить измерение; прочитать текст поля
    await expect(input).toHaveValue(lines.join('\n'));
    await expect(page.getByTestId('save-saved')).toBeVisible();
    const after = await measure(page);
    expect(after.value.split('\n')).toEqual(lines);
    expectAligned(after);
  });
});
