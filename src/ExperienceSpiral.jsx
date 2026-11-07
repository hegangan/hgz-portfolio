// Spiral geometry adapted from React Bits / David Haz. See licenses/react-bits-LICENSE.md.
import React, {useLayoutEffect, useMemo, useRef} from 'react';
const modulo=(n,d)=>((n%d)+d)%d;
export default function ExperienceSpiral({items,step,motion=true,onSelect,language}) {
  const root=useRef(null),cards=useRef([]),progress=useRef(0),velocity=useRef(0);
  const pointer=useRef({x:0,y:0}),follow=useRef({x:0,y:0}),wake=useRef(()=>{});
  const repeated=useMemo(()=>Array.from({length:items.length*3},(_,index)=>({...items[index%items.length],logicalIndex:index%items.length})),[items]);
  useLayoutEffect(()=>{
    let frame=0,previous=0,visible=false,bounds={width:540,height:520};
    const paint=time=>{
      frame=0;
      if(document.hidden)return;
      const dt=Math.min((time-(previous||time-16))/1000,.04);previous=time;
      const difference=step-progress.current;
      velocity.current+=difference*48*dt;
      velocity.current*=Math.exp(-dt*10);
      progress.current+=velocity.current*dt;
      if(Math.abs(difference)<.0002&&Math.abs(velocity.current)<.002){progress.current=step;velocity.current=0;}
      follow.current.x+=(pointer.current.x-follow.current.x)*(1-Math.exp(-dt*7));
      follow.current.y+=(pointer.current.y-follow.current.y)*(1-Math.exp(-dt*7));
      const drift=motion?Math.sin(time/2400)*.055:0;
      const tilt=motion?Math.sin(time/3600)*1.6:0;
      const fit=Math.min(1,bounds.width/510,bounds.height/520),radius=130*fit,half=repeated.length/2;
      const phase=progress.current+drift;
      if(root.current)root.current.style.setProperty('--helix-phase',String(modulo(progress.current,items.length)/Math.max(1,items.length-1)));
      cards.current.forEach((card,index)=>{
        if(!card)return;
        const offset=modulo(index-phase+half,repeated.length)-half;
        const angle=offset*Math.PI/3,x=Math.sin(angle)*radius,z=Math.cos(angle)*radius;
        const edge=Math.min(Math.abs(offset)/half,1),depth=(Math.cos(angle)+1)/2;
        const scale=(1+.25*Math.max(0,1-Math.abs(offset)))*fit;
        const opacity=Math.max(0,Math.min(1,(1-edge)/.35))*(.55+.45*depth);
        const px=follow.current.x*9*(.3+depth),py=follow.current.y*6*(.3+depth);
        card.style.transform=`translate(-50%,-50%) translate3d(${x+px}px,${offset*123*fit+py}px,${z}px) rotateY(${Math.sin(angle)*-14+follow.current.x*3}deg) rotateZ(${Math.sin(angle)*-4+tilt}deg) scale(${scale})`;
        card.style.opacity=opacity.toFixed(3);
        card.style.filter=Math.abs(offset)>.45?`blur(${Math.max(0,edge-.6)*2}px)`:'none';
        card.style.zIndex=String(Math.round(depth*1000));
        card.style.pointerEvents=opacity>.35?'auto':'none';
        card.classList.toggle('is-centered',Math.abs(offset)<.45);
      });
      const moving=Math.abs(step-progress.current)>.0002||Math.abs(velocity.current)>.002||Math.abs(pointer.current.x-follow.current.x)+Math.abs(pointer.current.y-follow.current.y)>.001;
      if(visible&&(motion||moving))frame=requestAnimationFrame(paint);
    };
    const schedule=()=>{if(!frame){previous=0;frame=requestAnimationFrame(paint);}};
    wake.current=schedule;
    const resize=new ResizeObserver(([entry])=>{bounds=entry.contentRect;schedule();});
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();},{threshold:.02});
    const visibility=()=>{if(!document.hidden&&visible)schedule();};
    resize.observe(root.current);observer.observe(root.current);document.addEventListener('visibilitychange',visibility);schedule();
    return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);wake.current=()=>{};};
  },[step,repeated,motion,items.length]);
  return <div className="experience-helix" ref={root} aria-hidden="true" onPointerMove={event=>{const rect=event.currentTarget.getBoundingClientRect();pointer.current={x:(event.clientX-rect.left)/rect.width-.5,y:(event.clientY-rect.top)/rect.height-.5};wake.current();}} onPointerLeave={()=>{pointer.current={x:0,y:0};wake.current();}}>
    <div className="experience-orbit orbit-one"/><div className="experience-orbit orbit-two"/>
    <span className="experience-axis">{language==='en'?'A CONTINUOUS PRACTICE':'创作，一路向前'}</span>
    <div className="experience-helix-stage">{repeated.map((item,index)=><button type="button" tabIndex={-1} key={index} ref={node=>cards.current[index]=node} className="experience-helix-card" onClick={()=>onSelect(item.logicalIndex)}>
      <span className="helix-card-top"><span>{item.kind}</span><span>H.GZ / {String(item.logicalIndex+1).padStart(2,'0')}</span></span>
      <strong>{item.cardTitle}</strong><span className="helix-card-date">{item.period}</span><span className="helix-card-arrow">↗</span><span className="helix-card-seal"/>
    </button>)}</div>
    <div className="helix-phase-track"><i/></div><span className="helix-window-corner corner-top"/><span className="helix-window-corner corner-bottom"/>
  </div>;
}
