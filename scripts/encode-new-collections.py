"""Browser-compatible copies; source movies and previous web copies are retained."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess, json, shutil
ROOT=Path(__file__).resolve().parents[1]
FFMPEG=ROOT/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
review=ROOT/'tmp/new-collections'
catalog_path=ROOT/'src/video-catalog.json'
catalog=json.loads(catalog_path.read_text(encoding='utf8'))
items=json.loads((review/'inventory.json').read_text(encoding='utf8'))
fractions={'live-auto':.28,'live-factory-mov':.60,'live-factory-mp4':.40,'vfx-01':.3,'vfx-02':.55,'vfx-03':.55,'vfx-04':.45}
def prepare(item):
    slug=item['id'];out=ROOT/f'public/videos/{slug}.mp4';poster=ROOT/f'public/images/projects/{slug}.jpg'
    subprocess.run([str(FFMPEG),'-y','-loglevel','error','-ss',str(item['duration']*fractions[slug]),'-i',item['source'],'-frames:v','1','-vf','scale=900:-2','-q:v','2',str(poster)],check=True)
    if not out.exists():
        subprocess.run([str(FFMPEG),'-y','-loglevel','error','-i',item['source'],'-map','0:v:0','-map','0:a:0?','-vf',"scale='if(gt(iw,ih),min(1280,iw),min(720,iw))':-2",'-c:v','libx264','-threads','2','-preset','fast','-crf','24','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',str(out)],check=True)
    subprocess.run([str(FFMPEG),'-v','error','-i',str(out),'-f','null','NUL'],check=True)
    result={key:value for key,value in item.items() if key!='source'}
    result.update(video=f'/videos/{slug}.mp4',image=f'/images/projects/{slug}.jpg',webBytes=out.stat().st_size)
    print(f"READY {slug}: {out.stat().st_size}",flush=True)
    return result
with ThreadPoolExecutor(max_workers=2) as pool:
    for result in pool.map(prepare,items):catalog[result['id']]=result
catalog_path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('All seven new clips decoded successfully.',flush=True)
