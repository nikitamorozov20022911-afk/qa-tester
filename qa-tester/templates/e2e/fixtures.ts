// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Несколько пользователей в одном тесте: каждый — в своём окне (контексте) со своей сессией.
// Пример:
//   import { test, expect } from '../fixtures';
//   test('покупатель пишет — продавец видит лид #hash', async ({ asUser }) => {
//     const buyer = await asUser('buyer');⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
//     const seller = await asUser('seller');
//     ...
//   });
// 'guest' — окно без входа. Сессии — из .qa/auth/<id>.json (npm run qa-login / qa-login:manual).
import { test as base, expect, BrowserContext, BrowserContextOptions, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

type AsUser = (id: string) => Promise<Page>;

// Только параметры окна из текущего проекта (десктоп или мобильный), без настроек раннера.
const CONTEXT_KEYS = ['baseURL', 'locale', 'viewport', 'userAgent', 'deviceScaleFactor', 'isMobile', 'hasTouch', 'timezoneId'] as const;

export const test = base.extend<{ asUser: AsUser }>({
  asUser: async ({ browser }, use, testInfo) => {
    const contexts: BrowserContext[] = [];
    const projectUse = testInfo.project.use as Record<string, unknown>;
    const ctxOptions: BrowserContextOptions = {};
    for (const k of CONTEXT_KEYS) if (projectUse[k] !== undefined) (ctxOptions as Record<string, unknown>)[k] = projectUse[k];

    await use(async (id: string) => {
      let storageState: string | undefined;
      if (id !== 'guest') {
        storageState = path.resolve(__dirname, '../auth', `${id}.json`);
        if (!fs.existsSync(storageState)) {
          throw new Error(`Нет сессии «${id}» (.qa/auth/${id}.json). Запусти npm run qa-login или qa-login:manual -- ${id}`);
        }
      }
      const context = await browser.newContext({ ...ctxOptions, storageState });
      contexts.push(context);
      return context.newPage();
    });

    await Promise.all(contexts.map((c) => c.close()));
  },
});

export { expect };
