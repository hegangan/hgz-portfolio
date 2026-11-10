import TextPressure from './TextPressure';
import WeChatCard from './WeChatCard';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getContent } from './i18n';
import InteractiveArchive from './InteractiveArchive';
import PointerAtmosphere from './PointerAtmosphere';
import PortfolioHero from './StudioHero';
import PortraitChapter from './StudioProfile';
import PracticeChapter from './PracticeChapter';
import CapabilitiesChapter from './CapabilitiesChapter';
import CreativeMotion from './CreativeMotion';
import KineticChapter from './KineticChapter';
import ContactGrid from './ContactGrid';
import PageNavigator from './PageNavigator';
import StarInteractions from './StarInteractions';

const Arrow = ({ diagonal = false, ...props }) => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>{diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
const Star = props => <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}><path d="M20 0v40M0 20h40M5.9 5.9l28.2 28.2M5.9 34.1 34.1 5.9" /></svg>;
const Sun = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1m0-15.6-2.1 2.1M6.3 17.7l-2.1 2.1" /></svg>;
const Moon = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.6 14.1A9 9 0 0 1 9.9 3.4 9 9 0 1 0 20.6 14.1Z" /></svg>;

function readPreference(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

export default function App() {
  const [language, setLanguage] = useState(() => readPreference('portfolio-language', 'zh') === 'en' ? 'en' : 'zh');
  const [theme, setTheme] = useState(() => readPreference('portfolio-theme', 'dark') === 'light' ? 'light' : 'dark');
  const { t, profile, projects, strengths, categories } = useMemo(() => getContent(language), [language]);
  const [selectedId, setSelectedId] = useState(null);
  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [active, setActive] = useState('home');
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState('');
  const [videoError, setVideoError] = useState(false);
  const video = useRef(null);
  const modal = useRef(null);
  const lastFocus = useRef(null);
  const selected = projects.find(p => p.id === selectedId);
  const isModalOpen = Boolean(selected || contact);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = language === 'en' ? 'He Ganzhong — Visual, AI & Brand Designer' : '何淦中 — 视觉 · AI · 品牌设计师';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f3f0e8' : '#111b1c');
    try { localStorage.setItem('portfolio-language', language); localStorage.setItem('portfolio-theme', theme); } catch { /* Preferences remain usable without storage. */ }
  }, [language, theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    const sections = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id === 'practice' ? 'about' : entry.target.id === 'playground' ? 'home' : entry.target.id);
    }), { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => sections.observe(el));
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    const initialSection = window.location.hash.slice(1);
    if (['home', 'playground', 'about', 'practice', 'work', 'archive', 'photography', 'expertise', 'contact'].includes(initialSection)) {
      requestAnimationFrame(() => document.getElementById(initialSection)?.scrollIntoView({ behavior: 'instant', block: 'start' }));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { observer.disconnect(); sections.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    if (!video.current) return;
    if (paused) video.current.pause();
    else video.current.play().catch(() => setPaused(true));
  }, [paused]);

  useEffect(() => {
    if (!isModalOpen) return;
    lastFocus.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => modal.current?.querySelector('button')?.focus(), 0);
    const handleKeys = e => {
      if (e.key === 'Escape') { setSelectedId(null); setContact(false); }
      if (e.key === 'Tab') {
        const focusable = modal.current?.querySelectorAll('button, a[href], video[controls]');
        if (!focusable?.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeys);
    return () => { clearTimeout(timer); document.body.style.overflow = ''; document.removeEventListener('keydown', handleKeys); lastFocus.current?.focus(); };
  }, [isModalOpen]);

  useEffect(() => { setVideoError(false); }, [selectedId]);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 2800); return () => clearTimeout(id); }, [toast]);

  const nav = [{ id: 'home', text: t.home, en: 'HOME' }, { id: 'about', text: t.about, en: 'ABOUT' }, { id: 'work', text: t.work, en: 'WORK' }, { id: 'expertise', text: t.expertise, en: 'EXPERTISE' }];
  const playbackProjects = ['drama','vfx','live'].includes(selected?.category) ? projects.filter(p => p.category === selected.category) : projects;
  const selectedIndex = playbackProjects.findIndex(p => p.id === selectedId);

  function openContact() { setCopied(false); setContact(true); setMenu(false); }
  function closeModal() { setSelectedId(null); setContact(false); }
  function changeFilm(direction) { setSelectedId(playbackProjects[(selectedIndex + direction + playbackProjects.length) % playbackProjects.length].id); }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); } catch { setToast(t.copyError); }
  }

  return <div className={language === 'en' ? 'site is-en' : 'site is-zh'}>
    <CreativeMotion/><PointerAtmosphere language={language}/><StarInteractions theme={theme}/><PageNavigator language={language} suspended={isModalOpen || menu}/><a className="skip-link" href="#about">{t.skip}</a>
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        <a href="#home" className="logo" aria-label={`${profile.name} ${t.home}`}>{profile.monogram}<span className="logo-divider" /><span className="logo-note">AIGC VISUAL<br />DESIGNER</span></a>
        <nav className={menu ? 'open' : ''} aria-label={language === 'en' ? 'Main navigation' : '主导航'}>{nav.map(n => <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''} onClick={() => setMenu(false)}><span>{n.text}</span>{language === 'zh' && <small>{n.en}</small>}</a>)}</nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={theme === 'dark' ? t.themeLight : t.themeDark} aria-label={theme === 'dark' ? t.themeLight : t.themeDark} aria-pressed={theme === 'light'}>{theme === 'dark' ? <Sun /> : <Moon />}<span>{theme === 'dark' ? t.lightsOn : t.lightsOff}</span></button>
          <button className="language-toggle" onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} aria-label={t.languageLabel} lang={language === 'zh' ? 'en' : 'zh-CN'}>{t.language}</button>
          <button className="nav-contact" onClick={openContact}><span className="contact-desktop-label">{t.contact}</span><span className="contact-mobile-label">{t.contactShort}</span><Arrow diagonal /></button>
          <button className="mobile-menu" aria-label={menu ? t.closeMenu : t.openMenu} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? `${t.closeMenu} −` : `${t.menu} +`}</button>
        </div>
      </div>
    </header>

    <main id="portfolio-content">
      <PortfolioHero theme={theme} profile={profile} t={t} language={language} paused={paused} onToggleVideo={()=>setPaused(!paused)} videoRef={video} projects={projects} onOpen={setSelectedId}/>
      <KineticChapter projects={projects} t={t} language={language} onOpen={setSelectedId}/>
      <PortraitChapter profile={profile} t={t} language={language} onContact={openContact}/>
      <PracticeChapter profile={profile} language={language} projects={projects} onOpen={setSelectedId}/>

      <section id="work" className="work section-pad dimensional-work">
        <InteractiveArchive projects={projects} categories={categories} t={t} language={language} theme={theme} onOpen={setSelectedId}/>
      </section>

      <CapabilitiesChapter strengths={strengths} t={t} language={language}/>

      <section id="contact" className="contact-section"><ContactGrid theme={theme}/><div className="contact-glow" aria-hidden="true"/><div className="container contact-inner"><div className="section-kicker"><span>05 / LET’S CONNECT</span><span className="availability"><span className="status-dot"/>{t.available}</span></div><div className="contact-main reveal"><div className="eyebrow"><TextPressure text="GREAT THINGS START WITH A CONVERSATION." baseWeight={400}/></div><h2 className="section-display contact-title"><span className="display-index" aria-hidden="true">05</span><span className="title-line"><TextPressure as="b" text={t.contactTitle[0]} strength={.065}/></span><span className="title-line title-offset"><TextPressure as="b" text={t.contactTitle[1]} strength={.065}/><span className="headline-accent"><TextPressure as="b" text={t.contactTitle[2]} strength={.065}/></span><TextPressure as="b" text={t.contactTitle[3]} strength={.065}/><Star/></span></h2><div className="contact-action"><p>{t.contactIntro[0]}<br/>{t.contactIntro[1]}</p><WeChatCard profile={profile} language={language} onOpen={openContact}/></div><button className="email-link" onClick={openContact}>{profile.email}<Arrow diagonal/></button></div><footer><a className="logo" href="#home">{profile.monogram}</a><span>© {new Date().getFullYear()} {profile.name}. DESIGNED WITH INTENTION.</span><a className="back-top" href="#home">{t.backTop}<Arrow diagonal/></a></footer></div></section>
    </main>

    {isModalOpen && <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)closeModal();}}><section className={`modal ${contact?'contact-modal':`film-modal ${selected?.height>selected?.width?'film-modal-portrait':'film-modal-landscape'}`}`} ref={modal} role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="modal-close" onClick={closeModal} aria-label={t.closeModal}>×</button>
      {selected && <><div className="film-player"><video key={selected.id} controls playsInline autoPlay preload="metadata" poster={selected.image} aria-label={`${t.watchLabel} ${selected.title}`} onError={()=>setVideoError(true)}><source src={selected.video} type="video/mp4"/></video>{videoError && <div className="video-error"><p>{t.videoError}</p><a href={selected.video} target="_blank" rel="noreferrer">{t.openVideo}<Arrow diagonal/></a></div>}</div><div className="modal-body"><div className="film-modal-meta"><span className="eyebrow">{selected.discipline}</span><span>{selected.durationLabel} / {t.originalAudio}</span></div><h2 id="dialog-title"><TextPressure as="b" text={selected.title} strength={.055}/></h2><p>{selected.description}</p><div className="modal-tags">{selected.tags.map(tag=><span key={tag}>{tag}</span>)}</div><div className="film-pagination"><button onClick={()=>changeFilm(-1)}><Arrow/>{t.previous}</button><span>{String(selectedIndex+1).padStart(2,'0')} / {playbackProjects.length}</span><button onClick={()=>changeFilm(1)}>{t.next}<Arrow/></button></div></div></>}
      {contact && <div className="modal-body"><Star className="contact-modal-star"/><span className="eyebrow">LET’S MAKE SOMETHING GOOD.</span><h2 id="dialog-title"><TextPressure as="b" text={t.contactModalTitle} strength={.055}/></h2><p>{t.contactModalIntro}</p><div className="contact-modal-layout"><div className="contact-details"><div><span>{t.email}</span><strong>{profile.email}</strong><button onClick={copyEmail}>{copied?t.copied:t.copy}</button></div><div><span>{t.phone}</span><a href={`tel:${profile.phone}`}>{profile.phone}<Arrow diagonal/></a></div><div><span>QQ</span><strong>{profile.qq}</strong></div></div><WeChatCard profile={profile} language={language} large/></div><a className="pill-button primary" href={`mailto:${profile.email}`}>{t.sendEmail}<Arrow diagonal/></a></div>}
    </section></div>}
    <div className="toast" role="status" aria-live="polite">{toast}</div>
  </div>;
}
