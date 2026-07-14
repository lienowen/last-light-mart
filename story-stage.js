/* Stage direction v2: integrated cast frames, off-axis camera crops and playable travel. */
const stageSceneAssets={
  dawn:'assets/story/opening-suyan-store-v5.png',
  clinic:'assets/story/lin-clinic-integrated-v3.webp',
  diagnose:'assets/story/ali-clinic-diagnosis-v4.webp',
  search:'assets/story/zhou-pharmacy-integrated-v3.webp',
  c2_dawn:'assets/story/lin-store-integrated-v3.webp',
  alley:'assets/story/suyan-first-alley-v4.webp',
  c2_suyan:'assets/story/suyan-underpass-yoga-v4.webp',
  c2_roof:'assets/story/chengye-roof-integrated-v3.webp',
  c2_market:'assets/story/lin-ration-integrated-v3.webp',
  c2_pump:'assets/story/ali-pump-integrated-v3.webp',
  garage:'assets/story/chengye-garage-integrated-v2.webp',
  radio:'assets/story/ali-rooftop-integrated-v2.webp',
  c2_choice:'assets/story/ali-rooftop-integrated-v2.webp',
  c2_end:'assets/story/ali-rooftop-integrated-v2.webp'
};
const stageActors={
  dawn:{x:15,y:7,w:27,h:62,label:'让苏妍把话说清楚'},
  clinic:{x:40,y:42,w:22,h:27,label:'和林晓交谈'},
  diagnose:{x:48,y:29,w:31,h:49,label:'接过阿梨手里的水样'},
  search:{x:13,y:35,w:32,h:36,label:'和老周交谈'},
  c2_dawn:{x:18,y:35,w:32,h:34,label:'询问林晓'},
  alley:{x:15,y:10,w:31,h:65,label:'别只看苏妍伸出的手'},
  c2_suyan:{x:15,y:14,w:33,h:55,label:'盯住苏妍的手'},
  c2_roof:{x:20,y:34,w:42,h:36,label:'询问程野'},
  c2_market:{x:40,y:38,w:30,h:35,label:'协助林晓'},
  c2_pump:{x:25,y:22,w:38,h:42,label:'询问阿梨'},
  garage:{x:42,y:34,w:34,h:38,label:'和程野配合'},
  radio:{x:35,y:37,w:32,h:40,label:'和阿梨交谈'},
  c2_choice:{x:35,y:37,w:32,h:40,label:'询问阿梨'}
};
const stageProfiles={
  dawn:{wide:[100,50,50],person:[148,28,45],investigate:[118,58,61],decision:[108,48,52]},
  clinic:{wide:[100,50,50],person:[150,50,51],investigate:[112,50,52],decision:[106,50,52]},
  diagnose:{wide:[100,50,50],person:[145,63,52],investigate:[120,66,48],decision:[108,51,52]},
  search:{wide:[100,50,50],person:[145,30,49],investigate:[112,42,52],decision:[106,45,52]},
  c2_dawn:{wide:[100,50,50],person:[145,31,50],investigate:[112,46,52],decision:[106,48,52]},
  alley:{wide:[101,50,50],person:[146,28,45],investigate:[118,58,62],decision:[108,48,52]},
  c2_suyan:{wide:[101,50,50],person:[145,30,48],investigate:[116,50,60],decision:[108,45,52]},
  c2_roof:{wide:[100,50,50],person:[138,39,51],investigate:[112,50,52],decision:[106,50,52]},
  c2_market:{wide:[100,50,50],person:[135,52,50],investigate:[112,50,52],decision:[106,50,52]},
  c2_pump:{wide:[100,50,50],person:[145,42,43],investigate:[112,48,50],decision:[106,48,50]},
  garage:{wide:[101,50,50],person:[138,59,49],investigate:[116,59,52],decision:[108,55,50]},
  radio:{wide:[100,50,50],person:[132,50,55],investigate:[114,54,54],decision:[107,54,52]},
  c2_choice:{wide:[100,50,50],person:[132,50,55],investigate:[114,54,54],decision:[107,54,52]},
  c2_end:{wide:[100,50,50],decision:[108,54,52]}
};

