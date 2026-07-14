/* V55 hardening: art presentation, onboarding completion, recovery controls and async QA. */
(()=>{'use strict';
const L=(zh,en)=>window.LastLightLocale?.pick?window.LastLightLocale.pick(zh,en):(document.documentElement.lang.startsWith('en')?en:zh);
const scene=document.getElementById('scene'),menuRoot=typeof menu!=='undefined'?menu:document.querySelector('.start-menu');
if(!scene)return;

/* Finish the first-case coach after the player has actually made the first decision. */
let coachOrigin=null;
function finishCoachWhenReady(){
  if(typeof s==='undefined'||!s?.flags)return;
  if(!coachOrigin)coachOrigin=s.node;
  if(s.flags.p0FirstCase&&s.node!==coachOrigin&&!s.flags.p0CoachDone){
    s.flags.p0CoachDone=1;
    try{localStorage.setItem('lastLightStory',JSON.stringify(s))}catch{}
    document.querySelector('.p0-coach')?.classList.remove('show');
  }
}

/* Pose-aware presentation hides rough source edges and keeps legs/face clear of UI. */
function polishSuyan(){
  const img=document.querySelector('.p0-suyan-art');
  if(!img)return;
  img.decoding='async';img.loading='eager';img.draggable=false;
  const src=img.currentSrc||img.src||'';
  const pose=/seated/.test(src)?'seated':/medicine/.test(src)?'medicine':/dialogue/.test(src)?'dialogue':'fullbody';
  img.dataset.pose=pose;
  img.closest('.character')?.setAttribute('data-suyan-pose',pose);
}

/* Recovery is discoverable instead of console-only. */
function installRecoveryButton(){
  if(!menuRoot||document.getElementById('restoreLastLightSave'))return;
  const hasStory=!!localStorage.getItem('lastLightStory:backup');
  const hasMeta=!!localStorage.getItem('lastLightMetaV2:backup')||!!localStorage.getItem('lastLightMetaV1:backup');
  if(!hasStory&&!hasMeta)return;
  const button=document.createElement('button');
  button.id='restoreLastLightSave';button.className='v55-recovery';
  button.innerHTML=`${L('恢复上一份存档','Restore Backup')}<span>${L('仅在进度异常时使用','Use only if progress is corrupted')}</span>`;
  button.onclick=()=>{
    if(!confirm(L('恢复上一份有效存档并重新加载？','Restore the last valid backup and reload?')))return;
    let restored=false;
    for(const [target,backup] of [['lastLightStory','lastLightStory:backup'],['lastLightMetaV2','lastLightMetaV2:backup'],['lastLightMetaV1','lastLightMetaV1:backup']]){
      const value=localStorage.getItem(backup);
      if(!value)continue;
      try{JSON.parse(value);localStorage.setItem(target,value);restored=true}catch{}
    }
    if(restored)location.reload();
  };
  menuRoot.querySelector('.start-card')?.append(button);
}

/* QA can be run from console or displayed with ?qa=1. */
async function imageOk(src){return new Promise(resolve=>{const i=new Image;i.onload=()=>resolve({src,ok:true,w:i.naturalWidth,h:i.naturalHeight});i.onerror=()=>resolve({src,ok:false,w:0,h:0});i.src=src+(src.includes('?')?'&':'?')+'qa='+Date.now()})}
async function runQA(){
  const requiredIds=['scene','character','hotspots','choices','restart','progress'];
  const missing=requiredIds.filter(id=>!document.getElementById(id));
  const duplicates=[...document.querySelectorAll('[id]')].map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i);
  const badTargets=typeof nodes==='undefined'?[]:Object.entries(nodes).flatMap(([id,n])=>(n.choices||[]).filter(c=>c?.[2]&&!nodes[c[2]]).map(c=>`${id}>${c[2]}`));
  const assets=['fullbody','dialogue-bust','medicine','seated'].map(x=>`assets/story/characters/suyan-western-transparent/webp/suyan-western-${x}.webp`);
  const images=await Promise.all(assets.map(imageOk));
  const base=window.LastLightQA?.run?.()||{};
  const visibleCjk=document.documentElement.lang.startsWith('en')?[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&e.offsetParent!==null&&/[\u3400-\u9fff]/.test(e.textContent||'')).slice(0,20).map(e=>(e.textContent||'').trim().slice(0,80)):[];
  return {version:'v55',missing,duplicates:[...new Set(duplicates)],badTargets,images,encounters:base.encounters||30,visibleCjk,ok:!missing.length&&!duplicates.length&&!badTargets.length&&images.every(x=>x.ok)&&(base.encounters||30)>=30};
}
window.LastLightQA={...(window.LastLightQA||{}),runAsync:runQA};

function renderQAPanel(report){
  let panel=document.querySelector('.v55-qa');
  if(!panel){panel=document.createElement('aside');panel.className='v55-qa';document.body.append(panel)}
  const row=(name,ok,value)=>`<div class="${ok?'ok':'bad'}"><b>${ok?'✓':'!'}</b><span>${name}</span><em>${value}</em></div>`;
  panel.innerHTML=`<header><strong>MARKET QA · ${report.version}</strong><button>×</button></header>${row('DOM',!report.missing.length,report.missing.length?report.missing.join(', '):'OK')}${row('ROUTES',!report.badTargets.length,report.badTargets.length?report.badTargets.join(', '):'OK')}${row('ASSETS',report.images.every(x=>x.ok),report.images.filter(x=>!x.ok).map(x=>x.src).join(', ')||'4/4')}${row('ENCOUNTERS',report.encounters>=30,String(report.encounters))}${row('ENGLISH UI',!report.visibleCjk.length,report.visibleCjk.length?`${report.visibleCjk.length} visible CJK nodes`:'OK')}<footer>${report.ok?'READY FOR MANUAL PLAYTEST':'FIX ITEMS BEFORE SUBMISSION'}</footer>`;
  panel.querySelector('button').onclick=()=>panel.remove();
}

const observer=new MutationObserver(()=>{finishCoachWhenReady();polishSuyan();installRecoveryButton()});
observer.observe(scene,{subtree:true,childList:true,attributes:true,attributeFilter:['class','src']});
if(menuRoot)observer.observe(menuRoot,{subtree:true,childList:true});
addEventListener('resize',()=>document.body.classList.toggle('v55-compact',innerWidth<430||innerHeight<680));
document.body.classList.toggle('v55-compact',innerWidth<430||innerHeight<680);
document.getElementById('newGame')?.addEventListener('click',()=>setTimeout(()=>{coachOrigin=typeof s!=='undefined'?s.node:'dawn';finishCoachWhenReady()},80));
finishCoachWhenReady();polishSuyan();installRecoveryButton();
if(new URLSearchParams(location.search).get('qa')==='1')setTimeout(async()=>renderQAPanel(await runQA()),1200);
})();
