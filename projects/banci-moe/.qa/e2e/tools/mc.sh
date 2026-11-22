#!/bin/bash
# mc.sh <profile> <op> [arg] — send command to macdev window and wait result
P=$1; L=/Users/avielshnaider/banci-moe/.qa/live; ID=$(date +%s%N)
python3 -c "import json,sys;print(json.dumps({'id':sys.argv[1],'op':sys.argv[2],'arg':(sys.argv[3] if len(sys.argv)>3 else None)}))" "$ID" "$2" "$3" > $L/$P.cmd
for i in $(seq 1 60); do sleep 0.5; grep -q "\"$ID\"" $L/$P.res 2>/dev/null && { cat $L/$P.res; echo; exit 0; }; done; echo timeout
