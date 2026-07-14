/* Director mode: authored shot flow for every playable scene. Loaded last. */
const directorScene=sceneEl;
directorScene.classList.add('director-mode');

const inventoryToggle=document.createElement('button');
inventoryToggle.type='button';
inventoryToggle.className='inventory-toggle';
directorScene.appendChild(inventoryToggle);

const directorCaption=document.createElement('div');
directorCaption.className='director-caption';
directorScene.appendChild(directorCaption);

const clueCloseup=document.createElement('div');
clueCloseup.className='clue-closeup';
directorScene.appendChild(clueCloseup);

const focusReticle=document.createElement('div');
focusReticle.className='focus-reticle';
directorScene.appendChild(focusReticle);

const caseButton=document.createElement('button');
caseButton.type='button';caseButton.className='case-button';caseButton.textContent='整理证据 · 作出推断';
directorScene.appendChild(caseButton);

const shotSkip=document.createElement('button');
shotSkip.type='button';
shotSkip.className='shot-skip';
shotSkip.textContent='跳过镜头';
directorScene.appendChild(shotSkip);

const directorClasses=['shot-wide','shot-person','shot-close','shot-investigate','shot-decision'];
let directorNode='';
let directorTimers=[];
let directorRun=0;
let directorDialoguePlaying=false;
const deprecatedDirectorDeductions={
  'dawn:ledger':{question:'这处水痕说明什么？',options:[['苏妍进门前就知道药品缺口',true,'她不是临时求助，而是带着库存情报来的。'],['只是暴雨溅湿了纸面',false,'水痕集中在药品一行，其他位置是干的。']]},
  'dawn:lock':{question:'红漆最可能来自哪里？',options:[['屋顶天线的检修底座',true,'漆色与钥匙刮痕完全一致，钥匙近期上过屋顶。'],['便利店的卷帘门',false,'卷帘门用的是灰色防锈漆。']]},
  'alley:wire':{question:'这根钢丝真正的用途是？',options:[['制造声音，给巡逻车报点',true,'线末连着空罐，不足以伤人，却能暴露位置。'],['绊倒追兵方便逃跑',false,'钢丝太低，受力后会先拉响空罐。']]},
  'alley:cleanboot':{question:'她为什么始终踩着这里？',options:[['这是唯一不会触发钢丝的落脚点',true,'她伸手不是单纯求助，也是在控制你的下一步。'],['她只是不愿弄湿靴子',false,'周围早已积水，只有这一小块被刻意清理过。']]}
};
const directorDeductions={};
const directorCases={
  dawn:{question:'苏妍为何在清晨准确找上这家店？',options:[['她提前拿到库存与屋顶钥匙的情报',true,'湿指纹只落在缺药一行，钥匙又刚接触过红漆设备：她是按情报来的。'],['她只是随机寻找有灯的商店',false,'随机闯入解释不了精确的药品位置和刚用过的钥匙。'],['她昨晚一直躲在店内',false,'门锁没有从内部反锁，雨水痕迹也从门口向内。']]},
  alley:{question:'苏妍伸手让你靠近，真正想控制什么？',options:[['让你踩中发声装置，向街口暴露位置',true,'细钢丝无法伤人，空罐、受力方向和唯一落脚点共同指向“报点”。'],['借你的力量跨过深水',false,'她脚下就是唯一安全落脚点，并不需要借力。'],['抢走你手里的医疗包',false,'她的手始终在控制你的落脚方向，而不是靠近背包。']]},
  clinic:{question:'23:47的广播线索最可能来自哪里？',options:[['有人从诊所取情报，再带钥匙上过屋顶',true,'向外书写的时间、往返脚印和红漆把诊所、商店、屋顶连成了一条路线。'],['林晓独自在病房直接发出广播',false,'病房里只有书写痕迹，没有发射设备；脚印还离开过诊所。'],['广播与诊所无关，只是巧合',false,'时间和脚印都形成了可复核的对应。']]},
  diagnose:{question:'黑色颗粒与地图闭环说明了什么？',options:[['污染物会响应金属设施，用水路标记有人居住的建筑',true,'颗粒吸附金属，而路线把天线、雨水和泵站连成完整系统。'],['孩子感染了会磁化血液的病毒',false,'颗粒只出现在饮水容器，诊室和人体没有同类反应。'],['地下泵站只是普通避难所',false,'闭环同时经过屋顶天线，目的不只是藏人。']]},
  search:{question:'钥匙、红漆和无编号车辆指向谁在控制路线？',options:[['有人利用屋顶设备和假巡逻车筛选幸存者',true,'钥匙接触过天线，车辆也来自同一路线，却刻意取消官方编号。'],['老周临时偷车寻找食物',false,'他有钥匙但无法解释固定七秒扫描和屋顶沥青。'],['正规救援队正在封锁感染区',false,'正规车辆不会抹去编号，也无需使用便利店后仓钥匙。']]}
};
const evidenceOperations={
  ledger:['掀开防水膜','左右擦掉水渍'],lock:['把钥匙插入锁芯','缓慢转动钥匙'],wire:['用钳口夹住钢丝','剪断并收紧线头'],cleanboot:['移开松动砖块','拉出砖下细线'],
  footprint:['打开紫外检查灯','沿脚印方向扫描'],window:['用袖口抹开水汽','追踪玻璃上的笔画'],bottle:['把磁片贴近瓶底','移动磁片观察颗粒'],mapmark:['展开折叠地图','对齐三处红线'],
  key:['打开工具箱暗扣','转动钥匙检查齿痕'],siren:['接上频率检测器','校准灯光间隔'],cable:['剥开电缆外皮','对齐断裂铜丝'],badge:['擦掉徽章油污','转动查看背面编号'],
  shutter:['贴近卷帘门听声','对齐敲击节奏'],backdoor:['移开货架纸箱','拉开隐藏门栓'],radio:['切换监听频段','校准两路底噪'],redlamp:['遮住环境反光','测量红灯闪烁间隔']
};

