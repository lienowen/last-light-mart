/* First-season continuation. Chapter two pays off the rain, Su Yan and the lighthouse system. */
itemLabels.rainbarrel='黑雨样本';itemLabels.tracker='白塔定位器';itemLabels.sistercode='姐姐的校验码';
Object.assign(evidenceNames,{rainbarrel:'黑雨沉淀',flyer:'白塔传单',filter:'割裂滤芯',bluepowder:'蓝色示踪粉',rationmark:'被改配水线',sickbird:'中毒雨燕',tracker:'白塔定位器',tripwire:'水下绊线',valve:'泵站阀门',seal:'L-17封条',antenna:'示踪天线',sistercode:'姐姐的校验码'});
Object.assign(investigations,{
  c2_dawn:[['rainbarrel',12,68,'接雨桶','桶底不是泥，而是会吸附金属的黑色沉淀。'],['flyer',78,42,'湿传单','白塔传单背面印着“聚居点示踪回收”。']],
  c2_roof:[['filter',12,66,'割裂滤芯','滤芯从内部被割开，示踪粉因此进入整栋楼的水。'],['bluepowder',78,38,'蓝色粉末','粉末遇雨发出微弱荧光，能被高空设备识别。']],
  c2_market:[['rationmark',12,70,'水桶刻线','有人把配给线往上改了两厘米，正在制造争抢。'],['sickbird',78,43,'雨燕','死鸟脚环上有白塔环境监测编号。']],
  c2_suyan:[['tracker',23,70,'掌心遥控器','她把遥控器藏在大腿侧边，屏幕正回传白塔定位信号。'],['tripwire',55,78,'水下绊线','细线贴着水面横过道路，连着货车底部的震爆罐。']],
  c2_pump:[['valve',12,67,'泵站阀门','阀门被锁死，旁边的跨接端口正好能接电池。'],['seal',78,42,'L-17封条','泵站封条与便利店节点编号完全相同。']],
  c2_choice:[['antenna',12,66,'示踪天线','天线正在向白塔回报这片街区的人数。'],['sistercode',78,38,'校验码','锈蚀面板下刻着姐姐常用的七位校验格式。']],c2_end:[]
});
Object.assign(dialogues,{
  c2_dawn:['林晓：孩子不是复发，是刚喝下的雨水有问题。','林晓：这种沉淀会标记建筑，不会立刻杀人。'],
  c2_roof:['程野：滤芯不是老化，是从里面被人割开的。','程野：给我三分钟，我能把收集器拆下来。'],
  c2_market:['林晓：再不公布真相，人群会先为了净水打起来。'],
  c2_suyan:['苏妍：先拉我起来，水还在涨。你如果低头看线，我们就都来不及了。','苏妍：她贴着货车站起，手还停在你肩上：“你每次都知道我在骗你，却还是会伸手。”','苏妍：好吧，你又没看我想让你看的地方。白塔让我带着定位器接近你。'],
  c2_pump:['阿梨：L-17不是商店编号，是灯塔节点编号。','阿梨：你姐姐的名字在维护记录最后一页。'],
  c2_choice:['阿梨：姐姐留下的校验码能劫持天线，但只能用一次。','阿梨：毁掉它最安全，接管它才可能救更多人。']
});
Object.assign(poseSets,{c2_dawn:['lin-worry','lin-point'],c2_roof:['chengye'],c2_market:['lin-guard'],c2_suyan:['suyan'],c2_pump:['ali-map','ali-point'],c2_choice:['ali-point','ali-lookback'],c2_end:['ali-lookback']});

