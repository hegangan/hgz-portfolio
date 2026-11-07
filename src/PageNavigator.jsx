import React, { useCallback, useEffect, useRef, useState } from 'react';
import './page-navigator.css';

const clamp = value => Math.min(1, Math.max(0, value));
const scrollRange = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

export default function PageNavigator({ language, suspended = false }) {
  const en = language === 'en';
  const rail = useRef(null);
  const handle = useRef(null);
  const drag = useRef(null);
  const [ratio, setRatio] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);
  const disabled = suspended || bodyLocked;
  const percent = ratio >= 1 ? 100 : Math.floor(ratio * 100);

  const finishDrag = useCallback(() => {
    const pointerId = drag.current?.pointerId;
    drag.current = null;
    if (pointerId !== undefined && rail.current?.hasPointerCapture(pointerId)) {
      rail.current.releasePointerCapture(pointerId);
    }
    document.documentElement.classList.remove('is-page-scroll-dragging');
    setDragging(false);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = scrollRange();
      const position = window.scrollY;
      setRatio(range <= 0 || range - position <= 1 ? 1 : position <= 1 ? 0 : clamp(position / range));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const lockObserver = new MutationObserver(() => {
      setBodyLocked(document.body.style.overflow === 'hidden');
    });
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    setBodyLocked(document.body.style.overflow === 'hidden');
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    resize.observe(document.documentElement);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('blur', finishDrag);
    document.documentElement.classList.add('has-page-navigator');
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      lockObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('blur', finishDrag);
      document.documentElement.classList.remove('has-page-navigator', 'is-page-scroll-dragging');
    };
  }, [finishDrag]);

  useEffect(() => { if (disabled) finishDrag(); }, [disabled, finishDrag]);

  function seek(value) {
    if (disabled || document.body.style.overflow === 'hidden') return;
    const next = clamp(value);
    window.scrollTo({ top: next * scrollRange(), behavior: 'instant' });
    setRatio(next);
  }

  function seekPointer(clientY, offset) {
    const bounds = rail.current.getBoundingClientRect();
    const travel = bounds.height - handle.current.offsetHeight;
    if (travel > 0) seek((clientY - bounds.top - offset) / travel);
  }

  function pointerDown(event) {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    const grabbedHandle = handle.current.contains(event.target);
    const offset = grabbedHandle ? event.clientY - handle.current.getBoundingClientRect().top : handle.current.offsetHeight / 2;
    drag.current = { pointerId: event.pointerId, offset };
    rail.current.setPointerCapture(event.pointerId);
    document.documentElement.classList.add('is-page-scroll-dragging');
    setDragging(true);
    seekPointer(event.clientY, offset);
  }

  function keyDown(event) {
    if (disabled) return;
    const range = scrollRange();
    const current = range ? clamp(window.scrollY / range) : 0;
    const step = event.shiftKey ? 0.05 : 0.01;
    const page = range ? window.innerHeight * 0.85 / range : 1;
    const values = { Home: 0, End: 1, ArrowUp: current - step, ArrowLeft: current - step,
      ArrowDown: current + step, ArrowRight: current + step, PageUp: current - page, PageDown: current + page };
    if (!(event.key in values)) return;
    event.preventDefault();
    seek(values[event.key]);
  }

  const style = { '--reading-progress': ratio };
  return <>
    <div className="page-reading-progress" style={style} role="progressbar" aria-label={en ? 'Page reading progress' : '网页阅读进度'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <span className="page-reading-progress-fill" />
    </div>
    <aside className={'page-navigator' + (dragging ? ' is-dragging' : '') + (disabled ? ' is-suspended' : '')} style={style} aria-hidden={disabled || undefined}>
      <span className="page-scroll-cap" aria-hidden="true"><i /><i /><i /></span>
      <div className="page-scroll-rail" ref={rail} role="slider" tabIndex={disabled ? -1 : 0}
        aria-label={en ? 'Drag to scroll the page' : '拖动滑块浏览网页'} aria-orientation="vertical" aria-controls="portfolio-content"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={en ? `${percent}% through the page` : `已浏览网页 ${percent}%`} aria-disabled={disabled || undefined}
        onKeyDown={keyDown} onPointerDown={pointerDown}
        onPointerMove={event => { if (drag.current?.pointerId === event.pointerId) seekPointer(event.clientY, drag.current.offset); }}
        onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}>
        <span className="page-scroll-ticks" aria-hidden="true" />
        <span className="page-scroll-line" aria-hidden="true"><i /></span>
        <span className="page-scroll-handle" ref={handle} aria-hidden="true"><i /><i /><i /><span className="page-scroll-hint">{en ? 'DRAG TO EXPLORE' : '拖动，探索全页'}<b>↕</b></span></span>
      </div>
      <output className="page-scroll-value" aria-hidden="true">{String(percent).padStart(2, '0')}<small>%</small></output>
    </aside>
  </>;
}
