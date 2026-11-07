import TextPressure from './TextPressure';
// Depth rail geometry adapted from React Bits / David Haz (DepthCarousel).
// Native requestAnimationFrame interpolation; see licenses/react-bits-LICENSE.md.
import React,{useCallback,useEffect,useLayoutEffect,useRef} from 'react';
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export default function ExperienceDepthCarousel({items,active,onSelect,language}){
  const root=useRef(null),cards=useRef([]),position=useRef(0),scale=useRef(1),frame=useRef(0),drag=useRef(null),skipClick=useRef(false);
  const count=items.length;
  const layout=useCallback(value=>{
    cards.current.forEach((card,index)=>{
      if(!card)return;
      const d=index-value,back=Math.max(0,d);
      card.style.transform=`translate(-50%,-50%) scale(${scale.current}) translateX(${(92*d).toFixed(2)}px) translateZ(${(-235*d).toFixed(2)}px) rotateY(${(27*clamp(d,0,1)).toFixed(2)}deg)`;
      const opacity=d<0?Math.max(0,1+d):1;
      card.style.opacity=opacity.toFixed(3);
      card.style.filter=`brightness(${Math.max(.55,1-back*.14).toFixed(3)}) blur(${(back*.5).toFixed(2)}px)`;
      card.style.zIndex=String(Math.round(2000-d*20));
      card.style.pointerEvents=opacity>.05?'auto':'none';
    });
  },[]);
  const animateTo=useCallback(target=>{
    cancelAnimationFrame(frame.current);
    const next=clamp(target,0,count-1),from=position.current,start=performance.now();
    const paint=time=>{
      const t=clamp((time-start)/720,0,1),ease=1-Math.pow(1-t,3);
      position.current=from+(next-from)*ease;layout(position.current);
      if(t<1)frame.current=requestAnimationFrame(paint);else frame.current=0;
    };
    frame.current=requestAnimationFrame(paint);
  },[count,layout]);
  useLayoutEffect(()=>{
    const observer=new ResizeObserver(([entry])=>{
      scale.current=Math.min(1,entry.contentRect.width/590,Math.max(.4,(entry.contentRect.height-34)/388));
      layout(position.current);
    });
    observer.observe(root.current);layout(position.current);
    return()=>{observer.disconnect();cancelAnimationFrame(frame.current);};
  },[layout]);
  useEffect(()=>{animateTo(active);return()=>cancelAnimationFrame(frame.current);},[active,animateTo]);
  function stopDrag(event,cancel=false){
    const current=drag.current;if(!current)return;
    drag.current=null;root.current.classList.remove('is-dragging');
    if(root.current.hasPointerCapture(current.pointerId))root.current.releasePointerCapture(current.pointerId);
    if(!current.moved){if(cancel)animateTo(active);return;}
    skipClick.current=!cancel;
    const unit=Math.max(155*scale.current,65);
    const target=clamp(Math.round(position.current-current.velocity*150/unit),0,count-1);
    onSelect(target);animateTo(target);
  }
  return <div ref={root} className="experience-depth-carousel" role="group" aria-roledescription="carousel" aria-label={language==='en'?'Depth carousel of education and work':'教育与工作经历深度旋转展示'}
    onPointerDown={event=>{if(event.button!==0)return;skipClick.current=false;cancelAnimationFrame(frame.current);drag.current={pointerId:event.pointerId,x:event.clientX,y:event.clientY,position:position.current,lastX:event.clientX,lastTime:performance.now(),velocity:0,moved:false};}}
    onPointerMove={event=>{
      const current=drag.current;if(!current||current.pointerId!==event.pointerId)return;
      const dx=event.clientX-current.x,dy=event.clientY-current.y;
      if(!current.moved&&Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag.current=null;animateTo(active);return;}
      if(!current.moved&&Math.abs(dx)>5){current.moved=true;root.current.setPointerCapture(event.pointerId);root.current.classList.add('is-dragging');}
      if(!current.moved)return;
      event.preventDefault();const now=performance.now();current.velocity=(event.clientX-current.lastX)/Math.max(1,now-current.lastTime);current.lastX=event.clientX;current.lastTime=now;
      position.current=clamp(current.position-dx/Math.max(155*scale.current,65),0,count-1);layout(position.current);
    }}
    onPointerUp={event=>stopDrag(event)} onPointerCancel={event=>stopDrag(event,true)} onLostPointerCapture={event=>stopDrag(event,true)}
    onClickCapture={event=>{if(skipClick.current){skipClick.current=false;event.preventDefault();event.stopPropagation();}}}>
    <div className="depth-rail-guide" aria-hidden="true"><i/><i/><i/></div>
    <span className="depth-axis-label" aria-hidden="true">PAST → PRACTICE → POSSIBILITIES</span>
    <div className="experience-depth-stage">{items.map((item,index)=><button type="button" key={item.id} ref={node=>cards.current[index]=node} className={'experience-depth-card dossier-'+index+(active===index?' is-current':'')} tabIndex={active===index?0:-1} aria-hidden={active!==index} aria-label={item.title+' / '+item.period} onClick={()=>{onSelect(index);animateTo(index);}}>
      <span className="dossier-registration"><span>{String(index+1).padStart(2,'0')} / {item.kind}</span><span>H.GZ ↗</span></span>
      <span className="dossier-art" aria-hidden="true"><span className="dossier-serial">{String(index+1).padStart(2,'0')}</span><i/><i/><i/><span className="dossier-art-caption">{index===0?'THE FOUNDATION':index===1?'CREATIVE PRACTICE':'NEW PERSPECTIVES'}</span></span>
      <span className="dossier-copy"><span className="dossier-date">{item.period}</span><strong><TextPressure as="b" text={item.cardHeading} strength={.055}/></strong><span className="dossier-role">{item.cardTitle}</span></span>
      <span className="dossier-footer"><span>{index===0?'DESIGN / EDUCATION':index===1?'DIRECTION / FILM':'AIGC / LEADERSHIP'}</span><i/></span>
    </button>)}</div>
    <span className="depth-drag-caption" aria-hidden="true">← {language==='en'?'DRAG TO CHANGE PERSPECTIVE':'拖动，进入下一段经历'} →</span>
  </div>;
}
