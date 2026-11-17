import React,{useRef} from 'react';
import CursorGrid from './effects/CursorGrid';
import {useVisible} from './visibility';
import {usePlaybackActive} from './playback-state';
import './contact-grid.css';
export default function ContactGrid({theme}) {
  const light=theme==='light';
  const root=useRef(null),visible=useVisible(root);
  const playing=usePlaybackActive();
  return <div ref={root} className="contact-cursor-grid">{visible&&!playing&&document.documentElement.dataset.performance!=='lite'&&<CursorGrid style={{width:'100%',height:'100%'}} color={light?'#fff6e8':'#17231b'} gridColor={light?'#fff6e8':'#17231b'} lightMode={light} cellSize={58} radius={175} gridStyle="lines" holdTime={160} fadeDuration={1050} fillOpacity={0.12} gridOpacity={0.11} maxOpacity={0.8} spotlight={0.13} lineWidth={1} clickPulse pulseSpeed={420} ambient={0} edgeFade={0.08} intro/>}</div>;
}
