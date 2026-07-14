/* Market-ready retention layer: repeatable night shifts, daily contracts, permanent upgrades and ad-safe rewards. */
(() => {
  if (typeof menu === 'undefined' || typeof sceneEl === 'undefined') return;

  const META_KEY = 'lastLightMetaV1';
  const defaultMeta = { credits: 80, reputation: 0, shifts: 0, bestScore: 0, streak: 0, lastDaily: '', claimedStory: {}, upgrades: { pack: 0, filter: 0, radio: 0, lock: 0 } };
  function loadMeta() {
    try {
      const raw = JSON.parse(localStorage.getItem(META_KEY) || 'null');
      return { ...defaultMeta, ...(raw || {}), upgrades: { ...defaultMeta.upgrades, ...(raw?.upgrades || {}) }, claimedStory: { ...(raw?.claimedStory || {}) } };
    } catch { return JSON.parse(JSON.stringify(defaultMeta)); }
  }
  let meta = loadMeta();
  function saveMeta() { try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {} refreshMetaUI(); }

  const encounters = [
    { id:'medic',name:'林晓',role:'诊所医生',face:'assets/nurse.webp',need:'water',text:'“诊所的净水只够撑到天亮。我可以用药品配给记录交换。”',safe:true,clues:['胸牌编号与诊所记录一致','水壶内侧有消毒标记'],reward:15,truth:'她把记录交给你，街区信任上升。' },
    { id:'repair',name:'老周',role:'修理工',face:'assets/repairman.webp',need:'food',text:'“给我一份罐头，我把卷帘门的卡榫修好。”',safe:true,clues:['工具箱磨损与工种吻合','能准确指出门轴故障'],reward:12,truth:'卷帘门耐久得到修复。',repair:10 },
    { id:'infected',name:'无名旅客',role:'伤者',face:'assets/infected.webp',need:'med',text:'“只是被铁丝划伤，给我药，快。”',safe:false,clues:['伤口边缘出现黑色网状纹','瞳孔没有追随手电移动'],reward:22,truth:'他突然撞向柜台，店铺受损。',damage:16 },
    { id:'mapper',name:'阿梨',role:'无线电测绘员',face:'assets/girl.webp',need:'food',text:'“我用一张安全路线图换一份食物。”',safe:true,clues:['地图标出了真实积水深度','背包里只有测绘工具'],reward:10,truth:'路线图让你避开下一次巡逻。',focus:1 },
    { id:'scout',name:'灰帽商人',role:'物资贩子',face:'assets/trader.webp',need:'water',text:'“高价换水。别问我的车停在哪里。”',safe:false,clues:['腰间撬棍刚沾过红漆','门外有三组脚印而不是一组'],reward:25,truth:'他是在替车队确认店内人数。',damage:12 },
    { id:'courier',name:'周冉',role:'外卖骑手',face:'assets/fp/girl.webp',need:'water',text:'“我知道屋顶连桥，但要先喝口水。”',safe:true,clues:['头盔路线贴纸覆盖多个街区','鞋底泥水来自后巷而非主路'],reward:13,truth:'她留下了一条快速撤离路线。',focus:1 },
    { id:'guard',name:'郑凯',role:'保安队长',face:'assets/fp/repairman.webp',need:'food',text:'“商场还有人，我需要补给回去开消防门。”',safe:true,clues:['对讲机仍在接收商场频道','钥匙串有消防门专用齿形'],reward:16,truth:'他兑现承诺，送来一批工具。',repair:7 },
    { id:'bait',name:'求救者',role:'身份不明',face:'assets/fp/injured.webp',need:'med',text:'“后巷只有我一个人，求你开门。”',safe:false,clues:['衣服干燥却声称淋雨两小时','求救间隔与外面敲击节奏一致'],reward:24,truth:'这是诱导你开门的暗号。',damage:18 },
    { id:'accountant',name:'何秀兰',role:'退休会计',face:'assets/fp/girl.webp',need:'water',text:'“我能看懂白塔配给账，但眼下需要净水。”',safe:true,clues:['账本数字有连续核算痕迹','能指出配给表中的重复编号'],reward:18,truth:'她找出了隐藏的人口评级规则。',focus:1 },
    { id:'fakeMedic',name:'巡回护士',role:'医疗人员',face:'assets/fp/nurse.webp',need:'med',text:'“伤员很多，把药全部交给我统一分配。”',safe:false,clues:['急救包里没有任何无菌耗材','胸牌医院在灾前已关闭'],reward:28,truth:'她试图一次带走全部药品。',damage:14 },
    { id:'firefighter',name:'程野',role:'前消防救援',face:'assets/fp/repairman.webp',need:'water',text:'“给我水，我能把后门堵住的金属架移开。”',safe:true,clues:['手套有液压剪磨痕','能说出建筑承重墙位置'],reward:14,truth:'后门逃生路线被重新打开。',repair:12 },
    { id:'silentCar',name:'车队联络员',role:'撤离人员',face:'assets/trader.webp',need:'food',text:'“车上还有位置，先把食物搬出来核验。”',safe:false,clues:['车身没有任何救援编号','无线电只重复人数而不报呼号'],reward:30,truth:'假车队开始冲击卷帘门。',damage:20 }
  ];

  const upgradeDefs = {
    pack:{name:'加固背包',desc:'每次夜班额外携带 1 份罐头',base:70,max:3},
    filter:{name:'净水滤芯',desc:'每次夜班额外携带 1 份净水',base:75,max:3},
    radio:{name:'短波监听',desc:'每次夜班额外获得 1 次调查',base:90,max:3},
    lock:{name:'卷帘门锁',desc:'每次夜班额外获得 10 点店铺耐久',base:100,max:3}
  };
  function upgradeCost(id) { const level = meta.upgrades[id] || 0; return Math.round(upgradeDefs[id].base * Math.pow(1.75, level)); }

  const shell = document.createElement('section');
  shell.className = 'liveops-shell';
  shell.innerHTML = '<div class="liveops-top"><div><small>NIGHT SHIFT</small><h2>最后一盏灯 · 夜班守店</h2></div><button class="liveops-close">返回标题</button></div><div class="liveops-stats"></div><div class="liveops-stage"><img class="liveops-person" alt=""><div class="liveops-risk">风险未知</div><div class="liveops-copy"><small class="liveops-role"></small><h3 class="liveops-name"></h3><p class="liveops-dialog"></p><div class="liveops-clues"></div><div class="liveops-actions"><button data-action="inspect">调查身份</button><button data-action="accept" class="primary">接受交易</button><button data-action="refuse">拒绝开门</button></div><p class="liveops-result"></p></div></div></section>';
  sceneEl.appendChild(shell);

  const results = document.createElement('section');
  results.className = 'liveops-results';
  sceneEl.appendChild(results);
  const shop = document.createElement('section');
  shop.className = 'liveops-shop';
  sceneEl.appendChild(shop);

  let run = null;
  function dayKey() { return new Date().toISOString().slice(0,10); }
  function seededOrder(seed) {
    let n = [...seed].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),2166136261);
    const list = [...encounters];
    for (let i=list.length-1;i>0;i--) { n=(n*1664525+1013904223)>>>0; const j=n%(i+1); [list[i],list[j]]=[list[j],list[i]]; }
    return list;
  }
  function startShift(daily=false) {
    const up = meta.upgrades;
    run = { daily, index:0, score:0, correct:0, trust:0, shelter:50+(up.lock||0)*10, focus:3+(up.radio||0), food:3+(up.pack||0), water:3+(up.filter||0), med:1, acted:false, inspected:false, order:seededOrder(daily?dayKey():`${Date.now()}-${meta.shifts}`).slice(0,6) };
    menu.classList.remove('show'); results.classList.remove('show'); shop.classList.remove('show'); shell.classList.add('show');
    window.LastLightPlatform?.gameplayStart({mode:daily?'daily-shift':'night-shift',round:'1'});
    renderShift();
  }
  function currentEncounter() { return run?.order[run.index]; }
  function renderShift() {
    if (!run) return;
    const e=currentEncounter();
    shell.querySelector('.liveops-stats').innerHTML=`<span>回合 <b>${run.index+1}/6</b></span><span>店铺 <b>${run.shelter}</b></span><span>调查 <b>${run.focus}</b></span><span>罐头 <b>${run.food}</b></span><span>净水 <b>${run.water}</b></span><span>药品 <b>${run.med}</b></span><span>得分 <b>${run.score}</b></span>`;
    shell.querySelector('.liveops-person').src=e.face; shell.querySelector('.liveops-person').alt=e.name;
    shell.querySelector('.liveops-role').textContent=e.role; shell.querySelector('.liveops-name').textContent=e.name; shell.querySelector('.liveops-dialog').textContent=e.text;
    shell.querySelector('.liveops-risk').textContent=run.inspected?(e.safe?'风险较低':'风险很高'):'风险未知';
    shell.querySelector('.liveops-risk').className='liveops-risk '+(run.inspected?(e.safe?'safe':'danger'):'');
    shell.querySelector('.liveops-clues').innerHTML=run.inspected?e.clues.map(x=>`<span>${x}</span>`).join(''):'<span>调查后才能看到关键细节</span>';
    shell.querySelector('.liveops-result').textContent=''; run.acted=false;
    shell.querySelectorAll('[data-action]').forEach(b=>b.disabled=false);
    const inspect=shell.querySelector('[data-action="inspect"]'); inspect.disabled=run.inspected||run.focus<=0; inspect.textContent=run.inspected?'已经调查':`调查身份 · ${run.focus}次`;
  }
  function inspectEncounter() { if (!run||run.acted||run.inspected||run.focus<=0) return; run.focus--; run.inspected=true; renderShift(); }
  function resolveEncounter(accept) {
    if(!run||run.acted)return; const e=currentEncounter(); const stock=e.need; run.acted=true;
    if(accept && run[stock]<=0){run.acted=false;shell.querySelector('.liveops-result').textContent=`${stock==='food'?'罐头':stock==='water'?'净水':'药品'}不足，无法交易`;return}
    if(accept) run[stock]--;
    const correct=(accept&&e.safe)||(!accept&&!e.safe);
    if(correct){run.correct++;run.score+=e.reward+(run.inspected?5:0);run.trust+=e.safe?2:1;if(e.repair)run.shelter+=e.repair;if(e.focus)run.focus+=e.focus;shell.querySelector('.liveops-result').textContent='判断正确：'+e.truth;}
    else{run.score=Math.max(0,run.score-5);run.trust=Math.max(-3,run.trust-1);if(e.damage)run.shelter-=e.damage;shell.querySelector('.liveops-result').textContent='判断失误：'+e.truth;}
    shell.querySelectorAll('[data-action]').forEach(b=>b.disabled=true);
    setTimeout(()=>{run.index++;run.inspected=false;if(run.shelter<=0||run.index>=run.order.length)finishShift();else{window.LastLightPlatform?.gameplayStart({mode:run.daily?'daily-shift':'night-shift',round:String(run.index+1)});renderShift()}},1150);
  }
  function calculateReward() {
    const clear=run.shelter>0; const base=clear?20:8; const accuracy=run.correct*5; const score=Math.floor(run.score/8); const daily=(run.daily&&meta.lastDaily!==dayKey())?25:0; return {clear,credits:base+accuracy+score+daily,reputation:Math.max(1,run.correct+(clear?2:0)),daily};
  }
  function finishShift() {
    window.LastLightPlatform?.gameplayStop(); shell.classList.remove('show'); const reward=calculateReward(); const score=run.score+Math.max(0,run.shelter);
    meta.shifts++; meta.bestScore=Math.max(meta.bestScore,score); meta.streak=reward.clear?meta.streak+1:0; if(reward.daily)meta.lastDaily=dayKey();
    let claimed=false;
    function claim(multiplier=1){if(claimed)return;claimed=true;meta.credits+=reward.credits*multiplier;meta.reputation+=reward.reputation;saveMeta();results.querySelector('.reward-actions').innerHTML='<button class="primary" data-next>再守一夜</button><button data-menu>回到标题</button><button data-shop>升级店铺</button>';wireResultButtons()}
    results.innerHTML=`<div class="result-card"><small>${run.daily?'DAILY CONTRACT':'NIGHT SHIFT COMPLETE'}</small><h2>${reward.clear?'灯还亮着':'卷帘门失守'}</h2><p>正确判断 ${run.correct}/6 · 店铺耐久 ${Math.max(0,run.shelter)} · 本局得分 ${score}</p><div class="result-grid"><span><b>+${reward.credits}</b>灯票</span><span><b>+${reward.reputation}</b>声望</span><span><b>${meta.streak}</b>连胜</span></div><div class="reward-actions"><button class="primary" data-claim>领取奖励</button>${window.LastLightPlatform?.canRewarded()?'<button data-double>看广告 · 双倍灯票</button>':''}<button data-menu>回到标题</button></div></div>`;
    results.classList.add('show');
    results.querySelector('[data-claim]').onclick=()=>claim(1);
    const double=results.querySelector('[data-double]');if(double)double.onclick=async()=>{double.disabled=true;double.textContent='正在请求广告…';const ok=await window.LastLightPlatform.rewarded();if(ok)claim(2);else{double.disabled=false;double.textContent='暂无广告 · 正常领取';}};
    results.querySelector('[data-menu]').onclick=()=>{if(!claimed)claim(1);results.classList.remove('show');menu.classList.add('show');refreshMetaUI()};
    function wireResultButtons(){results.querySelector('[data-next]').onclick=async()=>{results.classList.remove('show');await window.LastLightPlatform?.midgame();startShift(false)};results.querySelector('[data-menu]').onclick=()=>{results.classList.remove('show');menu.classList.add('show')};results.querySelector('[data-shop]').onclick=openShop}
    if(reward.clear&&run.correct===6)window.LastLightPlatform?.happyTime();
  }

  function openShop(){window.LastLightPlatform?.gameplayStop();results.classList.remove('show');shell.classList.remove('show');renderShop();shop.classList.add('show')}
  function renderShop(){shop.innerHTML='<div class="shop-card"><button class="shop-close">关闭</button><small>PERMANENT UPGRADES</small><h2>店铺升级</h2><p>夜班赚取灯票，永久强化下一次守店。所有奖励都能通过正常游玩获得。</p><div class="shop-credit">灯票 <b>'+meta.credits+'</b></div><div class="shop-grid">'+Object.entries(upgradeDefs).map(([id,d])=>{const level=meta.upgrades[id]||0,cost=upgradeCost(id),max=level>=d.max;return `<button data-upgrade="${id}" ${max?'disabled':''}><b>${d.name} ${level}/${d.max}</b><span>${d.desc}</span><em>${max?'已满级':cost+' 灯票'}</em></button>`}).join('')+'</div></div>';shop.querySelector('.shop-close').onclick=()=>{shop.classList.remove('show');menu.classList.add('show');refreshMetaUI()};shop.querySelectorAll('[data-upgrade]').forEach(button=>button.onclick=()=>{const id=button.dataset.upgrade,def=upgradeDefs[id],level=meta.upgrades[id]||0,cost=upgradeCost(id);if(level>=def.max||meta.credits<cost)return;meta.credits-=cost;meta.upgrades[id]=level+1;saveMeta();renderShop()})}

  shell.querySelector('.liveops-close').onclick=()=>{window.LastLightPlatform?.gameplayStop();shell.classList.remove('show');menu.classList.add('show')};
  shell.querySelector('[data-action="inspect"]').onclick=inspectEncounter;
  shell.querySelector('[data-action="accept"]').onclick=()=>resolveEncounter(true);
  shell.querySelector('[data-action="refuse"]').onclick=()=>resolveEncounter(false);

  const livePanel=document.createElement('div');livePanel.className='liveops-menu';livePanel.innerHTML='<div class="liveops-wallet"></div><button id="startNightShift" class="primary">夜班守店<span>可重复挑战 · 赚取灯票</span></button><button id="startDailyShift">今日契约<span>每日固定事件与额外奖励</span></button><button id="openUpgradeShop">永久升级<span>强化背包、滤芯、短波与门锁</span></button>';
  menu.querySelector('.start-card').appendChild(livePanel);
  document.getElementById('startNightShift').onclick=()=>startShift(false);
  document.getElementById('startDailyShift').onclick=()=>startShift(true);
  document.getElementById('openUpgradeShop').onclick=openShop;
  function refreshMetaUI(){const wallet=livePanel.querySelector('.liveops-wallet');if(wallet)wallet.innerHTML=`<span>灯票 <b>${meta.credits}</b></span><span>声望 <b>${meta.reputation}</b></span><span>最高分 <b>${meta.bestScore}</b></span><span>夜班 <b>${meta.shifts}</b></span>`;const daily=document.getElementById('startDailyShift');if(daily){const done=meta.lastDaily===dayKey();daily.querySelector('span').textContent=done?'今日额外奖励已领取 · 仍可练习':'每日固定事件 · 首次完成 +25灯票'}}
  refreshMetaUI();

  function applyStoryUpgrades(){if(typeof s==='undefined'||s.flags?.metaAppliedRun)return;s.flags=s.flags||{};s.flags.metaAppliedRun=1;s.food+=(meta.upgrades.pack||0);s.water+=(meta.upgrades.filter||0);s.battery+=(meta.upgrades.radio||0);if(typeof timedNodes!=='undefined')timedNodes.radio=(timedNodes.radio||40)+(meta.upgrades.radio||0)*5;try{localStorage.setItem('lastLightStory',JSON.stringify(s))}catch{}if(typeof render==='function')render()}
  document.getElementById('newGame')?.addEventListener('click',()=>setTimeout(applyStoryUpgrades,50));

  function grantStoryReward(id,credits,reputation,progress){const first=!meta.claimedStory[id];meta.credits+=first?credits:Math.max(5,Math.floor(credits*.2));meta.reputation+=first?reputation:1;meta.claimedStory[id]=true;saveMeta();window.LastLightPlatform?.reportProgress(progress);return first?credits:Math.max(5,Math.floor(credits*.2))}
  if(typeof renderEndingReport==='function'){const base=renderEndingReport;renderEndingReport=function(){base();s.flags=s.flags||{};if(!s.flags.metaRewardChapter1Granted){s.flags.metaRewardChapter1Granted=1;s.flags.metaRewardChapter1Amount=grantStoryReward('chapter1',60,8,14);try{localStorage.setItem('lastLightStory',JSON.stringify(s))}catch{}}if(!document.querySelector('#chapterComplete .story-economy')){const line=document.createElement('div');line.className='story-economy';line.textContent=`章节结算 · 灯票 +${s.flags.metaRewardChapter1Amount||0} · 永久升级已开放`;document.querySelector('#chapterComplete .result-actions')?.before(line)}window.LastLightPlatform?.gameplayStop()}}
  if(typeof renderChapter2End==='function'){const base=renderChapter2End;renderChapter2End=function(){base();s.flags=s.flags||{};if(!s.flags.metaRewardChapter2Granted){s.flags.metaRewardChapter2Granted=1;s.flags.metaRewardChapter2Amount=grantStoryReward('chapter2',90,12,28);try{localStorage.setItem('lastLightStory',JSON.stringify(s))}catch{}}if(!document.querySelector('#chapterComplete .story-economy')){const line=document.createElement('div');line.className='story-economy';line.textContent=`章节结算 · 灯票 +${s.flags.metaRewardChapter2Amount||0} · 第一季进度继续保留`;document.querySelector('#chapterComplete .result-actions')?.before(line)}window.LastLightPlatform?.gameplayStop()}}

  const storyButtons=[document.getElementById('newGame'),document.getElementById('continueGame'),document.getElementById('closeMenu')];storyButtons.forEach(button=>button?.addEventListener('click',()=>setTimeout(()=>window.LastLightPlatform?.gameplayStart({mode:'story',chapter:String(s.chapter||1),node:s.node}),100)));
  document.getElementById('restart')?.addEventListener('click',()=>window.LastLightPlatform?.gameplayStop());
})();
