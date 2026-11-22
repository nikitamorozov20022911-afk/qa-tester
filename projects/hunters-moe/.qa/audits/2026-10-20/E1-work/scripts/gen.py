import sys
tmpl, out, key, job, cardre, action = sys.argv[1:7]
s = open(tmpl).read().replace('__KEY__', key).replace('__JOB__', job).replace('__CARDRE__', cardre).replace('//ACTION', open(action).read() if action != '-' else '')
lib = open('pii-lib.txt').read()
s = s.replace('//PII', lib)
open(out, 'w').write(s)
