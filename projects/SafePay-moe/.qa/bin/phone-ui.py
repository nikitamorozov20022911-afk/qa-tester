#!/usr/bin/env python3
# usage: ui.py dump [filter]  |  ui.py shot name  |  ui.py tap "text"  | ui.py taprid id
import sys,subprocess,re,xml.etree.ElementTree as ET,time
OUT='/Users/avielshnaider/SafePay-moe/.qa/screenshots/2026-11-08-phone'
def sh(c): return subprocess.run(c,shell=True,capture_output=True,text=True).stdout
def dump():
    sh('adb shell uiautomator dump /sdcard/ui.xml >/dev/null; adb pull /sdcard/ui.xml /tmp/ui.xml >/dev/null 2>&1')
    t=ET.parse('/tmp/ui.xml'); res=[]
    for n in t.iter('node'):
        tx=re.sub(r'[\u200e\u200f\u2066-\u2069\u00a0]',' ',n.get('text') or n.get('content-desc') or '')
        b=[int(x) for x in re.findall(r'\d+',n.get('bounds'))]
        if tx.strip() or n.get('clickable')=='true':
            res.append((tx.strip(),b,n.get('clickable'),n.get('resource-id'),n.get('class').split('.')[-1]))
    return res
a=sys.argv[1]
if a=='dump':
    f=sys.argv[2] if len(sys.argv)>2 else ''
    for tx,b,c,r,cl in dump():
        if f in tx: print(f"{tx[:70]!r:74} {b} {'C' if c=='true' else ' '} {cl} {r or ''}")
elif a=='shot':
    p=f"{OUT}/{sys.argv[2]}.png"; sh(f'adb exec-out screencap -p > "{p}"'); print(p)
elif a=='tap':
    want=sys.argv[2]; idx=int(sys.argv[3]) if len(sys.argv)>3 else 0
    d=dump(); m=[x for x in d if x[3]==want] or [x for x in d if x[0]==want] or [x for x in d if want in x[0]]
    if not m: print('NOT FOUND',want); sys.exit(1)
    b=m[idx][1]; x=(b[0]+b[2])//2; y=(b[1]+b[3])//2; sh(f'adb shell input tap {x} {y}'); print('tap',m[idx][0][:40],x,y)
