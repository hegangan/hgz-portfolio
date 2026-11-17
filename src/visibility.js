import {useEffect,useState} from 'react';

// One shared observer instead of an observer and canvas for every heading.
const subscribers=new Map();let observer;
export function observeVisible(element,notify){
  if(!('IntersectionObserver' in window)){notify(true);return()=>{}};
  if(!observer)observer=new IntersectionObserver(entries=>entries.forEach(entry=>subscribers.get(entry.target)?.(entry.isIntersecting)),{rootMargin:'120px'});
  subscribers.set(element,notify);observer.observe(element);
  return()=>{observer.unobserve(element);subscribers.delete(element)};
}
export function useVisible(ref,{once=false}={}){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const element=ref.current;if(!element)return;let stop=()=>{};stop=observeVisible(element,value=>{setVisible(value);if(value&&once)stop()});return()=>stop()},[ref,once]);
  return visible;
}
