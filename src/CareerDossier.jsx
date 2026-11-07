import React from 'react';
import TextPressure from './TextPressure';
export default function CareerDossier({content,projects=[],onOpen}){
 return <div className="career-dossier">
   <header><div><span className="station-kicker">SELECTED WORK / IN PRACTICE</span><h4><TextPressure text={content.casesTitle} baseWeight={600}/></h4></div><p>{content.casesNote}</p></header>
   <div className="career-case-grid">{content.cases.map((entry,index)=><details className="career-case" key={entry.filmId}>
     <summary><span className="career-case-index">0{index+1}</span><div><h5><TextPressure text={entry.title} baseWeight={600}/></h5><span>{entry.role}</span><p>{entry.summary}</p></div><i aria-hidden="true">+</i></summary>
     <div className="career-case-body"><dl>{entry.sections.map(section=><div key={section.title}><dt>{section.title}</dt><dd>{section.text}</dd></div>)}</dl>
       {projects.some(project=>project.id===entry.filmId)&&<button type="button" onClick={()=>onOpen?.(entry.filmId)}>{content.play}<span aria-hidden="true">↗</span></button>}
     </div>
   </details>)}</div>
   <details className="career-workflow"><summary><div><span className="station-kicker">{content.workflowLabel}</span><h4><TextPressure text={content.workflowTitle} baseWeight={600}/></h4></div><i aria-hidden="true">+</i></summary>
     <ol>{content.steps.map(([title,text],index)=><li key={title}><span>{String(index+1).padStart(2,'0')}</span><div><h5>{title}</h5><p>{text}</p></div></li>)}</ol>
     <div className="career-skill"><h4><TextPressure text={content.skillTitle} baseWeight={600}/></h4><dl>{content.skill.map(([title,text])=><div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl></div>
   </details>
 </div>;
}
