import React,{useEffect,useId,useRef} from 'react';
import './circular-text.css';
export default function CircularText({text,className='',reverse=false}){
  const id='type-orbit-'+useId().replace(/:/g,''),root=useRef(null);
  useEffect(()=>{
    const element=root.current,observer=new IntersectionObserver(([entry])=>element.classList.toggle('is-visible',entry.isIntersecting),{rootMargin:'50px'});
    observer.observe(element);return()=>observer.disconnect();
  },[]);
  return <span ref={root} className={'circular-text '+(reverse?'circular-text-reverse ':'')+className} aria-hidden="true">
    <svg viewBox="0 0 120 120"><defs><path id={id} d="M60,60m-45,0a45,45 0 1,1 90,0a45,45 0 1,1 -90,0"/></defs>
      <text textLength="279" lengthAdjust="spacing"><textPath href={'#'+id}>{text}</textPath></text>
    </svg>
  </span>;
}
