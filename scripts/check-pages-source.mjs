import {createServer} from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const raw=process.env.PAGES_BASE_PATH||'/';
const base=raw==='/'?'/':'/'+raw.replace(/^\/+|\/+$/g,'')+'/';
const server=await createServer({server:{middlewareMode:true}});
try{
 const {getContent}=await server.ssrLoadModule('/src/i18n.js');
 for(const language of ['zh','en']){
   const data=getContent(language);assert.equal(data.projects.length,24);
   const urls=[data.profile.portrait,data.profile.heroPortrait,...data.projects.flatMap(f=>[f.video,f.image,f.coverImage])];
   for(const url of urls){assert(url.startsWith(base),'Incorrect Pages URL '+url);await fs.access('public/'+url.slice(base.length));}
   const education=data.profile.education;assert(education.school);
   assert.equal(data.profile.experience[0].startDate,'2026-04');
   console.log(language+': '+urls.length+' public asset URLs verified under '+base);
 }
 const dossier=JSON.parse(await fs.readFile('src/practice-dossier.json','utf8'));
 for(const language of ['zh','en']){assert.equal(dossier[language].steps.length,7);assert.deepEqual(dossier[language].cases.map(c=>c.filmId),['konfu','aviation']);}
}finally{await server.close();}
