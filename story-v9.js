/* Chapter-one interaction and consequence layer. Loaded after story.js. */
const itemLabels={med:'药品',water:'净水',battery:'电池',ledger:'改写清单',lock:'钥匙痕迹',footprint:'红漆脚印',window:'23:47',bottle:'污染水样',mapmark:'地下地图',tracks:'分岔脚印',redlight:'救援暗号',key:'仓库钥匙',siren:'假巡逻车',shutter:'敲门节奏',backdoor:'暗门冷风',recorder:'循环磁带',crates:'应急封条',radio:'双重频道',redlamp:'求救灯'};
const relationLabels={lin:'林晓',ali:'阿梨',zhou:'老周'};
const resourceItems=['med','water','battery'];

function ensureV9State(){
  s.relations={lin:0,ali:0,zhou:0,...(s.relations||{})};
  s.used=s.used||{};
  s.history=s.history||[];
  s.selectedItem=s.selectedItem||null;
  s.echo=s.echo||'';
}
ensureV9State();
timedNodes.knock=30;timedNodes.radio=30;

const sceneEl=$('scene');
const actionTray=document.createElement('div');actionTray.id='actionTray';actionTray.className='action-tray';sceneEl.appendChild(actionTray);
const useHint=document.createElement('div');useHint.id='useHint';useHint.className='use-hint';sceneEl.appendChild(useHint);
const relationPanel=document.createElement('div');relationPanel.id='relationPanel';relationPanel.className='relation-panel';sceneEl.appendChild(relationPanel);
const changeToast=document.createElement('div');changeToast.id='changeToast';changeToast.className='change-toast';sceneEl.appendChild(changeToast);
const echoCard=document.createElement('div');echoCard.id='echoCard';echoCard.className='echo-card';sceneEl.appendChild(echoCard);

function itemCount(id){return resourceItems.includes(id)?Math.max(0,s[id]||0):1}
function selectableItems(){
  const clues=Object.keys(s.evidence||{}).filter(id=>['bottle','mapmark','key','redlight','backdoor','recorder','radio'].includes(id));
  return [...resourceItems,...clues.slice(-3)];
}
function selectItem(id){
  if(resourceItems.includes(id)&&itemCount(id)<=0){say(itemLabels[id]+'已经用完了。');return}
  s.selectedItem=s.selectedItem===id?null:id;
  renderActionTray();renderEvidence();
  if(s.selectedItem){useHint.textContent='已拿出「'+itemLabels[id]+'」· 点击画面中的人或物';useHint.classList.add('show')}
  else useHint.classList.remove('show');
}
function renderActionTray(){
  ensureV9State();
  actionTray.innerHTML='';
  selectableItems().forEach(id=>{
    const b=document.createElement('button');b.className='action-item'+(s.selectedItem===id?' selected':'');
    b.innerHTML='<span>'+itemLabels[id]+'</span><b>'+ (resourceItems.includes(id)?'×'+itemCount(id):'线索') +'</b>';
    b.onclick=e=>{e.stopPropagation();selectItem(id)};actionTray.appendChild(b);
  });
  actionTray.style.display=s.node==='ending'?'none':'flex';
}
function renderRelations(){
  relationPanel.innerHTML=Object.entries(relationLabels).map(([id,name])=>{
    const value=Math.max(-3,Math.min(5,s.relations[id]||0));
    const width=Math.round((value+3)/8*100)+'%';
    return '<div class="relation-row"><span>'+name+'</span><i style="--bond:'+width+'"></i></div>';
  }).join('');
  relationPanel.style.display=s.node==='dawn'||s.node==='ending'?'none':'grid';
}
let toastTimer;
function flashChange(title,detail){
  changeToast.innerHTML='<b>'+title+'</b>'+ (detail?'<br>'+detail:'');changeToast.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>changeToast.classList.remove('show'),2600);
}
function setEcho(text){s.echo=text;renderEcho()}
function renderEcho(){
  if(!s.echo||s.node==='dawn'||s.node==='ending'){echoCard.style.display='none';return}
  echoCard.innerHTML='<b>选择回响</b>'+s.echo;echoCard.style.display='block';
}
function spend(id,n=1){if((s[id]||0)<n)return false;s[id]-=n;return true}
function bond(id,n){s.relations[id]=(s.relations[id]||0)+n}

