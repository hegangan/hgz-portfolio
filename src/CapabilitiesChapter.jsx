import TextPressure from './TextPressure';
import React,{useRef,useState} from 'react';

function CapabilityGraphic({index}){
 return <svg viewBox="0 0 440 340" fill="none" aria-hidden="true" className={`capability-line-art graphic-${index}`}><g>{Array.from({length:9},(_,i)=><ellipse key={i} cx="220" cy="170" rx={138-i*6} ry={80+i*5} transform={`rotate(${i*11+index*17} 220 170)`}/>)}</g><circle cx="220" cy="170" r="9"/><path d="M220 30v28m0 225v28M65 170h28m255 0h28"/></svg>;
}

export default function CapabilitiesChapter({strengths,t,language}){
 const en=language==='en';
 const [active,setActive]=useState(0);
 const tabs=useRef([]);
 function navigateTab(event,index){
   const offset={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1};
   let next;
   if(event.key in offset)next=(index+offset[event.key]+strengths.length)%strengths.length;
   else if(event.key==='Home')next=0;
   else if(event.key==='End')next=strengths.length-1;
   else return;
   event.preventDefault();setActive(next);tabs.current[next]?.focus();
 }
 const selected=strengths[active];
 return <section id="expertise" className="capabilities-chapter"><div className="container">
   <div className="chapter-topline"><span>04 / CREATIVE CAPABILITIES</span><span>{en?'ONE FOCUS. MANY POSSIBILITIES.':'每一种能力，都通向更多可能。'}</span></div>
   <div className="capability-heading"><h2><TextPressure as="b" text={en?'A CONSIDERED':'能力，'} strength={.065}/><br/><span><TextPressure as="b" text={en?'WAY TO CREATE.':'有章可循。'} strength={.065}/></span></h2><p>{en?'Explore one creative discipline at a time.':'一次，了解一种创作能力。'}</p></div>
   <div className="capability-layout"><div className="capability-selector" role="tablist" aria-orientation="vertical" aria-label={en?'Creative capabilities':'个人能力'}>{strengths.map((strength,index)=><button key={strength.number} id={`capability-tab-${index}`} ref={element=>{tabs.current[index]=element;}} tabIndex={active===index?0:-1} onKeyDown={event=>navigateTab(event,index)} role="tab" aria-selected={active===index} aria-controls="capability-panel" onClick={()=>setActive(index)}><span>{strength.number}</span><strong><TextPressure text={strength.title} baseWeight={500}/></strong><i aria-hidden="true">↗</i></button>)}</div><article className="capability-panel" id="capability-panel" role="tabpanel" tabIndex={0} aria-labelledby={`capability-tab-${active}`}><div className="capability-art"><CapabilityGraphic index={active}/><span>{selected.number}</span></div><div className="capability-panel-copy"><span className="small-label"><TextPressure text={selected.en} baseWeight={400}/></span><h3><TextPressure as="b" text={selected.title} strength={.055}/></h3><p>{selected.text}</p><div className="capability-tags">{selected.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></article></div>
 </div></section>;
}
