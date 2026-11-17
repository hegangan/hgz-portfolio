import React,{useRef} from 'react';
import {useVisible} from './visibility';

// Native lazy loading still fetches several screens ahead. No URL is attached
// until this particular image is actually near the viewport.
export default function DeferredImage({src,srcSet,loading='lazy',...props}){
  const ref=useRef(null),visible=useVisible(ref,{once:true});
  const eager=loading==='eager';
  return <img {...props} ref={ref} src={visible||eager?src:undefined} srcSet={visible||eager?srcSet:undefined} loading={loading} decoding="async"/>;
}
