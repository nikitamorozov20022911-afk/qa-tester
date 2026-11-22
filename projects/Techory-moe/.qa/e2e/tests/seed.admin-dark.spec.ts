// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Стартовая точка для агентов Playwright: тот же аккаунт на превью ветки feat/dark-mode (Vercel, защищено — вход только вручную).
import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const QA = JSON.parse(fs.readFileSync(path.join(__dirname, '../qa.config.json'), 'utf8'));
test.use({ storageState: '../auth/admin-dark.json', baseURL: QA.darkModeUrl });

test.describe('seed admin-dark', () => {
  test('seed', async ({ page }) => {
    await page.goto('/dashboard');
  });
});
