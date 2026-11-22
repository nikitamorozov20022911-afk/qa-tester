import sys,json
for l in sys.stdin:
  try: o=json.loads(l)
  except: print(l[:300]); continue
  if 'titles' in o: print(o.get('item'),o['label'],o.get('at'),'TF=',o.get('tefillin'),'dup=',o.get('dupTitles'),'|', ' ; '.join(o['titles']),'| rpc',o.get('rpc'),'| db',o.get('db'), '| icon', (o.get('tefillinRow') or {}).get('iconOnRight'))
  else: print(json.dumps(o,ensure_ascii=False)[:500])