nodes.c2_dawn={scene:'store',title:'第二夜 · 黑雨',stamp:'06:40 / 水源警报',speaker:'林晓',text:x=>'第一夜之后，所有接雨桶同时出现黑色沉淀。'+(x.flags.savedChild?'昨晚救下的孩子再次呕吐，林晓却断定这不是感染。':'诊所传来第二次求救：没等到药的孩子开始抽搐。')+'便利店门上多了一张白塔科技的湿传单。',choices:[['封存所有雨水，去屋顶找污染源','净水暂时停用','c2_roof',x=>x.flags.waterLocked=1],['先去居民院控制配水冲突','信任考验','c2_market',x=>x.flags.crowdFirst=1]]};
nodes.c2_roof={scene:'rooftop',title:'屋顶集水区 · 蓝色微光',stamp:'07:25 / 无人机掠过',speaker:'程野',text:'程野拆开集水器，蓝色粉末在雨里发光。天空掠过一架没有灯的无人机，正沿着每一栋亮灯建筑画圈。滤芯切口很新，动手的人就在昨夜来过。',choices:[['追踪无人机落点，先去居民院','寻找地面接收者','c2_market',x=>x.flags.followDrone=1],['直接找苏妍对质','她知道白塔规则','c2_suyan',x=>x.flags.confrontSuyan=1]]};
nodes.c2_market={scene:'courtyard',title:'居民院 · 配水冲突',stamp:'11:10 / 净水只剩三桶',speaker:'林晓',text:'几十个人围住配水桶。有人把刻线偷偷上移，老人和孩子被挤到最后。远处无人机每隔七秒扫过一次，争抢的人越多，它停留得越久。',choices:[['公开黑雨真相，立即按家庭配给','信任 +2','c2_suyan',x=>{x.trust+=2;x.flags.fairRation=1}],['隐瞒示踪风险，先稳住人群','保住秩序','c2_suyan',x=>x.flags.hidRain=1],['让程野站到桶前强行控场','需要程野加入','c2_pump',x=>{x.flags.forceRation=1;x.trust--}]]};
choiceRequirements.c2_market={2:x=>x.flags.chengyeJoined?null:'程野还没有加入'};
nodes.c2_suyan={scene:'courtyard',title:'积水隧道 · 苏妍的诱饵',stamp:'15:40 / 红点掠过墙面',speaker:'苏妍',text:x=>(x.flags.rescuedOffice?'许曼交出的员工名单把你带到写字楼下方的排水道。':'定位信号最终钻进一座积水隧道。')+(x.flags.outsmartedSuyan?'苏妍不再装受伤，却仍靠在货车边向你伸手。':'苏妍半跪在翻倒的货车旁，湿透的紧身黑裤和敞开的外套让她显得毫无防备。')+'右侧，被路牌压住的快递员却在拼命摇头。你的灯扫过水面：她腿侧藏着遥控器，脚前横着几乎看不见的绊线。',choices:[['割断绊线，先把快递员拖出来','救人并夺走遥控器','c2_pump',x=>{x.flags.savedCourier=1;x.flags.exposedSuyan=1;x.trust++;bond('suyan',-1)}],['关闭定位器，逼她带路去泵站','需要找到定位器','c2_pump',x=>{x.flags.suyanTurned=1;bond('suyan',2)}],['把背包挂上绊线假装中招，反向追踪','反制能量 +20','c2_pump',x=>{x.flags.trackedWhiteTower=1;if(typeof gainMomentum==='function')gainMomentum(20,'反向追踪');bond('suyan',1)}]]};
choiceRequirements.c2_suyan={1:x=>x.evidence.tracker?null:'先看清她藏遥控器的手'};
nodes.c2_pump={scene:'backroom',title:'地下泵站 · L-17',stamp:'19:30 / 水位上涨',speaker:'阿梨',text:'便利店货架后的通道通向一座旧泵站。墙上印着与商店相同的L-17编号，维护记录最后一页出现了你失踪姐姐的签名。主泵断电，污染水正倒灌进净水管。',choices:[['启动主泵，隔离污染水','需要修复阀门供电','c2_choice',x=>{x.flags.cleanPump=1;x.trust+=2}],['手动封死管道，保住现有净水','失去泵站','c2_choice',x=>x.flags.sealedPump=1],['沿维护记录追查姐姐留下的校验码','获得核心证据','c2_choice',x=>x.flags.sisterTrail=1]]};
choiceRequirements.c2_pump={0:x=>x.flags.pumpOnline?null:'把电池拖到泵站阀门'};
nodes.c2_choice={scene:'rooftop',title:'示踪发射塔 · 第二夜终局',stamp:'23:12 / 白塔车队 18分钟',speaker:'阿梨',text:'泵站恢复后，屋顶天线自动升起。屏幕显示：L-17，幸存者37，医疗人员1，工程人员1。姐姐留下的校验码正在等待输入，白塔车队已经转向这条街。',choices:[['砸毁天线，让街区从地图上消失','最安全的选择','c2_end',x=>x.flags.c2Destroy=1],['输入姐姐校验码，向全城公开示踪真相','需要校验码和定位器','c2_end',x=>x.flags.c2Hijack=1],['伪造两百人坐标，把白塔引向空泵站','需要苏妍情报或反向追踪','c2_end',x=>x.flags.c2Decoy=1]]};
choiceRequirements.c2_choice={1:x=>(x.evidence.sistercode&&x.evidence.tracker)?null:'缺少校验码或定位器',2:x=>(x.flags.suyanTurned||x.flags.trackedWhiteTower)?null:'不知道白塔接收规则'};
nodes.c2_end={scene:'rooftop',title:'第二章终章 · 雨水有毒',stamp:'23:47 / 第二段密钥',speaker:'旁白',text:x=>x.flags.c2Hijack?'你输入姐姐的校验码。整座城市的灯塔同时跳出白塔回收名单，陌生频道开始回应：“我们看见了。”第二段关闭密钥随广播解锁。':x.flags.c2Decoy?'白塔车队转向废弃泵站。苏妍听着对方在假坐标扑空，第一次真正笑了。街区得到一夜喘息，但定位系统仍在运行。':'天线在雨中断成两截。无人机失去目标，街区暂时安全；姐姐的校验码却随电路一起烧毁。',choices:[]};

