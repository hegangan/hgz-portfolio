import React,{useLayoutEffect,useRef,useState} from 'react';
import TechText from './effects/TechText';
import './text-pressure.css';

// Native text reserves exactly the original layout. React Bits Tech Text draws
// on a single per-heading canvas, fitted to those native glyph positions.
export default function TextPressure({text,as:Tag='span',className='',baseWeight=650}){
  const root=useRef(null);
  const [metrics,setMetrics]=useState(null);
  useLayoutEffect(()=>{
    const element=root.current;
    const measure=()=>{
      const css=getComputedStyle(element),size=parseFloat(css.fontSize)||16;
      const next={fontSize:size,fontFamily:css.fontFamily,fontWeight:Number(css.fontWeight)||baseWeight,
        letterSpacing:(parseFloat(css.letterSpacing)||0)/size,
        outlined:css.color==='rgba(0, 0, 0, 0)',compact:size<25,interactive:Boolean(element.closest('button,a,summary'))};
      setMetrics(old=>old&&JSON.stringify(old)===JSON.stringify(next)?old:next);
    };
    const observer=new ResizeObserver(measure);observer.observe(element);measure();
    document.fonts?.ready.then(measure);return()=>observer.disconnect();
  },[text,baseWeight]);
  return <Tag ref={root} className={'text-pressure tech-heading '+className} style={{'--pressure-base-weight':baseWeight}}>
    <span className="pressure-sr-only">{text}</span><span className="pressure-content" aria-hidden="true">
      {Array.from(text).map((char,index)=><span key={index} className="pressure-cell"><span className="pressure-ghost">{char===' '?' ':char}</span></span>)}
    </span>
    {metrics&&<TechText text={text} {...metrics} align="left" color="currentColor" accentColor="currentColor"
      sweep={false} intro="none" specks={metrics.compact?0:5} selection={!metrics.compact} labels={!metrics.compact}
      draggable={!metrics.interactive&&!metrics.compact} clickKick={!metrics.interactive&&!metrics.compact}
      reach={120} strokeWidth={metrics.compact?.75:1.1} dashLength={3} dashGap={2}/>}
  </Tag>;
}