function clearDirectorTimers(){
  directorTimers.forEach(clearTimeout);
  directorTimers=[];
}
function afterShot(fn,delay){
  const run=directorRun;
  const timer=setTimeout(()=>{if(run===directorRun)fn()},delay);
  directorTimers.push(timer);
  return timer;
}
function shotDots(step){
  return '<div class="shot-dots">'+[1,2,3,4].map(n=>'<i class="'+(n<=step?'on':'')+'"></i>').join('')+'</div>';
}
function setDirectorCaption(kicker,title,text,step=1){
  directorCaption.innerHTML='<small>'+kicker+'</small><b>'+title+'</b>'+(text?'<p>'+text+'</p>':'')+shotDots(step);
  directorCaption.classList.add('show');
}
function applyDirectorShot(type,options={}){
  directorClasses.forEach(name=>directorScene.classList.remove(name));
  directorScene.classList.add('shot-'+type);
  if(options.x!=null)directorScene.style.setProperty('--clue-x',options.x+'%');
  if(options.y!=null)directorScene.style.setProperty('--clue-y',options.y+'%');
}
function sceneHasPerson(){
  const integrated=typeof stageActors!=='undefined'&&stageActors[s.node];
  return ((poseSets[s.node]||[]).length>0||integrated)&&(dialogues[s.node]||[]).length>0;
}
const baseReadyDirector=ready;
ready=function(){
  const clues=investigations[s.node]||[];
  const caseFile=directorCases[s.node];
  if(!clues.length)return baseReadyDirector();
  const observed=(s.found[s.node]||[]).length>=clues.length;
  const talked=!sceneHasPerson()||!!s.talked[s.node];
  return observed&&talked&&(!caseFile||!!s.flags['case_'+s.node]);
};
function updateCaseButton(){
  const caseFile=directorCases[s.node];
  const observed=(s.found[s.node]||[]).length>=(investigations[s.node]||[]).length;
  const talked=!sceneHasPerson()||!!s.talked[s.node];
  caseButton.classList.toggle('show',!!caseFile&&observed&&talked&&!s.flags['case_'+s.node]);
}
function openCaseFile(){
  const caseFile=directorCases[s.node];if(!caseFile)return;
  clearDirectorTimers();applyDirectorShot('close');directorCaption.classList.remove('show');focusReticle.classList.remove('show');
  clueCloseup.innerHTML='<small>推理板 / 两处证物只能支持一个结论</small><b>'+caseFile.question+'</b><div class="deduction-options case-options">'+caseFile.options.map((o,i)=>'<button type="button" data-case-answer="'+i+'">'+o[0]+'</button>').join('')+'</div>';
  clueCloseup.classList.add('show');caseButton.classList.remove('show');
  clueCloseup.querySelectorAll('[data-case-answer]').forEach(button=>button.onclick=e=>{
    e.stopPropagation();const answer=caseFile.options[Number(button.dataset.caseAnswer)];
    clueCloseup.querySelectorAll('[data-case-answer]').forEach(b=>b.disabled=true);button.classList.add(answer[1]?'correct':'wrong');
    const result=document.createElement('div');result.className='deduction-result';result.textContent=answer[2];clueCloseup.appendChild(result);
    if(answer[1]){s.flags['case_'+s.node]=1;if(typeof checkChains==='function')checkChains();localStorage.setItem('lastLightStory',JSON.stringify(s));updateLocks();afterShot(showDecision,1250)}
    else afterShot(()=>{clueCloseup.classList.remove('show');applyDirectorShot('investigate');updateCaseButton()},1600);
  });
}
caseButton.onclick=e=>{e.stopPropagation();openCaseFile()};
function showInvestigation(quiet=false){
  clearDirectorTimers();
  applyDirectorShot('investigate');
  clueCloseup.classList.remove('show');
  focusReticle.classList.remove('show');
  const count=(s.found[s.node]||[]).length;
  const total=(investigations[s.node]||[]).length;
  const needsPerson=sceneHasPerson()&&!s.talked[s.node];
  const prompt=needsPerson?'先点击画面中的人物，让她把话说完。':total>count?'点击画面中微微发光的位置，靠近查看。':'关键细节已经到手。';
  updateCaseButton();
  if(quiet||!needsPerson){directorCaption.classList.remove('show','closing');return}
  setDirectorCaption('自由调查',needsPerson?'有人在等你回应':'别放过画面里的异常',prompt,3);
}
function showDecision(){
  clearDirectorTimers();
  applyDirectorShot('decision');
  clueCloseup.classList.remove('show');
  focusReticle.classList.remove('show');
  directorCaption.classList.remove('show');
  caseButton.classList.remove('show');
}
function recordDirectorEvidence(id,label){
  const found=s.found[s.node]||[];
  if(!found.includes(id)){found.push(id);s.found[s.node]=found;s.evidence[id]=evidenceNames[id]||label;renderEvidence();updateLocks();localStorage.setItem('lastLightStory',JSON.stringify(s))}
}
function focusDirectorClue(index,sourceButton){
  const clue=(investigations[s.node]||[])[index];
  if(!clue)return;
  clearDirectorTimers();
  const [id,x,y,label,text]=clue;
  applyDirectorShot('close',{x,y});
  directorCaption.classList.remove('show');
  focusReticle.style.left=x+'%';
  focusReticle.style.top=y+'%';
  focusReticle.classList.remove('show');
  void focusReticle.offsetWidth;
  focusReticle.classList.add('show');
  const deduction=directorDeductions[s.node+':'+id];
  const operation=evidenceOperations[id];
  clueCloseup.innerHTML=operation?'<small>现场操作 / 由你亲手检查</small><b>'+label+'</b><div class="evidence-operation"><button type="button" class="operation-start">'+operation[0]+'</button><div class="operation-slide"><span>'+operation[1]+'</span><input type="range" min="0" max="100" value="0" aria-label="'+operation[1]+'"></div><p class="operation-result"></p></div>':'<small>观察 / 不要急着下结论</small><b>'+label+'</b><p>'+text+'</p>'+(deduction?'<div class="deduction-question">'+deduction.question+'</div><div class="deduction-options">'+deduction.options.map((o,i)=>'<button type="button" data-answer="'+i+'">'+o[0]+'</button>').join('')+'</div>':'');
  clueCloseup.classList.remove('show');
  void clueCloseup.offsetWidth;
  clueCloseup.classList.add('show');
  if(operation){
    const start=clueCloseup.querySelector('.operation-start'),slide=clueCloseup.querySelector('.operation-slide'),range=clueCloseup.querySelector('input'),result=clueCloseup.querySelector('.operation-result');
    start.onclick=e=>{e.stopPropagation();start.disabled=true;start.textContent='第一步完成';slide.classList.add('show');range.focus()};
    range.oninput=e=>{clueCloseup.style.setProperty('--operation-progress',e.target.value+'%');if(Number(e.target.value)>=96&&!range.disabled){range.disabled=true;result.textContent=text;result.classList.add('show');recordDirectorEvidence(id,label);if(sourceButton){sourceButton.classList.add('consumed');sourceButton.setAttribute('aria-hidden','true')}afterShot(()=>{if(ready())showDecision();else showInvestigation(true)},1650)}};
  }else if(deduction){
    clueCloseup.querySelectorAll('[data-answer]').forEach(button=>button.onclick=e=>{
      e.stopPropagation();
      const answer=deduction.options[Number(button.dataset.answer)];
      clueCloseup.querySelectorAll('[data-answer]').forEach(b=>b.disabled=true);
      button.classList.add(answer[1]?'correct':'wrong');
      const result=document.createElement('div');result.className='deduction-result';result.textContent=answer[2];clueCloseup.appendChild(result);
      if(answer[1]){
        const found=s.found[s.node]||[];
        if(!found.includes(id)){found.push(id);s.found[s.node]=found;s.evidence[id]=evidenceNames[id]||label;renderEvidence()}
        updateLocks();localStorage.setItem('lastLightStory',JSON.stringify(s));
      }
      afterShot(()=>{if(ready())showDecision();else showInvestigation(true)},answer[1]?1150:1450);
    });
  }else{
    recordDirectorEvidence(id,label);
    afterShot(()=>{if(ready())showDecision();else showInvestigation(true)},1850);
  }
}
function playDirectorDialogue(){
  const lines=dialogues[s.node]||[];
  if(!lines.length||directorDialoguePlaying)return;
  directorDialoguePlaying=true;
  const node=s.node;
  clearDirectorTimers();
  applyDirectorShot('person');
  directorScene.classList.add('dialogue-playing');
  let index=0;
  const advance=()=>{
    if(s.node!==node){directorDialoguePlaying=false;directorScene.classList.remove('dialogue-playing');return}
    if(index>=lines.length){
      s.talked[node]=true;s.line[node]=lines.length;
      directorDialoguePlaying=false;
      directorScene.classList.remove('dialogue-playing');
      directorCaption.classList.add('closing');
      $('speech').classList.remove('show');
      updateLocks();
      localStorage.setItem('lastLightStory',JSON.stringify(s));
      afterShot(()=>{
        directorCaption.classList.remove('show','closing');
        if(ready())showDecision();else showInvestigation(true);
      },420);
      return;
    }
    const spoken=lines[index++];
    s.line[node]=index;
    const parts=spoken.split('：');
    const name=parts.length>1?parts.shift():(nodes[node]?.speaker||'幸存者');
    const words=parts.length?parts.join('：'):spoken;
    directorCaption.classList.remove('closing');
    setDirectorCaption(index===1?'靠近交谈':'对话继续',name,words,2);
    const speech=$('speech');speech.textContent=spoken;speech.classList.add('show');
    afterShot(advance,Math.max(1450,Math.min(2600,900+words.length*55)));
  };
  advance();
}
function startDirectorSequence(){
  directorRun++;
  clearDirectorTimers();
  clueCloseup.classList.remove('show');
  focusReticle.classList.remove('show');
  directorCaption.classList.remove('show');
  applyDirectorShot('wide');
  const n=nodes[s.node];
  const title=n?.title||'未知地点';
  const stamp=n?.stamp||'';
  setDirectorCaption('建立镜头',title,stamp+'。先看清出口、遮蔽物和异常动静。',1);
  const noActions=!(investigations[s.node]||[]).length&&!sceneHasPerson();
  afterShot(()=>{
    if(noActions){showDecision();return}
    if(sceneHasPerson()){
      applyDirectorShot('person');
      const first=(dialogues[s.node]||[])[0]||'画面里的人正注视着你。';
      setDirectorCaption('人物入镜',nodes[s.node]?.speaker||'幸存者',first.replace(/^[^：]+：/,''),2);
      afterShot(showInvestigation,1250);
    }else showInvestigation();
  },900);
}
function updateInventoryToggle(){
  const resourceTotal=resourceItems.reduce((sum,id)=>sum+Math.max(0,Number(s[id])||0),0);
  const evidenceTotal=Object.keys(s.evidence||{}).length;
  inventoryToggle.innerHTML='背包 <b>'+(resourceTotal+evidenceTotal)+'</b>';
  inventoryToggle.classList.toggle('need-item',!!document.querySelector('#choices .unavailable'));
  inventoryToggle.setAttribute('aria-expanded',directorScene.classList.contains('inventory-open')?'true':'false');
}
inventoryToggle.onclick=e=>{
  e.stopPropagation();
  const open=directorScene.classList.toggle('inventory-open');
  inventoryToggle.setAttribute('aria-expanded',open?'true':'false');
  if(open)directorCaption.classList.remove('show');
  else if(directorScene.classList.contains('shot-investigate'))showInvestigation();
};
shotSkip.onclick=e=>{
  e.stopPropagation();
  directorRun++;
  clearDirectorTimers();
  if(ready())showDecision();else showInvestigation();
};

