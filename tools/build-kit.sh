#!/usr/bin/env bash
# qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
# Личный инструмент автора: собирает архив qa-tester-kit-<версия>.zip в moe/dist/.
# Запускается автоматически в конце /qa-improve или вручную: bash moe/tools/build-kit.sh⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
set -euo pipefail

MOE="$(cd "$(dirname "$0")/.." && pwd)"
PLUGIN="$MOE/qa-tester"
VERSION="$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['version'])" "$PLUGIN/.claude-plugin/plugin.json")"
OUT="$MOE/dist/qa-tester-kit-$VERSION.zip"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

KIT="$STAGE/qa-tester-kit"
mkdir -p "$KIT/.claude-plugin"
cp "$MOE/.claude-plugin/marketplace.json" "$KIT/.claude-plugin/"
rsync -a --exclude '.DS_Store' "$PLUGIN" "$KIT/"
cp "$MOE/kit/install.sh" "$MOE/kit/INSTALL.md" "$MOE/kit/COMMANDS.md" "$KIT/"
chmod +x "$KIT/install.sh"

# Проверки: плагин и marketplace валидны, подписи на месте.
claude plugin validate "$KIT/qa-tester" >/dev/null
claude plugin validate "$KIT" >/dev/null
python3 "$MOE/tools/find-watermark.py" "$KIT" | tail -1

mkdir -p "$MOE/dist"
rm -f "$OUT"   # пересборка той же версии; старые — по ротации ниже
(cd "$STAGE" && zip -qr -X "$OUT" qa-tester-kit)
echo "Архив: $OUT"

# Ротация «змейкой»: в dist хранятся 5 последних версий, более старые удаляются.
KEEP=5
python3 - "$MOE/dist" "$KEEP" <<'PYEOF'
import pathlib, re, sys
dist, keep = pathlib.Path(sys.argv[1]), int(sys.argv[2])
zips = [(tuple(int(x) for x in m.group(1).split('.')), z) for z in dist.glob('qa-tester-kit-*.zip')
        if (m := re.fullmatch(r'qa-tester-kit-(\d+\.\d+\.\d+)\.zip', z.name))]
zips.sort()
for _, z in zips[:-keep]:
    z.unlink(); print(f'Удалена старая версия: {z.name}')
print('В dist:', ', '.join(z.name.replace('qa-tester-kit-', '').replace('.zip', '') for _, z in zips[-keep:]))
PYEOF

# Раздача в папки проектов: из реестра ~/.qa-tester/config.json ("projects") + папки из аргументов.
# В каждом проекте заменяется только наш комплект: папка qa-tester-kit/ (распакованный) и/или qa-tester-kit-*.zip.
# Если в проекте нет ни того ни другого — кладётся распакованная папка qa-tester-kit/.
PROJECTS="$(python3 - "$@" <<'PYEOF'
import json, os, sys
dirs = list(sys.argv[1:])
cfg = os.path.expanduser('~/.qa-tester/config.json')
if os.path.exists(cfg):
    dirs += json.load(open(cfg)).get('projects', [])
seen = []
for d in dirs:
    d = os.path.abspath(os.path.expanduser(d))
    if os.path.isdir(d) and d not in seen:
        seen.append(d)
print('\n'.join(seen))
PYEOF
)"
while IFS= read -r P; do
  [ -z "$P" ] && continue
  [ "$P" = "$MOE" ] && continue
  updated=""
  if [ -f "$P/qa-tester-kit/.claude-plugin/marketplace.json" ] && grep -q '"moe-qa"' "$P/qa-tester-kit/.claude-plugin/marketplace.json"; then
    rsync -a --delete "$KIT/" "$P/qa-tester-kit/"
    updated="папка qa-tester-kit/"
  fi
  if ls "$P"/qa-tester-kit-*.zip >/dev/null 2>&1; then
    rm -f "$P"/qa-tester-kit-*.zip
    cp "$OUT" "$P/"
    updated="${updated:+$updated + }$(basename "$OUT")"
  fi
  if [ -z "$updated" ]; then
    mkdir -p "$P/qa-tester-kit" && rsync -a "$KIT/" "$P/qa-tester-kit/"
    updated="папка qa-tester-kit/ (новая)"
  fi
  echo "Проект обновлён: $P → $updated (v$VERSION)"
done <<< "$PROJECTS"
