/* Release feedback layer. Keeps the chapter data in story.js/story-v9.js. */
let storedReleasePrefs={};
try{storedReleasePrefs=JSON.parse(localStorage.getItem('lastLightPrefs')||'{}')||{}}catch{localStorage.removeItem('lastLightPrefs')}
const releasePrefs={sound:true,vibration:true,...storedReleasePrefs};
let releaseAudio=null,releaseRain=null,releaseTutorial=0,releaseTutorialDone=localStorage.getItem('lastLightTutorialV10')==='1';

const headerNode=document.querySelector('#scene>header');
const menuButton=$('restart');
const headerTools=document.createElement('div');headerTools.className='header-tools';
menuButton.parentNode.replaceChild(headerTools,menuButton);headerTools.appendChild(menuButton);
const soundButton=document.createElement('button');soundButton.id='soundToggle';soundButton.className='sound-toggle';headerTools.appendChild(soundButton);
const saveState=document.createElement('div');saveState.id='saveState';saveState.className='save-state';saveState.textContent='● 自动存档';sceneEl.appendChild(saveState);
const coach=document.createElement('div');coach.id='coach';coach.className='coach';sceneEl.appendChild(coach);
const systemModal=document.createElement('div');systemModal.id='systemModal';systemModal.className='system-modal';sceneEl.appendChild(systemModal);

