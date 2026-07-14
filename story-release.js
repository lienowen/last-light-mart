/* Release hardening: loading, prefetching, route consequences and final copy polish. */
(() => {
  const releaseScene = document.getElementById('scene');
  if (!releaseScene || typeof s === 'undefined' || typeof nodes === 'undefined') return;

  /* Keep character tension focused on deception and survival clues instead of repeated outfit descriptions. */
  if (nodes.dawn) {
    nodes.dawn.text = '卷帘门刚抬到腰高，苏妍就从暴雨里钻进店内。她把红色医疗包放到脚边，嘴上说着求助，目光却先扫过药柜、后门和收音机。频道仍停在23:47，库存清单上恰好少了一盒药——她显然比一个普通求救者知道得更多。';
  }
  if (typeof dialogues !== 'undefined') {
    dialogues.dawn = [
      '苏妍：二十八岁，前战地护士。她把双手放在你看得见的位置：“先确认我有没有武器，再决定要不要相信我。”',
      '苏妍：她把医疗包推过柜台：“药少了一盒，对吧？昨晚有人比我更早来过。”',
      '苏妍：外面那辆救护车不是我的。她压低声音：“跟紧，但别踩我踩过的每一步。”'
    ];
    dialogues.alley = [
      '苏妍：她踩住积水中唯一干燥的落脚点：“过来，或者继续盯着那根线。你只有五秒。”',
      '苏妍：她扣住你的手腕，另一只手却把你的鞋尖拨离钢丝：“不错，你至少知道危险不一定来自眼前的人。”',
      '苏妍：她松开手：“你没有按我设计的路线走。真正的诊所入口，只告诉保持清醒的人。”'
    ];
  }
  if (nodes.alley) {
    nodes.alley.text = '救护车后门敞着，苏妍站在暖色警示灯下向你伸手。她故意挡住最容易观察积水的角度，催促你立刻靠近。只要视线离开地面，就会错过连接空罐的透明钢丝；远处无编号巡逻车已经转进路口。';
  }
  if (nodes.c2_suyan) {
    nodes.c2_suyan.text = x => (x.flags.rescuedOffice ? '许曼交出的员工名单把你带到写字楼下方的排水道。' : '定位信号最终钻进一座积水隧道。') + (x.flags.outsmartedSuyan ? '苏妍不再装作受伤，却仍靠在翻倒货车旁向你伸手。' : '苏妍半跪在翻倒货车旁，刻意把你的注意力引向自己。') + '右侧，被路牌压住的快递员却在拼命摇头。灯光扫过水面：她腿侧藏着遥控器，脚前横着几乎看不见的绊线。';
  }
  if (typeof routeScenes !== 'undefined') {
    const underpass = routeScenes['c2_roof>c2_suyan'];
    if (underpass) underpass.text = '定位信号钻进积水隧道。苏妍靠着翻倒货车向你伸手，身体挡住了右侧视野；被压住的快递员却在拼命摇头，水面还有一道不自然的横线。';
    const office = routeScenes['c2_market>c2_suyan'];
    if (office) office.text = '许曼翻过损坏闸机，把高管门卡递向你。真正需要注意的不是她从容的姿态，而是她身后被反锁的十七名普通职员。保安队长郑恺守着电梯，正在等你表态。';
  }

  const imagePromises = new Map();
  function preloadImage(src) {
    if (!src || imagePromises.has(src)) return imagePromises.get(src) || Promise.resolve();
    const task = new Promise(resolve => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve({ src, ok: true });
      img.onerror = () => resolve({ src, ok: false });
      img.src = src;
    });
    imagePromises.set(src, task);
    return task;
  }
  function nodeAsset(nodeId) {
    return (typeof stageSceneAssets !== 'undefined' && stageSceneAssets[nodeId]) ||
      (typeof sceneImg !== 'undefined' && nodes[nodeId] && sceneImg[nodes[nodeId].scene]) || '';
  }
  function collectNearbyAssets(nodeId) {
    const assets = new Set();
    const current = nodeAsset(nodeId);
    if (current) assets.add(current);
    const poses = typeof poseSets !== 'undefined' ? (poseSets[nodeId] || []) : [];
    poses.forEach(pose => assets.add(`assets/story/characters/${pose}.webp`));
    const choices = nodes[nodeId]?.choices || [];
    choices.forEach(choice => {
      const next = choice[2];
      const nextAsset = nodeAsset(next);
      if (nextAsset) assets.add(nextAsset);
      if (typeof routeScenes !== 'undefined') {
        const routeAsset = routeScenes[`${nodeId}>${next}`]?.asset;
        if (routeAsset) assets.add(routeAsset);
      }
    });
    return [...assets];
  }
  function preloadAroundNode(nodeId) {
    collectNearbyAssets(nodeId).forEach(preloadImage);
  }

  const loader = document.createElement('div');
  loader.className = 'release-loader show';
  loader.innerHTML = '<div><small>LAST LIGHT MART</small><b>正在加载雨夜现场</b><span>准备人物、证物与下一段路线…</span><i></i></div>';
  releaseScene.appendChild(loader);
  let loaderClosed = false;
  function closeLoader() {
    if (loaderClosed) return;
    loaderClosed = true;
    loader.classList.remove('show');
    setTimeout(() => loader.remove(), 420);
  }
  const criticalAssets = [...new Set([
    nodeAsset('dawn'),
    typeof routeScenes !== 'undefined' ? routeScenes['dawn>alley']?.asset : '',
    nodeAsset('alley')
  ].filter(Boolean))];
  Promise.all(criticalAssets.map(preloadImage)).then(closeLoader);
  setTimeout(closeLoader, 3500);

  const preloadObserver = new MutationObserver(() => preloadAroundNode(s.node));
  preloadObserver.observe(releaseScene, { attributes: true, attributeFilter: ['data-stage-node'] });
  preloadAroundNode(s.node);

  const baseRadioTime = typeof timedNodes !== 'undefined' ? (timedNodes.radio || 40) : 40;
  function syncRouteBenefits() {
    if (typeof timedNodes === 'undefined') return;
    const careful = Number(s.flags?.routeCareful || 0);
    timedNodes.radio = baseRadioTime + (careful >= 2 ? 10 : 0);
  }
  function appendRouteImpact() {
    const impact = stageRoute?.releaseImpact;
    const copy = typeof travelOverlay !== 'undefined' ? travelOverlay.querySelector('.route-copy') : null;
    if (!impact || !copy || copy.querySelector('.route-impact')) return;
    const badge = document.createElement('em');
    badge.className = 'route-impact';
    badge.textContent = impact;
    copy.appendChild(badge);
  }
  if (typeof showRouteResult === 'function') {
    const baseShowRouteResultRelease = showRouteResult;
    showRouteResult = function(kind, text, heading) {
      baseShowRouteResultRelease(kind, text, heading);
      appendRouteImpact();
    };
  }
  if (typeof routeChoice === 'function') {
    const baseRouteChoiceRelease = routeChoice;
    routeChoice = function(kind) {
      const activeRoute = stageRoute;
      const routeKey = activeRoute ? `${activeRoute.from}>${activeRoute.next}` : '';
      baseRouteChoiceRelease(kind);
      if (!activeRoute) return;
      if (kind === 'safe') {
        const careful = Number(s.flags?.routeCareful || 0);
        let reward = '';
        if ((careful === 2 || careful === 4) && !s.flags[`carefulReward${careful}`]) {
          s.flags[`carefulReward${careful}`] = 1;
          s.trust += 1;
          reward = ' · 信任 +1';
        }
        activeRoute.releaseImpact = `保持隐蔽 · 谨慎路线 ${careful}${reward}${careful >= 2 ? ' · 终局判断时间 +10秒' : ''}`;
        s.echo = careful >= 2 ? '你连续选择隐蔽路线，队伍抵达屋顶时保留了更多观察时间。' : '你没有急着暴露位置，同伴记住了你的谨慎。';
      } else {
        const bold = Number(s.flags?.routeBold || 0);
        activeRoute.releaseImpact = `抢到先机 · 强攻路线 ${bold} · 反制能量 +5`;
        s.echo = bold >= 2 ? '你多次冒险抢时间，敌人更早注意到你，但你也积攒了主动反制的机会。' : '你用暴露风险换来了时间和反制能量。';
      }
      s.flags.lastRoute = `${routeKey}:${kind}`;
      syncRouteBenefits();
      try { localStorage.setItem('lastLightStory', JSON.stringify(s)); } catch {}
      appendRouteImpact();
    };
  }
  syncRouteBenefits();
  document.getElementById('newGame')?.addEventListener('click', () => setTimeout(syncRouteBenefits, 0));

  window.addEventListener('error', event => {
    if (!event?.message) return;
    console.error('[Last Light Mart]', event.message, event.filename || '', event.lineno || '');
  });
})();
