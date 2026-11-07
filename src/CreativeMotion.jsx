import { useEffect } from 'react';

const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));

export default function CreativeMotion(){
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const root=document.documentElement;
    const scenes=Array.from(document.querySelectorAll('[data-motion-scene]')).map(element=>({element,value:0,target:0}));
    const energyTargets=Array.from(document.querySelectorAll('.capability-art,.contact-glow'));
    let frame=0,energy=0,lastY=window.scrollY,dirty=true,active=true;
    function tick(){
      if(!active)return;
      if(dirty){
        for(const scene of scenes){
          const rect=scene.element.getBoundingClientRect();
          scene.target=clamp(-rect.top/Math.max(1,rect.height));
        }
        dirty=false;
      }
      energy*=.88;
      for(const target of energyTargets)target.style.setProperty('--wheel-energy',Math.abs(energy)<.001?'0':energy.toFixed(3));
      let moving=Math.abs(energy)>.001;
      for(const scene of scenes){
        scene.value+=(scene.target-scene.value)*.12;
        if(Math.abs(scene.target-scene.value)>.0001)moving=true;
        scene.element.style.setProperty('--section-progress',scene.value.toFixed(5));
      }
      frame=moving?requestAnimationFrame(tick):0;
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(tick);}
    function scroll(){energy=clamp((window.scrollY-lastY)/80,-1,1);lastY=window.scrollY;dirty=true;schedule();}
    function wheel(event){energy=clamp(event.deltaY/150,-1,1);schedule();}
    function resize(){dirty=true;schedule();}
    window.addEventListener('scroll',scroll,{passive:true});
    window.addEventListener('wheel',wheel,{passive:true});
    window.addEventListener('resize',resize,{passive:true});
    root.classList.add('has-creative-motion');schedule();
    return()=>{active=false;cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);window.removeEventListener('wheel',wheel);window.removeEventListener('resize',resize);root.classList.remove('has-creative-motion');};
  },[]);
  return null;
}
