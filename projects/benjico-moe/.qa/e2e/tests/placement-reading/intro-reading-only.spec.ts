// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// spec: specs/placement-reading.md
// seed: tests/seed.parent.spec.ts
import { test, expect } from '../../fixtures';
import { annotateCleanup, createChild, qaChildName } from '../placement-results/placement.helpers';


// Пропущено 08.11 (решение пользователя): тест создаёт нового ребёнка QA-AUTO и передаёт ему устройство — с #8ca267 режим ребёнка серверный и запирает вход до ввода пароля/PIN.
test.skip(true, 'QA-AUTO + режим ребёнка запирает вход (#8ca267) — пропущено по решению 08.11');

test.describe('Стартовый тест чтения — экраны и прохождение (генератор)', () => {
  test('Экран объяснения — только чтение, «מתחילים!» и «אחר כך»; /assessment/writing у нового ребёнка ведёт домой @desktop @data #8bf5a8', async ({ asUser }, testInfo) => {
    const page = await asUser('parent');
    const name = qaChildName();

    // 1. Открыть /children/new, создать профиль QA-AUTO-<6 букв>, год рождения 2018, остальное по умолчанию → сохранить; запомнить id
    const childId = await createChild(page, name, '2018');
    annotateCleanup(testInfo, name, childId);

    // 2. Открыть /children/<id>/handover → нажать «<имя>, בואו נתחיל!»
    await page.goto(`/children/${childId}/handover`);
    await page.getByRole('button', { name: `${name}, בואו נתחיל!` }).click();

    // 3. Дождаться адреса /<id>/assessment/intro
    await page.waitForURL(new RegExp(`/${childId}/assessment/intro$`));
    await expect(page.getByText('מבדק התאמה')).toBeVisible();
    await expect(page.getByText('בואו נכיר!')).toBeVisible();
    await expect(page.getByText('קוראים בקול')).toBeVisible();
    await expect(page.getByText('כמה קטעים קצרים • כ־5 דקות')).toBeVisible();
    await expect(page.getByRole('button', { name: 'מתחילים!', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'אחר כך', exact: true })).toBeVisible();
    // Письма на C1 нет
    await expect(page.locator('body')).not.toContainText('כתיבה');

    // 4. Открыть /<id>/assessment/writing (тест не начат)
    await page.goto(`/${childId}/assessment/writing`);
    await page.waitForURL(new RegExp(`/${childId}/home$`));
    await expect(page.getByTestId('writing-input')).toHaveCount(0);
  });
});
