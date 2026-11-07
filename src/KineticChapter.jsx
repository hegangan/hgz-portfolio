import TextPressure from './TextPressure';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import DriftWall from './effects/DriftWall';
import './drift-chapter.css';
export default function KineticChapter({projects,language,onOpen}) {
  const en=language==='en',stage=useRef(null);
  const [width,setWidth]=useState(1200);
  const [paused,setPaused]=useState(()=>typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const observer=new ResizeObserver(([entry])=>setWidth(entry.contentRect.width));if(stage.current)observer.observe(stage.current);return()=>observer.disconnect();},[]);
  const items=useMemo(()=>projects.map(film=>({id:film.id,image:film.coverImage,title:film.title})),[projects]);
  const tileWidth=width<640?130:width<1000?165:205;
  const columns=width<640?4:width<1000?6:8;
  return <section id="playground" className="drift-chapter" aria-label={en?'Interactive film poster wall':'互动影片海报墙'}>
    <div className="container drift-chapter-heading"><div><span className="eyebrow"><TextPressure text="02 / IMAGINATION IN MOTION" baseWeight={400}/></span><h2><TextPressure as="b" text={en?'Let imagination':'让想象'} strength={.07}/><span><TextPressure as="b" text={en?'drift.':'发生。'} strength={.07}/></span></h2></div><div className="drift-chapter-note"><p>{en?'A moving collection of ideas, stories and worlds.':'灵感、故事与世界，在此流动。'}</p><span>{en?'HOVER TO LIFT · CLICK TO WATCH':'悬停，让灵感浮起 · 点击，进入影像'}</span></div></div>
    <div className="drift-chapter-stage" ref={stage}>
      <DriftWall motionEnabled={!paused} items={items} columns={columns} tileWidth={tileWidth} tileHeight={tileWidth*1.5} gap={22} radius={3} tilt={13} turn={-13} roll={-4} perspective={1500} depth={85} speed={paused?0:24} variance={0.4} parallax={0.9} lift={60} fade={0.12} dim={1} grayscale={false} overlayColor="transparent" onSelect={item=>onOpen(item.id)}/>
    </div>
    <div className="container drift-chapter-footer"><span>{String(projects.length).padStart(2,'0')} {en?'FILMS / ENDLESS PERSPECTIVES':'部作品 / 流动的视角'}</span><button onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused?'▷':'Ⅱ'} {en?(paused?'Resume wall':'Pause wall'):(paused?'继续漂移':'暂停漂移')}</button><a href="#work">{en?'EXPLORE THE ARCHIVE':'展开全部作品'} ↗</a></div>
  </section>;
}
