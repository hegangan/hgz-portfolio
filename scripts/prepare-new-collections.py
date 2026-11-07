"""Prepare resized web assets and sample real video frames. Source files stay intact."""
from pathlib import Path
from PIL import Image, ImageOps
import subprocess, re, json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('D:/AAAAAA个人作品/摄影作品')
OUT=ROOT/'public/images/photography'
OUT.mkdir(parents=True,exist_ok=True)
photos=['2024-11-19 201754.jpg','2024-11-19 201135.jpg','2025-02-09 225953.jpg','2025-02-09 230324.jpg','2024-08-26 161639.jpg','2024-09-01 200033.jpg','2024-08-26 161636.jpg','2024-09-01 195945.jpg','2024-08-26 161632.jpg','2024-09-01 200005.jpg','Testing the GB350 Retro Handheld Game Console.jpg','商品图.png','GB350-4.jpg','GB350-10.jpg']
for i,name in enumerate(photos,1):
    im=ImageOps.exif_transpose(Image.open(SOURCE/name)).convert('RGB')
    im.thumbnail((2200,2600),Image.Resampling.LANCZOS)
    im.save(OUT/f'photo-{i:02}.webp','WEBP',quality=84,method=6)
    print(f'PHOTO {i}: {im.size}',flush=True)
ffmpeg=ROOT/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
review=ROOT/'tmp/new-collections'
review.mkdir(parents=True,exist_ok=True)
names=[('live-auto','车企宣传.mov'),('live-factory-mov','工厂宣传片.mov'),('live-factory-mp4','工厂宣传片.mp4'),('vfx-01','A006C080_260514LF_V1-0254.mp4'),('vfx-02','A006C116_2605146F_V1-0325.mp4'),('vfx-03','A006C254_260514XJ_V1-0206.mp4'),('vfx-04','B005C126_260513OJ_V1-0135-136.mp4')]
inventory=[]
for slug,name in names:
    source=SOURCE/name
    info=subprocess.run([str(ffmpeg),'-hide_banner','-i',str(source)],capture_output=True).stderr.decode('utf8',errors='replace')
    m=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',info)
    duration=int(m[1])*3600+int(m[2])*60+float(m[3])
    line=next(line for line in info.splitlines() if 'Video:' in line)
    width,height=map(int,re.search(r'(\d{2,5})x(\d{2,5})',line).groups())
    subprocess.run([str(ffmpeg),'-y','-loglevel','error','-i',str(source),'-vf',f'fps=6/{duration},scale=320:-2,tile=3x2','-frames:v','1','-q:v','3',str(review/(slug+'.jpg'))],check=True)
    item=dict(id=slug,filename=name,duration=duration,width=width,height=height,bytes=source.stat().st_size,source=str(source))
    inventory.append(item)
    print(json.dumps(item,ensure_ascii=True),flush=True)
(review/'inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf8')
