import {publicAsset} from './site-assets';
import React,{useEffect,useRef} from 'react';
import {filmCount} from './films';
import CursorGrid from './effects/CursorGrid';
import TextPressure from './TextPressure';
import CircularText from './CircularText';
import './intro-hero.css';
const Arrow=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>;
const Play=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 10 7-10 7V5Z"/></svg>;
export default function StudioHero({profile,language,theme,paused,videoRef,projects,onOpen}){
  const en=language==='en',light=theme==='light',reel=projects.find(film=>film.id==='showreel')||projects[0],titleRef=useRef(null);
  useEffect(()=>{let alive=true;const title=titleRef.current,word=title.querySelector('.portfolio-word');const fit=()=>{if(alive&&word.offsetWidth)title.style.setProperty('--portfolio-fit',String(title.clientWidth/word.offsetWidth));};const observer=new ResizeObserver(fit);observer.observe(title);observer.observe(word);window.addEventListener('resize',fit);document.fonts?.ready.then(fit);fit();return()=>{alive=false;observer.disconnect();window.removeEventListener('resize',fit);};},[]);
  return <section id="home" className={'portrait-hero'+(en?' portrait-hero-english':'')} data-motion-scene="hero">
    <video ref={videoRef} className="portrait-hero-ambient" autoPlay={!paused} loop muted playsInline preload="metadata" aria-hidden="true"><source src={publicAsset("/images/orbit.mp4")} type="video/mp4"/></video>
    <CursorGrid className="portrait-hero-grid" color={light?'#cb4f31':'#d6ee8b'} gridColor={light?'#927e68':'#8ba89c'} lightMode={light} cellSize={88} radius={180} gridStyle="lines" holdTime={130} fadeDuration={900} fillOpacity={0} gridOpacity={.018} maxOpacity={.24} spotlight={0} lineWidth={1} clickPulse pulseSpeed={460} ambient={0} edgeFade={.16}/>
    <div className="container portrait-hero-stage">
      <div className="portrait-hero-topline"><span><i aria-hidden="true">✳</i> AIGC VISUAL DESIGNER</span><a href="#contact"><span className="status-dot"/>{en?'OPEN TO NEW OPPORTUNITIES':'开放新的工作机会'}<span aria-hidden="true">⟶</span></a></div>
      <h1 ref={titleRef} className="portrait-hero-title" aria-label={en?'He Ganzhong — AIGC Visual Designer Portfolio':'何淦中 — AIGC视觉设计师个人作品集'}><TextPressure text="PORTFOLIO" className="portfolio-word" strength={.045} baseWeight={800} pressureWeight={900}/></h1>
      <span className="portrait-hero-side portrait-hero-side-left" aria-hidden="true">VISUAL DESIGN　—　AI FILM</span><span className="portrait-hero-side portrait-hero-side-right" aria-hidden="true">BRAND　—　DIGITAL EXPERIENCES</span>
      <div className="portrait-hero-disc" aria-hidden="true"/>
      <div className="portrait-hero-person"><img src={profile.heroPortrait} alt={en?'He Ganzhong, AIGC visual designer':'何淦中，AIGC视觉设计师'} width="1180" height="1333" fetchPriority="high" draggable={false}/></div>
      <div className="portrait-hero-copy"><div className="portrait-hero-greeting"><span>HELLO, I'M</span><span>HE GANZHONG</span></div><div className="portrait-profile-top"><div className="portrait-identity"><h2>{en?<><TextPressure as="b" text="HE" strength={.055} baseWeight={650} pressureWeight={850}/><br/><TextPressure as="b" text="GANZHONG" strength={.055} baseWeight={650} pressureWeight={850}/></>:<TextPressure as="b" text={profile.name} strength={.055} baseWeight={650} pressureWeight={850}/>}</h2><p className="portrait-hero-role"><TextPressure text={en?'AIGC VISUAL DESIGNER':'AIGC 视觉设计师'} baseWeight={500}/></p></div><div className="portrait-statement"><h3><TextPressure as="b" text={en?'VISUAL AT HEART.':'以视觉为本，'} strength={.055}/><br/><TextPressure as="b" text={en?'IDEAS IN MOTION.':'让想象发生。'} strength={.055}/></h3><p>{en?'Brand expression, AI filmmaking & generative creativity.':'品牌视觉、AI 影像与生成式创作。'}</p></div></div><div className="portrait-hero-specialties" aria-label={en?'Creative disciplines':'创作方向'}><span><small>01 / BRAND FILMS</small><b>{en?'Brand films':'商业影像'}</b></span><span><small>02 / AI STORIES</small><b>{en?'AI stories':'AI 叙事'}</b></span><span><small>03 / VISUAL CRAFT</small><b>{en?'Visual craft':'视觉创作'}</b></span></div></div>
      <a className="portrait-hero-badge" href="#contact" aria-label={en?'Contact He Ganzhong about a role':'联系何淦中，洽谈工作机会'}><CircularText text="OPEN TO WORK · AIGC VISUAL DESIGN · "/><span>{en?<>LET’S<br/>CONNECT</>:<>开放<br/>工作机会</>}</span><Arrow/></a>
    </div>
    <div className="container portrait-hero-footer"><a className="portrait-selected-label" href="#work">SELECTED <span>WORKS</span></a><p>{en?'A collection of films, images and possibilities.':'让想法成为影像，让作品表达自己。'}<span>{filmCount} {en?'FILMS / 6 PHOTO SERIES / 6 POSTERS':'部影片 / 6 组摄影 / 6 张平面海报'}</span></p><div className="portrait-hero-actions"><button onClick={()=>onOpen(reel.id)} aria-label={en?'Play creative showreel':'观看创作精选'}><Play/><span>{en?'PLAY REEL':'观看精选'}</span></button><a href="#work">{en?'EXPLORE ALL WORK':'探索全部作品'}<Arrow/></a></div></div>
  </section>;
}
