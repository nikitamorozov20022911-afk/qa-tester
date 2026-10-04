#!/usr/bin/env bash
# qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See qa-tester/LICENSE. ID: QAT-NM-2026-344086DC45B0
# Установка плагина qa-tester в Claude Code (один раз на компьютер).⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
set -e
KIT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Node.js 22 нужен для браузера Playwright и автотестов. Он не обязан быть версией по умолчанию —
# плагин сам находит его (bin/with-node22: nvm, fnm, volta, Homebrew) и запускает всё под ним.
if ! bash "$KIT_DIR/qa-tester/bin/with-node22" >/dev/null; then
  exit 1
fi
echo "Node.js 22: $(bash "$KIT_DIR/qa-tester/bin/with-node22")"

if ! command -v claude >/dev/null 2>&1; then
  echo "Не найдена команда claude (Claude Code). Установи Claude Code и повтори."
  exit 1
fi

claude plugin marketplace add "$KIT_DIR" || claude plugin marketplace update moe-qa
claude plugin install qa-tester@moe-qa || claude plugin update qa-tester@moe-qa
echo
echo "Готово. Перезапусти Claude, открой папку проекта и напиши /qa-onboard."
