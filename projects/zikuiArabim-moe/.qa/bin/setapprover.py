import json,urllib.request,sys
sid=open('session.txt').read().strip()
def r(m,p,b=None):
    q=urllib.request.Request('http://localhost:4723/session/'+sid+p,data=json.dumps(b).encode() if b is not None else None,method=m,headers={'Content-Type':'application/json'})
    return json.loads(urllib.request.urlopen(q).read())
# label element "השם נשמר עם האישור..." -> TextField directly above it
lab=r('POST','/elements',{'using':'-ios predicate string','value':"label BEGINSWITH 'השם נשמר עם האישור'"})['value']
ly=r('GET',f"/element/{list(lab[0].values())[0]}/rect")['value']['y']
best=None
for e in r('POST','/elements',{'using':'class name','value':'XCUIElementTypeTextField'})['value']:
    eid=list(e.values())[0]; y=r('GET',f'/element/{eid}/rect')['value']['y']
    if y<ly and (best is None or y>best[1]): best=(eid,y)
eid=best[0]; r('POST',f'/element/{eid}/clear',{}); r('POST',f'/element/{eid}/value',{'text':sys.argv[1]})
print('approver', r('GET',f'/element/{eid}/attribute/value')['value'], best[1], ly)