const useRules={
  'clinic:character:med':()=>{
    if(s.used.giveLinMed)return '林晓已经收下药了。';if(!spend('med'))return '药品已经用完。';
    s.used.giveLinMed=1;s.flags.savedChild=1;s.trust+=2;bond('lin',2);setEcho('你当面把最后一盒药交给林晓。她记住了这件事。');
    showPose(2);flashChange('林晓关系 +2','药品 -1 · 信任 +2');return '林晓接过药，第一次放下了挡在你面前的手：“我欠你一次。”';
  },
  'diagnose:character:water':()=>{
    if(s.used.giveCleanWater)return '孩子已经喝过净水。';if(!spend('water'))return '净水已经用完。';
    s.used.giveCleanWater=1;s.flags.savedChild=1;s.trust+=2;bond('lin',2);bond('ali',1);setEcho('你用净水验证了阿梨的判断：这不是感染，而是中毒。');
    flashChange('判断得到验证','净水 -1 · 林晓 +2 · 阿梨 +1');return '孩子喝下净水后停止抽搐。阿梨低声说：“现在她会相信我们了。”';
  },
  'courtyard:redlight:battery':()=>{
    if(s.used.decodeLamp)return '红灯暗号已经记录。';if(!spend('battery'))return '没有可用电池。';
    s.used.decodeLamp=1;s.flags.signalDecoded=1;s.evidence.redlight='救援暗号';setEcho('你用电池启动接收器，确认红灯不是求救，而是给撤离车的身份校验。');
    flashChange('发现隐藏规则','电池 -1 · 电台路线已验证');return '接收器亮起：三短一长。这个节奏能排除一辆冒牌撤离车。';
  },
  'search:character:key':()=>{
    if(s.used.checkZhouKey)return '老周已经说明钥匙来历。';
    s.used.checkZhouKey=1;s.flags.verifiedKey=1;bond('zhou',1);setEcho('你没有直接夺走钥匙，而是让老周指认了交钥匙的人。');
    showPose(0);flashChange('老周关系 +1','获得：灰帽商人的体貌');return '老周盯着钥匙沉默片刻：“灰帽、左手缺两根指头。他不是救援队的人。”';
  },
  'knock:backdoor:key':()=>{
    if(s.used.unlockBackdoor)return '暗门已经打开。';
    s.used.unlockBackdoor=1;s.flags.tunnel=1;setEcho('旧钥匙与货架后的锁完全吻合。你抢在门外人闯入前打开了地下通道。');
    flashChange('隐藏路线开启','地下通道结局已解锁');return '钥匙转动半圈，整面货架向里松开。冷风里混着循环播放的求救声。';
  },
  'tunnel:recorder:battery':()=>{
    if(s.used.powerRecorder)return '录音机的完整记录已经读出。';if(!spend('battery'))return '没有电池，录音机无法读取。';
    s.used.powerRecorder=1;s.flags.truth=1;s.flags.authenticated=1;setEcho('完整录音暴露了武装车队的应答频率，你可以反过来骗走他们。');
    flashChange('掌握反制频率','电池 -1 · 真相路线已解锁');return '磁带末尾不是求救，而是一串挑战码。真正的撤离车从不回答这串码。';
  },
  'radio:radio:recorder':()=>{
    if(s.used.compareSignal)return '两个频道已经比对完成。';
    s.used.compareSignal=1;s.flags.authenticated=1;setEcho('循环磁带里的底噪和武装车队完全一致。你找出了冒牌者。');
    flashChange('识破假撤离车','特殊结局已解锁');return '波形重合。东线撤离车是真的，另一辆车正沿着假坐标逼近。';
  },
  'radio:radio:redlight':()=>{
    if(s.used.verifyRescue)return '撤离车身份已经验证。';
    s.used.verifyRescue=1;s.flags.authenticated=1;setEcho('红灯暗号与东线撤离车的回应吻合，真正的救援身份得到确认。');
    flashChange('身份验证成功','特殊结局已解锁');return '你发出三短一长。只有东线车辆正确回应，假车队暴露了。';
  }
};
function tryUse(target){
  if(!s.selectedItem)return;
  const id=s.node+':'+target+':'+s.selectedItem,rule=useRules[id];
  if(!rule){say('「'+itemLabels[s.selectedItem]+'」用在这里没有作用。试试与线索相关的人或物。');return}
  const result=rule();say(result);s.selectedItem=null;useHint.classList.remove('show');['food','water','med','battery','trust'].forEach(k=>$(k).textContent=s[k]);renderActionTray();renderEvidence();renderRelations();updateLocks();localStorage.setItem('lastLightStory',JSON.stringify(s));
}

