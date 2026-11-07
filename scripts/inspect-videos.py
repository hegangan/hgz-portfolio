from pathlib import Path
import subprocess, re, json, sys
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(r'D:\个人作品')
OUT=ROOT/'tmp'/'video-review'
OUT.mkdir(parents=True,exist_ok=True)
FFMPEG=ROOT/'node_modules'/'@ffmpeg-installer'/'win32-x64'/'ffmpeg.exe'
FILES=[
 ('showreel','个人能力展示.mp4'),
 ('aviation','东航2.2 宠物进舱服务2.0.mp4'),
 ('konfu','康夫吹风机无水印.mp4'),
 ('translator','音诺AI翻译器广告.mp4'),
 ('wedding-promo','婚礼宣传片.mp4'),
 ('wedding-lifetimes','AI婚礼片 前世今生.mp4'),
 ('ink-cg','水墨CG.mp4'),
 ('toy-cg','玩偶公仔产品CG.mp4'),
 ('toy-showroom','玩偶公仔展厅宣传.mp4'),
 ('mother','《阿尔兹海默症母亲》4K60带水印.mp4'),
 ('photograph','《照片》原视频.mp4'),
 ('catzilla','AAAA最终成片猫斯拉多多~.mp4'),
 ('music-video','MV.mp4'),
]
records=[]
font=ImageFont.truetype(r'C:\Windows\Fonts\msyh.ttc',18)
small=ImageFont.truetype(r'C:\Windows\Fonts\msyh.ttc',13)
rows=[]
for slug,filename in FILES:
 path=SOURCE/filename
 info=subprocess.run([str(FFMPEG),'-hide_banner','-i',str(path)],capture_output=True).stderr.decode('utf-8',errors='replace')
 m=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',info)
 duration=int(m[1])*3600+int(m[2])*60+float(m[3])
 dims=re.search(r'Video:.*? (\d{2,5})x(\d{2,5})',info)
 width,height=map(int,dims.groups())
 fps=re.search(r'(\d+(?:\.\d+)?) fps',info)
 rec=dict(id=slug,filename=filename,duration=duration,width=width,height=height,fps=float(fps[1]) if fps else 25,bytes=path.stat().st_size)
 records.append(rec)
 row=Image.new('RGB',(1440,260),'#13171d')
 d=ImageDraw.Draw(row)
 d.text((14,7),f'{slug} / {filename}  |  {width}×{height}  {duration:.1f}s',font=font,fill='#e2e9f4')
 for j,fraction in enumerate([.12,.35,.60,.83]):
  dst=OUT/f'{slug}-{j}.jpg'
  subprocess.run([str(FFMPEG),'-y','-loglevel','error','-ss',str(duration*fraction),'-i',str(path),'-frames:v','1','-vf','scale=350:196:force_original_aspect_ratio=decrease,pad=350:196:(ow-iw)/2:(oh-ih)/2','-q:v','3',str(dst)],check=True)
  row.paste(Image.open(dst),(j*360+5,40))
  d.text((j*360+12,239),f'{duration*fraction:.1f}s',font=small,fill='#8d9caf')
 rows.append(row)
 print(json.dumps(rec,ensure_ascii=False),flush=True)
for k in range(0,len(rows),4):
 sheet=Image.new('RGB',(1440,260*len(rows[k:k+4])),'#13171d')
 for j,row in enumerate(rows[k:k+4]):sheet.paste(row,(0,j*260))
 sheet.save(OUT/f'review-{k//4+1}.jpg',quality=94)
(OUT/'inventory.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print('Review sheets ready.',flush=True)
