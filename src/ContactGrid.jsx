import React from 'react';
import CursorGrid from './effects/CursorGrid';
import './contact-grid.css';
export default function ContactGrid({theme}) {
  const light=theme==='light';
  return <CursorGrid className="contact-cursor-grid" color={light?'#fff6e8':'#17231b'} gridColor={light?'#fff6e8':'#17231b'} lightMode={light} cellSize={58} radius={175} gridStyle="lines" holdTime={160} fadeDuration={1050} fillOpacity={0.12} gridOpacity={0.11} maxOpacity={0.8} spotlight={0.13} lineWidth={1} clickPulse pulseSpeed={420} ambient={0} edgeFade={0.08} intro/>;
}
