
if(import.meta.env.DEV&&new URLSearchParams(location.search).has('perf')){
  const nativeRAF=window.requestAnimationFrame.bind(window),nativeCancel=window.cancelAnimationFrame.bind(window);
  let recording=false,frames=[],costs=[],longTasks=[],last=0,start=0,callbackTotals=new Map();
  const labels=new WeakMap();
  window.requestAnimationFrame=function(callback){
    if(!labels.has(callback)){
      const line=new Error().stack.split('\n').find(line=>line.includes('/src/')&&!line.includes('performance-lab'));
      labels.set(callback,(callback.name||'anonymous')+' '+(line?.trim().split('/src/')[1]?.split('?')[0]||''));
    }
    return nativeRAF(timestamp=>{
      if(!recording)return callback(timestamp);
      const t=performance.now();try{return callback(timestamp);}finally{
        const elapsed=performance.now()-t,label=labels.get(callback),item=callbackTotals.get(label)||{count:0,ms:0,max:0};
        item.count++;item.ms+=elapsed;item.max=Math.max(item.max,elapsed);callbackTotals.set(label,item);costs.push(elapsed);
      }
    });
  };
  const po=new PerformanceObserver(list=>{if(recording)longTasks.push(...list.getEntries().map(e=>e.duration));});
  try{po.observe({type:'longtask',buffered:false});}catch{}
  const panel=document.createElement('aside');panel.id='performance-lab';
  panel.style.cssText='position:fixed;z-index:30000;bottom:10px;left:10px;width:290px;padding:12px;background:#111e;color:#fff;border:1px solid #aab6;font:12px/1.6 monospace;contain:layout paint';
  panel.innerHTML='<button type="button" style="padding:8px" id="perf-start">记录6秒性能</button><pre style="max-height:210px;overflow:auto;white-space:pre-wrap" id="perf-result">准备就绪</pre>';
  document.body.appendChild(panel);
  const output=panel.querySelector('pre');
  function monitor(t){
    if(!recording)return;
    if(last)frames.push(t-last);last=t;
    if(t-start<6000){nativeRAF(monitor);return;}
    recording=false;
    const sorted=[...frames].sort((a,b)=>a-b),total=frames.reduce((a,b)=>a+b,0);
    const report={frames:frames.length,meanFPS:Math.round(frames.length*1000/total),p95FrameMs:+(sorted[Math.floor(sorted.length*.95)]||0).toFixed(2),
      over32ms:frames.filter(n=>n>32).length,longTasks:longTasks.length,totalRAFms:+costs.reduce((a,b)=>a+b,0).toFixed(2),
      callbacks:[...callbackTotals].map(([name,v])=>({name,count:v.count,ms:+v.ms.toFixed(2),max:+v.max.toFixed(2)})).sort((a,b)=>b.ms-a.ms).slice(0,10)};
    output.textContent=JSON.stringify(report,null,2);
  }
  panel.querySelector('button').onclick=()=>{frames=[];costs=[];longTasks=[];last=0;callbackTotals=new Map();start=performance.now();recording=true;output.textContent='正在记录…';nativeRAF(monitor);};
}
