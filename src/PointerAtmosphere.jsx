import React,{useEffect,useRef} from 'react';

export default function PointerAtmosphere({language}){
 const cursor=useRef(null);
 useEffect(()=>{
   const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
   if(!window.matchMedia('(pointer:fine)').matches||reduced.matches)return;
   let x=-400,y=-400,tx=-400,ty=-400,frame=0,px=0,py=0,targetPX=0,targetPY=0,lastAngle=0;
   let initialised=false;
   let textRects=[],textRectsDirty=true;
   const parallaxTargets=Array.from(document.querySelectorAll('.capability-art,.hero-optics'));
   function invalidateTextRects(){textRectsDirty=true;if(initialised&&!frame)frame=requestAnimationFrame(animate);}
   function collectTextRects(){
     textRects=[];
     // Measure semantic blocks, not every text node and duplicated animated glyph.
     const elements=document.querySelectorAll('h1,h2,h3,h4,p,li,dt,dd,a,button,summary,label,figcaption,.eyebrow,.small-label,.chapter-topline');
     for(const element of elements){
       if(element.closest('[inert],[aria-hidden="true"]'))continue;
       const rect=element.getBoundingClientRect();
       if(rect.width&&rect.height&&rect.bottom>=-14&&rect.top<=innerHeight+14&&rect.right>=-14&&rect.left<=innerWidth+14)
         textRects.push({left:rect.left-14,right:rect.right+14,top:rect.top-14,bottom:rect.bottom+14});
     }
     textRectsDirty=false;
   }
   const touchesText=(cx,cy)=>textRects.some(rect=>cx>=rect.left&&cx<=rect.right&&cy>=rect.top&&cy<=rect.bottom);
   function animate(){
     if(document.hidden){frame=0;return;}
     const dx=tx-x,dy=ty-y;
     x+=dx*.135;y+=dy*.135;
     px+=(targetPX-px)*.07;py+=(targetPY-py)*.07;
     const speed=Math.min(65,Math.hypot(dx,dy));
     if(speed>1)lastAngle=Math.atan2(dy,dx)*180/Math.PI;
     if(cursor.current){
       if(textRectsDirty)collectTextRects();
       // Check the pointer and its trailing position, including headings with pointer-events:none.
       cursor.current.classList.toggle('is-over-text',touchesText(tx,ty)||touchesText(x,y));
       cursor.current.style.transform=`translate3d(${x}px,${y}px,0)`;
       cursor.current.style.setProperty('--liquid-angle',`${lastAngle}deg`);
       cursor.current.style.setProperty('--liquid-stretch',String(1+speed*.002));
       cursor.current.style.setProperty('--liquid-squash',String(1-speed*.001));
       cursor.current.style.setProperty('--liquid-drift',`${Math.min(12,speed*.16)}px`);
     }
     for(const target of parallaxTargets){target.style.setProperty('--scene-x',px.toFixed(3));target.style.setProperty('--scene-y',py.toFixed(3));}
     if(Math.abs(dx)+Math.abs(dy)>.1||Math.abs(targetPX-px)+Math.abs(targetPY-py)>.001)frame=requestAnimationFrame(animate);else frame=0;
   }
   function move(event){
     if(event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
     tx=event.clientX;ty=event.clientY;
     if(!initialised){x=tx;y=ty;initialised=true;}
     targetPX=Math.max(-1,Math.min(1,(tx/innerWidth-.5)*2));
     targetPY=Math.max(-1,Math.min(1,(ty/innerHeight-.5)*2));
     cursor.current?.classList.add('is-visible');
     if(!frame)frame=requestAnimationFrame(animate);
   }
   function leave(){cursor.current?.classList.remove('is-visible');}
   window.addEventListener('pointermove',move,{passive:true});
   window.addEventListener('scroll',invalidateTextRects,{passive:true,capture:true});
   window.addEventListener('resize',invalidateTextRects,{passive:true});
   document.addEventListener('pointerover',invalidateTextRects,{passive:true});
   document.addEventListener('pointerleave',leave);
   window.addEventListener('blur',leave);
   const textObserver=new MutationObserver(invalidateTextRects);
   textObserver.observe(document.body,{subtree:true,childList:true,characterData:true});
   document.fonts?.ready.then(invalidateTextRects);
   return()=>{cancelAnimationFrame(frame);textObserver.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('scroll',invalidateTextRects,true);window.removeEventListener('resize',invalidateTextRects);document.removeEventListener('pointerover',invalidateTextRects);document.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);};
 },[language]);
 return <div ref={cursor} className="liquid-cursor" aria-hidden="true"><div className="liquid-cursor-surface"><span className="liquid-cursor-glass"/></div></div>;
}
