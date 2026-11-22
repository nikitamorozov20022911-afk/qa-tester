# Handoff · elion-moe · 2026-11-15

## Где мы
- Статус: сессия закрыта. Очередь «בבדיקות» (13) — вся пройдена, все 13 проведены пользователем в עבר QA.
  - Проверено QA на qa-stand: #f54c1e, #0cd999, #38f51d, #6ee502; #fd4e1d — по доказательствам #43cd29/#58be43.
  - Проведены пользователем без теста QA: #7fce7b, #0231e5, #6810c3, #8364ea, #df58b6, #0ee04e, #66521b, #b13ce5 (принятые расхождения — в context.md «Согласованные решения»).
- #0cd999, #38f51d, #6ee502 — фикс пока только на qa-stand.

## Автотесты — незакончено
- Планы готовы: .qa/e2e/specs/hard-delete-audit.md (4 теста), .qa/e2e/specs/projects-search.md (2 теста). Seed: .qa/e2e/tests/seed.admin-stand.spec.ts (baseURL qa-stand, storageState ../auth/admin-stand.json).
- Генерация (playwright-test-generator) НЕ запущена: нет сессии. Сначала пользователь: `cd .qa/e2e && ../bin/with-node22 npm run qa-login:manual -- admin-stand` (вход с MFA/AAL2). Потом — генератор на 6 тестов по таблице в планах; после генерации вручную проверить test.use({baseURL: qa-stand}) + guard хоста + afterAll-чистку QA-AUTO.
- seed.admin-stand.spec.ts будет падать в обычных прогонах, пока нет admin-stand.json.
- #fd4e1d — не автоматизируем.

## Вход
- Chrome пользователя: qa-stand залогинен; prod-сессия на elion-inky.vercel.app (www.elionvc.com не залогинен).
- .qa/auth пуст.

## Найдено, но не оформлено
- Audit Trail View Details (hard delete): «financial_projects … current_value_usd» показывает значения в AED.
- С 05.11: /profile «Sent to … every morning» при выкл. переключателе; нет aria-label у переключателя; Audit Trail HE рвёт слова.

## Тестовые данные
- qa-stand: QA HD Account 1511 / QA HD Peer 1511 / строка QA restore row 1511 — удалены ✓. Чистить нечего.

## Следующий шаг
/qa продолжаем → войти admin-stand → сгенерировать 6 автотестов по планам. Или новая очередь /qa.
