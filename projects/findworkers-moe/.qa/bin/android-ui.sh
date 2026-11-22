#!/bin/bash
# usage: ui.sh [screenshot-name]  — dumps UI elements; optional screenshot
export PATH=$PATH:~/Library/Android/sdk/platform-tools
D=/Users/avielshnaider/findworkers-moe/.qa/screenshots/2026-11-03
adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; adb pull /sdcard/ui.xml $D/ui.xml >/dev/null 2>&1
python3 - "$D/ui.xml" <<'P'
import re,sys
x=open(sys.argv[1]).read()
seen=set()
for m in re.finditer(r'<node [^>]*>',x):
  n=m.group(0)
  t=re.search(r' text="([^"]*)"',n).group(1); c=re.search(r'content-desc="([^"]*)"',n).group(1); b=re.search(r'bounds="([^"]*)"',n).group(1)
  ch=re.search(r'checked="true"',n); cl='clickable="true"' in n
  lab=(t or c)
  if not lab and not (cl and ch): continue
  k=(lab,b)
  if k in seen: continue
  seen.add(k); print(lab[:60].replace('\n',' '), b, 'CHECKED' if ch else '', 'clk' if cl else '')
P
[ -n "$1" ] && adb exec-out screencap -p > $D/$1.png && echo "shot $D/$1.png"
