const base=import.meta.env?.BASE_URL||'/';
export function publicAsset(path){
  if(typeof path!=='string'||!path.startsWith('/'))return path;
  return base+path.replace(/^\/+/, '');
}
