import json,sys,urllib.request,os,re,base64
B='http://127.0.0.1:4723'; SF=os.environ.get('IOS_SID_FILE','/tmp/ios_sid_verify.txt')
SHOTS='/Users/avielshnaider/findworkers-moe/.qa/screenshots/2026-11-03/ios'
os.makedirs(SHOTS,exist_ok=True)
def call(m,p,body=None,t=300):
    r=urllib.request.Request(B+p,method=m,data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json'})
    try: return json.load(urllib.request.urlopen(r,timeout=t))
    except urllib.error.HTTPError as e: raise SystemExit('HTTP %s %s'%(e.code,e.read()[:600]))
def sid():
    if os.path.exists(SF):
        s=open(SF).read().strip()
        try: call('GET',f'/session/{s}/window/rect'); return s
        except SystemExit: pass
    dev=json.load(open(os.path.expanduser('~/.qa-tester/devices.json')))['ios']
    caps={'platformName':'iOS','appium:automationName':'XCUITest','appium:udid':dev['udid'],'appium:bundleId':'com.juliusAgency.findWorkers','appium:noReset':True,'appium:forceAppLaunch':False,'appium:usePrebuiltWDA':True,'appium:derivedDataPath':dev['derivedDataPath'],'appium:updatedWDABundleId':dev['wdaBundleId'],'appium:xcodeOrgId':dev['teamId'],'appium:xcodeSigningId':'Apple Development','appium:wdaLaunchTimeout':240000,'appium:newCommandTimeout':900}
    s=call('POST','/session',{'capabilities':{'alwaysMatch':caps}},t=400)['value']['sessionId']; open(SF,'w').write(s); return s
a=sys.argv[1:]; s=sid()
def find(using,val):
    return list(call('POST',f'/session/{s}/element',{'using':using,'value':val})['value'].values())[0]
def tapxy(x,y):
    call('POST',f'/session/{s}/actions',{'actions':[{'type':'pointer','id':'f','parameters':{'pointerType':'touch'},'actions':[{'type':'pointerMove','duration':0,'x':int(x),'y':int(y)},{'type':'pointerDown','button':0},{'type':'pause','duration':80},{'type':'pointerUp','button':0}]}]})
c=a[0]
if c=='src':
    x=call('GET',f'/session/{s}/source')['value']; seen=set()
    for m in re.finditer(r'<XCUIElementType(\w+)([^>]*)>',x):
        n=m.group(2); g=lambda k:(re.search(k+r'="([^"]*)"',n) or [None,''])[1]
        lab=g('label') or g('name') or g('value')
        if not lab or g('visible')=='false': continue
        k=(lab,g('x'),g('y'))
        if k in seen: continue
        seen.add(k); print(m.group(1)[:10],lab[:70].replace('&#10;',' | '),g('x'),g('y'),g('width'),g('height'))
elif c=='tap':   # tap "<label>" [contains]
    q=f'label {"CONTAINS" if len(a)>2 else "=="} "{a[1]}"'
    e=find('-ios predicate string',q); call('POST',f'/session/{s}/element/{e}/click',{}); print('tapped',a[1])
elif c=='xy': tapxy(a[1],a[2]); print('xy')
elif c=='type':  # type <text> (into first TextField/SearchField)
    try: e=find('-ios class chain','**/XCUIElementTypeTextField')
    except SystemExit: e=find('-ios class chain','**/XCUIElementTypeSearchField')
    call('POST',f'/session/{s}/element/{e}/click',{}); call('POST',f'/session/{s}/element/{e}/clear',{})
    call('POST',f'/session/{s}/element/{e}/value',{'text':a[1]}); print('typed')
elif c=='id': e=find('accessibility id',a[1]); call('POST',f'/session/{s}/element/{e}/click',{}); print('tapped id',a[1])
elif c=='shot':
    open(f'{SHOTS}/{a[1]}.png','wb').write(base64.b64decode(call('GET',f'/session/{s}/screenshot')['value'])); print(f'{SHOTS}/{a[1]}.png')
elif c=='link': call('POST',f'/session/{s}/execute/sync',{'script':'mobile: deepLink','args':[{'url':a[1],'bundleId':'com.juliusAgency.findWorkers'}]}); print('link')
elif c=='swipe': call('POST',f'/session/{s}/execute/sync',{'script':'mobile: swipe','args':[{'direction':a[1]}]}); print('swiped')
elif c=='activate': call('POST',f'/session/{s}/appium/device/activate_app',{'bundleId':'com.juliusAgency.findWorkers'}); print('active')
elif c=='quit': call('DELETE',f'/session/{s}'); os.remove(SF); print('quit')
if c=='chain':
    e=find('-ios class chain',a[1]); call('POST',f'/session/{s}/element/{e}/click',{}); print('tapped chain')
if c=='typein':  # typein <chain> <text>
    e=find('-ios class chain',a[1]); call('POST',f'/session/{s}/element/{e}/click',{}); call('POST',f'/session/{s}/element/{e}/value',{'text':a[2]}); print('typed in')
if c=='typeactive':
    e=list(call('GET',f'/session/{s}/element/active')['value'].values())[0]
    call('POST',f'/session/{s}/element/{e}/value',{'text':a[1]}); print('typed active')
if c=='keys':
    acts=[]
    for ch in a[1]: acts+= [{'type':'keyDown','value':ch},{'type':'keyUp','value':ch}]
    call('POST',f'/session/{s}/actions',{'actions':[{'type':'key','id':'kb','actions':acts}]}); print('keys sent')
if c=='home': call('POST',f'/session/{s}/execute/sync',{'script':'mobile: pressButton','args':[{'name':'home'}]}); print('home')
if c=='lock': call('POST',f'/session/{s}/appium/device/lock',{}); print('locked')
if c=='terminate': call('POST',f'/session/{s}/appium/device/terminate_app',{'bundleId':'com.juliusAgency.findWorkers'}); print('terminated')
