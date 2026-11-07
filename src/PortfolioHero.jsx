import {publicAsset} from './site-assets';
import React from 'react';
import { filmCount } from './films';

const Arrow=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>;

function AtmosphereSculpture(){
  return <svg className="hero-sculpture" viewBox="0 0 640 640" fill="none" aria-hidden="true"><defs><linearGradient id="sculpture-stroke" x1="100" y1="100" x2="530" y2="550" gradientUnits="userSpaceOnUse"><stop stopColor="currentColor" stopOpacity=".05"/><stop offset=".48" stopColor="currentColor" stopOpacity=".8"/><stop offset="1" stopColor="currentColor" stopOpacity=".1"/></linearGradient></defs><g transform="rotate(-28 320 320)" stroke="url(#sculpture-stroke)" strokeWidth=".85">{Array.from({length:15},(_,i)=><ellipse key={i} cx="320" cy="320" rx={210-i*4} ry={97+i*6} transform={`rotate(${i*6} 320 320)`}/>)}</g></svg>;
}

export default function PortfolioHero({profile,t,language,paused,onToggleVideo,videoRef}){
  const en=language==='en';
  const role=en?'AI Visual Production':'AI视觉制作';
  return <section id="home" className={`gallery-hero ${en?'hero-english':''}`}>
    <video ref={videoRef} className="hero-ambient-video" autoPlay={!paused} loop muted playsInline preload="metadata" poster={publicAsset("/images/hero-poster.jpg")} aria-hidden="true"><source src={publicAsset("/images/orbit.mp4")} type="video/mp4"/></video>
    <div className="hero-canvas container">
      <div className="hero-corner-copy"><span className="small-label">INDEPENDENT CREATIVE / 2026</span><p>{en?'A visual mind.':'以视觉为本。'}<br/>{en?'An open imagination.':'让想象发生。'}</p><div className="hero-author">{en?'HE GANZHONG':profile.name}</div></div>
      <div className="hero-discipline"><span>VISUAL</span><span>AI CREATION</span><span>BRAND</span><i/></div>
      <h1 className="hero-wordmark" aria-label={role}><span>{en?'AI VISUAL':'AI视觉'}</span><span className="hero-role-outline">{en?' PRODUCTION':'制作'}</span></h1>
      <div className="hero-art-track" aria-hidden="true"><div className="hero-art-float"><AtmosphereSculpture/></div></div>
      <div className="hero-graphic-layer" aria-hidden="true"><svg className="hero-orbit-graphic" viewBox="0 0 620 620" fill="none" stroke="currentColor"><ellipse cx="310" cy="310" rx="280" ry="126"/><ellipse cx="310" cy="310" rx="280" ry="126" transform="rotate(60 310 310)"/><circle cx="310" cy="310" r="6"/></svg><span className="hero-cross cross-primary">+</span><span className="hero-cross cross-secondary">+</span><span className="hero-graphic-dot"/></div>
      <div className="hero-profile-note"><span className="availability-mark"><i/>{en?'OPEN TO CREATIVE COLLABORATIONS':'开放创意合作'}</span><p>{en?'Visual / AI / Brand Designer':'视觉设计师 / AI 设计师 / 品牌设计师'}</p><a className="editorial-cta" href="#work"><span>{t.explore}</span><span className="cta-arrow"><Arrow/></span></a></div>
      <div className="hero-caption"><p>{en?'From an idea to a visual world.':'从一个想法，到一个视觉世界。'}<br/>{en?'A practice shaped by design, photography and AI.':'连接设计、摄影与生成式创作。'}</p><span>H.GZ — SELECTED PORTFOLIO</span></div>
      <div className="gallery-hero-bottom"><a href="#about"><span className="hero-scroll-arrow">↓</span>{t.scroll}</a><span>{filmCount} {en?'FILMS / INFINITE POSSIBILITIES':'部影像 / 无限种可能'}</span><button onClick={onToggleVideo} aria-label={paused?t.playBg:t.pauseBg}><span aria-hidden="true">{paused?'▷':'Ⅱ'}</span>{paused?'PLAY':'PAUSE'}</button></div>
    </div>
  </section>;
}
