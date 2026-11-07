import React from 'react';
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>;
const Play = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 11 7-11 7V5Z" /></svg>;
export default function FilmCard({ film, t, onOpen, featured = false }) {
  return <button className={`film-card ${featured ? 'showreel-card' : ''}`} style={{ '--film-accent': film.accent }} onClick={() => onOpen(film.id)} aria-label={`${t.watchLabel} ${film.title}`}>
    <div className={`film-poster poster-${film.style}`}>
      <img src={film.image} alt={film.title} loading="lazy" draggable={false} />
      <div className="poster-vignette" />
      <div className="poster-hairline" aria-hidden="true" />
      <div className="poster-top"><span>{featured ? 'HE GANZHONG / CREATIVE REEL' : `${film.number} / ${film.discipline}`}</span><span>H.GZ / FILMS</span></div>
      {featured && <span className="reel-overline">{t.selectedReel}</span>}
      <div className="poster-copy"><span className="poster-type">{featured ? t.reelLabel : film.discipline}</span><h3>{film.posterTitle.map((line, i) => <React.Fragment key={line}>{i > 0 && <br />}{line}</React.Fragment>)}</h3><span className="poster-watch"><Play />{t.watch}<span className="poster-watch-line" /></span></div>
      <span className="film-play-circle"><Play /></span>
      <div className="poster-bottom"><span>SELECTED WORK / HE GANZHONG</span><span>{film.durationLabel}</span></div>
    </div>
    <div className="film-caption"><div><span>{film.discipline}</span><h3>{film.title}</h3></div><span className="film-caption-time">{film.durationLabel}<Arrow diagonal /></span></div>
  </button>;
}

