#!/bin/zsh
# usage: run.sh <session> <tag> '<js array of [name,url]>'
D=/Users/avielshnaider/hunters-moe/.qa/audits/2026-10-20/E1-work/scripts/e1e
python3 -c "import sys;t=open('$D/adm-read.js').read();open('$D/_gen-$2.js','w').write(t.replace('__URLS__',sys.argv[1]))" "$3"
cd /Users/avielshnaider/hunters-moe/.qa
e2e/node_modules/.bin/playwright-cli -s=$1 run-code --filename=$D/_gen-$2.js > $D/out-$2.txt 2>&1
wc -c $D/out-$2.txt
