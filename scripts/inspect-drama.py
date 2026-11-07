"""Inspect the four supplied episodes and sample their original frames for poster selection."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess, re, json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('D:/AAAAAA个人作品')
FFMPEG = ROOT/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
OUT = ROOT/'tmp/drama-review'
OUT.mkdir(parents=True, exist_ok=True)

def inspect(number):
    source = SOURCE/f'EP{number:02}.mp4'
    info = subprocess.run([str(FFMPEG), '-hide_banner', '-i', str(source)], capture_output=True).stderr.decode('utf-8', errors='replace')
    match = re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)', info)
    if not match: raise RuntimeError(info)
    duration = int(match[1])*3600+int(match[2])*60+float(match[3])
    video_line = next(line for line in info.splitlines() if 'Video:' in line)
    width, height = map(int, re.search(r'(\d{2,5})x(\d{2,5})', video_line).groups())
    record = dict(id=f'drama-ep{number:02}', filename=source.name, duration=duration, width=width, height=height, bytes=source.stat().st_size, videoInfo=video_line.strip())
    subprocess.run([str(FFMPEG), '-y', '-loglevel', 'error', '-threads', '2', '-i', str(source), '-vf', f'fps=10/{duration},scale=320:-2,tile=5x2', '-frames:v', '1', '-q:v', '3', str(OUT/f'EP{number:02}-sheet.jpg')], check=True)
    print(json.dumps(record), flush=True)
    return record

with ThreadPoolExecutor(max_workers=2) as pool:
    records = list(pool.map(inspect, range(1,5)))
(OUT/'inventory.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
