# GM-01: Телефон, Map — «View on Map» и адрес в карточке открывают навигацию Google Maps
- Фича/экран: Leads Map (/map)
- Тикеты: #6e6f101d («מובייל – לחיצה על המפה או על הכתובת תפתח את Google Maps בטלפון»)
- Роль/аккаунт: admin, компания «test»
- Устройство: Android (Pixel 7)
- Тип: позитив
- Предусловия: лид «test» с адресом «Miami Beach, FL, USA». Реальное приложение — только на телефоне (qa-device); в эмуляции проверяется URL.
## Шаги
1. Открыть /map.
2. Проверить адрес в карточке «test».
3. Нажать «View on Map».
## Ожидаемо
- Адрес — ссылка `https://www.google.com/maps/dir/?api=1&destination=Miami%20Beach%2C%20FL%2C%20USA`, target=_blank.
- «View on Map» вызывает window.open с тем же URL (не центрирует карту), страница остаётся /map.
(источник: «מה רצוי» — פותחת את Google Maps עם הכתובת והניווט אליה)
## История
- 2026-10-14 · ✅ · #6e6f101d
