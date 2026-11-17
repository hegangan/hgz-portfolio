"""Build cacheable HLS files without byte-range dependency; preserve full MP4s."""
from pathlib import Path
import subprocess,json,re,concurrent.futures,hashlib
ROOT=Path(__file__).resolve().parents[1]
FFMPEG=ROOT/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
CATALOG=json.loads((ROOT/'src/video-catalog.json').read_text(encoding='utf-8'))
OUT=ROOT/'public/streams/v1'
def build(pair):
    slug,item=pair;source=ROOT/'public'/item['video'].lstrip('/')
    fingerprint=hashlib.sha256(source.read_bytes()).hexdigest()
    target=OUT/slug/fingerprint[:12];target.mkdir(parents=True,exist_ok=True)
    info=subprocess.run([str(FFMPEG),'-hide_banner','-i',str(source)],capture_output=True).stderr.decode('utf-8','replace')
    size=re.search(r'Video:.*? (\d{2,5})x(\d{2,5})',info)
    if not size:raise ValueError('Missing video dimensions '+slug)
    width,height=map(int,size.groups())
    assert 'h264' in info and 'Audio: aac' in info,slug+' needs supported H264/AAC'
    stamp=target/'source.sha256'
    if not stamp.exists() or stamp.read_text()!=fingerprint:
        for level in ['low','high']:
            folder=target/level;folder.mkdir(exist_ok=True)
            options=['-map','0:v:0','-map','0:a:0']
            if level=='low':
                scale='scale=-2:360:flags=lanczos,setsar=1,fps=24' if width>=height else 'scale=360:-2:flags=lanczos,setsar=1,fps=24'
                options+=['-vf',scale,'-c:v','libx264','-threads','2','-preset','fast','-crf','27','-maxrate','500k','-bufsize','1000k','-g','96','-keyint_min','96','-sc_threshold','0','-pix_fmt','yuv420p','-c:a','aac','-b:a','64k','-ac','2']
            else:options+=['-c','copy']
            args=[str(FFMPEG),'-y','-hide_banner','-loglevel','error','-i',str(source)]+options+['-f','hls','-hls_time','4','-hls_playlist_type','vod','-hls_segment_type','fmp4','-hls_fmp4_init_filename','init.mp4','-hls_flags','independent_segments','-hls_segment_filename','seg-%03d.m4s','index.m3u8']
            subprocess.run(args,check=True,cwd=folder)
        stamp.write_text(fingerprint)
    levels=[]
    for level in ['low','high']:
        folder=target/level;playlist=(folder/'index.m3u8').read_text();durations=[float(s) for s in re.findall(r'#EXTINF:([\d.]+)',playlist)];segments=sorted(folder.glob('*.m4s'))
        assert len(segments)==len(durations)
        peak=max(p.stat().st_size*8/d for p,d in zip(segments,durations))
        levels.append((level,int(peak*1.1),sum(p.stat().st_size for p in segments),max(p.stat().st_size for p in segments),sum(durations)))
    master='#EXTM3U\n#EXT-X-VERSION:7\n'+''.join(f'#EXT-X-STREAM-INF:BANDWIDTH={bandwidth}\n{level}/index.m3u8\n' for level,bandwidth,*_ in levels)
    # Keep quality ordering stable even for very short, already highly-compressed
    # source clips where a transcode's final partial fragment has higher overhead.
    if levels[1][1]<=levels[0][1]:
        master='#EXTM3U\n#EXT-X-VERSION:7\n'+f'#EXT-X-STREAM-INF:BANDWIDTH={levels[0][1]}\nlow/index.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH={levels[0][1]+10000}\nhigh/index.m3u8\n'
    (target/'master.m3u8').write_text(master)
    print(slug+' ready',flush=True)
    return slug,{'manifest':f'/streams/v1/{slug}/{fingerprint[:12]}/master.m3u8','sourceSHA256':fingerprint,'levels':[{'name':s[0],'peakBandwidth':s[1],'bytes':s[2],'largestSegment':s[3],'duration':s[4]} for s in levels]}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=dict(pool.map(build,CATALOG.items()))
(ROOT/'src/streaming-catalog.json').write_text(json.dumps(results,indent=2)+'\n')
print('Prepared '+str(len(results))+' complete films.')
