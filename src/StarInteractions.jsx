import React,{useEffect,useState} from 'react';
import StarBorder from './effects/StarBorder';
import './star-interactions.css';

const interactive='button,a[href],summary,[role="button"],[role="tab"],[role="slider"],input[type="range"]';
export default function StarInteractions({theme}){
  const [target,setTarget]=useState(null);
  const [activation,setActivation]=useState(0);
  useEffect(()=>{
    let last=null,timer=0;
    const find=node=>{
      const element=node instanceof Element?node.closest(interactive):null;
      if(!element||element.matches(':disabled,[aria-disabled="true"]')||element.closest('[inert],[aria-hidden="true"]'))return null;
      // Native range inputs have no child content; decorate their custom slider shell.
      return element.tagName==='INPUT'?element.parentElement:element;
    };
    const activate=(element,pulse=false)=>{
      clearTimeout(timer);
      if(!element)return;
      if(last!==element){last?.classList.remove('star-interactive-target','star-static-target');last=element;last.classList.add('star-interactive-target');setTarget(element);}
      if(pulse)setActivation(performance.now());
    };
    const enter=event=>{const element=find(event.target);if(element)activate(element);};
    const down=event=>{const element=find(event.target);if(element)activate(element,true);};
    const leave=event=>{
      const next=find(event.relatedTarget);
      if(next){activate(next);return;}
      timer=setTimeout(()=>{last?.classList.remove('star-interactive-target','star-static-target');last=null;setTarget(null);},450);
    };
    const focus=event=>activate(find(event.target));
    document.addEventListener('pointerover',enter,true);
    document.addEventListener('pointerout',leave,true);
    document.addEventListener('pointerdown',down,true);
    document.addEventListener('focusin',focus,true);
    document.addEventListener('focusout',leave,true);
    return()=>{clearTimeout(timer);last?.classList.remove('star-interactive-target','star-static-target');document.removeEventListener('pointerover',enter,true);document.removeEventListener('pointerout',leave,true);document.removeEventListener('pointerdown',down,true);document.removeEventListener('focusin',focus,true);document.removeEventListener('focusout',leave,true);};
  },[]);
  if(!target?.isConnected)return null;
  const radius=parseFloat(getComputedStyle(target).borderTopLeftRadius)||4;
  return <StarBorder key={activation} targetElement={target} activation={activation} theme={theme} color={theme==='light'?'#cb4f31':'#d6ee8b'} trailColor={theme==='light'?'#e5a285':'#77b8ae'} radius={radius} duration={3.2} thickness={1.5} trailLength={0.24} glow={0.75} sparkle stars={1} hover="lap" clickPulse/>;
}