nodes.dawn={scene:'store',title:'最后一盏灯 · 雨晨来客',stamp:'07:10 / 卷帘门只开一半',speaker:'苏妍',text:'卷帘门刚抬到腰高，一个穿改装护士短裙和黑丝袜的成年女人就从暴雨里钻了进来。苏妍把红色医疗包放在脚边，雨衣敞着，语气像求助，视线却先扫过药柜、后门和你的手。收音机仍停在23:47，库存清单上恰好少了一盒药。',choices:[['拿上药跟她去救护车','药品先由你保管','alley',x=>{x.flags.tookMed=1;x.flags.agreedSuyan=1;bond('suyan',1)}],['逼她走前面，你在后面核对脚印','识破谎言的机会','alley',x=>{x.flags.tailedSuyan=1;if(typeof gainMomentum==='function')gainMomentum(8,'保持戒心')}],['扣下医疗包作抵押，从侧门包抄','主动掌握节奏','alley',x=>{x.flags.suyanCollateral=1;x.trust++;bond('suyan',1)}]]};
investigations.dawn=[['ledger',64,82,'库存清单','药品一行有半枚湿指纹，水痕方向从门口指向柜台。其他行都是干的。'],['lock',35,84,'旧仓钥匙','钥匙齿缝里卡着新鲜红漆，表面没有长期使用留下的油垢。']];
dialogues.dawn=['苏妍：二十八岁，前战地护士。她解开湿雨衣的束带，露出贴身制服，却始终让右手停在你看得见的位置：“先看我的眼睛，还是先看我有没有武器？选错的人通常活不久。”','苏妍：她俯身把医疗包推过柜台，短裙下摆被桌沿轻轻带起，又若无其事地压回去；冰凉指尖从你手背慢慢擦过：“没躲？胆子不小。”','苏妍：外面那辆救护车不是我的。她贴近半步，替你扣紧松开的背包带：“跟紧我。刚才那一下，你可以当成意外——也可以记着。”'];

nodes.alley.text='救护车后门敞着，苏妍站在暖色警示灯下向你伸手。贴身的护士短裙、黑丝袜和湿雨衣让她看起来比这条巷子更值得注意——这正是她想要的。你的目光只要再抬高一点，就会错过水面上连着空罐的透明钢丝；远处无编号巡逻车已经转进路口。';
dialogues.alley=['苏妍：她单腿踩住安全落点，黑丝包裹的长腿从雨衣下露出一截：“过来扶我，或者继续盯着那根线。你只有五秒。”','苏妍：她扣住你的手腕借力贴近，另一只手却悄悄把你的鞋尖拨离钢丝；呼吸擦过耳侧：“心跳这么快，是怕机关，还是怕我？”','苏妍：她松开你时，指尖故意在掌心多停了一秒：“你没看我想让你看的地方。很好——真正的诊所入口，我只告诉清醒的人。”'];
investigations.alley=[['wire',70,79,'积水绊线','透明钢丝末端拴着三个空罐，受力方向正对街口；钢丝本身细得无法承受人体重量。'],['cleanboot',35,74,'避水落脚点','积水里只有一块干燥砖面，苏妍的鞋尖始终压着砖角，伸手方向恰好越过钢丝。']];

