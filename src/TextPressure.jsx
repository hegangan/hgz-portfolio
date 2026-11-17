import React,{lazy,Suspense,useLayoutEffect,useRef,useState} from 'react';
import {useVisible} from './visibility';
import {usePlaybackActive} from './playback-state';
import './effects/TechText.css';
import './text-pressure.css';
const TechText=lazy(()=>import('./effects/TechText'));
class EffectBoundary extends React.Component{
  state={failed:false};
  static getDerivedStateFromError(){return{failed:true}}
  render(){return this.state.failed?null:this.props.children}
}

// Native text reserves exactly the original layout. React Bits Tech Text draws
// on a single per-heading canvas, fitted to those native glyph positions.
export default function TextPressure({text,as:Tag='span',className='',baseWeight=650}){
  const root=useRef(null);
  const visible=useVisible(root);
  const playing=usePlaybackActive();
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
    {metrics&&visible&&!playing&&document.documentElement.dataset.performance!=='lite'&&!navigator.connection?.saveData&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches&&window.matchMedia('(pointer:fine)').matches&&<EffectBoundary><Suspense fallback={null}><TechText text={text} {...metrics} align="left" color="currentColor" accentColor="currentColor"
      sweep={false} intro="none" specks={metrics.compact?0:5} selection={!metrics.compact} labels={!metrics.compact}
      draggable={!metrics.interactive&&!metrics.compact} clickKick={!metrics.interactive&&!metrics.compact}
      reach={120} strokeWidth={metrics.compact?.75:1.1} dashLength={3} dashGap={2}/></Suspense></EffectBoundary>}
  </Tag>;
}
