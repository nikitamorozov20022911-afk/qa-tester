import sys,os
from PIL import Image,ImageDraw
d=sys.argv[1]; t0=int(sys.argv[2]); out=sys.argv[3]; step=int(sys.argv[4]) if len(sys.argv)>4 else 1
fs=sorted(os.listdir(d))[::step]
cols=8; w,h=150,326
rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(cols*w,rows*h),'white')
for i,f in enumerate(fs):
    im=Image.open(f'{d}/{f}').convert('RGB').resize((w,h))
    dr=ImageDraw.Draw(im); dr.text((4,4),f"{(int(f[:-4])-t0)/1000:.1f}s",fill=(255,255,0))
    S.paste(im,((i%cols)*w,(i//cols)*h))
S.save(out)