investigations.clinic=[['footprint',38,70,'湿脚印','同一双鞋往返过便利店和诊所，鞋跟夹着未干的红漆屑。'],['window',72,46,'病房窗','玻璃内侧只写着“23:47”；笔画朝外，写字的人当时站在病房里。']];
investigations.diagnose=[['bottle',54,57,'黑色水样','黑色颗粒被瓶盖磁片吸住，静置后仍沿金属边缘排列。'],['mapmark',79,29,'检修路线图','屋顶天线、雨水管和地下泵站被同一种红笔连成闭环，诊室没有被圈入。']];
investigations.search=[['key',28,62,'旧钥匙','钥匙能开便利店后仓，齿缝残留与天线底座相同的红漆。'],['siren',72,37,'巡逻灯','车灯每七秒扫一次，车身没有编号，轮胎却沾着屋顶防水沥青。']];

/* Keep the first night chronological and make every main route earn its finale. */
nodes.clinic.title='青禾诊所 · 封锁门厅';
nodes.clinic.stamp='08:40 / 巡逻灯第一次扫过';
nodes.clinic.text='林晓只把侧门拉开一条缝。昨夜有人偷走退烧药，又把你仓库的旧钥匙留在病床边；门内的病人喝过同一批接雨水。无编号巡逻车正在街口逐栋检查亮灯建筑。';
nodes.diagnose.title='青禾诊所 · 水样诊断';
nodes.diagnose.stamp='09:05 / 黑色沉淀出现';
nodes.diagnose.text='阿梨把瓶底的黑色沉淀举到灯下：这不是感染，而是饮水中毒。林晓在后景稳定病人的体温，墙上地图则把屋顶天线、旧药房和地下检修道连成同一条路线。';
investigations.diagnose=[['bottle',54,57,'黑色水样','颗粒会吸附在金属瓶盖上，说明它不是普通淤泥。'],['mapmark',79,29,'检修路线图','红线从旧药房经过后仓机修间，最后抵达屋顶天线。']];
dialogues.diagnose=['阿梨：我二十四岁，修无线电的。水样里有会回应电磁脉冲的东西。','阿梨：有人不是想毒死这里的人，而是想从空中数清这里有多少人。'];
nodes.search.title='旧药房 · 无编号巡逻车';
nodes.search.stamp='11:20 / 封锁线合拢';
nodes.search.text='老周守在废弃药房里，手上是你的仓库钥匙。他承认灰帽商人用一段“撤离频率”换他送钥匙上楼；窗外那辆没有编号的巡逻车已经堵住主路，唯一出口是相连的后仓机修间。';
nodes.garage.stamp='13:10 / 卷帘门下坠';
nodes.knock.stamp='20:40 / 你们守了七个小时';
nodes.knock.text=x=>x.momentum>=25?'你们用整个下午把幸存者、药和证据搬回便利店。卷帘门外终于敲出三长两短；灰帽商人仍在兜售撤离名单，但你已经能把一路线索反过来变成陷阱。':'你们用整个下午才绕回便利店。天黑后，灰帽商人在卷帘门外用十瓶水换撤离名单；仓库深处却同时响起同样的三长两短，说明店里还有一条路。';
nodes.tunnel.stamp='21:15 / 地下广播仍在循环';
nodes.radio.stamp='23:47 / 两辆车同时回应';
nodes.search.choices.forEach(choice=>choice[2]='garage');
nodes.garage.choices.forEach(choice=>choice[2]='knock');

function applyStageScene(){
  const asset=stageSceneAssets[s.node],actor=stageActors[s.node];
  directorScene.classList.toggle('integrated-cast',!!asset);
  directorScene.dataset.stageNode=asset?s.node:'';
  if(asset)directorScene.style.backgroundImage=`url('${asset}')`;
  const character=$('character');
  if(actor){
    character.style.left=actor.x+'%';character.style.top=actor.y+'%';
    character.style.width=actor.w+'%';character.style.height=actor.h+'%';
    character.style.bottom='auto';character.style.transform='none';
    character.dataset.stageLabel=actor.label;
    character.setAttribute('aria-label',actor.label);
  }else{
    character.style.removeProperty('top');character.style.removeProperty('height');
    character.style.removeProperty('bottom');character.style.removeProperty('width');
    character.style.removeProperty('left');character.style.removeProperty('transform');
    delete character.dataset.stageLabel;
    character.setAttribute('aria-label','场景人物');
  }
}

