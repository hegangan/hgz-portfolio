import {publicAsset} from './site-assets';
import React,{useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';

const image=n=>publicAsset('/images/photography/photo-')+String(n).padStart(2,'0')+'.webp';
export const photographySeries=[
 {id:'coast',title:['海风与红玫瑰','Sea Breeze & Red Roses'],type:['海边人像','COASTAL PORTRAITS'],images:[1]},
 {id:'tennis',title:['球场日记','Court Diary'],type:['运动人像','SPORTS PORTRAITS'],images:[2]},
 {id:'night',title:['夜色肖像','After Dark'],type:['夜景人像','NIGHT PORTRAITS'],images:[3]},
 {id:'wedding',title:['喜事成双','A Day to Remember'],type:['婚礼纪实','WEDDING DOCUMENTARY'],images:[4]},
 {id:'pomelo',title:['红柚 · 鲜活肌理','Pomelo · Vivid Textures'],type:['水果商业摄影','FRUIT & STILL LIFE'],images:[5,6,7,8,9,10]},
 {id:'gb350',title:['GB350 · 霓虹玩家','GB350 · Neon Play'],type:['产品摄影与视觉呈现','PRODUCT PHOTOGRAPHY & VISUALS'],images:[11,12,13,14]},
];
export function PhotoSheet({series,en=false}){
 const render=n=><img key={n} src={image(n)} alt={series.title[en?1:0]+' / '+n} loading="lazy" draggable={false}/>;
 if(series.images.length===1)return <div className="photo-sheet single">{render(series.images[0])}</div>;
 const columns=series.id==='pomelo'?[[5,7,9,10],[6,8]]:[[11,14],[12,13]];
 return <div className={'photo-sheet collage collage-'+series.id}>{columns.map((column,i)=><div className="photo-sheet-column" key={i}>{column.map(render)}</div>)}</div>;
}
export default function PhotographyDrawer({language,number}){
 const en=language==='en',locale=en?1:0;
 const [open,setOpen]=useState(false),[selected,setSelected]=useState(null);
 const dialog=useRef(null),lastFocus=useRef(null);
 const series=selected===null?null:photographySeries[selected];
 useEffect(()=>{
  if(selected===null)return;
  lastFocus.current=document.activeElement;
  dialog.current?.showModal();
  const old=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=old;lastFocus.current?.focus({preventScroll:true});};
 },[selected===null]);
 function step(offset){setSelected(current=>(current+offset+photographySeries.length)%photographySeries.length);dialog.current?.scrollTo({top:0});}
 return <section id="photography" className={'collection-drawer photography-drawer '+(open?'is-open':'')}>
  <button id="collection-trigger-photography" className="collection-front" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="collection-panel-photography">
   <span className="collection-number">{String(number).padStart(2,'0')}</span><span className="collection-name"><strong>{en?'Photography':'摄影作品'}</strong><small>PHOTOGRAPHY / SELECTED SERIES</small></span>
   <span className="collection-previews" aria-hidden="true">{[1,5,11].map(n=><span key={n}><img src={image(n)} alt="" loading="lazy"/></span>)}</span>
   <span className="collection-count">06<small>{en?'SERIES':'组作品'}</small></span><span className="collection-toggle" aria-hidden="true"><i/><i/></span><span className="collection-handle" aria-hidden="true"/>
  </button>
  <div id="collection-panel-photography" className="collection-panel" role="region" aria-labelledby="collection-trigger-photography" aria-hidden={!open} inert={!open||undefined}>
   <div className="collection-panel-inner"><div className="collection-tray"><div className="collection-tray-label"><span>{en?'PORTRAITS / WEDDINGS / PRODUCTS':'人像 / 婚礼 / 商业产品'}</span><span>{en?'OPEN A SERIES TO VIEW FULL SIZE':'点击组图，查看完整拼图'} ↗</span></div>
    <div className="photography-grid">{photographySeries.map((item,index)=><button className="photography-card" key={item.id} onClick={()=>setSelected(index)} aria-label={(en?'View photography series: ':'查看摄影组图：')+item.title[locale]}><div className="photography-card-sheet"><PhotoSheet series={item} en={en}/><span className="photography-open" aria-hidden="true">↗</span></div><span className="collection-film-meta"><span><small>{String(index+1).padStart(2,'0')} / {item.type[locale]}</small><strong>{item.title[locale]}</strong></span><span aria-hidden="true">↗</span></span></button>)}</div>
    <div className="collection-tray-foot"><span>H.GZ / PHOTOGRAPHY</span><button onClick={()=>{setOpen(false);document.getElementById('collection-trigger-photography')?.focus();}}>{en?'CLOSE DRAWER':'收起抽屉'} ↑</button></div>
   </div></div>
  </div>
  {series&&createPortal(<dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-dialog-title" onCancel={()=>setSelected(null)} onClick={event=>{if(event.target===event.currentTarget)setSelected(null);}} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();step(1);}if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}}}>
   <div className="photo-dialog-inner"><div className="photo-dialog-heading"><div><span>{series.type[locale]}</span><h2 id="photo-dialog-title">{series.title[locale]}</h2></div><button className="photo-dialog-close" onClick={()=>setSelected(null)} aria-label={en?'Close photography viewer':'关闭摄影查看器'}>×</button></div><PhotoSheet series={series} en={en}/><div className="photo-dialog-navigation"><button onClick={()=>step(-1)}>{en?'← PREVIOUS SERIES':'← 上一组'}</button><span>{selected+1} / {photographySeries.length}</span><button onClick={()=>step(1)}>{en?'NEXT SERIES →':'下一组 →'}</button></div></div>
  </dialog>,document.body)}
 </section>;
}
