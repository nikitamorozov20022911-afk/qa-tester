<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-020: цитаты-доказательства оценки кандидата — только из его сегментов, текст цитаты есть в этом сегменте
- Фича/экран: отчёт (get_candidate_report → report.domains / checkpoints / strengths), F-44/F-45
- Тикеты: #16dea8 (fe219494b9b5f50edd16dea8)
- Роль/аккаунт: business (testim), только чтение
- Устройство: desktop (данные API)
- Тип: негатив / безопасность
- Предусловия: «QA-5f7c10-2110» (как REC-019).
## Шаги
1. Собрать все evidence {quote, segment_index} из report.domains.*.evidence, domains.*.checkpoints[].evidence, strengths[].evidence.
## Ожидаемо
- segments[segment_index] существует, speaker ≠ customer (candidate; при null — допустимо как «неизвестный», но не клиент), quote — подстрока текста сегмента (AC тикета: реплики клиента не приписываются кандидату).
- Исключения (там клиент законен): domains.*.discovered_items (что раскрыл клиент), recommended_clips.
- Факт 21.10: 28 доказательств кандидата — все из сегментов candidate.
## История
- 2026-10-21 · ✅ · #16dea8
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/speaker-trust-16dea8.spec.ts (не запускался)
