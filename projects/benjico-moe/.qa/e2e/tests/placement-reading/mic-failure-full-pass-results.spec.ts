// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// spec: specs/placement-reading.md
// seed: tests/seed.parent.spec.ts
import { test, expect } from '../../fixtures';
import { annotateCleanup, createChild, qaChildName } from '../placement-results/placement.helpers';


// Пропущено 08.11 (решение пользователя): тест создаёт нового ребёнка QA-AUTO и передаёт ему устройство — с #8ca267 режим ребёнка серверный и запирает вход до ввода пароля/PIN.
test.skip(true, 'QA-AUTO + режим ребёнка запирает вход (#8ca267) — пропущено по решению 08.11');

test.describe('Стартовый тест чтения — экраны и прохождение (генератор)', () => {
  test('Сбой микрофона без «ошибки» → самооценка; после 3 отрывков C3 без номера уровня; /assessment/writing у закончившего ведёт домой @desktop @data #8bf5a8', async ({ asUser }, testInfo) => {
    test.setTimeout(5 * 60_000); // лимит на 3 отрывка, не пауза
    const page = await asUser('parent');
    const name = qaChildName();

    // 1. Создать ребёнка QA-AUTO-<6 букв> и передать устройство (шаги 1–3 из 1.1)
    const childId = await createChild(page, name, '2018');
    annotateCleanup(testInfo, name, childId);
    await page.goto(`/children/${childId}/handover`);
    await page.getByRole('button', { name: `${name}, בואו נתחיל!` }).click();
    await page.waitForURL(new RegExp(`/${childId}/assessment/intro$`));

    // 2. На C1 нажать «מתחילים!» → «מבדק התאמה • קריאה», «קטע 1»
    await page.getByRole('button', { name: 'מתחילים!', exact: true }).click();
    await expect(page.getByText('מבדק התאמה • קריאה')).toBeVisible();
    await expect(page.getByText('קטע 1')).toBeVisible();

    const read = page.getByRole('button', { name: 'קראתי!', exact: true });
    const retry = page.getByRole('button', { name: 'לנסות שוב', exact: true });
    const howWasIt = page.getByText('איך היה?');
    const fine = page.getByRole('button', { name: 'בסדר', exact: true });

    // 3. Нажать кнопку микрофона «קראתי!»
    await read.click();
    await expect(page.getByText('לא שומעים אותך כרגע')).toBeVisible();
    await expect(page.getByText('מה שכבר קראת נשמר.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'בדיקת מיקרופון' })).toBeVisible();
    await expect(retry).toBeVisible();
    for (const word of ['טעות', 'טעית', 'שגיאה', 'נכשל']) {
      await expect(page.locator('body')).not.toContainText(word);
    }

    // 4. Нажать «לנסות שוב» → на «איך היה?» выбрать «בסדר»
    await retry.click();
    await expect(howWasIt).toBeVisible();
    await fine.click();
    await expect(howWasIt).toBeHidden();

    // 5. Отрывки 2 и 3 — так же: «קראתי!» → «לנסות שוב» → «בסדר»
    for (const n of [2, 3]) {
      await expect(page.getByText(`קטע ${n}`)).toBeVisible();
      await read.click();
      await expect(retry).toBeVisible();
      await retry.click();
      await expect(howWasIt).toBeVisible();
      await fine.click();
      await expect(howWasIt).toBeHidden();
    }

    // 6. Дождаться экрана окончания (C3)
    await page.waitForURL(new RegExp(`/${childId}/assessment/results$`));
    await expect(page.getByText(`כל הכבוד, ${name}!`)).toBeVisible();
    await expect(page.getByText('סיימנו את המבדק.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'יאללה, מתחילים!', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'אחר כך', exact: true })).toBeVisible();
    await expect(page.getByTestId('writing-input')).toHaveCount(0);
    // Номера уровня на C3 нет (имя ребёнка без цифр)
    const c3 = page.locator('body');
    await expect(c3).not.toContainText(/\d/);
    for (const word of ['רמה', 'ציון', '/ 10', '/ 4', 'מתוך']) {
      await expect(c3).not.toContainText(word);
    }

    // 7. Открыть /<id>/assessment/writing
    await page.goto(`/${childId}/assessment/writing`);
    await page.waitForURL(new RegExp(`/${childId}/home$`));
  });
});
