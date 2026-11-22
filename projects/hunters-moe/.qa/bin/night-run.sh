#!/bin/zsh
# Ночной QA-прогон hunters: запускает проверки отдельными сессиями `claude -p` по волнам.
# Запуск (из любой папки):   caffeinate -i zsh /Users/avielshnaider/hunters-moe/.qa/bin/night-run.sh 2026-10-21
# Без даты — берётся сегодняшняя. Проверка без запуска: DRY_RUN=1 zsh .../night-run.sh 2026-10-21
#
# Порядок (аккаунты не пересекаются внутри параллельных веток):
#   параллельно:  гость [C1, M1, N1] | хедхантер [C2 → N2] | компания [C3 → N3] | талант [C4 → N4] | админ [C5 → N5]
#   затем по очереди:  E1 → M2 → F1 → R
set -u

PROJECT="/Users/avielshnaider/hunters-moe"
SESS="$PROJECT/.qa/sessions"
RUN="${1:-$(date +%Y-%m-%d)}"
MMDD="$(echo "$RUN" | awk -F- '{print $2$3}')"
OUT="${OUT_DIR:-$PROJECT/.qa/audits/$RUN}"
LOGS="$OUT/logs"
MODE="${PERMISSION_MODE:-auto}"          # auto | bypassPermissions (если auto будет отказывать в нужных действиях)
CLAUDE_BIN="${CLAUDE_BIN:-$(command -v claude || echo /Users/avielshnaider/.nvm/versions/node/v20.9.0/bin/claude)}"
mkdir -p "$LOGS"
MASTER="$LOGS/night-run.log"

log() { echo "$(date '+%F %T') $*" | tee -a "$MASTER"; }

# run_one КОД ФАЙЛ_БРИФА "auth-файлы" "агенты"
run_one() {
  local code="$1" brief="$2" auths="$3" agents="$4"
  local report="$OUT/$code.md"; [[ "$code" == "R" ]] && report="$OUT/SUMMARY.md"
  if [[ -s "$report" ]] && grep -q -i -E "сводка|итог|summary" "$report"; then
    log "$code: отчёт уже есть — пропускаю"; return 0
  fi
  local prompt="Прогон $RUN, сессия $code. Прочитай $SESS/_rules.md и $SESS/$brief и выполни бриф полностью, со своими субагентами ($agents). ВАЖНО: дата этого прогона $RUN — везде, где в брифах написано 2026-10-20 / 1020, используй $RUN / $MMDD (папка отчётов $OUT, скриншоты .qa/screenshots/run-$MMDD/$code/, префикс тестовых данных «QA-AUTO $MMDD $code»). Auth-файлы: $auths — только эти, по одной браузерной сессии на файл одновременно, не копировать. Это неинтерактивный запуск (claude -p): процесс завершится, как только ты закончишь ответ, поэтому субагентов запускай с run_in_background: false (параллельно — несколькими вызовами в одном сообщении) и не заканчивай ответ, пока все они не вернули результат и отчёт не записан. Доску mifrat не трогай, пользователя ни о чём не спрашивай — работай автономно, вопросы пиши в отчёт. В конце — отчёт $report, тестовые данные $OUT/$code-testdata.md, короткое резюме по-русски."
  log "$code: старт (auth: $auths)"
  if [[ -n "${DRY_RUN:-}" ]]; then log "$code: DRY_RUN — пропуск запуска"; return 0; fi
  ( cd "$PROJECT" && "$CLAUDE_BIN" -p "$prompt" --permission-mode "$MODE" --output-format text > "$LOGS/$code.log" 2>&1 )
  local rc=$?
  if [[ -s "$report" ]]; then log "$code: готово (rc=$rc)"; else
    log "$code: отчёта нет (rc=$rc) — повторяю один раз"
    ( cd "$PROJECT" && "$CLAUDE_BIN" -p "$prompt Это повторный запуск: часть работы и отчёта может уже быть — продолжи." --permission-mode "$MODE" --output-format text >> "$LOGS/$code.log" 2>&1 )
    [[ -s "$report" ]] && log "$code: готово со 2-й попытки" || log "$code: НЕ ВЫПОЛНЕНО — см. $LOGS/$code.log"
  fi
}

guest_chain()   { run_one C1 C1-guest.md "нет (гость)" "qa-tester:qa-tester, qa-tester:bug-verifier" &
                  run_one M1 M1-mobile-guest.md "нет (гость)" "qa-tester:mobile-ux-auditor, qa-tester:bug-verifier" &
                  run_one N1 N1-guest.md "нет (гость)" "qa-tester:negative-tester, qa-tester:bug-verifier" &
                  wait; }
hunter_chain()  { run_one C2 C2-headhunter.md "hunter_plus, hunter_free_2" "qa-tester:qa-tester, qa-tester:bug-verifier"
                  run_one N2 N2-headhunter.md "hunter_plus, hunter_free_2" "qa-tester:negative-tester, qa-tester:bug-verifier"; }
company_chain() { run_one C3 C3-company-hr.md "company, company_6, hunter_free" "qa-tester:qa-tester, qa-tester:bug-verifier"
                  run_one N3 N3-company-hr.md "company, company_6, hunter_free" "qa-tester:negative-tester, qa-tester:bug-verifier"; }
talent_chain()  { run_one C4 C4-talent.md "talent, talent_2, company_2" "qa-tester:qa-tester, qa-tester:bug-verifier"
                  run_one N4 N4-talent.md "talent, talent_2, company_2" "qa-tester:negative-tester, qa-tester:bug-verifier"; }
admin_chain()   { run_one C5 C5-admin.md "admin" "qa-tester:qa-tester, qa-tester:bug-verifier"
                  run_one N5 N5-admin.md "admin" "qa-tester:negative-tester, qa-tester:bug-verifier"; }

log "=== Ночной прогон $RUN старт (режим $MODE, claude: $CLAUDE_BIN) ==="
log "Волны 1–2: параллельные ветки по ролям"
guest_chain & hunter_chain & company_chain & talent_chain & admin_chain &
wait
ALL="hunter_plus, hunter_free, hunter_free_2, company, company_2, company_6, talent, talent_2, admin"
log "Волна 3: E1"; run_one E1 E1-end-to-end.md "$ALL" "qa-tester:qa-tester, qa-tester:bug-verifier"
log "Волна 4: M2"; run_one M2 M2-mobile-roles.md "$ALL" "qa-tester:mobile-ux-auditor, qa-tester:bug-verifier"
log "Волна 4b: F1"; run_one F1 F1-figma.md "$ALL" "qa-tester:qa-tester"
log "Волна 5: R";  run_one R R-report.md "не нужны" "по необходимости"
log "=== Прогон $RUN закончен. Итог: $OUT/SUMMARY.md ==="
