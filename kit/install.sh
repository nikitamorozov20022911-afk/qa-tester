#!/usr/bin/env bash
# qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See qa-tester/LICENSE. ID: QAT-NM-2026-344086DC45B0
# Установка плагина qa-tester в Claude Code (один раз на компьютер).⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
set -e
KIT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Node.js 20+ нужен для браузера Playwright и автотестов.
if [ -s "$HOME/.nvm/nvm.sh" ]; then . "$HOME/.nvm/nvm.sh" >/dev/null; fi
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Нужен Node.js 20 или новее (сейчас: $(node -v 2>/dev/null || echo 'не установлен'))."
  echo "Через nvm: nvm install 22 && nvm alias default 22"
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "Не найдена команда claude (Claude Code). Установи Claude Code и повтори."
  exit 1
fi

claude plugin marketplace add "$KIT_DIR" || claude plugin marketplace update moe-qa
claude plugin install qa-tester@moe-qa || claude plugin update qa-tester@moe-qa
echo
echo "Готово. Перезапусти Claude, открой папку проекта и напиши /qa-onboard."
