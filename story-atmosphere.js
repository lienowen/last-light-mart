/* Two depth rain fields: back rain establishes distance, front rain embeds people in weather. */
const rainBack=document.createElement('canvas'),rainFront=document.createElement('canvas');
rainBack.className='rain-canvas rain-back';rainFront.className='rain-canvas rain-front';sceneEl.insertBefore(rainBack,sceneEl.firstChild);sceneEl.appendChild(rainFront);
const humanGround=document.createElement('div');humanGround.className='human-ground';sceneEl.appendChild(humanGround);
const humanRim=document.createElement('div');humanRim.className='human-rim';sceneEl.appendChild(humanRim);

let rainWidth=0,rainHeight=0,rainDpr=1,rainIntensity=.7,rainRunning=true,rainLast=performance.now(),rainTime=0;
let backDrops=[],frontDrops=[],rainSplashes=[],lensDrops=[];
const backCtx=rainBack.getContext('2d',{alpha:true}),frontCtx=rainFront.getContext('2d',{alpha:true});
function newDrop(front=false,randomY=true){
  const depth=front?.72+Math.random()*.5:.22+Math.random()*.55;
  return {x:Math.random()*rainWidth*1.25-rainWidth*.12,y:randomY?Math.random()*rainHeight:-Math.random()*120,z:depth,len:(front?20:9)+Math.random()*(front?32:17),speed:(front?760:380)+Math.random()*(front?520:430),width:(front?.7:.35)+Math.random()*(front?1.15:.55),phase:Math.random()*6.28};
}
function resizeRain(){
  const rect=sceneEl.getBoundingClientRect();rainWidth=Math.max(1,rect.width);rainHeight=Math.max(1,rect.height);rainDpr=Math.min(window.devicePixelRatio||1,1.25);
  for(const canvas of [rainBack,rainFront]){canvas.width=Math.round(rainWidth*rainDpr);canvas.height=Math.round(rainHeight*rainDpr);canvas.style.width=rainWidth+'px';canvas.style.height=rainHeight+'px'}
  backCtx.setTransform(rainDpr,0,0,rainDpr,0,0);frontCtx.setTransform(rainDpr,0,0,rainDpr,0,0);
  backDrops=Array.from({length:108},()=>newDrop(false));frontDrops=Array.from({length:48},()=>newDrop(true));
  lensDrops=Array.from({length:12},()=>({x:.08+Math.random()*.84,y:.12+Math.random()*.68,r:3+Math.random()*8,stretch:.7+Math.random()*1.5}));
}
function resetDrop(drop,front){Object.assign(drop,newDrop(front,false))}
function addSplash(x,y,strong){
  if(rainSplashes.length>34)return;rainSplashes.push({x,y,life:0,max:.18+Math.random()*.16,strong});
}
function drawRainField(ctx,drops,front,dt){
  ctx.clearRect(0,0,rainWidth,rainHeight);if(rainIntensity<.03)return;
  const wind=65+Math.sin(rainTime*.00031)*28,ground=rainHeight*(front?.69:.76);
  ctx.lineCap='round';ctx.strokeStyle=front?'rgba(205,232,239,.52)':'rgba(178,209,218,.34)';ctx.beginPath();
  for(const d of drops){
    d.y+=d.speed*dt*(.45+rainIntensity*.75);d.x+=(wind+d.z*35)*dt;const wobble=Math.sin(rainTime*.002+d.phase)*1.2;
    ctx.moveTo(d.x+wobble,d.y);ctx.lineTo(d.x-wind*.055-d.z*3+wobble,d.y-d.len*(.55+rainIntensity*.45));
    if(d.y>ground&&Math.random()<.18*rainIntensity)addSplash(d.x,ground+Math.random()*rainHeight*.16,front);
    if(d.y>rainHeight+50||d.x>rainWidth+70)resetDrop(d,front);
  }
  ctx.lineWidth=front?1.35:.65;ctx.globalAlpha=Math.min(1,.22+rainIntensity*.78);ctx.stroke();ctx.globalAlpha=1;
  if(front){
    for(const drop of lensDrops){const x=drop.x*rainWidth,y=drop.y*rainHeight,r=drop.r*(.7+rainIntensity*.35);ctx.beginPath();ctx.ellipse(x,y,r*.72,r*drop.stretch,0,0,Math.PI*2);ctx.strokeStyle='rgba(215,238,242,'+(.035+rainIntensity*.06)+')';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(x-r*.18,y-r*.25,Math.max(1,r*.16),0,Math.PI*2);ctx.fillStyle='rgba(238,249,250,'+(.04+rainIntensity*.05)+')';ctx.fill()}
  }
}
function drawSplashes(dt){
  for(let i=rainSplashes.length-1;i>=0;i--){const s=rainSplashes[i];s.life+=dt;if(s.life>s.max){rainSplashes.splice(i,1);continue}const p=s.life/s.max,r=(s.strong?12:7)*p;frontCtx.beginPath();frontCtx.ellipse(s.x,s.y,r,r*.25,0,Math.PI,Math.PI*2);frontCtx.strokeStyle='rgba(210,235,240,'+(1-p)*.32*rainIntensity+')';frontCtx.lineWidth=s.strong?1.1:.7;frontCtx.stroke();for(let n=0;n<2;n++){frontCtx.beginPath();frontCtx.arc(s.x+(n?1:-1)*r*.45,s.y-r*(.22+n*.12),Math.max(.5,(1-p)*1.2),0,Math.PI*2);frontCtx.fillStyle='rgba(220,241,244,'+(1-p)*.3+')';frontCtx.fill()}}
}
function rainFrame(now){
  if(!rainRunning){rainLast=now;requestAnimationFrame(rainFrame);return}
  if(now-rainLast<32){requestAnimationFrame(rainFrame);return}
  const dt=Math.min(.05,(now-rainLast)/1000||.033);rainLast=now;rainTime=now;drawRainField(backCtx,backDrops,false,dt);drawRainField(frontCtx,frontDrops,true,dt);drawSplashes(dt);requestAnimationFrame(rainFrame)
}
function sceneWeather(){
  const sceneType=nodes[s.node]?.scene||'backroom';let mode='storm',level=.84;
  if(s.node==='tunnel'){mode='dry';level=.08}else if(sceneType==='backroom'){mode='indoor';level=.4}else if(sceneType==='store'){mode='shelter';level=.62}else if(sceneType==='rooftop'){mode='storm';level=1}
  sceneEl.dataset.weather=mode;rainIntensity=level;
  if(typeof releaseRain!=='undefined'&&releaseRain?.gain&&typeof releaseAudio!=='undefined'&&releaseAudio){const target=.008+level*.025;releaseRain.gain.gain.setTargetAtTime(target,releaseAudio.currentTime,.5)}
}
function maybeLightning(){if(sceneEl.dataset.weather!=='storm'||document.hidden)return;if(Math.random()<.62){sceneEl.classList.remove('lightning');void sceneEl.offsetWidth;sceneEl.classList.add('lightning');if(typeof playTone==='function'&&Math.random()<.26)setTimeout(()=>playTone('danger'),420)}}
// Keep investigation targets on the environment, never pasted over a person's body.
const humanSafeHotspots={clinic:[[12,69],[78,43]],diagnose:[[12,69],[78,56]],courtyard:[[12,72],[78,25]],search:[[12,63],[78,38]],radio:[[12,68],[78,25]]};
for(const [nodeId,positions] of Object.entries(humanSafeHotspots)){(investigations[nodeId]||[]).forEach((item,index)=>{if(positions[index]){item[1]=positions[index][0];item[2]=positions[index][1]}})}
const baseRenderAtmosphere=render;render=function(){baseRenderAtmosphere();sceneWeather()};
const baseShowPoseAtmosphere=showPose;showPose=function(index=0){baseShowPoseAtmosphere(index);humanGround.style.display=$('character').classList.contains('show')?'block':'none';humanRim.style.display=humanGround.style.display};
new ResizeObserver(resizeRain).observe(sceneEl);document.addEventListener('visibilitychange',()=>{rainRunning=!document.hidden;rainLast=performance.now()});
resizeRain();sceneWeather();requestAnimationFrame(rainFrame);setInterval(maybeLightning,8500);render();


