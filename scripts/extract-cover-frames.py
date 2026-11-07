"""Extract the art-directed selections after reviewing twelve candidates per film."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,subprocess
ROOT=Path(__file__).resolve().parents[1]
FFMPEG=ROOT/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
designs=json.loads((ROOT/'src/poster-designs.json').read_text(encoding='utf8'))
catalog=json.loads((ROOT/'src/video-catalog.json').read_text(encoding='utf8'))
times={item['id']:item['times'] for item in json.loads((ROOT/'tmp/poster-frame-review/times.json').read_text(encoding='utf8'))}
out=ROOT/'public/images/cover-frames'
out.mkdir(parents=True,exist_ok=True)
def extract(pair):
    slug,design=pair;data=catalog[slug]
    second=design.get('time',91.3 if slug=='catzilla' else times[slug][design['reviewFrame']-1])
    filename=data['filename']
    candidates=[Path('D:/个人作品')/filename,Path('D:/AAAAAA个人作品')/filename,Path('D:/AAAAAA个人作品/摄影作品')/filename]
    source=next((p for p in candidates if p.exists()),ROOT/('public'+data['video']))
    subprocess.run([str(FFMPEG),'-y','-loglevel','error','-threads','2','-ss',str(second),'-i',str(source),'-frames:v','1','-vf',"scale='if(gt(iw,ih),min(1200,iw),min(720,iw))':-2",'-q:v','4',str(out/(slug+'.jpg'))],check=True)
    record={'id':slug,'time':second,'source':str(source),'reviewFrame':design['reviewFrame'],'reason':design['selectionReason']}
    print(f'{slug}: {second:.2f}s',flush=True)
    return record
with ThreadPoolExecutor(max_workers=3) as pool:records=list(pool.map(extract,designs.items()))
(ROOT/'docs/cover-frame-selections.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Selected frames ready. Total bytes: '+str(sum(p.stat().st_size for p in out.glob('*.jpg'))),flush=True)