const baseDirectorShotStage=applyDirectorShot;
applyDirectorShot=function(type,options={}){
  baseDirectorShotStage(type,options);
  const profile=stageProfiles[s.node]?.[type];
  if(profile){
    directorScene.style.setProperty('--shot-size',profile[0]+'%');
    directorScene.style.setProperty('--shot-x',profile[1]+'%');
    directorScene.style.setProperty('--shot-y',profile[2]+'%');
  }else if(type==='close'){
    directorScene.style.setProperty('--shot-size','120%');
    directorScene.style.setProperty('--shot-x',(options.x??50)+'%');
    directorScene.style.setProperty('--shot-y',(options.y??50)+'%');
  }else{
    directorScene.style.removeProperty('--shot-size');
    directorScene.style.removeProperty('--shot-x');
    directorScene.style.removeProperty('--shot-y');
  }
};

const routeScenes={
  'dawn>alley':{asset:'assets/story/suyan-first-alley-v4.webp',title:'卷帘门外 · 救护车后巷',text:'她没有直接去诊所，而是把你带到一辆弃置救护车前。警示灯暖得像安全屋，远处巡逻灯却正在逼近。',scan:'看清水面细线',x:70,y:79,safe:'沿墙踩她走过的位置',bold:'抓住她的手跨过积水',safeText:'你顺着她的脚印避开绊线，也看见线头连着给巡逻车报点的空罐。',boldText:'她的手很稳，身体却在最后一步故意靠近；你闻到消毒水时，鞋尖已经碰到钢丝。'},
  'alley>clinic':{asset:'assets/story/lin-clinic-integrated-v3.webp',title:'诊所侧门 · 巡逻灯扫墙',text:'钢丝剪断后，苏妍没有再绕路。青禾诊所侧门只开了一条缝，林晓在里面压低手电，巡逻车的红光正从院墙移向门口。',scan:'观察红光停顿',x:20,y:31,safe:'等红光移开再敲三短声',bold:'把救护车警示灯扔向街口',safeText:'林晓听懂暗号，在巡逻灯移开的七秒里放你进门。',boldText:'警示灯滚进路口，巡逻车立即转向；你获得更长时间，却暴露了救护车有人动过。'},
  'search>garage':{asset:'assets/story/chengye-garage-integrated-v2.webp',title:'封锁线外 · 机修后门',text:'主路被无编号车辆截断。半落的卷帘门后有人撑着重量，电机正冒出焦味。',scan:'观察卷扬机',x:78,y:37,safe:'先切断过热电源',bold:'趁闸门没落冲进去',safeText:'你找到断裂电缆和手动刹车，里面的人因此多撑了十秒。',boldText:'你滑进门内，鞋底在油水上打滑。闸门轰然落到身后。'},
  'garage>radio':{asset:'assets/story/ali-rooftop-integrated-v2.webp',title:'楼梯间断电 · 屋顶入口',text:'最后两层没有灯。上方有无线电杂音，楼下却传来金属门被撞击的回声。',scan:'听清回声方向',x:19,y:48,safe:'贴墙摸黑上楼',bold:'打开手电冲上屋顶',safeText:'你避开断裂台阶，从侧门看见阿梨正在校准天线。',boldText:'手电暴露了位置，远处红塔立刻转向，但你抢到了半分钟。'},
  'c2_dawn>c2_roof':{asset:'assets/story/chengye-roof-integrated-v3.webp',title:'黑雨中的楼梯',text:'楼道里每一扇门都摆着接雨桶。越往上，桶底的蓝光越明显。',scan:'检查墙上水痕',x:28,y:62,safe:'关闭沿途接雨管',bold:'先赶到屋顶源头',safeText:'你关掉三户的进水阀，延缓了污染扩散。',boldText:'你抢先抵达屋顶，却听见楼下有人已经喝了雨水。'},
  'c2_dawn>c2_market':{asset:'assets/story/lin-ration-integrated-v3.webp',title:'居民院外 · 第七秒',text:'配水桶旁已经挤满人。无人机每隔七秒掠过一次，每次都在争抢最激烈的位置减速。',scan:'数无人机间隔',x:76,y:28,safe:'熄灯分批进入院内',bold:'跳上水箱压住人群',safeText:'你让老人和孩子先沿暗处进入，白塔只记录到零散热源。',boldText:'所有人都看见了你，无人机也在你头顶停满七秒。'},
  'c2_roof>c2_market':{asset:'assets/story/lin-ration-integrated-v3.webp',title:'追着无人机下楼',text:'无人机的影子落进居民院。人群正围着仅剩的三桶水，地上却有一道刚改过的刻线。',scan:'查看桶边粉笔灰',x:31,y:72,safe:'从侧门找到林晓',bold:'穿过人群抢到水桶边',safeText:'你从背后看见有人反复擦改配给线，先抓住了制造混乱的人。',boldText:'你撞开争抢者站到桶前，暂时镇住场面，也成了无人机最清楚的目标。'},
  'c2_roof>c2_suyan':{asset:'assets/story/suyan-underpass-yoga-v4.webp',title:'高架桥下 · 求救手势',text:'定位信号钻进积水隧道。苏妍穿着深色全身紧身瑜伽服，靠着翻倒货车向你伸手；右侧被压住的快递员却在拼命摇头。',scan:'看水面横线',x:55,y:76,safe:'先沿墙检查她身侧',bold:'伸手把她拉起来',safeText:'你的灯扫出贴着水面的绊线，她藏在腿侧的手正按着遥控器。',boldText:'她抓住你的手借力站起，脚尖却把绊线推向你。你只剩半步反应。'},
  'c2_market>c2_suyan':{asset:'assets/story/xu-man-lobby-rescue-v4.webp',title:'停电写字楼 · 闸机两侧',text:'许曼穿着贴身瑜伽上衣、短裙和黑丝翻过损坏闸机，把高管门卡递向你；真正让人移不开视线的，是她身后被反锁的十七名普通职员。保安队长郑恺守着电梯，正在等你表态。',scan:'核对门卡楼层',x:39,y:48,safe:'先查卡再翻闸机',bold:'抓住她的手直接越过',safeText:'卡片只开放管理层安全梯。许曼说的“全员通道”是谎话。',boldText:'你借她的手越过闸机，姿势亲近得像一场默契；随即，普通员工楼层的防火门开始自动落锁。',followup:{text:'警报只给你二十秒。许曼要你拿卡走，郑恺却把手电照向楼上求救的人。',choices:[{label:'折回解锁普通员工楼层',hint:'救十七人，放慢追踪',result:'你和郑恺顶住防火门，许曼终于交出真实名单。十七个人下楼时，无人机已经飞向下一处信号。',heading:'你选择先救人',trust:1,flag:'rescuedOffice',evidence:['towerRoster','被锁楼层名单']},{label:'拿走高管门卡继续追踪',hint:'抢时间，掌握白塔入口',result:'你拿走门卡，许曼带你穿过董事专梯。楼上的敲门声留在身后，这张卡却能打开白塔外包通道。',heading:'你拿到了捷径',flag:'executiveCard',evidence:['executiveCard','白塔高管门卡'],momentum:8}]}},
  'c2_suyan>c2_pump':{asset:'assets/story/ali-pump-integrated-v3.webp',title:'排水井 · 污水倒灌',text:'苏妍给出的坐标通向旧泵站。井盖下的水位每十秒上涨一格，阿梨隔着铁网喊你别踩黄色踏板。',scan:'照亮阀门刻度',x:69,y:42,safe:'沿检修链逐级下降',bold:'跳过护栏落到平台',safeText:'你摸到一条仍有张力的检修链，顺势找到了L-17备用入口。',boldText:'你抢在水位前落地，护栏却砸进水里，后路被彻底封死。'},
  'c2_pump>c2_choice':{asset:'assets/story/ali-rooftop-integrated-v2.webp',title:'维护竖井 · 天线苏醒',text:'主泵一震，竖井上方的天线同时升起。白塔车灯已在三条街外，屏幕开始清点这片街区的人数。',scan:'辨认旋转红光',x:62,y:26,safe:'关闭沿路身份标签',bold:'带着校验码直上屋顶',safeText:'你拔掉三枚身份标签，白塔人数从四十跳回三十七。',boldText:'你赶在计数锁定前抵达发射塔，但楼下每个人仍在名单上。'}
};
let stageRoute=null;

