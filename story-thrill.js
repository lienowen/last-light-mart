/* Evidence-chain payoff and a new playable counterattack scene. */
const thrillMeter=document.createElement('div');thrillMeter.className='thrill-meter';thrillMeter.innerHTML='<i></i>';sceneEl.appendChild(thrillMeter);
const impactCard=document.createElement('div');impactCard.className='impact-card';sceneEl.appendChild(impactCard);
const comboPop=document.createElement('div');comboPop.className='combo-pop';sceneEl.appendChild(comboPop);
let impactTimer=null,comboTimer=null;
function ensureThrill(){s.momentum=Math.max(0,Math.min(100,s.momentum||0));s.chains=s.chains||{};s.combo=s.combo||0}
function renderThrill(){
  ensureThrill();sceneEl.classList.toggle('trader-scene',s.node==='ambush');thrillMeter.querySelector('i').style.width=s.momentum+'%';thrillMeter.dataset.label='反制能量 '+s.momentum+'%';sceneEl.classList.toggle('counter-ready',s.momentum>=25);
  const buttons=$('choices').querySelectorAll('button');buttons.forEach(b=>b.classList.remove('counter-choice'));if(s.node==='knock'&&buttons[3])buttons[3].classList.add('counter-choice');if(s.node==='ambush')buttons.forEach(b=>b.classList.add('counter-choice'));
  $('progress').textContent=Math.min(s.steps,9)+' / 9';
}
function showImpact(kicker,title,detail,reward){
  impactCard.innerHTML='<small>'+kicker+'</small><b>'+title+'</b><p>'+detail+'</p><em>'+reward+'</em>';impactCard.classList.remove('show');void impactCard.offsetWidth;impactCard.classList.add('show');sceneEl.classList.remove('flash-good');void sceneEl.offsetWidth;sceneEl.classList.add('flash-good');if(typeof playTone==='function')playTone('ending');if(typeof buzz==='function')buzz([24,35,45]);clearTimeout(impactTimer);impactTimer=setTimeout(()=>impactCard.classList.remove('show'),1950)
}
function gainMomentum(amount,label){
  ensureThrill();s.momentum=Math.min(100,s.momentum+amount);s.combo++;comboPop.textContent='+'+amount+' '+label+'  ×'+s.combo;comboPop.classList.remove('show');void comboPop.offsetWidth;comboPop.classList.add('show');clearTimeout(comboTimer);comboTimer=setTimeout(()=>{comboPop.classList.remove('show');s.combo=0},1100);renderThrill()
}
const chainRecipes=[
  {id:'inside',needs:['ledger','lock'],title:'钥匙在自己人手里',detail:'门锁没有破坏，库存却被改写。昨夜拿药的人熟悉仓库。',reward:'反制能量 +25',effect:x=>{x.flags.insider=1}},
  {id:'timeline',needs:['footprint','window'],title:'23:47不是求救时间',detail:'红漆脚印来自屋顶，窗上的时间是有人故意留下的行动信号。',reward:'信任 +1 · 反制能量 +25',effect:x=>{x.flags.timeline=1;x.trust++}},
  {id:'fakecar',needs:['key','siren'],title:'灰帽商人就是带路人',detail:'老周的钥匙和无编号巡逻灯连成一条线：假车队一直在利用他。',reward:'反杀路线解锁',effect:x=>{x.flags.exposedTrader=1}},
  {id:'broadcast',needs:['recorder','radio'],title:'猎人暴露了自己的频道',detail:'循环磁带的底噪与武装车队完全重合。现在你可以反向投喂假坐标。',reward:'终局反制解锁',effect:x=>{x.flags.authenticated=1}}
];
function checkChains(){
  const reasoningGate={inside:'case_dawn',timeline:'case_clinic',fakecar:'case_search'};
  ensureThrill();for(const recipe of chainRecipes){if(reasoningGate[recipe.id]&&!s.flags[reasoningGate[recipe.id]])continue;if(s.chains[recipe.id]||!recipe.needs.every(id=>s.evidence?.[id]))continue;s.chains[recipe.id]=1;recipe.effect(s);gainMomentum(25,'证据链');showImpact('推断成立',recipe.title,recipe.detail,recipe.reward);localStorage.setItem('lastLightStory',JSON.stringify(s));break}
}

