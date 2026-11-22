# GM-02: Телефон, Leads — адрес в Lead Details ведёт в навигацию Google Maps
- Фича/экран: Leads (/leads) → Lead Details (кнопка с иконкой file-text)
- Тикеты: #6e6f101d
- Роль/аккаунт: admin, компания «test»
- Устройство: Android (Pixel 7)
- Тип: позитив
- Предусловия: лид «test».
## Шаги
1. /leads → у лида «test» (+972531231234) нажать кнопку деталей (file-text).
## Ожидаемо
- В окне «Lead Details» адрес «Miami Beach, FL, USA» — ссылка `…/maps/dir/?api=1&destination=Miami%20Beach%2C%20FL%2C%20USA…`, target=_blank.
(источник: «מה רצוי» — בליד; комментарий программиста — адрес в деталях лида)
## История
- 2026-10-14 · ✅ · #6e6f101d
