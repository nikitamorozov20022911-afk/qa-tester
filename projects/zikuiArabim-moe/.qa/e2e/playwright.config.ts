// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Адрес тестируемого сайта — заполняется при /qa-onboard.
const QA = JSON.parse(fs.readFileSync(path.join(__dirname, 'qa.config.json'), 'utf8'));
const BASE_URL = process.env.QA_BASE_URL || QA.baseUrl;

export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    locale: 'he-IL',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    // Логин под тестовыми аккаунтами: npm run qa-login (запускает пользователь).⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    // Автотесты: используют сохранённые сессии из ../auth/, паролей не содержат.
    // Пометки в названии теста: @desktop — только десктоп; @mobile — оба телефона; @iphone / @android — один телефон; без пометки — все три прогона.
    // Десктоп: Chrome 1440×900.
    // Тесты, меняющие данные (@data), в эти три проекта не входят — у них свой проект «data» (ниже).
    { name: 'tests', testDir: './tests', grepInvert: /@mobile|@iphone|@android|@data/, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // iPhone: Safari/WebKit, iPhone 13 Mini (375 px).
    { name: 'iphone', testDir: './tests', grepInvert: /@desktop|@android|@data/, use: { ...devices['iPhone 13 Mini'] } },
    // Android: Chrome, Pixel 7.
    { name: 'android', testDir: './tests', grepInvert: /@desktop|@iphone|@data/, use: { ...devices['Pixel 7'] } },
    // @data: один аккаунт user1 → одно устройство, строго по одному тесту (запуск: npm run test:data, --workers=1).
    { name: 'data', testDir: './tests', grep: /@data/, fullyParallel: false, use: { ...devices['Pixel 7'] } },
  ],
});