useRules['c2_pump:valve:battery']=()=>{if(s.used.c2Pump)return'主泵已经通电。';if(!spend('battery'))return'没有可用电池。';s.used.c2Pump=1;s.flags.pumpOnline=1;s.trust++;return'电池接入跨接端口，沉寂多年的主泵重新震动。黑水被切离净水管，墙上亮起“密钥 2/7”。'};

const chapter2FlagKeys=['waterLocked','crowdFirst','followDrone','confrontSuyan','fairRation','hidRain','forceRation','savedCourier','exposedSuyan','suyanTurned','trackedWhiteTower','cleanPump','sealedPump','sisterTrail','c2Destroy','c2Hijack','c2Decoy','pumpOnline','rescuedOffice','executiveCard'];
const chapter2EvidenceKeys=['rainbarrel','flyer','filter','bluepowder','rationmark','sickbird','tracker','tripwire','valve','seal','antenna','sistercode','towerRoster','executiveCard'];
function chapter2Unlocked(){return localStorage.getItem('lastLightChapter2Unlocked')==='1'}
function saveChapter2Checkpoint(){
  try{localStorage.setItem('lastLightChapter2Base',JSON.stringify(s))}catch{}
}
function restoreChapter2Checkpoint(){
  try{const saved=JSON.parse(localStorage.getItem('lastLightChapter2Base')||'null');if(saved&&saved.flags)return saved}catch{}
  return null;
}
function clearChapter2Progress(){
  s.flags=s.flags||{};chapter2FlagKeys.forEach(key=>delete s.flags[key]);
  s.evidence=s.evidence||{};chapter2EvidenceKeys.forEach(key=>delete s.evidence[key]);
  s.used=s.used||{};delete s.used.c2Pump;
  s.history=(s.history||[]).filter(entry=>!String(entry?.from||'').startsWith('c2_'));
}
function startChapter2(replay=false){
  if(!chapter2Unlocked()&&localStorage.getItem('lastLightDebugChapter2')!=='1'){say('完成第一章后才能进入第二章。');return}
  clearInterval(crisisInterval);
  if(replay){const checkpoint=restoreChapter2Checkpoint();if(checkpoint)s=checkpoint}else saveChapter2Checkpoint();
  clearChapter2Progress();
  s.chapter=2;s.node='c2_dawn';s.steps=1;s.found={};s.talked={};s.line={};s.selectedItem=null;s.echo='第一夜的选择已经保存。活下来的人和失去的东西都会继续影响第二章。';s.food=Math.max(2,s.food);s.water=Math.max(2,s.water);s.battery=Math.max(1,s.battery);
  menu.classList.remove('show');$('chapterComplete').classList.remove('show');render();
}
function chapter2EndingInfo(){return s.flags.c2Hijack?['全城看见了','你把白塔的标记变成了证据。']:s.flags.c2Decoy?['空泵站诱饵','敌人追向假人口，街区得到喘息。']:['从地图消失','你保住街区，却烧掉一段真相。']}
function renderChapter2End(){
  const [title,desc]=chapter2EndingInfo(),root=$('chapterComplete');let ends=[];try{ends=JSON.parse(localStorage.getItem('lastLightChapter2Endings')||'[]')}catch{}const id=s.flags.c2Hijack?'hijack':s.flags.c2Decoy?'decoy':'destroy';if(!ends.includes(id))ends.push(id);localStorage.setItem('lastLightChapter2Endings',JSON.stringify(ends));root.innerHTML='<h2>'+title+'</h2><p>'+desc+'</p><div class="result-stats"><span><b>'+s.trust+'</b>街区信任</span><span><b>'+Object.keys(s.evidence||{}).length+'</b>累计线索</span><span><b>2 / 7</b>关闭密钥</span></div><div class="ending-progress">第二章结局 '+ends.length+' / 3 · 第一季试玩进度 2 / 7</div><div class="result-actions"><button id="c2Menu">回到标题</button><button id="c2Retry" class="primary">重玩第二章</button></div>';root.classList.add('show');$('c2Menu').onclick=()=>{menu.classList.add('show');refreshChapter2Shortcut()};$('c2Retry').onclick=()=>startChapter2(true);
}
const baseEndingSeason=renderEndingReport;renderEndingReport=function(){
  localStorage.setItem('lastLightChapter2Unlocked','1');saveChapter2Checkpoint();baseEndingSeason();refreshChapter2Shortcut();
  const actions=$('chapterComplete').querySelector('.result-actions');if(actions&&!$('enterChapter2')){actions.classList.add('three');const next=document.createElement('button');next.id='enterChapter2';next.className='primary next-chapter';next.textContent='进入第二章';next.onclick=()=>startChapter2(false);actions.appendChild(next)}
};
const seasonProgress=document.createElement('div');seasonProgress.className='season-progress';seasonProgress.innerHTML='<b>第一季 · 七个雨夜</b><span>试玩版当前开放：第一章、第二章</span><button id="chapter2Shortcut">第二章：雨水有毒</button>';menu.querySelector('.start-card').appendChild(seasonProgress);
const chapter2Shortcut=$('chapter2Shortcut');
function refreshChapter2Shortcut(){
  const unlocked=chapter2Unlocked();chapter2Shortcut.disabled=!unlocked;chapter2Shortcut.textContent=unlocked?'第二章：雨水有毒':'第二章：完成第一章后解锁';chapter2Shortcut.style.opacity=unlocked?'1':'.45';chapter2Shortcut.style.cursor=unlocked?'pointer':'not-allowed';
}
chapter2Shortcut.onclick=()=>{if(chapter2Unlocked())startChapter2(true)};refreshChapter2Shortcut();
const baseRenderSeason=render;render=function(){baseRenderSeason();const chapter2=s.node.startsWith('c2_');document.body.classList.toggle('chapter-two',chapter2);$('chapter').textContent=chapter2?'第二章 · 雨水有毒':'第一章 · 失联者';if(chapter2){$('objective').textContent='目标：查明黑雨为什么标记幸存者';$('progress').textContent=Math.min(s.steps,7)+' / 7'}if(s.node==='c2_end')renderChapter2End();refreshChapter2Shortcut()};
render();
