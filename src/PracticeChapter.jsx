import dossierData from './practice-dossier.json';
import CareerDossier from './CareerDossier';
import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import TextPressure from './TextPressure';
import './experience-stations.css';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export default function PracticeChapter({profile,language,projects,onOpen}){
  const en=language==='en',region=useRef(null),wheel=useRef({sum:0,last:0,switched:0});
  const tabs=useRef([]);
  const [selected,setSelected]=useState(0);
  const dossier=dossierData[en?'en':'zh'];
  const items=useMemo(()=>[
    {id:'education',kind:en?'EDUCATION':'教育经历',period:profile.education.period||(en?'BACHELOR’S DEGREE':'大学本科'),
      station:profile.education.school,title:profile.education.school,subtitle:profile.education.major+' / '+profile.education.degree,
      detail:dossier.educationNote,
      tags:profile.education.courses.split(' · '),awards:profile.awards},
    ...[...profile.experience].sort((a,b)=>a.startDate.localeCompare(b.startDate)).map((entry,index)=>({
      ...entry,id:'work-'+entry.startDate,kind:en?'PROFESSIONAL PRACTICE':'工作经历',
      station:en?(index===0?'Qiqige Technology':'Jiatailihua'):(index===0?'柒柒戈科技':'迦太利华'),
      title:en?(index===0?'Qiqige Technology':'Jiatailihua'):(index===0?'柒柒戈科技':'迦太利华'),
      subtitle:entry.role,
      tags:en?(index===0?['Product messaging','Video scripts','Post-production']:['6-person team','AIGC production','Project leadership']):
        (index===0?['卖点拆解','视频脚本','后期剪辑']:['6 人团队','AIGC 制作','项目统筹'])
    }))
  ],[profile,en,dossier]);
  const count=items.length,item=items[selected],serial=String(selected+1).padStart(2,'0');
  const select=useCallback(index=>setSelected(clamp(index,0,count-1)),[count]);
  const advance=useCallback(direction=>setSelected(value=>clamp(value+direction,0,count-1)),[count]);
  useEffect(()=>{
    const element=region.current;
    const handleWheel=event=>{
      if(event.ctrlKey||event.metaKey||event.deltaY===0||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest('details'))return;
      event.preventDefault();
      const now=performance.now(),gesture=wheel.current;
      if(now-gesture.last>180)gesture.sum=0;
      gesture.last=now;
      if(now-gesture.switched<380)return;
      const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?element.clientHeight:1);
      gesture.sum+=clamp(pixels,-120,120);
      if(Math.abs(gesture.sum)>=36){advance(Math.sign(gesture.sum));gesture.sum=0;gesture.switched=now;}
    };
    element.addEventListener('wheel',handleWheel,{passive:false});
    return()=>element.removeEventListener('wheel',handleWheel);
  },[advance]);
  const handleKeys=(event,index)=>{
    if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key))return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?count-1:clamp(index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1),0,count-1);
    select(next);tabs.current[next]?.focus();
  };
  return <section id="practice" className="practice-chapter station-practice"><div className="container">
    <div className="chapter-topline"><span>02 / SELECTED PRACTICE</span><span>H.GZ / EDUCATION & EXPERIENCE</span></div>
    <header className="station-heading"><h2><TextPressure as="b" text={en?'Every step,':'每一站，'} strength={.065}/><span><TextPressure as="b" text={en?'counts.':'都算数。'} strength={.065}/></span></h2>
      <p>{en?'From visual communication to leading a six-person AI team. Every step shapes the next creative chapter.':'从视觉传达到六人 AI 团队，每一段经历，都是下一次创作的起点。'}</p>
    </header>
    <div className="station-experience" ref={region} onPointerLeave={()=>{wheel.current.sum=0;}}>
      <div className="station-route" style={{'--station-progress':selected/(count-1)}}><div className="station-route-line" aria-hidden="true"><i/></div>
        <div className="station-tabs" role="tablist" aria-label={en?'Education and work in chronological order':'按时间顺序的教育与工作经历'}>
          {items.map((entry,index)=><button type="button" role="tab" id={'career-tab-'+index} aria-controls="career-panel" aria-selected={selected===index} tabIndex={selected===index?0:-1}
            ref={node=>{tabs.current[index]=node;}} key={entry.id} onClick={()=>select(index)} onKeyDown={event=>handleKeys(event,index)}>
            <span className="station-dot">{String(index+1).padStart(2,'0')}</span><strong><TextPressure text={entry.station} baseWeight={500}/></strong><span className="station-date">{entry.period}</span>
          </button>)}
        </div>
      </div>
      <div id="career-panel" role="tabpanel" aria-labelledby={'career-tab-'+selected} tabIndex={0} className="station-detail">
        <div className="station-panel-main" key={item.id}>
          <span className="station-serial" aria-hidden="true">{serial}</span>
          <div className="station-identity" aria-live="polite" aria-atomic="true">
            <span className="station-kicker"><TextPressure text={item.kind+' / '+item.period} baseWeight={400}/></span>
            <h3><TextPressure as="b" text={item.title} strength={.045}/></h3>
            <p className="station-role"><TextPressure text={item.subtitle} baseWeight={400}/></p>
            {item.company&&<p className="station-company">{item.company}</p>}
          </div>
          <div className="station-narrative"><p>{item.detail}</p><ul className="station-tags" aria-label={en?'Areas of practice':'实践方向'}>{item.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>
            {item.awards&&<ul className="station-awards" aria-label={en?'Recognition':'荣誉与认可'}>{item.awards.map(award=><li key={award}>{award}</li>)}</ul>}
            {item.id==='education'&&<p className="station-education-project">{dossier.educationProject}</p>}
          </div>
        </div>
        {item.highlights?.length>0&&<details className="station-responsibilities" key={"responsibilities-"+item.id}><summary><span>{en?'RESPONSIBILITIES & SELECTED PROJECTS':'工作职责与项目细节'}</span><i aria-hidden="true">+</i></summary>
          <dl>{item.highlights.map(highlight=><div key={highlight.title}><dt>{highlight.title}</dt><dd>{highlight.text}</dd></div>)}</dl>
        </details>}
        {item.startDate==='2026-04'&&<CareerDossier content={dossier} projects={projects} onOpen={onOpen}/>}
      </div>
    </div>
    <div className="station-bottomline"><p>{en?'Select a station · Scroll here to move through experiences':'点击站点展开履历 · 鼠标在经历区域时，滚轮切换经历'}</p><span>{serial} / {String(count).padStart(2,'0')} <i aria-hidden="true">→</i></span></div>
    <div className="station-toolkit"><details><summary><span>{en?'MY CREATIVE TOOLKIT':'我的创作工具'}</span><i aria-hidden="true">+</i></summary><div>{profile.tools.map(tool=><span key={tool}>{tool}</span>)}</div></details></div>
  </div></section>;
}
