import sys,json,re
t=open(sys.argv[1]).read()
m=re.search(r'### Result\n(".*?")\n### Ran',t,re.S)
print(json.loads(m.group(1)) if m else t[:3000])
