// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Стартовая точка для официальных агентов Playwright: admin на qa-stand (не prod).
// baseURL проекта (qa.config.json) остаётся prod — стенд задаётся здесь и в каждом тесте по этому seed.
// Сессия: cd .qa/e2e && ../bin/with-node22 npm run qa-login:manual -- admin-stand
import { test } from '@playwright/test';

test.use({
  baseURL: 'https://elion-git-qa-stand-aviels-projects.vercel.app',
  storageState: '../auth/admin-stand.json',
});

test.describe('seed admin-stand', () => {
  test('seed', async ({ page }) => {
    await page.goto('/dashboard');
  });
});