evidenceNames.glove='缺指手套';evidenceNames.forgery='伪造名单';
investigations.ambush=[['glove',12,68,'断指手套','手套左侧两根手指被缝死，和老周描述完全一致。'],['forgery',78,42,'撤离名单','名单上的印章来自已经解散的应急部门。']];
dialogues.ambush=['灰帽商人：你以为抓住我就赢了？车队已经知道坐标。','灰帽商人：东线车问“灯还亮吗”，假的那辆只会报人数。'];
poseSets.ambush=['trader'];
nodes.ambush={scene:'store',title:'便利店反制 · 暴雨夜',stamp:'22:03 / 猎人入笼',speaker:'灰帽商人',text:'卷帘门升到一半，你故意让灯熄灭。老周从侧面撞上商人的膝弯，林晓反锁正门。刚才还在叫价的人，如今被绑在收银台前——外面的假车队开始催他回应。',choices:[['逼他说出真假车队的应答码','识破假频道','radio',x=>{x.flags.authenticated=1;x.flags.brokeTrader=1;x.trust+=2}],['搜走物资，把他锁进仓库','净水 +2，电池 +1','radio',x=>{x.water+=2;x.battery++;x.flags.lootedTrader=1}],['让林晓审问，再用他的电台回话','需要救下孩子','radio',x=>{x.flags.authenticated=1;x.flags.linInterrogate=1;x.trust+=3}]]};
choiceRequirements.ambush={2:x=>x.flags.savedChild?null:'林晓不会替你冒险'};
if(nodes.knock.choices.length===3)nodes.knock.choices.push(['故意开门，断电反锁灰帽商人','消耗25反制能量','ambush',x=>{x.momentum=Math.max(0,(x.momentum||0)-25);x.flags.counterTrap=1}]);
choiceRequirements.knock={...(choiceRequirements.knock||{}),3:x=>(x.momentum>=25&&(x.flags.insider||x.flags.signalDecoded||x.flags.verifiedKey))?null:'需要完成证据链并积攒25反制能量'};
nodes.knock.text=x=>x.momentum>=25?'卷帘门外敲出三长两短。灰帽商人仍在高价兜售撤离名单，但你已经从证据链里看穿他的身份。你示意老周躲到货架后——这一次，开门不代表投降。':'卷帘门被敲了三长两短。灰帽商人喊着用撤离名单换十瓶水，仓库门却同时从里面响了一声。你还缺少能反过来控制局面的证据。';

// Tension without stealing agency on slower phones.
timedNodes.knock=50;timedNodes.radio=40;
const baseUpdateLocksThrill=updateLocks;updateLocks=function(){baseUpdateLocksThrill();const found=(s.found[s.node]||[]).length+(s.talked[s.node]?1:0),total=(investigations[s.node]||[]).length+((dialogues[s.node]||[]).length?1:0);$('clueCount').textContent=found+' / '+total};
const baseEnterThrill=enterConsequences;enterConsequences=function(next){baseEnterThrill(next);if(next==='ambush')s.echo='你把一路收集的证据变成了陷阱，灰帽商人没有发现店里的人早已就位。';if(next==='radio'&&s.flags.brokeTrader)s.echo='灰帽商人交出的应答码正在耳机里验证：其中一辆车果然答错。'};
const baseTryThrill=tryUse;tryUse=function(target){const before=Object.keys(s.used||{}).length;baseTryThrill(target);if(Object.keys(s.used||{}).length>before){gainMomentum(12,'有效操作');checkChains();localStorage.setItem('lastLightStory',JSON.stringify(s))}};
const baseInteractionsThrill=renderInteractions;renderInteractions=function(){baseInteractionsThrill();$('hotspots').querySelectorAll('.hotspot').forEach(button=>button.addEventListener('click',()=>setTimeout(checkChains,30)))};
const baseRenderThrill=render;render=function(){ensureThrill();baseRenderThrill();renderThrill();checkChains()};
render();


