"""Fit complete web playback copies within the static host's 25 MiB limit."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, shutil, subprocess

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = ROOT / 'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
BACKUP = ROOT / 'tmp/before-public-release/videos'
BACKUP.mkdir(parents=True, exist_ok=True)
catalog_path = ROOT / 'src/video-catalog.json'
catalog = json.loads(catalog_path.read_text(encoding='utf-8'))
TARGET_MIB = {'catzilla': 15, 'music-video': 15, 'wedding-promo': 13, 'wedding-lifetimes': 14}

def prepare(video):
    backup = BACKUP / video.name
    if not backup.exists():
        shutil.copy2(video, backup)
    duration = catalog[video.stem]['duration']
    bitrate = max(300, int(TARGET_MIB.get(video.stem, 23) * 1024 * 1024 * 8 / duration / 1000) - 112)
    output = ROOT / 'tmp' / (video.stem + '-public.mp4')
    log = ROOT / 'tmp' / (video.stem + '-public-pass')
    common = [str(FFMPEG), '-hide_banner', '-loglevel', 'error', '-y', '-i', str(backup), '-map', '0:v:0', '-c:v', 'libx264', '-threads', '2', '-preset', 'fast', '-b:v', str(bitrate)+'k', '-pix_fmt', 'yuv420p', '-passlogfile', str(log)]
    subprocess.run(common + ['-pass', '1', '-an', '-f', 'null', 'NUL'], check=True)
    subprocess.run(common + ['-pass', '2', '-map', '0:a:0?', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', str(output)], check=True)
    if output.stat().st_size >= 25 * 1024 * 1024:
        raise RuntimeError('Oversized: ' + video.name)
    subprocess.run([str(FFMPEG), '-v', 'error', '-i', str(output), '-f', 'null', 'NUL'], check=True)
    shutil.copy2(output, video)
    print(f'{video.name}: {video.stat().st_size} bytes, complete playback verified', flush=True)
    return video.stem, video.stat().st_size

videos = [p for p in (ROOT/'public/videos').glob('*.mp4') if p.stem in TARGET_MIB]
with ThreadPoolExecutor(max_workers=2) as pool:
    for slug, size in pool.map(prepare, videos):
        catalog[slug]['webBytes'] = size
catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print('Public assets ready.', flush=True)
