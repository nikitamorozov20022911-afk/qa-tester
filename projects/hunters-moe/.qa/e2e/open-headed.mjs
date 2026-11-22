// QA helper: открыть видимое окно под сохранённой сессией роли, чтобы пользователь сам выполнил действие (оплата и т.п.).
// Запуск: node open-headed.mjs <role> <path>. Сессия пересохраняется каждые 3 с и при закрытии окна.
import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [role, p = '/'] = process.argv.slice(2);
const f = path.resolve(here, '../auth', role + '.json');
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ storageState: f, viewport: { width: 1200, height: 640 }, locale: 'he-IL' });
const page = await ctx.newPage();
await page.goto('https://hunters-sooty.vercel.app' + p);
console.log('Окно открыто:', role, p);
const save = async () => { try { await ctx.storageState({ path: f }); } catch {} };
const t = setInterval(save, 60000);
await new Promise((r) => page.on('close', r));
clearInterval(t); console.log('Окно закрыто, сессия сохранена'); await browser.close();
