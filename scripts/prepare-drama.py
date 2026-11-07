"""Create compatible web videos and original-frame posters; merge only the new catalog entries."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess, json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('D:/AAAAAA个人作品')
FFMPEG = ROOT/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
records = json.loads((ROOT/'tmp/drama-review/inventory.json').read_text(encoding='utf-8'))
poster_fractions = [.25, .75, .25, .15]

def prepare(item):
    slug = item['id']
    source = SOURCE/item['filename']
    video = ROOT/f'public/videos/{slug}.mp4'
    poster = ROOT/f'public/images/projects/{slug}.jpg'
    number = int(slug[-2:])
    subprocess.run([str(FFMPEG), '-y', '-loglevel', 'error', '-ss', str(item['duration']*poster_fractions[number-1]), '-i', str(source), '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '2', str(poster)], check=True)
    if not video.exists():
        temp = video.with_suffix('.partial.mp4')
        subprocess.run([str(FFMPEG), '-y', '-loglevel', 'error', '-threads', '2', '-i', str(source), '-map', '0:v:0', '-map', '0:a:0?', '-vf', 'scale=720:-2:flags=lanczos', '-c:v', 'libx264', '-threads', '2', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(temp)], check=True)
        temp.replace(video)
    result = {**item, 'video':f'/videos/{slug}.mp4', 'image':f'/images/projects/{slug}.jpg', 'webBytes':video.stat().st_size}
    print(f"READY {slug}: {result['webBytes']/1024/1024:.1f} MB", flush=True)
    return result

with ThreadPoolExecutor(max_workers=2) as pool:
    prepared = list(pool.map(prepare, records))
catalog_path = ROOT/'src/video-catalog.json'
catalog = json.loads(catalog_path.read_text(encoding='utf-8'))
catalog.update({item['id']:item for item in prepared})
catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding='utf-8')
print('Added four episodes. Existing catalog entries preserved.', flush=True)
