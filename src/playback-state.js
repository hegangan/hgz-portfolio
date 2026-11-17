import {useSyncExternalStore} from 'react';
const players=new Set(),listeners=new Set();
export function markPlayback(player,active){
  if(active)players.add(player);else players.delete(player);
  listeners.forEach(notify=>notify());
}
const subscribe=notify=>{listeners.add(notify);return()=>listeners.delete(notify)};
const snapshot=()=>players.size>0;
export const usePlaybackActive=()=>useSyncExternalStore(subscribe,snapshot,()=>false);