const baseRenderEvidence=renderEvidence;
renderEvidence=function(){
  const root=$('evidenceList'),entries=Object.entries(s.evidence||{}).slice(-6);
  root.innerHTML=entries.length?entries.map(([id,name])=>'<button class="evidence-chip '+(s.selectedItem===id?'selected':'')+'" data-item="'+id+'">'+name+'</button>').join(''):'<span class="evidence-empty">尚无证物</span>';
  root.querySelectorAll('[data-item]').forEach(b=>b.onclick=e=>{e.stopPropagation();selectItem(b.dataset.item)});
};
const baseRenderInteractions=renderInteractions;
renderInteractions=function(){
  baseRenderInteractions();
  $('hotspots').querySelectorAll('.hotspot').forEach((b,index)=>{const id=(investigations[s.node]||[])[index]?.[0];if(id)b.addEventListener('click',()=>{tryUse(id);renderActionTray()})});
  const actor=$('character');if(actor._useHandler)actor.removeEventListener('click',actor._useHandler);actor._useHandler=()=>tryUse('character');actor.addEventListener('click',actor._useHandler);
};

// Carrying supplies is not the same as consuming them. The player decides on the scene.
nodes.dawn.choices[0]=['带药去诊所','药品随身携带','clinic',x=>x.flags.tookMed=1];
nodes.clinic.choices[0]=['把药交给林晓','药品 -1，信任 +2','search',x=>{if(!x.flags.savedChild&&x.med>0){x.med--;x.trust+=2;x.flags.savedChild=1}}];
nodes.clinic.choices[2]=['保留药品，追查旧钥匙','林晓关系 -1','search',x=>{x.trust--;x.flags.keptMed=1}];
nodes.diagnose.choices[0]=['留下净水和药','净水 -1，药品 -1','search',x=>{if(x.water>0)x.water--;if(x.med>0)x.med--;if(!x.flags.savedChild)x.trust+=3;x.flags.savedChild=1}];
choiceRequirements.clinic={0:x=>(x.med>0||x.flags.savedChild)?null:'没有可用药品'};
choiceRequirements.radio[0]=x=>(x.trust>=2||x.flags.linWarning)?null:'需要信任 2，或得到林晓担保';
choiceRequirements.radio[3]=x=>x.flags.authenticated?null:'需要识破假撤离车';
if(nodes.radio.choices.length===3)nodes.radio.choices.push(['广播假坐标，引开武装车队','需要验证真实频道','ending',x=>x.flags.choseDecoy=1]);
nodes.ending.text=x=>{
  const f=x.flags;
  if(f.choseDecoy&&f.authenticated)return '你把武装车队引向循环广播的旧坐标。真正的撤离车在黑暗中接走诊所的人，老周最后锁上便利店。没有人需要被留下。';
  if(f.choseTunnel&&f.tunnel)return '你没有回答无线电。阿梨带着众人穿过地下仓库，红灯在身后熄灭。撤离车扑了个空，但所有人都活着。';
  if(f.choseClinic&&x.trust>=2)return '撤离车先抵达诊所。林晓抱着退烧的孩子上车，老周回头守住便利店。你失去大半物资，却得到一个愿意保护你的街区。';
  if(f.choseStore)return '撤离车停在便利店门前。你带走了物资和钥匙，却看见诊所的灯在后视镜中熄灭。那段广播从此再也没有响起。';
  return '两个方向同时亮起车灯。准备不足让你无法救下所有人，这个选择会跟随你进入下一章。';
};

