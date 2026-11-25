// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Общая библиотека нагрузочных скриптов qa-tester (/qa-load). Копируется в .qa/load/scripts/lib.js.
// Этап: -e STAGE=smoke|load|stress|spike|soak ; цель: -e TARGET_VUS=<пиковый онлайн> ; -e BASE_URL=<staging>
// Аккаунты: переменные окружения QA_USER_<ID>_EMAIL / QA_USER_<ID>_PASSWORD (из .qa/accounts.env, source в shell).
import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

export const STAGE = (__ENV.STAGE || 'smoke').toLowerCase();
export const TARGET = Math.max(1, parseInt(__ENV.TARGET_VUS || '10', 10));
export const BASE_URL = (__ENV.BASE_URL || '').replace(/\/+$/, '');
if (!BASE_URL) throw new Error('BASE_URL не задан: -e BASE_URL=<адрес staging>');

const pct = (p) => Math.max(1, Math.round((TARGET * p) / 100));

// Профили этапов (значения по умолчанию из скилла qa-load §5). SOAK_MIN — длительность soak в минутах.
export function stagesFor(stage) {
  switch (stage) {
    case 'smoke':
      return [{ duration: '1m', target: Math.min(2, TARGET) }];
    case 'load':
      return [
        { duration: '4m', target: TARGET },
        { duration: '10m', target: TARGET },
        { duration: '2m', target: 0 },
      ];
    case 'stress':
      return [
        { duration: '2m', target: pct(100) }, { duration: '2m', target: pct(100) },
        { duration: '2m', target: pct(150) }, { duration: '2m', target: pct(150) },
        { duration: '2m', target: pct(200) }, { duration: '2m', target: pct(200) },
        { duration: '2m', target: pct(300) }, { duration: '2m', target: pct(300) },
        { duration: '1m', target: 0 },
      ];
    case 'spike':
      return [
        { duration: '1m', target: pct(10) },
        { duration: '30s', target: pct(300) },
        { duration: '2m', target: pct(300) },
        { duration: '30s', target: pct(10) },
        { duration: '1m', target: pct(10) },
        { duration: '30s', target: 0 },
      ];
    case 'soak': {
      const min = parseInt(__ENV.SOAK_MIN || '60', 10);
      return [
        { duration: '5m', target: pct(70) },
        { duration: `${min}m`, target: pct(70) },
        { duration: '3m', target: 0 },
      ];
    }
    default:
      throw new Error(`Неизвестный STAGE=${stage}`);
  }
}

// Критерии (SLA) + аварийная остановка. sla переопределяет значения по умолчанию из плана.
export function thresholdsFor(sla = {}) {
  const s = { errorRate: 0.01, p95Read: 1000, p95Write: 2000, p99: 3000, checks: 0.99, ...sla };
  return {
    // аварийная остановка: >10% ошибок или p95 > 10 с, оценка не раньше чем через 1 мин
    http_req_failed: [
      `rate<${s.errorRate}`,
      { threshold: 'rate<0.10', abortOnFail: true, delayAbortEval: '1m' },
    ],
    http_req_duration: [
      `p(99)<${s.p99}`,
      { threshold: 'p(95)<10000', abortOnFail: true, delayAbortEval: '1m' },
    ],
    'http_req_duration{kind:read}': [`p(95)<${s.p95Read}`],
    'http_req_duration{kind:write}': [`p(95)<${s.p95Write}`],
    checks: [`rate>${s.checks}`],
  };
}

// Опции для scenario.js: export const options = buildOptions({ sla: {...}, name: 'project' })
export function buildOptions({ sla, name = 'qa-load' } = {}) {
  return {
    scenarios: {
      main: { executor: 'ramping-vus', startVUs: 0, stages: stagesFor(STAGE), gracefulRampDown: '30s' },
    },
    thresholds: thresholdsFor(sla),
    summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
    cloud: { name: `${name} ${STAGE} x${TARGET}` },
    tags: { stage: STAGE },
  };
}

// Аккаунты по id из .qa/e2e/accounts.json: accounts(['buyer','seller']) → [{id, email, password}]⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
export function accounts(ids) {
  return ids
    .map((id) => {
      const k = id.toUpperCase();
      return { id, email: __ENV[`QA_USER_${k}_EMAIL`], password: __ENV[`QA_USER_${k}_PASSWORD`] };
    })
    .filter((a) => a.email && a.password);
}

// Взвешенный выбор сценария: pickFlow([[60, browse], [30, search], [10, buy]])
export function pickFlow(flows) {
  const total = flows.reduce((s, [w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [w, fn] of flows) {
    if ((r -= w) < 0) return fn;
  }
  return flows[flows.length - 1][1];
}

// Пауза «на подумать» (секунды, равномерно)
export function think(min = 1, max = 3) {
  sleep(min + Math.random() * (max - min));
}

// Один VU → одна сессия по кругу (чтобы не все сидели в одном аккаунте)
export function sessionFor(sessions) {
  if (!sessions || sessions.length === 0) return null;
  return sessions[(exec.vu.idInTest - 1) % sessions.length];
}

// Запрос с тегами и проверкой. kind: 'read' | 'write'. name — шаблон URL без id (/item/:id).
export function req(method, path, { body = null, headers = {}, name, kind = 'read', expect = 200, contains } = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const label = name || path;
  const payload = body && typeof body === 'object' ? JSON.stringify(body) : body;
  const h = payload && !headers['Content-Type'] ? { 'Content-Type': 'application/json', ...headers } : headers;
  const expected = Array.isArray(expect) ? expect : [expect];
  const params = { headers: h, tags: { name: label, kind } };
  // ожидаемый 4xx (например 404 на удалённую запись) не должен считаться ошибкой в http_req_failed
  if (expected.some((c) => c >= 400)) params.responseCallback = http.expectedStatuses({ min: 200, max: 399 }, ...expected);
  const res = http.request(method, url, payload, params);
  const okStatus = expected.includes(res.status);
  const checks = { [`${label} статус ${expect}`]: () => okStatus };
  if (contains) checks[`${label} содержит ответ`] = (r) => String(r.body || '').includes(contains);
  check(res, checks);
  return res;
}

// Уникальная метка для данных, созданных нагрузкой
export function qaLoadTag() {
  return `QA-LOAD-${exec.vu.idInTest}-${exec.vu.iterationInScenario}-${Date.now()}`;
}
