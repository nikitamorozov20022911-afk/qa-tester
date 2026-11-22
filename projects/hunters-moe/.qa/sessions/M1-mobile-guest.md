# M1 · Мобильная версия — гость
Волна 1 (параллельно с C1–C5; auth не нужен). Сначала прочитать `_rules.md`.

**Auth-файлы:** никаких. Устройства: iPhone 13 mini (375×812, WebKit) и Pixel 7 (412×915, Chromium). Агент `qa-tester:mobile-ux-auditor`.

**Что проверить (§01 респонсивность, §02 RTL):** все публичные страницы (/, /headhunters, /organizations, /talents, /about, /login, /forgot-password, /register до письма, /terms, /privacy, /accessibility, FAQ на лендинге, 404): горизонтальная прокрутка, обрезка и наложение текста, размер касаний (≥44px), клавиатура поверх полей, меню-гамбургер, футер на he/en/ru/ar, RTL-порядок, латинские имена в RTL.

Отчёт: `.qa/audits/2026-10-20/M1.md`.
