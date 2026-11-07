import React, { useRef, useState } from 'react';

const codes = { drama:'AI SHORT DRAMA', commercial:'COMMERCIAL', story:'NARRATIVE', visual:'CG / VISUAL', reel:'SHOWREEL' };

export default function DrawerCabinet({ projects, categories, category, activeId, onCategory, onFilm, language }) {
  const [openId, setOpenId] = useState(null);
  const fronts = useRef([]);
  const english = language === 'en';
  const collections = categories.filter(item => item.id !== 'all');

  function toggle(id) {
    setOpenId(current => current === id ? null : id);
    if (category !== id) onCategory(id);
  }

  function moveFocus(event, index) {
    const offsets = { ArrowDown:1, ArrowUp:-1 };
    if (event.key in offsets) {
      event.preventDefault();
      fronts.current[(index + offsets[event.key] + collections.length) % collections.length]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      fronts.current[event.key === 'Home' ? 0 : collections.length - 1]?.focus();
    }
  }

  return <aside className="drawer-sidebar">
    <div className="drawer-index-heading"><span>{english?'THE COLLECTION INDEX':'创作档案索引'}</span><span>01—{String(projects.length).padStart(2,'0')}</span></div>
    <button className={`drawer-all ${category === 'all' ? 'is-selected' : ''}`} onClick={() => {setOpenId(null);onCategory('all');}} aria-pressed={category === 'all'}><span>{english?'All films':'全部作品'}</span><span>{projects.length}<span aria-hidden="true">↗</span></span></button>
    <div className="drawer-cabinet">
      <div className="cabinet-crown" aria-hidden="true"><span>H.GZ / FILM ARCHIVE</span><span className="cabinet-status"/></div>
      <div className="cabinet-body">{collections.map((collection, index) => {
        const films = projects.filter(film => film.category === collection.id);
        const open = openId === collection.id;
        const current = category === collection.id;
        return <section key={collection.id} className={`cabinet-drawer ${open?'is-open':''} ${current?'is-current':''}`} style={{'--drawer-accent':'var(--gallery-accent)','--drawer-offset':`${[0,10,-3,7,-2][index%5]}px`}}>
          <div className="drawer-well" aria-hidden="true"><span/><span/><span/></div>
          <div className="drawer-hover-preview" aria-hidden="true">{films.slice(0,3).map((film,i)=><span key={film.id} style={{'--preview-order':i}}><img src={film.image} alt="" loading="lazy" draggable={false}/></span>)}</div>
          <button ref={element => fronts.current[index] = element} className="drawer-front" onClick={() => toggle(collection.id)} onKeyDown={event => moveFocus(event,index)} aria-expanded={open} aria-controls={`drawer-${collection.id}`} aria-label={`${english?(open?'Close drawer':'Pull out drawer'):(open?'收起抽屉':'拉开抽屉')} ${collection.label} (${films.length})`}>
            <span className="drawer-number">0{index+1}</span>
            <span className="drawer-title-group"><strong>{collection.label}</strong><span>{codes[collection.id]}</span></span>
            <span className="drawer-file-count">{String(films.length).padStart(2,'0')}<small>{english?'FILMS':'部影片'}</small></span>
            <span className="drawer-grip" aria-hidden="true"><span/></span>
            <span className="drawer-displacement" aria-hidden="true">{open?'−':'+'}</span>
          </button>
          <div id={`drawer-${collection.id}`} className="drawer-extension" aria-hidden={!open} inert={!open || undefined}>
            <div className="drawer-extension-inner">
              <div className="drawer-tray"><div className="drawer-tray-caption"><span>{english?'CONTENTS':'抽屉内的影片'}</span><span>{films.length} / {english?'FILES':'档案'}</span></div>
                <div className="drawer-contents">{films.map(film => <button key={film.id} className={`drawer-film ${activeId === film.id?'is-selected':''}`} onClick={() => onFilm(film.id)} aria-pressed={activeId === film.id} aria-label={`${english?'Select film':'选择影片'} ${film.title}`}>
                  <span className="drawer-film-index">{film.number}</span><img src={film.image} alt="" loading="lazy" draggable={false}/><span className="drawer-film-name">{film.title}<small>{film.durationLabel}</small></span><span className="drawer-film-arrow" aria-hidden="true">↗</span>
                </button>)}</div>
              </div>
            </div>
          </div>
        </section>;
      })}</div>
      <div className="cabinet-foot" aria-hidden="true"><span>{String(collections.length).padStart(2,'0')} COLLECTIONS</span><span>CURATED BY H.GZ</span></div>
    </div>
    <p className="drawer-instruction"><span aria-hidden="true">↗</span>{english?'Pull open a drawer. Select a film.':'拉开抽屉，取出一段影像。'}</p>
  </aside>;
}
