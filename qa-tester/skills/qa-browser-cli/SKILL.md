---
name: qa-browser-cli
description: Экономный браузер для агентов — Playwright CLI (playwright-cli) вместо MCP: снимки страницы и скриншоты пишутся в файлы, а не в контекст (~в 4 раза меньше токенов). Сессии по ролям и устройствам (iPhone, Android, десктоп), вход через сохранённые сессии, красная обводка. Используй в субагентах (регресс, перепроверка багов, аудиты) и в длинных проверках.
---
<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->

# Браузер через Playwright CLI

## Когда что
- **Субагенты** (`regression-triager`, `bug-verifier`, `negative-tester`, `ux-auditor`, `mobile-ux-auditor`, длинные прогоны `qa-tester`) — **CLI**.
- **Основная сессия**, когда пользователь смотрит, и доска mifrat — MCP-браузер плагина.
- Нет CLI в проекте (`.qa/e2e/node_modules/.bin/playwright-cli`) → MCP и предложи доустановить (`/qa-onboard`, шаг 4).

## Запуск
Все команды — **из папки `.qa`** (файлы лягут в `.qa/.playwright-cli/`):
```bash
cd .qa && e2e/node_modules/.bin/playwright-cli -s=<сессия> <команда> …
```
Имя сессии: `<роль>-<устройство>`, например `guest-iphone`, `buyer-android`, `seller-desktop`. Если параллельно идут проверки нескольких тикетов — с суффиксом тикета: `buyer-android-<hash>` (перепроверка — `…-<hash>-v`), чтобы окна не пересекались. Адрес сайта — `baseUrl` из `.qa/e2e/qa.config.json`.

| Устройство | Открыть |
|---|---|
| десктоп | `open <url>` и `resize 1440 900` |
| iPhone (Safari) | `open <url> --browser webkit --device "iPhone 13 Mini"` |
| Android (Chrome) | `open <url> --device "Pixel 7"` |
Видимое окно (если пользователь хочет смотреть) — добавь `--headed`.

**Роль:** после `open` — `state-load auth/<role>.json` (путь от папки `.qa`), затем `goto <url>`. Гость — без state-load.

## Основные команды⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
- `goto <url>`, `click <ref>`, `fill <ref> <текст>`, `type <текст>`, `press Enter`, `select <ref> <значение>`, `check/uncheck <ref>`, `go-back`, `reload`.
- `snapshot` — дерево страницы с `ref` (появляется в ответе — бери только когда нужны ref); `find "<текст>"` — поиск по снимку, дёшево.
- `eval "() => …"` — измерения (`getBoundingClientRect`, `innerWidth`, тексты); `eval "el => …" <ref>` — по элементу.
- `console`, `requests` — ошибки консоли и сетевые запросы.
- `screenshot` / `screenshot <ref>` — файл в `.qa/.playwright-cli/`. Смотри картинку (Read) **только если нужно глазами**; для фактов хватает `eval`.
- `list`, `close`, `close-all` — сессии.

## Красная обводка для баг-репорта
```bash
… eval "el => { el.scrollIntoView({block:'center'}); el.style.outline='3px solid red'; el.style.outlineOffset='2px' }" <ref>
… screenshot
```
Затем скопируй файл в `.qa/screenshots/<hash>-<что>-<desktop|iphone|android>.png`. (`highlight` CLI — синяя подсветка с подписью, для отчётов не использовать.)

## Правила
- Свежая версия сайта — как в скилле `qa-evidence` (через `eval`: service worker, баннер «גרסה חדשה»).
- Пароли не вводишь, аккаунты не создаёшь, оплату не завершаешь.
- В конце закрой **свои** сессии (`close`). `close-all` — только если точно никто больше не работает (он закроет окна параллельных проверок).