function defaultRoute(from,next){
  const destination=stageSceneAssets[next]||sceneImg[nodes[next]?.scene]||sceneImg.store;
  return {asset:destination,title:travelTitle(from)+' → '+travelTitle(next),text:'安全路线在雨里不断变化。你必须先看清遮蔽物、积水和远处灯光。',scan:'停下观察动静',x:50,y:60,safe:'沿遮蔽物慢行',bold:'冒雨抢时间',safeText:'你用更慢的路线避开了暴露位置。',boldText:'你抢到时间，也让远处的人看见了移动的灯光。'};
}
function showRouteResult(kind,text,heading){
  travelOverlay.classList.add('route-result');
  travelOverlay.classList.remove('route-choice','route-followup');
  travelOverlay.querySelector('.route-choices')?.remove();
  travelOverlay.querySelector('.route-copy').innerHTML='<small>途中结果</small><h2>'+(heading||(kind==='safe'?'你看穿了路况':'你抢到了时间'))+'</h2><p>'+text+'</p><button class="route-continue">继续前进</button>';
  travelOverlay.querySelector('.route-continue').onclick=finishStageRoute;
}
function routeFollowup(index){
  if(!stageRoute?.data.followup)return;
  const option=stageRoute.data.followup.choices[index];
  if(!option)return;
  if(option.flag)s.flags[option.flag]=1;
  if(option.trust)s.trust+=option.trust;
  if(option.momentum&&typeof gainMomentum==='function')gainMomentum(option.momentum,'途中抉择');
  if(option.evidence){s.evidence=s.evidence||{};s.evidence[option.evidence[0]]=option.evidence[1]}
  stageRoute.followup=index;
  showRouteResult(index===0?'safe':'bold',option.result,option.heading);
}
function routeChoice(kind){
  if(!stageRoute)return;
  const data=stageRoute.data;
  stageRoute.choice=kind;
  if(kind==='safe'){
    s.flags.routeCareful=(s.flags.routeCareful||0)+1;
  }else{
    s.flags.routeBold=(s.flags.routeBold||0)+1;
    if(typeof gainMomentum==='function')gainMomentum(5,'冒险赶路');
  }
  travelOverlay.querySelector('.route-choices')?.remove();
  if(data.followup){
    travelOverlay.classList.add('route-followup');
    travelOverlay.classList.remove('route-choice');
    travelOverlay.querySelector('.route-copy').innerHTML='<small>第二个现场决定</small><h2>'+(kind==='safe'?'你识破了第一层':'你闯过了第一层')+'</h2><p>'+data.followup.text+'</p>';
    const choices=document.createElement('div');choices.className='route-choices route-choices-followup';
    choices.innerHTML=data.followup.choices.map((option,index)=>'<button data-follow="'+index+'">'+option.label+'<small>'+option.hint+'</small></button>').join('');
    travelOverlay.appendChild(choices);
    choices.querySelectorAll('button').forEach(button=>button.onclick=()=>routeFollowup(Number(button.dataset.follow)));
    return;
  }
  showRouteResult(kind,kind==='safe'?data.safeText:data.boldText);
}
function revealRouteChoices(){
  if(!stageRoute)return;
  travelOverlay.classList.add('route-choice');
  travelOverlay.querySelector('.route-camera').classList.add('route-camera-close');
  travelOverlay.querySelector('.route-scan').remove();
  travelOverlay.querySelector('.route-copy').innerHTML='<small>路线判断</small><h2>'+stageRoute.data.title+'</h2><p>现在决定怎么通过，不同走法会被后面的角色记住。</p>';
  const choices=document.createElement('div');choices.className='route-choices';
  choices.innerHTML='<button data-kind="safe">'+stageRoute.data.safe+'</button><button data-kind="bold">'+stageRoute.data.bold+'</button>';
  travelOverlay.appendChild(choices);
  choices.querySelectorAll('button').forEach(button=>button.onclick=()=>routeChoice(button.dataset.kind));
}
function openStageRoute(from,next,effect){
  const key=from+'>'+next,data=routeScenes[key]||defaultRoute(from,next);
  stageRoute={from,next,effect,data};travelBusy=true;clearInterval(crisisInterval);
  travelOverlay.className='travel-overlay stage-route show';
  travelOverlay.style.setProperty('--route-image',`url('${data.asset}')`);
  travelOverlay.innerHTML='<div class="route-camera"></div><button class="route-scan" style="left:'+data.x+'%;top:'+data.y+'%">'+data.scan+'</button><div class="route-copy"><small>途中事件 / '+travelTitle(from)+'之后</small><h2>'+data.title+'</h2><p>'+data.text+'</p></div><div class="route-distance"><i></i><i></i><i></i></div>';
  travelOverlay.querySelector('.route-scan').onclick=revealRouteChoices;
}
function finishStageRoute(){
  if(!stageRoute)return;
  const pending=stageRoute;stageRoute=null;
  travelOverlay.classList.add('route-leave');
  setTimeout(()=>{
    travelOverlay.className='travel-overlay';
    travelOverlay.innerHTML='';
    baseGoCinematic(pending.next,pending.effect);
    setTimeout(()=>{travelBusy=false;directorScene.classList.add('arriving');setTimeout(()=>directorScene.classList.remove('arriving'),720)},660);
  },360);
}

