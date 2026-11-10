import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),dist=path.join(root,'dist');
const raw=process.env.PAGES_BASE_PATH||'/';
const base=raw==='/'?'/':'/'+raw.replace(/^\/+|\/+$/g,'')+'/';
const html=await fs.readFile(path.join(dist,'index.html'),'utf8');
assert(!html.includes('127.0.0.1')&&!html.includes('localhost'),'Local preview address leaked into the published entry');
assert(!html.includes('clean-tide-2939.chatgpt.site'),'Old canonical host must not be published');
const urls=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(s=>s.startsWith(base)&&!s.startsWith('https:'));
for(const url of urls){const file=path.join(dist,decodeURI(url.slice(base.length)));assert((await fs.stat(file)).isFile(),'Missing entry asset '+url);}
let count=0,total=0,largest=0;
async function walk(folder){for(const entry of await fs.readdir(folder,{withFileTypes:true})){const file=path.join(folder,entry.name);if(entry.isDirectory())await walk(file);else{const stat=await fs.stat(file);count++;total+=stat.size;largest=Math.max(largest,stat.size);assert(stat.size<=25*1024*1024,'File exceeds Cloudflare Pages asset limit: '+file);}}}
await walk(dist);assert(total<1024*1024*1024,'Published site exceeds 1 GiB');
const catalog=JSON.parse(await fs.readFile(path.join(root,'src/video-catalog.json'),'utf8'));
const posters=JSON.parse(await fs.readFile(path.join(root,'src/poster-assets.json'),'utf8'));
for(const [id,item] of Object.entries(catalog)){for(const url of [item.video,item.image,posters[id]?.src].filter(Boolean)){assert((await fs.stat(path.join(dist,url.replace(/^\//,'')))).isFile(),'Missing work asset '+url);}}
assert(Object.keys(catalog).length===30,'All 30 films must remain available');
console.log(JSON.stringify({base,films:Object.keys(catalog).length,files:count,totalMiB:+(total/1048576).toFixed(2),largestMiB:+(largest/1048576).toFixed(2),entryAssets:urls.length}));
