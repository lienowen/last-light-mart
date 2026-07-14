/* Touch-first direct manipulation. Tap remains supported; dragging is the primary physical action. */
const dragGhost=document.createElement('div');dragGhost.className='drag-ghost';dragGhost.hidden=true;document.body.appendChild(dragGhost);
const dragLine=document.createElement('div');dragLine.className='drag-line';dragLine.hidden=true;document.body.appendChild(dragLine);
const dragTip=document.createElement('div');dragTip.className='drag-tip';dragTip.hidden=true;dragTip.textContent='拖到人物或发光物体上';document.body.appendChild(dragTip);
let worldDrag=null,dropElement=null,suppressWorldClick=0;

function targetAtPoint(x,y){
  const stack=document.elementsFromPoint(x,y);
  for(const el of stack){const spot=el.closest?.('.hotspot');if(spot)return {el:spot,id:spot.dataset.targetId||'scene'};const actor=el.closest?.('#character.show');if(actor)return {el:actor,id:'character'}}
  return null;
}
function setDropTarget(next){
  if(dropElement===next?.el)return;if(dropElement)dropElement.classList.remove('drop-target');dropElement=next?.el||null;if(dropElement){dropElement.classList.add('drop-target');if(typeof buzz==='function')buzz(8)}
}
function positionDrag(x,y){
  dragGhost.style.left=x+'px';dragGhost.style.top=y+'px';const dx=x-worldDrag.sx,dy=y-worldDrag.sy,len=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI;dragLine.style.left=worldDrag.sx+'px';dragLine.style.top=worldDrag.sy+'px';dragLine.style.width=len+'px';dragLine.style.transform='rotate('+angle+'deg)';setDropTarget(targetAtPoint(x,y));
}
function beginWorldDrag(e,button,itemId){
  if(resourceItems.includes(itemId)&&itemCount(itemId)<=0){say(itemLabels[itemId]+'已经用完。');return}
  worldDrag={pointer:e.pointerId,button,itemId,sx:e.clientX,sy:e.clientY,moved:false};button.setPointerCapture?.(e.pointerId);
}
function moveWorldDrag(e){
  if(!worldDrag||e.pointerId!==worldDrag.pointer)return;const distance=Math.hypot(e.clientX-worldDrag.sx,e.clientY-worldDrag.sy);
  if(!worldDrag.moved&&distance>7){worldDrag.moved=true;worldDrag.button.classList.add('drag-source');dragGhost.innerHTML='<span>'+itemLabels[worldDrag.itemId]+'</span><b>'+ (resourceItems.includes(worldDrag.itemId)?'×'+itemCount(worldDrag.itemId):'线索') +'</b>';dragGhost.hidden=false;dragLine.hidden=false;dragTip.hidden=false;document.body.classList.add('dragging-world');if(typeof buzz==='function')buzz(12)}
  if(worldDrag.moved){e.preventDefault();positionDrag(e.clientX,e.clientY)}
}
function endWorldDrag(e){
  if(!worldDrag||e.pointerId!==worldDrag.pointer)return;const state=worldDrag,hit=state.moved?targetAtPoint(e.clientX,e.clientY):null;
  if(state.moved){e.preventDefault();suppressWorldClick=Date.now()+420;selectItem(state.itemId);if(hit){tryUse(hit.id)}else{s.selectedItem=null;renderActionTray();say('把「'+itemLabels[state.itemId]+'」拖到人物或发光物体上。');sceneEl.classList.remove('drop-reject');void sceneEl.offsetWidth;sceneEl.classList.add('drop-reject')}}
  state.button.classList.remove('drag-source');setDropTarget(null);dragGhost.hidden=true;dragLine.hidden=true;dragTip.hidden=true;document.body.classList.remove('dragging-world');worldDrag=null;
}
window.addEventListener('pointermove',moveWorldDrag,{passive:false});window.addEventListener('pointerup',endWorldDrag,{passive:false});window.addEventListener('pointercancel',endWorldDrag,{passive:false});
document.addEventListener('click',e=>{if(Date.now()<suppressWorldClick){e.preventDefault();e.stopImmediatePropagation()}},true);

const baseTrayPhysical=renderActionTray;renderActionTray=function(){
  baseTrayPhysical();const ids=selectableItems();actionTray.querySelectorAll('.action-item').forEach((button,index)=>{const id=ids[index];button.dataset.itemId=id;button.addEventListener('pointerdown',e=>beginWorldDrag(e,button,id))});
};
const baseInteractionsPhysical=renderInteractions;renderInteractions=function(){
  baseInteractionsPhysical();const items=investigations[s.node]||[];$('hotspots').querySelectorAll('.hotspot').forEach((button,index)=>{button.dataset.targetId=items[index]?.[0]||'scene';let holdTimer;button.addEventListener('pointerdown',()=>{button.classList.add('holding');holdTimer=setTimeout(()=>{if(typeof buzz==='function')buzz(16)},420)});const stop=()=>{clearTimeout(holdTimer);button.classList.remove('holding')};button.addEventListener('pointerup',stop);button.addEventListener('pointercancel',stop);button.addEventListener('pointerleave',stop)})
};

sceneEl.addEventListener('pointermove',e=>{
  if(worldDrag||e.pointerType!=='mouse')return;const r=sceneEl.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;sceneEl.classList.add('looking');sceneEl.style.setProperty('--look-x',(-nx*8).toFixed(1)+'px');sceneEl.style.setProperty('--look-y',(-ny*5).toFixed(1)+'px');$('character').style.setProperty('--look-r',(nx*.22).toFixed(2)+'deg')
});
sceneEl.addEventListener('pointerleave',()=>{sceneEl.classList.remove('looking');sceneEl.style.setProperty('--look-x','0px');sceneEl.style.setProperty('--look-y','0px');$('character').style.setProperty('--look-r','0deg')});

const baseRenderPhysical=render;render=function(){baseRenderPhysical()};
render();