function persistPrefs(){localStorage.setItem('lastLightPrefs',JSON.stringify(releasePrefs));updateSoundButton()}
function updateSoundButton(){soundButton.textContent=releasePrefs.sound?'♪':'×';soundButton.title=releasePrefs.sound?'关闭声音':'打开声音';soundButton.setAttribute('aria-label',soundButton.title)}
function ensureAudio(){
  if(!releasePrefs.sound)return;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  if(!releaseAudio)releaseAudio=new AC();if(releaseAudio.state==='suspended')releaseAudio.resume();
  if(releaseRain)return;
  const length=releaseAudio.sampleRate*2,buffer=releaseAudio.createBuffer(1,length,releaseAudio.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(.45+.55*Math.sin(i/977));
  const src=releaseAudio.createBufferSource(),filter=releaseAudio.createBiquadFilter(),gain=releaseAudio.createGain();src.buffer=buffer;src.loop=true;filter.type='lowpass';filter.frequency.value=1050;gain.gain.value=.026;src.connect(filter).connect(gain).connect(releaseAudio.destination);src.start();releaseRain={src,gain};
}
function stopRain(){if(releaseRain){try{releaseRain.src.stop()}catch{}releaseRain=null}}
function playTone(kind='tap'){
  if(!releasePrefs.sound)return;ensureAudio();if(!releaseAudio)return;
  const now=releaseAudio.currentTime,osc=releaseAudio.createOscillator(),gain=releaseAudio.createGain();
  const tones={tap:[260,.018,.045],clue:[520,.035,.12],bond:[392,.05,.22],danger:[105,.06,.3],ending:[659,.05,.45]};const [hz,vol,len]=tones[kind]||tones.tap;
  osc.type=kind==='danger'?'sawtooth':'sine';osc.frequency.setValueAtTime(hz,now);if(kind==='clue'||kind==='ending')osc.frequency.exponentialRampToValueAtTime(hz*1.5,now+len);gain.gain.setValueAtTime(vol,now);gain.gain.exponentialRampToValueAtTime(.001,now+len);osc.connect(gain).connect(releaseAudio.destination);osc.start(now);osc.stop(now+len);
}
function buzz(pattern=18){if(releasePrefs.vibration&&navigator.vibrate)navigator.vibrate(pattern)}
function pulseSave(){saveState.classList.remove('pulse');void saveState.offsetWidth;saveState.classList.add('pulse')}
function positiveFlash(){sceneEl.classList.remove('flash-good');void sceneEl.offsetWidth;sceneEl.classList.add('flash-good')}
updateSoundButton();
soundButton.onclick=()=>{releasePrefs.sound=!releasePrefs.sound;if(releasePrefs.sound){ensureAudio();playTone('clue')}else stopRain();persistPrefs()};
document.addEventListener('pointerdown',ensureAudio,{once:true});
document.addEventListener('click',e=>{if(e.target.closest('button'))playTone('tap')},{capture:true});

const tutorialCopy={
  1:['先听人物说完','点击画面中的人物。对话会提供调查方向，也会影响你之后能做出的决定。'],
  2:['调查异常位置','点击画面里带金色光圈的位置，靠近查看证物。'],
  3:['亲手检查证物','先完成检查动作，再拖动出现的滑块，把细节看清楚。'],
  4:['整理完整证据','继续调查另一处异常。证物齐全后，点击“整理证据 · 作出推断”。'],
  5:['根据推断行动','选择最符合证据的结论。推断完成后，再从底部选择你的行动路线。']
};
function showTutorial(step){
  releaseTutorial=step;const copy=tutorialCopy[step];if(!copy){coach.classList.remove('show');return}
  coach.innerHTML='<b>'+copy[0]+'</b><p>'+copy[1]+'</p><div class="coach-foot"><span class="coach-dots">'+[1,2,3,4,5].map(i=>'<i class="'+(i<=step?'on':'')+'"></i>').join('')+'</span><button id="skipCoach">跳过教学</button></div>';coach.classList.add('show');
  $('skipCoach').onclick=completeTutorial;
}
function beginTutorial(force=false){if(releaseTutorialDone&&!force)return;showTutorial(1)}
function completeTutorial(){releaseTutorial=0;releaseTutorialDone=true;localStorage.setItem('lastLightTutorialV10','1');coach.classList.remove('show');flashChange('教学完成','以后可在设置中重新查看')}
function tutorialAfterClick(e){
  const target=e.target;
  if(releaseTutorial===1&&target.closest('#character'))showTutorial(2);
  else if(releaseTutorial===2&&target.closest('.hotspot'))showTutorial(3);
  else if(releaseTutorial===4&&target.closest('.case-button'))showTutorial(5);
  else if(releaseTutorial===5&&target.closest('#choices button'))setTimeout(completeTutorial,160);
}
function tutorialAfterInput(e){
  if(releaseTutorial===3&&e.target.matches('.evidence-operation input[type="range"]')&&Number(e.target.value)>=96)showTutorial(4);
}
document.addEventListener('click',tutorialAfterClick,true);
document.addEventListener('input',tutorialAfterInput,true);

const endingCatalog=[
  ['decoy','无人生还名单','让敌人追逐幽灵，让所有活人离开。'],
  ['tunnel','灯灭之后','全员从地下撤离，城市再也找不到你们。'],
  ['clinic','街区仍在','牺牲物资，换来彼此保护的街区。'],
  ['store','满载而去','保住货架，却留下永远熄灭的诊所。'],
  ['lost','错误坐标','准备不足，让每个选择都像放弃。']
];
function collectedEndings(){try{return JSON.parse(localStorage.getItem('lastLightEndings')||'[]')}catch{return[]}}
function openArchive(){
  const owned=collectedEndings();systemModal.innerHTML='<section class="system-card"><button class="system-close" id="closeSystem">关闭</button><h2>结局档案</h2><p>同一个雨夜，会因为你碰过的东西、相信的人而改变。</p><div class="archive-grid">'+endingCatalog.map(([id,title,desc])=>'<article class="ending-card '+(owned.includes(id)?'':'locked')+'"><b>'+(owned.includes(id)?title:'未解锁')+'</b><span>'+(owned.includes(id)?desc:'继续调查，寻找另一种可能。')+'</span></article>').join('')+'</div><div class="archive-count">已收集 '+owned.length+' / 5</div></section>';systemModal.classList.add('show');$('closeSystem').onclick=closeSystem;
}
function openSettings(){
  systemModal.innerHTML='<section class="system-card"><button class="system-close" id="closeSystem">关闭</button><h2>游戏设置</h2><p>声音会使用轻微的雨声与操作提示音。</p><div class="setting-list"><div class="setting-row"><span>环境声音</span><button id="settingSound" class="switch '+(releasePrefs.sound?'on':'')+'">'+(releasePrefs.sound?'开启':'关闭')+'</button></div><div class="setting-row"><span>触感反馈</span><button id="settingVibe" class="switch '+(releasePrefs.vibration?'on':'')+'">'+(releasePrefs.vibration?'开启':'关闭')+'</button></div><div class="setting-row"><span>操作教学</span><button id="replayCoach" class="switch">重新播放</button></div></div></section>';systemModal.classList.add('show');$('closeSystem').onclick=closeSystem;
  $('settingSound').onclick=()=>{releasePrefs.sound=!releasePrefs.sound;if(releasePrefs.sound)ensureAudio();else stopRain();persistPrefs();openSettings()};
  $('settingVibe').onclick=()=>{releasePrefs.vibration=!releasePrefs.vibration;persistPrefs();if(releasePrefs.vibration)buzz([20,30,20]);openSettings()};
  $('replayCoach').onclick=()=>{closeSystem();menu.classList.remove('show');releaseTutorialDone=false;beginTutorial(true)};
}
function closeSystem(){systemModal.classList.remove('show')}
systemModal.onclick=e=>{if(e.target===systemModal)closeSystem()};
const menuExtra=document.createElement('div');menuExtra.className='menu-extra';menuExtra.innerHTML='<button id="openArchive">结局档案</button><button id="openSettings">设置 / 教学</button>';menu.querySelector('.start-card').appendChild(menuExtra);$('openArchive').onclick=openArchive;$('openSettings').onclick=openSettings;

const baseSay10=say;say=function(text){baseSay10(text);playTone('clue');buzz(12)};
const baseSelectItem10=selectItem;selectItem=function(id){baseSelectItem10(id);buzz(10)};
const baseTryUse10=tryUse;tryUse=function(target){const beforeUsed10=Object.keys(s.used||{}).length;baseTryUse10(target);if(Object.keys(s.used||{}).length>beforeUsed10){playTone('bond');buzz([20,24,32]);positiveFlash();pulseSave()}};
const baseGo10=go;go=function(next,effect){playTone(timedNodes[s.node]?'danger':'tap');baseGo10(next,effect);setTimeout(pulseSave,680)};
const baseRenderEnding10=renderEndingReport;renderEndingReport=function(){baseRenderEnding10();playTone('ending');buzz([30,45,30]);positiveFlash()};
const baseRender10=render;render=function(){baseRender10();saveState.style.display=s.node==='ending'?'none':'block'};

const oldNewGame10=$('newGame').onclick;$('newGame').onclick=()=>{oldNewGame10();setTimeout(()=>beginTutorial(),80)};
const oldCloseMenu10=$('closeMenu').onclick;$('closeMenu').onclick=()=>{oldCloseMenu10();setTimeout(()=>beginTutorial(),80)};
render();
