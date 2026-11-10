import {publicAsset} from './site-assets';
import TextPressure from './TextPressure';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import CardSwap,{Card} from './effects/CardSwap';
import Folder from './effects/Folder';
import PosterArtwork from './PosterArtwork';
import {photographySeries,PhotoSheet} from './PhotographyDrawer';
import {getGraphicPosters} from './graphic-posters';
import './archive-swap.css';
import './archive-folders.css';
import './new-collections.css';

const codes={live:'LIVE-ACTION',short:'LIVE-ACTION SHORTS',vfx:'AI FILM VFX',drama:'AI SHORT DRAMA',commercial:'COMMERCIAL',story:'NARRATIVE',visual:'CG / VISUAL',reel:'SHOWREEL',photography:'PHOTOGRAPHY',graphic:'GRAPHIC POSTERS'};
const Arrow=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>;
const Play=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 10 7-10 7V5Z"/></svg>;
const Enlarge=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/></svg>;

export default function InteractiveArchive({projects,categories,t,language,theme}){
  const en=language==='en',swap=useRef(null),dialog=useRef(null),previousFocus=useRef(null),gridScroll=useRef(0);
  const [active,setActive]=useState(0),[posterIndex,setPosterIndex]=useState(0),[selectedGroup,setSelectedGroup]=useState(null),[itemId,setItemId]=useState(null),[videoError,setVideoError]=useState(false);
  const graphics=useMemo(()=>getGraphicPosters(language),[language]);
  const groups=useMemo(()=>[
    ...categories.filter(item=>item.id!=='all').map(item=>({...item,kind:'film',items:projects.filter(film=>film.category===item.id)})),
    {id:'photography',label:en?'Photography':'摄影作品',kind:'photography',items:photographySeries.map(series=>({id:series.id,title:series.title[en?1:0],discipline:series.type[en?1:0],coverImage:publicAsset('/images/photography/photo-')+String(series.images[0]).padStart(2,'0')+'.webp',series}))},
    {id:'graphic',label:en?'Graphic Poster Works':'平面海报作品',kind:'graphic',items:graphics},
  ],[categories,projects,en,graphics]);
  const current=groups[active],currentItems=current.items,focused=currentItems[posterIndex]||currentItems[0];
  const group=groups.find(item=>item.id===selectedGroup),selected=group?.items.find(item=>item.id===itemId);
  const film=group?.kind==='film'?selected:null,photo=group?.kind==='photography'?selected:null,graphic=group?.kind==='graphic'?selected:null;
  const total=String(groups.length).padStart(2,'0');
  const folderColors=theme==='light'?['#dbae91','#c9b69c','#aebeb4','#d5b3a4','#ccba89','#b9b1c7','#b2c4c8','#d0bc9f','#c5c795','#c7b5b1']:['#789b8c','#9a9c83','#809b9f','#b59c8b','#b2b985','#9391ae','#7e9f9a','#a9a181','#a0ae80','#b19b96'];
  const selectFolder=index=>{if(index!==active){setActive(index);setPosterIndex(0);}};
  const previewItem=(index,folderIndex=active)=>{const target=groups[folderIndex];setSelectedGroup(target.id);setItemId(target.items[index].id);gridScroll.current=0;};
  useEffect(()=>{
    if(!selectedGroup)return;
    previousFocus.current=document.activeElement;
    const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.showModal();
    return()=>{document.body.style.overflow=oldOverflow;previousFocus.current?.isConnected&&previousFocus.current.focus({preventScroll:true});};
  },[selectedGroup]);
  useEffect(()=>setVideoError(false),[itemId]);
  const openGroup=id=>{setItemId(null);setSelectedGroup(id);};
  const close=()=>{dialog.current?.close();setSelectedGroup(null);setItemId(null);};
  const openItem=id=>{gridScroll.current=dialog.current?.scrollTop||0;setItemId(id);requestAnimationFrame(()=>{dialog.current?.scrollTo({top:0});dialog.current?.querySelector('.collection-preview-back')?.focus({preventScroll:true});});};
  const back=()=>{setItemId(null);requestAnimationFrame(()=>{dialog.current?.scrollTo({top:gridScroll.current});dialog.current?.querySelector('.collection-preview-close')?.focus({preventScroll:true});});};
  const step=delta=>{const index=group.items.findIndex(item=>item.id===itemId);setItemId(group.items[(index+delta+group.items.length)%group.items.length].id);};
  const pagination=(previous,next)=><div className="collection-view-pagination"><button onClick={()=>step(-1)}>← {previous}</button><span>{group.items.findIndex(item=>item.id===itemId)+1} / {group.items.length}</span><button onClick={()=>step(1)}>{next} →</button></div>;
  return <div className="container archive-swap-shell">
    <div className="section-kicker"><span>03 / THE OPEN ARCHIVE</span><span>{projects.length} {en?'FILMS / 6 PHOTO SERIES / 6 POSTERS':'部影片 / 6 组摄影 / 6 张海报'}</span></div>
    <header className="archive-library-heading"><div><span className="eyebrow"><TextPressure text="A COLLECTION OF PERSPECTIVES" baseWeight={400}/></span><h2><TextPressure text={en?'Ideas, archived.':'灵感入档，'}/><span><TextPressure text={en?'Stories, revealed.':'好作品出场。'}/></span></h2></div><p>{en?'Choose a folder. Find a new perspective.':'打开一个文件夹，遇见另一种视角。'}<small>{en?'HOVER TO UNFOLD · SELECT TO EXPLORE':'悬停展开 · 点击选择 · 翻阅影像'}</small></p></header>
    <div className="archive-library" id="archive"><aside className="archive-folder-library" aria-label={en?'Work folders':'作品分类文件夹'}><div className="archive-library-label"><span>01 — {total} / COLLECTIONS</span><span>{en?'SELECT A FOLDER':'选择创作方向'} ↙</span></div>
      <div className="archive-folder-grid">{groups.map((item,index)=><div className={'archive-folder-tile'+(active===index?' is-selected':'')} key={item.id}>
        <Folder label={String(index+1).padStart(2,'0')+' / H.GZ'} ariaLabel={(en?'Select folder: ':'选择文件夹：')+item.label} size={.69} variant="solid" theme={theme} color={folderColors[index%folderColors.length]} paperColor={theme==='light'?'#fffcf4':'#e4e8de'} items={item.items.slice(0,3).map(work=>({image:work.coverImage||work.image,title:work.title}))} openOn="hover" layout="row" intro={false} draggable={false} zoomOnClick={false} closeOnOutsideClick={false} tilt={.7} bounce={.45} speed={1.3} onSelect={()=>selectFolder(index)} onItemClick={(_,itemIndex)=>{selectFolder(index);previewItem(itemIndex,index);}} cover={<span className="archive-folder-cover"><span>{codes[item.id]}</span><strong><TextPressure text={item.label} baseWeight={600}/></strong><span><b>{String(item.items.length).padStart(2,'0')}</b><i>↗</i></span></span>}/>
        <span className="archive-folder-caption"><span>{codes[item.id]}</span><i aria-hidden="true">{active===index?'●':'○'}</i></span></div>)}</div>
      <div className="archive-library-footnote"><span>CURATED BY H.GZ</span><span>{en?`${groups.length} DIRECTIONS. ONE CREATIVE MIND.`:`${groups.length} 种视角，同一份创作热情。`}</span></div></aside>
      <div className="archive-preview-desk"><div className="archive-library-label"><span>{codes[current.id]} / {en?'NOW EXPLORING':'正在浏览'}</span><span>{String(posterIndex+1).padStart(2,'0')} — {String(currentItems.length).padStart(2,'0')}</span></div>
        <div className="archive-poster-stage"><span className="archive-desk-watermark" aria-hidden="true">{String(active+1).padStart(2,'0')}</span><CardSwap key={current.id} ref={swap} label={en?'Posters in this folder':'当前文件夹海报预览'} theme={theme} width={280} height={420} cardDistance={63} verticalDistance={31} depth={80} skewAmount={-3} visibleCards={3} speed={1.12} bounce={.3} parallax={.12} hoverSpread={.18} dim={.13} autoplay={false} draggable onCardClick={index=>previewItem(index)} onChange={setPosterIndex}>{currentItems.map((item,index)=><Card key={item.id} className="archive-film-face"><button type="button" className={'archive-poster-open'+(current.kind==='photography'?' is-photography':current.kind==='graphic'?' is-graphic':'')} tabIndex={posterIndex===index?0:-1} aria-label={(current.kind==='film'?t.watchLabel+' ':en?'View: ':'查看：')+item.title}>{current.kind==='film'?<PosterArtwork film={item} priority/>:<img src={item.coverImage} alt="" draggable={false}/>}<span className="archive-film-play">{current.kind==='film'?<Play/>:<Enlarge/>}</span><span className="archive-film-card-label">{current.kind==='film'?(en?'PLAY THE FILM':'播放完整成片'):current.kind==='photography'?(en?'VIEW THE SERIES':'查看完整组图'):(en?'VIEW THE POSTER':'查看完整海报')} ↗</span></button></Card>)}</CardSwap></div>
        <div className="archive-preview-caption"><div><span>{focused.discipline}{current.kind==='film'?' / '+focused.durationLabel:''}</span><h3><TextPressure text={focused.title}/></h3></div><button onClick={()=>openGroup(current.id)} aria-label={(en?'Open collection: ':'打开专项：')+current.label}>{en?'VIEW ALL':'全部预览'} <Arrow/></button></div>
        <div className="archive-film-selector"><button className="archive-film-step" disabled={currentItems.length<2} onClick={()=>swap.current?.prev()} aria-label={en?'Previous poster in this folder':'同一文件夹上一张海报'}>←</button><div className="archive-film-thumbnails" aria-label={en?'Switch posters in this folder':'切换当前文件夹内的海报'}>{currentItems.map((item,index)=><button key={item.id} className={posterIndex===index?'is-current':''} aria-pressed={posterIndex===index} aria-label={(en?'Preview poster: ':'切换海报：')+item.title} onClick={()=>swap.current?.goTo(index)}><img src={item.coverImage||item.image} alt="" loading="lazy" draggable={false}/><span>{String(index+1).padStart(2,'0')}</span></button>)}</div><button className="archive-film-step" disabled={currentItems.length<2} onClick={()=>swap.current?.next()} aria-label={en?'Next poster in this folder':'同一文件夹下一张海报'}>→</button></div>
      </div></div>
    <div className="archive-swap-footer"><span>{total} COLLECTIONS / UNLIMITED PERSPECTIVES</span><span>{en?'Every frame, a possibility.':'每一帧，都是一种可能。'}</span></div>
    {group&&createPortal(<dialog ref={dialog} className={'collection-preview-dialog'+(film?' is-film-view':'')+(photo?' is-photo-view':'')+(graphic?' is-graphic-view':'')} aria-labelledby="collection-preview-title" onCancel={event=>{if(selected){event.preventDefault();back();}else close();}} onClick={event=>{if(event.target===event.currentTarget)close();}} onKeyDown={event=>{if((graphic||photo)&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();step(event.key==='ArrowRight'?1:-1);}}}>
      <div className="collection-preview-inner"><header className="collection-preview-header"><div><span>{codes[group.id]} / {en?'THE COLLECTION':'专项预览'}</span><h2 id="collection-preview-title"><TextPressure as="b" text={group.label}/></h2></div><button onClick={close} className="collection-preview-close" aria-label={en?'Close collection preview':'关闭专项预览'}>×</button></header>
      {selected&&<button className="collection-preview-back" onClick={back}>← {en?'BACK TO THE COLLECTION':'返回作品预览'}</button>}
      {film?<div className="collection-movie-view"><div className={'collection-movie-screen '+(film.height>film.width?'portrait':'landscape')}><video key={film.id} controls autoPlay playsInline preload="metadata" poster={film.image} aria-label={t.watchLabel+' '+film.title} onError={()=>setVideoError(true)}><source src={film.video} type="video/mp4"/></video></div>{videoError&&<a className="collection-original-video" href={film.video} target="_blank" rel="noreferrer">{en?'Open original video':'打开原片'} ↗</a>}<div className="collection-movie-copy"><span>{film.discipline} / {film.durationLabel}</span><h3><TextPressure as="b" text={film.title}/></h3><p>{film.description}</p><div className="modal-tags">{film.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div>{pagination(en?'PREVIOUS FILM':'上一部',en?'NEXT FILM':'下一部')}</div>
      :photo?<div className="collection-photo-view"><h3><TextPressure as="b" text={photo.title}/></h3><PhotoSheet series={photo.series} en={en}/>{pagination(en?'PREVIOUS SERIES':'上一组',en?'NEXT SERIES':'下一组')}</div>
      :graphic?<div className="collection-graphic-view"><div className="collection-graphic-heading"><div><span>{graphic.discipline}</span><h3><TextPressure as="b" text={graphic.title}/></h3></div><a href={graphic.original} target="_blank" rel="noreferrer">{en?'VIEW FULL-RESOLUTION ORIGINAL':'查看高清原图'} ↗</a></div><div className="collection-graphic-art"><img src={graphic.original} alt={graphic.title}/></div>{pagination(en?'PREVIOUS POSTER':'上一张海报',en?'NEXT POSTER':'下一张海报')}</div>
      :<><div className="collection-preview-intro"><p>{group.kind==='film'?(en?'Select a poster to watch the complete film.':'点击海报，观看完整成片。'):group.kind==='photography'?(en?'Original photography. Open a series to see every frame.':'保留原色与完整组图，点击查看每一帧。'):(en?'Original graphic works. Select a poster to view the complete composition.':'保留完整构图与原色，点击海报查看大图。')}</p><span>{String(group.items.length).padStart(2,'0')} {en?'WORKS':group.kind==='graphic'?'张作品':'部作品'}</span></div>
        {group.kind==='photography'?<div className="collection-preview-photos">{group.items.map(item=><button className="collection-photo-card" key={item.id} onClick={()=>openItem(item.id)} aria-label={(en?'View photography series: ':'查看摄影组图：')+item.title}><PhotoSheet series={item.series} en={en}/><span><strong>{item.title}</strong><small>{item.discipline} ↗</small></span></button>)}</div>
        :group.kind==='graphic'?<div className="collection-preview-graphics">{group.items.map(item=><button key={item.id} className="collection-graphic-card" onClick={()=>openItem(item.id)} aria-label={(en?'View graphic poster: ':'查看平面海报：')+item.title}><span><img src={item.coverImage} alt="" loading="lazy"/></span><strong>{item.title}</strong><small>{item.discipline} ↗</small></button>)}</div>
        :<div className="collection-preview-posters">{group.items.map(movie=><button key={movie.id} className="collection-poster-card" onClick={()=>openItem(movie.id)} aria-label={t.watchLabel+' '+movie.title}><span className="collection-poster-art"><PosterArtwork film={movie}/><span className="collection-poster-play"><Play/></span><span className="collection-poster-duration">{movie.durationLabel}</span></span><span className="collection-poster-meta"><small>{movie.number} / {movie.discipline}</small><strong>{movie.title}</strong></span></button>)}</div>}
      </>}
      </div></dialog>,document.body)}
  </div>;
}
