#!/usr/bin/env python3
# qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. ID: QAT-NM-2026-344086DC45B0
"""Личный инструмент автора: ищет видимую подпись и невидимый водяной знак qa-tester в файлах.

Использование:
    python3 find-watermark.py <папка или файл>

Только читает файлы, ничего не меняет. В плагин не входит — держи у себя.
"""
import pathlib
import re
import sys

VISIBLE_ID = 'QAT-NM-2026-344086DC45B0'
Z0, Z1, START, END = '​', '‌', '⁠', '⁣'
HIDDEN_RE = re.compile(START + '([' + Z0 + Z1 + ']+)' + END)


def decode_hidden(text):
    m = HIDDEN_RE.search(text)
    if not m:
        return None
    bits = ''.join('1' if c == Z1 else '0' for c in m.group(1))
    try:
        return bytes(int(bits[i:i + 8], 2) for i in range(0, len(bits) - len(bits) % 8, 8)).decode('utf-8')
    except UnicodeDecodeError:
        return '<повреждён>'


def scan(target):
    root = pathlib.Path(target)
    files = [root] if root.is_file() else sorted(p for p in root.rglob('*') if p.is_file())
    found_visible = found_hidden = 0
    for p in files:
        try:
            text = p.read_text(encoding='utf-8')
        except (UnicodeDecodeError, OSError):
            continue
        visible = VISIBLE_ID in text
        hidden = decode_hidden(text)
        if visible or hidden:
            found_visible += visible
            found_hidden += bool(hidden)
            print(f'{p}: видимая подпись={"да" if visible else "нет"}; невидимый знак={hidden or "нет"}')
    print(f'\nИтого: файлов с видимой подписью — {found_visible}, с невидимым знаком — {found_hidden}.')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    scan(sys.argv[1])
