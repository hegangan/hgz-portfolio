import React from 'react';

const Arrow=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>;

export default function PortraitChapter({profile,t,language,onContact}){
 const en=language==='en';
 return <section id="about" className="portrait-chapter">
   <div className="container portrait-chapter-inner">
     <div className="chapter-topline"><span>01 / A LITTLE ABOUT ME</span><span>HE GANZHONG</span></div>
     <div className="portrait-editorial-grid">
       <div className="portrait-statement"><span className="small-label">{en?'A DESIGNER. A CREATIVE EXPLORER.':'设计师，也是创意探索者。'}</span><h2>{en?'VISUAL AT HEART.':'视觉为本，'}<br/><span>{en?'IDEAS IN MOTION.':'想象向前。'}</span></h2><p>{en?'I connect design, photography and generative AI to create brand stories and cinematic visual worlds.':'以视觉传达与摄影为基础，连接品牌表达与生成式创作，让想法成为可感知的影像。'}</p><button className="editorial-cta" onClick={onContact}><span>{t.contactShort}</span><span className="cta-arrow"><Arrow/></span></button></div>
       <figure className="portrait-figure"><div className="portrait-arch"><img src={profile.portrait} alt={t.portraitAlt} loading="lazy"/></div><figcaption><span>{profile.name}</span><span>{en?'VISUAL / AI / BRAND':'视觉 / AI / 品牌'}</span></figcaption></figure>
       <div className="portrait-stat-column">{profile.stats.map(stat=><div key={stat.label}><strong>{stat.value}<sup>{stat.suffix||''}</sup></strong><span>{stat.label}</span></div>)}</div>
     </div>
     <div className="portrait-role-line"><span>{en?'VISUAL DESIGN':'视觉设计'}</span><i/><span>{en?'GENERATIVE STORYTELLING':'生成式叙事'}</span><i/><span>{en?'BRAND EXPRESSION':'品牌表达'}</span></div>
   </div>
 </section>;
}
