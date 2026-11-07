import React from 'react';
export default function PosterArtwork({film,variant='poster',className='',priority=false}) {
  return <span className={`cinema-cover cinema-${variant} ${className}`} aria-hidden="true">
    <img className="cinema-cover-photo" src={film.coverImage || film.image} width="1024" height="1536" alt="" loading={priority?'eager':'lazy'} decoding="async" draggable={false}/>
  </span>;
}
