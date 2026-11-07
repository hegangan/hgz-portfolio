"""Bounded web-only transcodes to fit a complete public portfolio release."""
from pathlib import Path
from PIL import Image, ImageOps
from concurrent.futures import ThreadPoolExecutor
import json, subprocess, shutil
ROOT=Path(__file__).resolve().parents[1]
FFMPEG=ROOT/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
BACKUP=ROOT/'tmp/before-photo-release'
BACKUP.mkdir(exist_ok=True,parents=True)
portrait=ROOT/'public/images/he-ganzhong-formal.jpg'
if not (BACKUP/portrait.name).exists():shutil.copy2(portrait,BACKUP/portrait.name)
im=ImageOps.exif_transpose(Image.open(BACKUP/portrait.name)).convert('RGB')
im.thumbnail((1800,2200),Image.Resampling.LANCZOS)
im.save(portrait,quality=88,optimize=True)
catalog_path=ROOT/'src/video-catalog.json'
catalog=json.loads(catalog_path.read_text(encoding='utf8'))
targets={'live-auto':5,'live-factory-mov':5,'live-factory-mp4':5,'ink-cg':6,'toy-cg':6,'toy-showroom':6}
def encode(pair):
    slug,target=pair;video=ROOT/f'public/videos/{slug}.mp4';source=BACKUP/video.name
    if not source.exists():shutil.copy2(video,source)
    bitrate=max(300,int(target*1024*1024*8/catalog[slug]['duration']/1000)-112)
    output=BACKUP/(slug+'-fitted.mp4');log=BACKUP/(slug+'-pass')
    args=[str(FFMPEG),'-y','-loglevel','error','-i',str(source),'-map','0:v:0','-vf',"scale='if(gt(iw,ih),min(1280,iw),min(720,iw))':-2",'-c:v','libx264','-threads','2','-preset','fast','-b:v',str(bitrate)+'k','-pix_fmt','yuv420p','-passlogfile',str(log)]
    subprocess.run(args+['-pass','1','-an','-f','null','NUL'],check=True)
    subprocess.run(args+['-pass','2','-map','0:a:0?','-c:a','aac','-b:a','96k','-movflags','+faststart',str(output)],check=True)
    subprocess.run([str(FFMPEG),'-v','error','-i',str(output),'-f','null','NUL'],check=True)
    shutil.copy2(output,video)
    print(f'VERIFIED {slug}: {video.stat().st_size}',flush=True)
    return slug,video.stat().st_size
with ThreadPoolExecutor(max_workers=2) as pool:
    for slug,size in pool.map(encode,targets.items()):catalog[slug]['webBytes']=size
catalog_path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('TOTAL PUBLIC BYTES',sum(p.stat().st_size for p in (ROOT/'public').rglob('*') if p.is_file()),flush=True)
