"""Twelve evenly distributed original-content frames per video for cover art review."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,subprocess
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tmp/poster-frame-review'
OUT.mkdir(parents=True,exist_ok=True)
FFMPEG=ROOT/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
catalog=json.loads((ROOT/'src/video-catalog.json').read_text(encoding='utf8'))
def review(item):
    slug,data=item
    output=OUT/(slug+'.jpg')
    if not output.exists():
        subprocess.run([str(FFMPEG),'-y','-loglevel','error','-threads','2','-i',str(ROOT/('public'+data['video'])),'-vf',f"fps=12/{data['duration']},scale=240:-2,tile=4x3",'-frames:v','1','-q:v','2',str(output)],check=True)
    print(slug,flush=True)
    return {'id':slug,'duration':data['duration'],'times':[round(data['duration']*(2*i+1)/24,3) for i in range(12)]}
with ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(review,catalog.items()))
(OUT/'times.json').write_text(json.dumps(results,indent=2),encoding='utf8')