function snapshot(){return {food:s.food,water:s.water,med:s.med,battery:s.battery,trust:s.trust,flags:{...s.flags}}}
function syncChoiceRelations(from,before){
  if(from==='clinic'){
    if(s.flags.savedChild&&!before.flags.savedChild){bond('lin',2);bond('ali',1)}
    else if(s.trust<before.trust)bond('lin',-1);
  }
  if(from==='diagnose'&&s.flags.savedChild&&!before.flags.savedChild){bond('lin',2);bond('ali',1)}
  if(from==='search'&&s.flags.zhou&&!before.flags.zhou)bond('zhou',1);
  if(from==='search'&&s.flags.sacrifice&&!before.flags.sacrifice)bond('zhou',-2);
}
function enterConsequences(next){
  if(next==='radio'&&s.flags.savedChild&&!s.flags.linWarning){s.flags.linWarning=1;s.trust++;bond('lin',1);s.echo='林晓通过短波担保你的身份，并警告：没有回应红灯暗号的车辆是假救援。'}
  else if(next==='radio'&&s.flags.verifiedKey){s.echo='老周认出的灰帽商人正在假频道里说话。你早先的耐心给了你判断依据。'}
  else if(next==='knock'&&s.flags.zhou){s.echo='老周提前从后巷赶回，在卷帘门外敲出约定的节奏。'}
}
go=function(next,effect){
  clearInterval(crisisInterval);const from=s.node,before=snapshot();$('scene').classList.add('fade');
  setTimeout(()=>{effect&&effect(s);syncChoiceRelations(from,before);enterConsequences(next);s.history.push({from,to:next,trust:s.trust,at:Date.now()});s.node=next;s.steps++;s.selectedItem=null;render();$('scene').classList.remove('fade');
    const delta=s.trust-before.trust;if(delta)flashChange(delta>0?'信任上升':'信任下降',(delta>0?'+':'')+delta+' · 之后的人会记得');
  },300)
};

function endingInfo(){
  if(s.flags.choseDecoy&&s.flags.authenticated)return {id:'decoy',title:'无人生还名单',desc:'你让敌人追逐幽灵，让活人悄悄离开。'};
  if(s.flags.choseTunnel&&s.flags.tunnel)return {id:'tunnel',title:'灯灭之后',desc:'所有人从地下离开，没有人知道你们去了哪里。'};
  if(s.flags.choseClinic&&s.trust>=2)return {id:'clinic',title:'街区仍在',desc:'你牺牲物资，换来一个会彼此保护的街区。'};
  if(s.flags.choseStore)return {id:'store',title:'满载而去',desc:'货架保住了，诊所的灯却永远熄灭。'};
  return {id:'lost',title:'错误坐标',desc:'准备不足时，任何选择都像一次放弃。'};
}
function endingLines(){
  return [s.flags.savedChild?'诊所的孩子活了下来':'诊所没有等到足够的药和净水',s.flags.truth||s.flags.authenticated?'你查清了循环广播的真相':'广播背后的真相仍不完整',s.relations.zhou>0?'老周愿意在下一章继续帮你':'老周没有成为你的同伴'];
}
function renderEndingReport(){
  const info=endingInfo();let gallery=[];try{gallery=JSON.parse(localStorage.getItem('lastLightEndings')||'[]')}catch{}
  if(!gallery.includes(info.id))gallery.push(info.id);localStorage.setItem('lastLightEndings',JSON.stringify(gallery));localStorage.setItem('lastLightEnding',info.id);
  const c=$('chapterComplete');c.innerHTML='<h2>'+info.title+'</h2><p>'+info.desc+'</p><div class="result-stats"><span><b>'+s.trust+'</b>最终信任</span><span><b>'+Object.keys(s.evidence||{}).length+'</b>发现线索</span><span><b>'+s.history.length+'</b>关键决定</span></div><div class="result-list">'+endingLines().map(x=>'<span>'+x+'</span>').join('')+'</div><div class="ending-progress">结局收集 '+gallery.length+' / 5</div><div class="result-actions"><button id="resultMenu">回到标题</button><button id="retryChapter" class="primary">换一条路</button></div>';c.classList.add('show');
  $('retryChapter').onclick=freshStory;$('resultMenu').onclick=()=>menu.classList.add('show');
}
const baseRender=render;
render=function(){
  ensureV9State();baseRender();if(s.node==='clinic'&&s.flags.savedChild){const done=$('choices').querySelector('button');if(done)done.innerHTML='继续追查旧钥匙<small>林晓已答应协助</small>'}renderActionTray();renderRelations();renderEcho();
  document.querySelector('.evidence-tray').style.display=s.node==='ending'?'none':'';
  if(s.node==='ending')renderEndingReport();
};
function freshStory(){
  clearInterval(crisisInterval);s={food:4,water:3,med:1,battery:1,trust:0,flags:{},node:'dawn',steps:1,found:{},talked:{},line:{},evidence:{},relations:{lin:0,ali:0,zhou:0},used:{},history:[],selectedItem:null,echo:''};
  localStorage.removeItem('lastLightStory');menu.classList.remove('show');render();
}
$('newGame').onclick=freshStory;
render();





