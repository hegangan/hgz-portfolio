import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=process.cwd(),dist=path.join(root,'dist');
const read=async file=>JSON.parse(await fs.readFile(path.join(root,'src',file),'utf8'));
const [catalog,streams,images,posters]=await Promise.all(['video-catalog.json','streaming-catalog.json','optimized-images.json','poster-assets.json'].map(read));
let largestLow=0,segments=0;
for(const [id,film] of Object.entries(catalog)){
  assert(streams[id],'Missing adaptive video for '+id);
  assert.equal(createHash('sha256').update(await fs.readFile(path.join(dist,film.video))).digest('hex'),streams[id].sourceSHA256,'Streaming source changed: '+id);
  const coverHash=createHash('sha256').update(await fs.readFile(path.join(dist,posters[id].src))).digest('hex').slice(0,10);
  const master=path.join(dist,streams[id].manifest);
  assert((await fs.stat(master)).isFile(),'Missing master '+id);
  for(const level of ['low','high']){
    const directory=path.join(path.dirname(master),level),playlist=await fs.readFile(path.join(directory,'index.m3u8'),'utf8');
    assert(playlist.includes('#EXT-X-ENDLIST'),'Incomplete video '+id);
    assert(!playlist.includes('D:')&&!playlist.includes('127.0.0.1'),'Local path leaked into playlist');
    assert((await fs.stat(path.join(directory,'init.mp4'))).size>0,'Missing initialization '+id);
    const listed=playlist.split(/\r?\n/).filter(line=>line&&!line.startsWith('#'));
    const duration=[...playlist.matchAll(/#EXTINF:([\d.]+)/g)].reduce((sum,m)=>sum+Number(m[1]),0);
    assert(Math.abs(duration-film.duration)<.5,'Truncated film '+id+' '+level);
    for(const file of listed){const size=(await fs.stat(path.join(directory,file))).size;segments++;if(level==='low'){largestLow=Math.max(largestLow,size);assert(size<850*1024,'Oversized weak-network segment '+id)}}
  }
  for(const width of [240,480]){
    assert(images[id]?.[width],'Missing responsive cover '+id);
    assert(images[id][width].includes(coverHash),'Cover thumbnails are stale: '+id);
    const size=(await fs.stat(path.join(dist,images[id][width]))).size;
    assert(size<(width===240?60:180)*1024,'Cover exceeds performance budget '+id);
  }
}
assert((await fs.stat(path.join(dist,images.hero.src))).size<350*1024,'Hero portrait exceeds initial load budget');
const hero=await fs.readFile(path.join(root,'src/StudioHero.jsx'),'utf8');assert(!hero.includes('<video'),'Background video must not return to initial load');
const html=await fs.readFile(path.join(dist,'index.html'),'utf8');assert(html.includes('startup-recovery'),'Missing readable startup fallback');
console.log(JSON.stringify({adaptiveFilms:Object.keys(streams).length,segments,largestLowKiB:Math.round(largestLow/1024),responsiveCovers:Object.keys(catalog).length}));
