/* V58 stable boot and presentation: pure backgrounds + independent character layer. */
(()=>{'use strict';
const scene=document.getElementById('scene');if(!scene)return;
const genericFor=nodeId=>{try{const key=nodes?.[nodeId]?.scene;return sceneImg?.[key]||sceneImg?.store||''}catch{return''}};
const suyanBase='assets/story/characters/suyan-western-transparent/webp/';
const suyanAssets={full:suyanBase+'suyan-western-fullbody.webp',dialogue:suyanBase+'suyan-western-dialogue-bust.webp',medicine:suyanBase+'suyan-western-medicine.webp',seated:suyanBase+'suyan-western-seated.webp'};
Object.values(suyanAssets).forEach(src=>{const image=new Image();image.decoding='async';image.src=src});
function killLoader(){document.querySelectorAll('.release-loader').forEach(x=>x.remove());document.documentElement.dataset.lastLightBoot='v58'}
function resetCharacterBox(character){for(const key of ['left','right','top','bottom','width','height','transform','opacity'])character.style.removeProperty(key);delete character.dataset.stageLabel;character.removeAttribute('data-suyan-pose')}
function isSuyanNode(){try{return ['dawn','alley','c2_suyan'].includes(s.node)||['苏妍','Su Yan'].includes(nodes?.[s.node]?.speaker)}catch{return false}}
function selectSuyanPose(){if(s?.node==='c2_suyan')return 'seated';const text=String(typeof nodes?.[s.node]?.text==='function'?nodes[s.node].text(s):nodes?.[s.node]?.text||'');if(/药|medicine/i.test(text))return'medicine';if(scene.classList.contains('shot-person')||scene.classList.contains('dialogue-playing'))return'dialogue';return'full'}
function syncCharacter(){const character=document.getElementById('character');if(!character)return;resetCharacterBox(character);if(isSuyanNode()){const pose=selectSuyanPose();character.dataset.v58Character='suyan';character.dataset.v58Pose=pose;character.style.backgroundImage=`url('${suyanAssets[pose]}')`;character.classList.add('show');character.setAttribute('aria-label','Su Yan');return}delete character.dataset.v58Character;delete character.dataset.v58Pose;try{if(typeof showPose==='function')showPose(0)}catch{}}
function syncPureStage(){killLoader();scene.classList.remove('integrated-cast');scene.classList.add('v58-pure-stage');scene.dataset.stageNode=typeof s!=='undefined'?s.node:'';const background=genericFor(typeof s!=='undefined'?s.node:'');if(background)scene.style.backgroundImage=`url('${background}')`;syncCharacter()}
/* Route events keep their interaction, but no longer use character-baked CGs. */
try{if(typeof routeScenes!=='undefined')Object.entries(routeScenes).forEach(([key,data])=>{const next=key.split('>')[1];const bg=genericFor(next);if(bg)data.asset=bg})}catch{}
/* Apply after every render. */
try{if(typeof render==='function'){const previousRender=render;render=function(){const out=previousRender.apply(this,arguments);syncPureStage();return out}}}catch{}
/* Class changes switch the independent pose without a broad DOM observer. */
new MutationObserver(()=>{syncCharacter();killLoader()}).observe(scene,{attributes:true,attributeFilter:['class']});
addEventListener('DOMContentLoaded',syncPureStage,{once:true});addEventListener('load',syncPureStage,{once:true});
setTimeout(syncPureStage,0);setTimeout(syncPureStage,500);setTimeout(syncPureStage,1800);
window.LastLightV58={sync:syncPureStage,killLoader};
})();
