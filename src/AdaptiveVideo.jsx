import React,{useEffect,useRef,useState} from 'react';
import './adaptive-video.css';
import {markPlayback} from './playback-state';

export function alternateAsset(url){
  const current=new URL(url,location.href);
  const path=current.pathname.replace(/^\/hgz-portfolio\//,'/');
  return current.hostname==='hgz-portfolio.pages.dev'
    ?'https://hegangan.github.io/hgz-portfolio'+path
    :'https://hgz-portfolio.pages.dev'+path;
}

export default function AdaptiveVideo({film,label,language='zh'}){
  const en=language==='en',ref=useRef(null),engine=useRef(null),resumeAt=useRef(0);
  const [attempt,setAttempt]=useState(0),[status,setStatus]=useState('loading'),[quality,setQuality]=useState('auto');
  const qualityRef=useRef(quality);qualityRef.current=quality;
  const [native,setNative]=useState(false);
  useEffect(()=>{const video=ref.current;markPlayback(video,true);return()=>markPlayback(video,false)},[]);
  useEffect(()=>{
    const video=ref.current;let alive=true,hls=null,recovery=0,stallTimer;
    setStatus('loading');setNative(false);
    const source=attempt%2?alternateAsset(film.stream):film.stream;
    const set=value=>{if(alive)setStatus(value)};
    const play=()=>{video.play().catch(()=>set('ready'))};
    const running=()=>{clearTimeout(stallTimer);set('playing')};
    const waiting=()=>{set('buffering');clearTimeout(stallTimer);stallTimer=setTimeout(()=>set('stalled'),15000)};
    const ready=()=>set('ready');
    const restore=()=>{if(resumeAt.current>0&&Number.isFinite(video.duration))video.currentTime=Math.min(resumeAt.current,video.duration-.1)};
    video.addEventListener('loadedmetadata',restore);stallTimer=setTimeout(()=>set('stalled'),20000);
    video.addEventListener('playing',running);video.addEventListener('waiting',waiting);video.addEventListener('canplay',ready);
    const visibility=()=>{if(document.hidden){video.pause();hls?.stopLoad()}else if(!video.paused)hls?.startLoad()};
    const resume=()=>{if(hls&&!document.hidden)hls.startLoad()};
    video.addEventListener('play',resume);document.addEventListener('visibilitychange',visibility);
    document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()});
    const start=async()=>{
      if(video.canPlayType('application/vnd.apple.mpegurl')&&(/iPad|iPhone|iPod/.test(navigator.userAgent)||!window.MediaSource)){
        setNative(true);video.src=source;video.load();play();return;
      }
      try{
        const {default:Hls}=await import('hls.js');if(!alive)return;
        if(!Hls.isSupported()){setNative(true);video.src=video.canPlayType('application/vnd.apple.mpegurl')?source:film.video;video.load();play();return}
        hls=new Hls({enableWorker:true,startLevel:0,startPosition:resumeAt.current||-1,capLevelToPlayerSize:true,maxBufferLength:8,maxMaxBufferLength:16,maxBufferSize:4*1024*1024,backBufferLength:4,lowLatencyMode:false,abrEwmaDefaultEstimate:350000,
          manifestLoadPolicy:{default:{maxTimeToFirstByteMs:12000,maxLoadTimeMs:18000,timeoutRetry:{maxNumRetry:1,retryDelayMs:1000,maxRetryDelayMs:2000},errorRetry:{maxNumRetry:1,retryDelayMs:1000,maxRetryDelayMs:2000}}},
          fragLoadPolicy:{default:{maxTimeToFirstByteMs:12000,maxLoadTimeMs:30000,timeoutRetry:{maxNumRetry:2,retryDelayMs:1000,maxRetryDelayMs:4000},errorRetry:{maxNumRetry:2,retryDelayMs:1000,maxRetryDelayMs:4000}}}});
        engine.current=hls;hls.attachMedia(video);hls.loadSource(source);
        hls.on(Hls.Events.MANIFEST_PARSED,()=>{if(!alive)return;hls.currentLevel=qualityRef.current==='save'?0:qualityRef.current==='high'?hls.levels.length-1:-1;play()});
        hls.on(Hls.Events.ERROR,(_,data)=>{if(!alive||!data.fatal)return;if(data.type===Hls.ErrorTypes.MEDIA_ERROR&&recovery++<1)hls.recoverMediaError();else{hls.stopLoad();set('error');if(attempt===0&&data.type===Hls.ErrorTypes.NETWORK_ERROR&&/^(hgz-portfolio\.pages\.dev|hegangan\.github\.io)$/.test(location.hostname))setAttempt(1)}});
      }catch{set('error')}
    };
    const onError=()=>set('error');video.addEventListener('error',onError);start();
    return()=>{resumeAt.current=video.currentTime||resumeAt.current;alive=false;clearTimeout(stallTimer);video.removeEventListener('loadedmetadata',restore);video.removeEventListener('playing',running);video.removeEventListener('waiting',waiting);video.removeEventListener('canplay',ready);video.removeEventListener('error',onError);video.removeEventListener('play',resume);document.removeEventListener('visibilitychange',visibility);hls?.destroy();engine.current=null;video.pause();video.removeAttribute('src');video.load()};
  },[film.id,attempt]);
  function choose(event){const value=event.target.value;setQuality(value);const hls=engine.current;if(hls)hls.currentLevel=value==='save'?0:value==='high'?hls.levels.length-1:-1}
  const blocked=status==='error'||status==='stalled';
  return <div className="adaptive-video" data-status={status}>
    <video ref={ref} controls playsInline preload="none" poster={film.image} aria-label={label}/>
    <div className="video-playback-toolbar"><span role="status">{status==='loading'?(en?'Loading video…':'正在加载视频…'):status==='buffering'?(en?'Buffering…':'正在缓冲…'):blocked?(en?'Connection interrupted':'当前线路加载遇到问题'):en?'Adaptive playback':'网络自适应播放'}</span>
      {!native&&<label>{en?'Quality':'清晰度'} <select aria-label={en?'Video quality':'视频清晰度'} value={quality} onChange={choose}><option value="auto">{en?'Auto':'自动'}</option><option value="save">{en?'Data saver':'流畅省流'}</option><option value="high">{en?'High':'高清'}</option></select></label>}
      <button type="button" onClick={()=>setAttempt(a=>a+1)}>{en?'Switch connection':'切换播放线路'}</button>
    </div>
    {blocked&&<div className="video-connection-help" role="alert"><p>{en?'Try data saver or switch the connection. Your progress and full film are still available.':'可选择流畅省流或切换播放线路；也可以单独打开完整视频。'}</p><button onClick={()=>{setQuality('save');qualityRef.current='save';setAttempt(a=>a+2)}}>{en?'Retry in data saver':'以省流模式重试'}</button><a href={attempt%2?alternateAsset(film.video):film.video} target="_blank" rel="noreferrer">{en?'Open complete video':'打开完整视频'} ↗</a></div>}
  </div>;
}