const priorGoStage=go;
go=function(next,effect){
  if(stageRoute||travelBusy)return;
  if(s.node==='clinic'&&next==='diagnose'){
    clearInterval(crisisInterval);baseGoCinematic(next,effect);return;
  }
  if(next==='dawn'||next==='ending'||next==='c2_end'||s.node==='ending'||s.node==='c2_end'){priorGoStage(next,effect);return}
  openStageRoute(s.node,next,effect);
};

/* Do not burn crisis time during establishing shots, dialogue or clue close-ups. */
const stageImmediateCrisis=startCrisis;
let stagePendingCrisis=0,stageCrisisNode='';
startCrisis=function(){
  clearInterval(crisisInterval);
  stagePendingCrisis=timedNodes[s.node]||0;
  stageCrisisNode='';
  const bar=$('crisisTimer');
  if(bar)bar.classList.remove('show');
};
const stageDecisionShot=showDecision;
showDecision=function(){
  stageDecisionShot();
  if(stagePendingCrisis&&stageCrisisNode!==s.node){
    stageCrisisNode=s.node;
    stageImmediateCrisis();
  }
};

const baseRenderStage=render;
render=function(){
  baseRenderStage();
  applyStageScene();
};

/* Layered menu handlers occasionally left the start card open after a reset. */
const stageNewGameButton=$('newGame');
stageNewGameButton.addEventListener('click',()=>setTimeout(()=>menu.classList.remove('show'),0));
$('character').addEventListener('click',e=>{
  if(typeof playDirectorDialogue!=='function')return;
  e.stopImmediatePropagation();
  playDirectorDialogue();
},true);
render();