const baseInteractionsDirector=renderInteractions;
renderInteractions=function(){
  baseInteractionsDirector();
  $('hotspots').querySelectorAll('.hotspot').forEach((button,index)=>{
    button.onclick=e=>{e.stopPropagation();focusDirectorClue(index,button)};
  });
  const actor=$('character');
  if(actor._directorReaction)actor.removeEventListener('click',actor._directorReaction);
  actor.onclick=e=>{e.stopPropagation();playDirectorDialogue()};
};

const baseUpdateLocksDirector=updateLocks;
updateLocks=function(){
  baseUpdateLocksDirector();
  updateInventoryToggle();
  const actor=$('character');
  const cluesFound=(s.found[s.node]||[]).length;
  const clueTotal=(investigations[s.node]||[]).length;
  const needsDialogue=sceneHasPerson();
  $('clueCount').textContent=(cluesFound+(s.talked[s.node]?1:0))+' / '+(clueTotal+(needsDialogue?1:0));
  if(directorCases[s.node]&&cluesFound>=clueTotal&&(!needsDialogue||s.talked[s.node])&&!s.flags['case_'+s.node])$('clueList').textContent='证物齐全：整理证据，作出推断';
  actor.classList.toggle('needs-talk',sceneHasPerson()&&!s.talked[s.node]&&cluesFound>0);
  updateCaseButton();
};

const baseRenderDirector=render;
render=function(){
  baseRenderDirector();
  directorScene.classList.remove('inventory-open');
  updateInventoryToggle();
  const changed=directorNode!==s.node;
  directorNode=s.node;
  if(changed){
    directorRun++;
    clearDirectorTimers();
    const delay=(typeof travelBusy!=='undefined'&&travelBusy)?430:40;
    afterShot(startDirectorSequence,delay);
  }else if(!directorClasses.some(name=>directorScene.classList.contains(name))){
    startDirectorSequence();
  }
};
render();

