import sys
url, shot, out = sys.argv[1:4]
s=open('deep.js').read().replace('__URL__',url).replace('__SHOT__',shot).replace('//PII',open('pii-lib.txt').read())
open(out,'w').write(s)
