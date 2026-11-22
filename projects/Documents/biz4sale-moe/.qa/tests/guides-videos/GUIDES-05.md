# GUIDES-05: при воспроизведении браузер декодирует звук
- Фича/экран: /guides — плеер
- Тикеты: #8790d6
- Роль/аккаунт: admin (`.qa/auth/admin.json`) — с #359741 гайды видит только админ (было: guest, D-07)
- Устройство: desktop (Chromium) + iPhone (WebKit)
- Тип: позитив, прод, только чтение (@prod-safe)
- Предусловия: нет.
## Шаги
1. Открыть /guides, запустить каждое из 5 видео (как в GUIDES-03), дождаться `currentTime` > 2 с.
2. Chromium: прочитать `video.webkitAudioDecodedByteCount`. WebKit: `video.audioTracks.length`.
## Ожидаемо
- Chromium: `webkitAudioDecodedByteCount > 0` (звук реально декодируется); WebKit: `audioTracks.length ≥ 1`.
- `muted=false`, `volume>0`.
(источник: #8790d6 комментарий 2026-11-03 — озвучка во всех видео; проверено 2026-11-03: signup Chromium 26 550 байт за 2 с, WebKit audioTracks=1)
- Не проверяет: громкость/наличие речи (тишина в дорожке тоже декодируется) — это GUIDES-07.
## История
- 2026-11-03 · ✅ · עבר QA #8790d6
- 2026-11-10 · ✍️ · #359741 — гайды скрыты от всех, кроме админа: кейс выполняется под admin (было: guest)
