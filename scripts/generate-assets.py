"""Generate original, code-based concept artwork and a seamless 3D background video.
Run with Python + numpy + Pillow. ffmpeg is supplied by the development dependency.
These are layout concepts, not claims of client work.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np
import math
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'images'
OUT.mkdir(parents=True, exist_ok=True)

def svg_file(name, content, w=1000, h=760):
    (OUT / name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{content}</svg>', encoding='utf-8')

noise = '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".11"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter>'

svg_file('offgrid.svg', f'''<defs>{noise}<linearGradient id="bg" x2="1" y2="1"><stop stop-color="#ece8de"/><stop offset="1" stop-color="#b9b6ae"/></linearGradient><linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff7138"/><stop offset="1" stop-color="#e14b1d"/></linearGradient><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter></defs>
<rect width="1000" height="760" fill="url(#bg)"/>
<g opacity=".18" stroke="#77756e"><path d="M0 510 1000 210M0 650 1000 350M200 760 1000 500"/><path d="m180 0 820 620M0 140l830 620"/></g>
<ellipse cx="555" cy="610" rx="330" ry="55" fill="#31312c" opacity=".30" filter="url(#shadow)"/>
<g transform="translate(137 180) rotate(-11 300 200)">
<path d="M20 40 416 0 624 138 226 184Z" fill="#ff8a53"/>
<path d="m20 40 206 144v300L20 338Z" fill="#b9431d"/>
<path d="m226 184 398-46v295l-398 51Z" fill="url(#orange)"/>
<path d="m100 94 395-45 49 33-396 46Z" fill="#151918"/>
<g transform="matrix(1,-.115,0,1,260,228)" fill="#151918" font-family="Arial,Helvetica,sans-serif" font-weight="900"><text font-size="91" letter-spacing="-7" y="70">OFF/</text><text font-size="91" letter-spacing="-7" y="145">GRID</text><path d="M0 175h322" stroke="#151918" stroke-width="2"/><text y="204" font-size="11" letter-spacing="2">OUTSIDE THE ORDINARY.</text><text y="226" font-size="9" letter-spacing="1">EQUIPMENT FOR YOUR OWN PATH</text><path d="M280 10h30v30m-30 0 30-30" fill="none" stroke="#151918" stroke-width="4"/></g>
<path d="M35 80v230l155 107V191Z" fill="#151918" opacity=".1"/>
<g transform="matrix(.68,.49,0,1,62,150)" fill="#151918" font-family="Arial" font-size="14" letter-spacing="3"><text>GO YOUR</text><text y="23">OWN WAY.</text></g></g>
<text x="66" y="700" fill="#42443c" font-family="Arial" font-size="10" letter-spacing="3">OFF/GRID® — IDENTITY SYSTEM</text><text x="845" y="700" fill="#42443c" font-family="Arial" font-size="10">CONCEPT / 01</text><rect width="1000" height="760" fill="transparent" filter="url(#grain)"/>
''')

leaves = ''
for i in range(26):
    a = i * 137.508 * math.pi / 180
    r = 16 * math.sqrt(i)
    x,y = 500 + math.cos(a)*r, 405 + math.sin(a)*r*.75
    rot = i*137.508
    scale = .62 + i/65
    leaves += f'<g transform="translate({x:.1f} {y:.1f}) rotate({rot:.1f}) scale({scale:.2f})"><path d="M0 0C-175-115-154-296 0-310 154-296 175-115 0 0Z" fill="url(#petal)" stroke="#c6b4f2" stroke-opacity=".32" stroke-width="1.2"/><path d="M0-10V-298" stroke="#e6dbff" stroke-opacity=".32"/></g>'
svg_file('synthetic.svg', f'''<defs>{noise}<radialGradient id="back"><stop stop-color="#3e3859"/><stop offset=".8" stop-color="#171c29"/><stop offset="1" stop-color="#111925"/></radialGradient><linearGradient id="petal" x1="0" y1="0" x2="1" y2=".35"><stop stop-color="#1f3042"/><stop offset=".24" stop-color="#5d6d8d"/><stop offset=".44" stop-color="#c2b4e6"/><stop offset=".56" stop-color="#e2cef6"/><stop offset=".68" stop-color="#716a99"/><stop offset="1" stop-color="#1b2c42"/></linearGradient><radialGradient id="core"><stop stop-color="#eee2ff"/><stop offset=".2" stop-color="#9c86ce"/><stop offset="1" stop-color="#232c48"/></radialGradient></defs><rect width="1000" height="760" fill="url(#back)"/>
<g fill="none" stroke="#9ea9ce" stroke-opacity=".16"><circle cx="500" cy="370" r="277"/><circle cx="500" cy="370" r="294"/><path d="M70 370h860M500 70v610" stroke-dasharray="2 8"/></g><g transform="translate(0 -10)">{leaves}<circle cx="500" cy="405" r="47" fill="url(#core)"/></g>
<g font-family="Arial,Helvetica,sans-serif" fill="#dedbee"><text x="63" y="79" font-size="10" letter-spacing="3">EXPERIMENT NO. 002 / DIGITAL ORGANISM</text><text x="62" y="640" font-size="57" letter-spacing="-2">SYNTHETIC</text><text x="62" y="698" font-size="57" letter-spacing="-2">NATURE.</text><text x="770" y="688" font-size="9" letter-spacing="2">BEYOND BIOLOGY.</text></g><rect width="1000" height="760" fill="transparent" filter="url(#grain)"/>''')

lines = ''
for i in range(76):
    t = i/75
    x = 160 + 680*t
    y = 315 + 90*math.sin(t*math.pi*4)
    length = 65 + 160*math.sin(t*math.pi)**2
    lines += f'<path d="M{x:.1f} {y-length:.1f} Q{x-90:.1f} {y:.1f} {x:.1f} {y+length:.1f}" stroke="url(#line)" stroke-width="3" fill="none"/>'
svg_file('aether.svg', f'''<defs>{noise}<linearGradient id="bg" x2="1" y2="1"><stop stop-color="#c2ff69"/><stop offset="1" stop-color="#8fca44"/></linearGradient><linearGradient id="line" y2="1" x2=".3"><stop stop-color="#122414"/><stop offset=".5" stop-color="#30582a"/><stop offset="1" stop-color="#102914"/></linearGradient></defs><rect width="1000" height="760" fill="url(#bg)"/>
<g stroke="#1e3b22" stroke-opacity=".17" fill="none"><path d="M55 55h890v650H55Z"/><path d="M55 125h890M55 620h890M500 55v650"/></g>
<g>{lines}</g><g fill="#142b1b" font-family="Arial,Helvetica,sans-serif"><text x="76" y="102" font-size="12" letter-spacing="3">A FESTIVAL OF SOUND &amp; SENSE</text><text x="823" y="102" font-size="11">VOL. 003</text><text x="64" y="617" font-weight="700" font-size="148" letter-spacing="-12">AETHER</text><text x="78" y="671" font-size="10" letter-spacing="2">FEEL THE INVISIBLE. / ELECTRONIC MUSIC &amp; VISUAL ARTS</text><path d="M861 650h42v28h-42Z" fill="none" stroke="#142b1b"/><path d="m870 664 10 6 14-15" stroke="#142b1b" fill="none"/></g><rect width="1000" height="760" fill="transparent" filter="url(#grain)"/>''')

svg_file('still.svg', f'''<defs>{noise}<linearGradient id="bg" x2="1" y2="1"><stop stop-color="#d6d0c0"/><stop offset="1" stop-color="#a79e88"/></linearGradient><linearGradient id="bottle"><stop stop-color="#676d4c"/><stop offset=".3" stop-color="#9b9e75"/><stop offset=".55" stop-color="#a8aa83"/><stop offset="1" stop-color="#6d7454"/></linearGradient><linearGradient id="paper"><stop stop-color="#ebe6d8"/><stop offset="1" stop-color="#c9c3af"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="14"/></filter></defs><rect width="1000" height="760" fill="url(#bg)"/>
<path d="M0 580 1000 390v370H0Z" fill="#b8ae97"/><path d="M0 580 1000 390" stroke="#a79b81"/><ellipse cx="518" cy="605" rx="282" ry="38" fill="#413e2e" opacity=".30" filter="url(#shadow)"/>
<g transform="translate(560 190) rotate(8)"><path d="M0 0h148l46 35H46Z" fill="#e3dfd0"/><path d="M46 35h148v343H46Z" fill="url(#paper)"/><path d="M0 0 46 35v343L0 343Z" fill="#b5b19e"/><g fill="#4a5140" font-family="Georgia,serif"><text x="65" y="110" font-size="43" letter-spacing="-2">still.</text><path d="M66 133h105" stroke="#888d74"/><text x="65" y="163" font-family="Arial" font-size="7" letter-spacing="1.3">A MOMENT FOR YOU.</text><text x="65" y="296" font-family="Arial" font-size="7" letter-spacing="1">DAILY ESSENTIALS</text><text x="65" y="316" font-family="Arial" font-size="6">NATURALLY CONSIDERED.</text></g></g>
<g transform="translate(270 132) rotate(-7 100 250)"><rect x="55" y="0" width="85" height="81" rx="7" fill="#30382d"/><path d="M55 60h85v35c58 8 74 48 74 76v275c0 27-19 40-43 40H28c-24 0-40-13-40-40V171c0-28 16-68 67-76Z" fill="url(#bottle)"/><path d="M15 180h180v228H15Z" fill="#e4dfcd"/><g fill="#424e37" font-family="Georgia,serif"><text x="38" y="251" font-size="65" letter-spacing="-3">still.</text><text x="39" y="280" font-family="Arial" font-size="7" letter-spacing="1.5">SLOW DOWN. FEEL MORE.</text><path d="M40 310h126" stroke="#a2a48b"/><text x="40" y="338" font-family="Arial" font-size="9">01 / BODY WASH</text><text x="40" y="355" font-family="Arial" font-size="7">CEDARWOOD + SAGE</text><text x="40" y="387" font-family="Arial" font-size="7">300 mL / 10.1 FL.OZ.</text></g><path d="M17 150c-11 30-13 150-6 277" stroke="#d2d7aa" stroke-opacity=".23" stroke-width="8" fill="none"/></g>
<text x="65" y="705" font-family="Arial" fill="#50503f" font-size="10" letter-spacing="2">STILL. — EVERYDAY RITUALS, RECONSIDERED.</text><rect width="1000" height="760" fill="transparent" filter="url(#grain)"/>''')

svg_file('portrait.svg', '''<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#323a45"/><stop offset=".65" stop-color="#1b2028"/><stop offset="1" stop-color="#303e50"/></linearGradient><linearGradient id="body" x2="1" y2=".3"><stop stop-color="#11151b"/><stop offset=".65" stop-color="#242d38"/><stop offset="1" stop-color="#7b8c9f"/></linearGradient><radialGradient id="head" cx=".8" cy=".3"><stop stop-color="#a4acb5"/><stop offset=".5" stop-color="#66717e"/><stop offset=".9" stop-color="#2a333f"/><stop offset="1" stop-color="#1a2029"/></radialGradient><linearGradient id="mist" y2="1" x2="0"><stop stop-color="#11151a" stop-opacity="0"/><stop offset="1" stop-color="#11151a" stop-opacity=".85"/></linearGradient><filter id="grain"><feTurbulence baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".07"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter><filter id="blur"><feGaussianBlur stdDeviation="12"/></filter></defs>
<rect width="640" height="760" fill="url(#bg)"/><circle cx="480" cy="260" r="210" fill="none" stroke="#93a1b7" stroke-opacity=".15"/><path d="M470 0v760M0 490h640" stroke="#9aabc0" stroke-opacity=".08"/>
<g filter="url(#blur)" opacity=".4"><ellipse cx="430" cy="310" rx="130" ry="210" fill="#9ba6b7"/></g>
<path d="M80 760v-75c0-101 52-159 136-179l62-29 120 1 55 26c107 29 145 88 145 181v75Z" fill="url(#body)"/>
<path d="m275 426-10 74 67 51 68-51-12-84Z" fill="#414d5b"/><path d="M237 270c-11-71 39-118 100-115 75 3 117 57 103 131l-10 85c-5 36-39 91-84 95-49 1-87-49-94-88Z" fill="url(#head)"/>
<path d="M236 284c-17-48-9-97 18-127 36-43 108-51 157-6 28 27 42 70 30 123l-17-49c-43 16-75 11-113-2-15 33-36 44-67 48Z" fill="#161c24"/>
<path d="m263 503 69 48 66-48 18 257H248Z" fill="#141a23"/><path d="M80 630h530v130H80Z" fill="url(#mist)"/><rect width="640" height="760" fill="transparent" filter="url(#grain)"/>
''', 640, 760)

# A ribbed toroidal sculpture: procedural geometry, depth-sorted surfaces and
# a reflection model. Loop angle follows sine/cosine so endpoints match.
U,V=320,64
u=(np.arange(U)+.5)*2*np.pi/U
v=(np.arange(V)+.5)*2*np.pi/V
uu,vv=np.meshgrid(u,v,indexing='ij')
minor=.69*(1+.035*np.cos(uu*80))
base=np.stack([(2+minor*np.cos(vv))*np.cos(uu), (2+minor*np.cos(vv))*np.sin(uu), minor*np.sin(vv)],axis=-1)
normals=np.stack([np.cos(vv)*np.cos(uu),np.cos(vv)*np.sin(uu),np.sin(vv)],axis=-1)
quads=np.stack([np.arange(U*V).reshape(U,V),np.roll(np.arange(U*V).reshape(U,V),-1,0),np.roll(np.roll(np.arange(U*V).reshape(U,V),-1,0),-1,1),np.roll(np.arange(U*V).reshape(U,V),-1,1)],axis=-1).reshape(-1,4)
stripe=(.64+.36*np.cos(uu*80)**8).reshape(-1,1)

def frame(phase, width=1200, height=1080):
    ax=.95+.07*math.sin(phase)
    ay=-.30+.10*math.cos(phase)
    az=-.58+.025*math.sin(phase)
    rx=np.array([[1,0,0],[0,math.cos(ax),-math.sin(ax)],[0,math.sin(ax),math.cos(ax)]])
    ry=np.array([[math.cos(ay),0,math.sin(ay)],[0,1,0],[-math.sin(ay),0,math.cos(ay)]])
    rz=np.array([[math.cos(az),-math.sin(az),0],[math.sin(az),math.cos(az),0],[0,0,1]])
    rot=rz@ry@rx
    pts=base.reshape(-1,3)@rot.T
    n=normals.reshape(-1,3)@rot.T
    reflect=2*n[:,2,None]*n-np.array([0,0,1])
    band=np.exp(-((reflect[:,1]+.25)/.20)**2)
    band2=np.exp(-((reflect[:,0]-.7)/.17)**2)
    diffuse=np.clip(n@np.array([-.5,-.7,.8]),0,1)
    intensity=18+38*diffuse+168*band+88*band2
    colors=np.clip(intensity[:,None]*np.array([.90,.96,1.06])*stripe+np.clip(-n[:,0:1],0,1)*np.array([0,3,9]),0,255).astype(np.uint8)
    persp=7.8/(7.8-pts[:,2])
    scale=min(width,height)*.154
    p=np.stack([width*.5+pts[:,0]*persp*scale,height*.5-pts[:,1]*persp*scale],axis=1)
    depths=pts[quads,2].mean(axis=1)
    order=np.argsort(depths)
    image=Image.new('RGB',(width,height),(16,17,19))
    draw=ImageDraw.Draw(image)
    for idx in order:
        q=quads[idx]
        c=tuple(colors[q].mean(axis=0).astype(np.uint8))
        draw.polygon([tuple(pt) for pt in p[q]],fill=c)
    return image

poster=frame(0,1600,1440)
poster.save(OUT/'hero-poster.jpg',quality=95)
print('Concept artwork and hero poster generated.',flush=True)
ffmpeg=ROOT/'node_modules'/'@ffmpeg-installer'/'win32-x64'/'ffmpeg.exe'
if ffmpeg.exists():
    width,height,fps,count=1000,900,24,144
    cmd=[str(ffmpeg),'-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{width}x{height}','-r',str(fps),'-i','-','-an','-vcodec','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'orbit.mp4')]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    for i in range(count):
        proc.stdin.write(frame(i/count*2*math.pi,width,height).tobytes())
        if i%36==0: print(f'Video frames {i}/{count}',flush=True)
    proc.stdin.close()
    err=proc.stderr.read().decode(errors='replace')
    if proc.wait()!=0: raise RuntimeError(err)
    print('Seamless background video generated.',flush=True)
else:
    raise RuntimeError('Install development dependencies to generate the video.')
