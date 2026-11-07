import {publicAsset} from './site-assets';
import React,{useCallback,useState} from 'react';
import ElectricLogo from './effects/ElectricLogo';
import './electric-identity.css';
export default function ElectricIdentity({theme,language}) {
  const [ready,setReady]=useState(false);
  const rendered=useCallback(()=>setReady(true),[]);
  const light=theme==='light';
  function pulse(event) {
    if(event.key!=='Enter'&&event.key!==' ')return;
    event.preventDefault();
    const node=event.currentTarget.querySelector('.electric-logo'),rect=node?.getBoundingClientRect();
    if(rect)node.dispatchEvent(new PointerEvent('pointerdown',{clientX:rect.left+rect.width/2,clientY:rect.top+rect.height/2,bubbles:true}));
  }
  return <div className={'electric-identity '+(ready?'is-ready':'')} role="button" tabIndex={0} onKeyDown={pulse} aria-label={language==='en'?'HGZ electric signature. Move over the letters or press Enter to energize.':'HGZ 电流字标，移动鼠标与字母互动，按回车触发电流涟漪'}>
    <img className="electric-fallback" src={publicAsset("/images/hgz-mark.svg")} alt="" aria-hidden="true"/>
    <ElectricLogo src={publicAsset("/images/hgz-mark.svg")} theme={theme} color={light?'#8b3328':'#e9ffc0'} glowColor={light?'#cb4f31':'#d6ee8b'} scale={0.94} thickness={1.5} intensity={0.95} glow={0.7} strands={4} speed={1.7} bend={0.3} crackle={1.1} arcs={1.6} flicker={0.12} fill={0.035} cursorIntensity={1.9} cursorRadius={155} interactive onRender={rendered}/>
    <span className="electric-signature-note" aria-hidden="true"><i/>{language==='en'?'MOVE TO ENERGIZE':'移动鼠标，点亮灵感'}<span>HGZ / IN MOTION</span></span>
  </div>;
}
