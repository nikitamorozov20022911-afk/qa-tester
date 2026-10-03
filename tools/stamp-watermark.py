#!/usr/bin/env python3
# qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. ID: QAT-NM-2026-344086DC45B0
"""Личный инструмент автора: ставит видимую подпись и невидимый водяной знак в файлы плагина.

Использование:
    python3 stamp-watermark.py <файл> [<файл> ...]

Файлы, где подпись уже есть, пропускаются. В плагин не входит.
"""
import pathlib
import re
import sys

NOTICE = ('qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). '
          'All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0')
HIDDEN_ID = 'QAT-NM-2026-344086DC45B0|Nikita Morozov'
Z0, Z1, START, END = '​', '‌', '⁠', '⁣'
MARK = START + ''.join(Z1 if c == '1' else Z0 for c in ''.join(f'{b:08b}' for b in HIDDEN_ID.encode('utf-8'))) + END


def add_visible(path, text):
    if 'QAT-NM-2026-' in text:
        return text
    if path.suffix == '.md':
        line = f'<!-- {NOTICE} -->\n'
        m = re.match(r'^---\n.*?\n---\n', text, re.S)
        return text[:m.end()] + line + text[m.end():] if m else line + text
    if path.suffix in ('.ts', '.js', '.mjs', '.cjs'):
        return f'// {NOTICE}\n' + text
    if path.suffix in ('.sh', '.py', '.env', '') or path.name.startswith('.'):
        if text.startswith('#!'):
            first, _, rest = text.partition('\n')
            return f'{first}\n# {NOTICE}\n{rest}'
        return f'# {NOTICE}\n' + text
    return text  # JSON и прочее — только вручную, где формат позволяет


def add_hidden(path, text):
    if START in text or path.suffix == '.json':
        return text  # JSON — только вручную внутри строкового значения
    lines = text.split('\n')
    in_code = False
    cands = []
    for i, l in enumerate(lines):
        if l.startswith('```'):
            in_code = not in_code
            continue
        if in_code or 'QAT-NM' in l or not re.search(r'[A-Za-zА-Яа-яא-ת]', l):
            continue
        if path.suffix == '.md' and (l.startswith('---') or l.startswith('|') or l.startswith('<!--')):
            continue
        if path.suffix in ('.ts', '.js', '.mjs', '.cjs') and not l.strip().startswith('//'):
            continue
        if path.suffix in ('.sh', '.py') and not l.strip().startswith('#'):
            continue
        cands.append(i)
    if not cands:
        return text
    i = cands[len(cands) // 2]
    lines[i] += MARK
    return '\n'.join(lines)


for arg in sys.argv[1:]:
    p = pathlib.Path(arg)
    s = p.read_text(encoding='utf-8')
    new = add_hidden(p, add_visible(p, s))
    if new != s:
        p.write_text(new, encoding='utf-8')
        print(f'подписан: {p}')
    else:
        print(f'без изменений: {p}')
