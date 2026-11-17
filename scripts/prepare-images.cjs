const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require(process.env.PORTFOLIO_SHARP_PATH||'sharp');
const root=path.resolve(__dirname,'..');
(async()=>{const posters=JSON.parse(await fs.readFile(root+'/src/poster-assets.json','utf8'));const dir=root+'/public/images/optimized';await fs.mkdir(dir,{recursive:true});const manifest={};
 const entries=Object.entries(posters).map(([id,a])=>[id,a.src]);
 for(let i=1;i<=14;i++)entries.push(['photo-'+String(i).padStart(2,'0'),'/images/photography/photo-'+String(i).padStart(2,'0')+'.webp']);
 for(const id of ['changzhi','fearless','just-do-it','tea-culture','jbl-editorial','digital-era'])entries.push(['graphic-'+id,'/images/graphic-posters/'+id+'.webp']);
 for(const [id,url] of entries){const input=await fs.readFile(root+'/public'+url);const hash=crypto.createHash('sha256').update(input).digest('hex').slice(0,10);const item={};
  for(const width of [240,480]){const filename=`${id}-${hash}-${width}.webp`;await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:80,effort:6}).toFile(dir+'/'+filename);item[width]='/images/optimized/'+filename}
  manifest[id]=item;
 }
 for(const [id,file,width,quality] of [['hero','he-ganzhong-hero-cutout.png',1000,88],['portrait','he-ganzhong-formal.jpg',720,86],['wechat','contact/wechat-qr.png',630,100]]){
  const input=await fs.readFile(root+'/public/images/'+file),hash=crypto.createHash('sha256').update(input).digest('hex').slice(0,10),name=`${id}-${hash}.webp`;
  await sharp(input).resize({width,withoutEnlargement:true}).webp(id==='wechat'?{lossless:true,effort:6}:{quality,effort:6}).toFile(dir+'/'+name);manifest[id]={src:'/images/optimized/'+name};
 }
 await fs.writeFile(root+'/src/optimized-images.json',JSON.stringify(manifest,null,2)+'\n');console.log('Prepared '+Object.keys(manifest).length+' optimized images.');
})();
