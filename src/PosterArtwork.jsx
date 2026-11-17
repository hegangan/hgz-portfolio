import React from 'react';
import DeferredImage from './DeferredImage';
export default function PosterArtwork({film,variant='poster',className='',priority=false}) {
  return <span className={`cinema-cover cinema-${variant} ${className}`} aria-hidden="true">
    <DeferredImage className="cinema-cover-photo" src={film.coverImage || film.image} srcSet={film.coverSrcSet} sizes="(max-width:600px) 45vw, (max-width:1000px) 30vw, 320px" width="800" height="1200" alt="" loading={priority?'eager':'lazy'} draggable={false}/>
  </span>;
}
