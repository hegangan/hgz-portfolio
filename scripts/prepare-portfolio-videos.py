"""Create browser-friendly local copies and real-frame posters; originals stay untouched."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import subprocess, json, sys, time

sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(r'D:\个人作品')
FFMPEG=ROOT/'node_modules'/'@ffmpeg-installer'/'win32-x64'/'ffmpeg.exe'
OUT=ROOT/'public'/'videos'
POSTERS=ROOT/'public'/'images'/'projects'
OUT.mkdir(parents=True,exist_ok=True)
POSTERS.mkdir(parents=True,exist_ok=True)
records=json.loads((ROOT/'tmp'/'video-review'/'inventory.json').read_text(encoding='utf-8'))
times={'showreel':182,'aviation':52.7,'konfu':22.2,'translator':33.1,'wedding-promo':14.2,'wedding-lifetimes':58.3,'ink-cg':17,'toy-cg':35.3,'toy-showroom':19.3,'mother':120.4,'photograph':70.6,'catzilla':91.3,'music-video':21.9}

def prepare(rec):
    slug=rec['id']
    source=SOURCE/rec['filename']
    poster=POSTERS/f'{slug}.jpg'
    video=OUT/f'{slug}.mp4'
    subprocess.run([str(FFMPEG),'-y','-loglevel','error','-ss',str(times[slug]),'-i',str(source),'-frames:v','1','-vf','scale=1280:-2','-q:v','3',str(poster)],check=True)
    if not video.exists():
        temp=OUT/f'{slug}.partial.mp4'
        command=[str(FFMPEG),'-y','-loglevel','error','-threads','2','-i',str(source),'-map','0:v:0','-map','0:a:0?','-vf','scale=1280:-2:flags=lanczos,fps=30','-c:v','libx264','-threads','2','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(temp)]
        subprocess.run(command,check=True)
        temp.replace(video)
    result=dict(rec,video=f'/videos/{slug}.mp4',image=f'/images/projects/{slug}.jpg',webBytes=video.stat().st_size)
    print(f"READY {slug}: {result['webBytes']/1024/1024:.1f} MB",flush=True)
    return result

# Posters and catalog are available immediately while video encoding continues.
catalog={rec['id']:dict(rec,video=f"/videos/{rec['id']}.mp4",image=f"/images/projects/{rec['id']}.jpg") for rec in records}
(ROOT/'src'/'video-catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
with ThreadPoolExecutor(max_workers=2) as pool:
    futures={pool.submit(prepare,rec):rec['id'] for rec in records}
    for task in as_completed(futures):
        item=task.result()
        catalog[item['id']]=item
(ROOT/'src'/'video-catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
print('All 13 web videos and posters are ready.',flush=True)
