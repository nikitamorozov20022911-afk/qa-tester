// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Автотесты рассчитаны на Node 22 — на другой версии остановиться сразу с понятной подсказкой.
if (process.versions.node.split('.')[0] !== '22') {
  console.error(`qa-tester: нужен Node 22, сейчас ${process.version}. Запусти через ../bin/with-node22, например: ../bin/with-node22 npm test (или nvm use 22).`);
  process.exit(1);
}

// Адрес тестируемого сайта — заполняется при /qa-onboard.
const QA = JSON.parse(fs.readFileSync(path.join(__dirname, 'qa.config.json'), 'utf8'));
const BASE_URL = process.env.QA_BASE_URL || QA.baseUrl;

export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  retries: 1,
  // Каждый тест — в своём новом окне (открылось → тест → закрылось); 3 окна одновременно.
  // Зависимые по порядку тесты в файле — test.describe.configure({ mode: 'serial' }).
  fullyParallel: true,
  workers: Number(process.env.QA_WORKERS) || 3,
  // Короткий вывод в консоль (в контекст агента) + JSON для разбора падений + HTML для человека.
  reporter: [['dot'], ['json', { outputFile: 'test-results/results.json' }], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    locale: 'he-IL',
    // Окна видны; без окон — npm run test:headless (или QA_HEADLESS=1).
    headless: process.env.QA_HEADLESS === '1',
    screenshot: 'only-on-failure',
    // Трейс пишется только на повторе упавшего теста, а не для каждого прошедшего.
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    // Логин под тестовыми аккаунтами: npm run qa-login (запускает пользователь).⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    // Автотесты: используют сохранённые сессии из ../auth/, паролей не содержат.
    // Пометки в названии теста: @data — меняет данные (идёт отдельно, по одному); @desktop — только десктоп; @mobile — оба телефона; @iphone / @android — один телефон; без пометки — все три прогона.
    // Десктоп: Chrome 1440×900.
    { name: 'tests', testDir: './tests', grepInvert: /@mobile|@iphone|@android|@data/, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // iPhone: Safari/WebKit, iPhone 13 Mini (375 px).
    { name: 'iphone', testDir: './tests', grepInvert: /@desktop|@android|@data/, use: { ...devices['iPhone 13 Mini'] } },
    // Android: Chrome, Pixel 7.
    { name: 'android', testDir: './tests', grepInvert: /@desktop|@iphone|@data/, use: { ...devices['Pixel 7'] } },
    // @data — тесты, меняющие данные общего тестового аккаунта: в три проекта выше не входят,
    // идут строго по одному (одно окно), параллельно с остальными, чтобы не мешать друг другу. Устройство — десктоп.
    { name: 'data', testDir: './tests', grep: /@data/, fullyParallel: false, workers: 1, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
