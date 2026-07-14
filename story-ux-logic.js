/* Market UX pass: clear visual hierarchy, player-paced dialogue and evidence-based deduction. */
(() => {
  if (typeof sceneEl === 'undefined' || typeof s === 'undefined') return;
  const locale = window.LastLightLocale;
  const pick = (zh, en) => locale?.pick ? locale.pick(zh, en) : (document.documentElement.lang.startsWith('en') ? en : zh);

  /* Chapter two now requires evidence synthesis instead of checklist completion. */
  if (typeof evidenceOperations !== 'undefined') Object.assign(evidenceOperations, {
    rainbarrel:[pick('刮取桶底沉淀','Scrape the barrel sediment'),pick('靠近磁片观察','Move it near a magnet')],
    flyer:[pick('展开湿透的传单','Unfold the soaked flyer'),pick('检查背面的细字','Inspect the fine print on the back')],
    filter:[pick('拆开滤芯外壳','Open the filter casing'),pick('沿切口方向检查','Trace the direction of the cut')],
    bluepowder:[pick('遮住环境光','Block the ambient light'),pick('滴入一滴雨水','Add one drop of rainwater')],
    rationmark:[pick('擦开桶边粉笔灰','Brush away the chalk dust'),pick('比较新旧刻线','Compare the old and new marks')],
    sickbird:[pick('翻看脚环编号','Read the leg-band number'),pick('对照传单监测代码','Compare it with the flyer code')],
    tracker:[pick('遮住遥控器屏幕','Shield the remote display'),pick('观察信号刷新方向','Watch the signal refresh direction')],
    tripwire:[pick('用灯贴近水面','Lower the light to the water'),pick('沿细线追到货车底部','Trace the line beneath the truck')],
    valve:[pick('清理阀门铭牌','Clean the valve plate'),pick('检查旁边的跨接端口','Inspect the bypass port')],
    seal:[pick('擦掉封条表面污泥','Wipe mud from the seal'),pick('对照便利店节点编号','Compare the store node number')],
    antenna:[pick('切换天线诊断页','Open the antenna diagnostics'),pick('查看正在上传的字段','Read the fields being uploaded')],
    sistercode:[pick('除去面板锈层','Remove rust from the panel'),pick('比对姐姐留下的格式','Compare your sister’s code format')]
  });

  if (typeof directorCases !== 'undefined') Object.assign(directorCases, {
    c2_dawn:{question:pick('黑色沉淀和白塔传单共同说明了什么？','What do the black sediment and White Tower flyer prove together?'),options:[
      [pick('雨水被用来标记有人居住的建筑','The rainwater is being used to mark occupied buildings'),true,pick('沉淀能被设备识别，传单又明确写着“聚居点示踪回收”。','The detectable sediment and “settlement tracking” notice describe the same system.')],
      [pick('普通酸雨腐蚀了所有储水桶','Ordinary acid rain corroded every water barrel'),false,pick('腐蚀解释不了磁性沉淀和定向回收说明。','Corrosion does not explain magnetic sediment or targeted recovery.')],
      [pick('诊所误用了过期药品','The clinic used expired medicine'),false,pick('两件证物都来自雨水与白塔系统，不是药品。','Both clues concern the rain and White Tower, not medicine.')]
    ]},
    c2_roof:{question:pick('滤芯切口和蓝色粉末说明污染是怎样发生的？','How did the contamination enter the water system?'),options:[
      [pick('有人从内部割开滤芯，主动注入可被无人机识别的示踪粉','Someone cut the filter from inside and introduced drone-visible tracer powder'),true,pick('向外的切口和遇雨发光的粉末共同指向人为投放。','The outward cut and rain-reactive powder show deliberate insertion.')],
      [pick('滤芯自然老化后吸入屋顶灰尘','The filter aged naturally and collected rooftop dust'),false,pick('自然老化不会留下由内向外的新切口。','Natural wear does not create a fresh inside-out cut.')],
      [pick('程野维修时不小心撒入染料','Cheng Ye spilled dye during repairs'),false,pick('切口在昨夜形成，且粉末属于白塔追踪体系。','The cut predates the repair and the powder belongs to the tracking system.')]
    ]},
    c2_market:{question:pick('被改配给线和监测脚环为什么同时出现在居民院？','Why do the altered ration line and monitoring tag appear together?'),options:[
      [pick('有人制造争抢，把人群集中到无人机最容易统计的位置','Someone engineered conflict to concentrate people where the drone could count them'),true,pick('配给线制造冲突，监测编号证明无人机正在记录这个区域。','The altered ration creates conflict while the tag confirms active monitoring.')],
      [pick('居民只是因为净水不足自然争吵','The residents are fighting only because water is scarce'),false,pick('自然短缺解释不了人为改高的刻线。','Scarcity alone does not explain a deliberately raised ration mark.')],
      [pick('死鸟偷喝了所有净水','The bird consumed the missing clean water'),false,pick('脚环是监测编号，不是配给记录。','The band is a monitoring ID, not a ration record.')]
    ]},
    c2_suyan:{question:pick('遥控器和水下绊线揭示了苏妍的真实任务是什么？','What do the remote and submerged wire reveal about Su Yan’s task?'),options:[
      [pick('她是诱饵，要把你引到定位信号和震爆机关之间','She is bait, drawing you between a tracker and a shock trap'),true,pick('遥控器持续回传位置，绊线连接货车下的震爆罐。','The remote transmits your location while the line connects to a shock canister.')],
      [pick('她只是在保护被困快递员','She is only protecting the trapped courier'),false,pick('快递员正在警告你，而遥控器藏在她自己身侧。','The courier is warning you, and the remote is hidden beside her.')],
      [pick('绊线是泵站的安全警报','The wire is a pump-station safety alarm'),false,pick('细线连接的是货车震爆罐，不是泵站设施。','The line ends at the truck canister, not pump equipment.')]
    ]},
    c2_pump:{question:pick('阀门跨接口和 L-17 封条说明便利店与泵站是什么关系？','What connects the store to the L-17 pump station?'),options:[
      [pick('它们属于同一个灯塔节点，泵站既控制水路也参与示踪','They are one lighthouse node; the pump controls water and participates in tracking'),true,pick('相同节点编号和可恢复供电的阀门把两个设施连成一个系统。','The shared node number and powered bypass connect both facilities into one system.')],
      [pick('便利店只是偶然建在泵站上方','The store was built above the pump by coincidence'),false,pick('相同的 L-17 节点封条不是地理巧合。','A matching L-17 node seal is not a geographic coincidence.')],
      [pick('封条表示泵站已经永久报废','The seal means the pump is permanently abandoned'),false,pick('跨接端口仍能恢复主泵，系统没有真正报废。','The bypass can restart the pump, so the system is still functional.')]
    ]},
    c2_choice:{question:pick('天线上传字段和姐姐校验码给了你哪种能力？','What do the antenna fields and your sister’s code allow you to do?'),options:[
      [pick('接管白塔广播，把秘密人口名单变成公开证据','Hijack the White Tower broadcast and turn its population list into public evidence'),true,pick('天线正在上传人口，校验码具有一次系统接管权限。','The antenna uploads population data and the code grants one system takeover.')],
      [pick('只关闭便利店里的收音机','Only switch off the store radio'),false,pick('校验码对应的是城市示踪天线，不是普通收音机。','The code belongs to the city tracking antenna, not a store radio.')],
      [pick('永久净化所有黑雨','Permanently purify all black rain'),false,pick('代码控制信号系统，不能直接改变雨水成分。','The code controls the signal network, not the rain chemistry.')]
    ]}
  });

  const falseObservations = {
    ledger:[pick('整张清单都被暴雨均匀打湿','The entire sheet was evenly soaked by rain')],
    lock:[pick('钥匙上的红漆来自便利店卷帘门','The red paint came from the store shutter')],
    wire:[pick('钢丝足够粗，可以直接绊倒成年人','The wire is strong enough to trip an adult')],
    cleanboot:[pick('所有砖面都同样干燥，没有人为选择路线','Every brick is equally dry; no route was prepared')],
    footprint:[pick('脚印只在诊所内部出现','The footprints appear only inside the clinic')],
    window:[pick('时间是从窗外写进去的','The time was written from outside')],
    bottle:[pick('沉淀完全不受金属影响','The sediment does not react to metal')],
    mapmark:[pick('地图上的路线彼此没有连接','The marked routes do not connect')],
    key:[pick('钥匙齿痕与仓库锁完全不符','The key teeth do not match the warehouse lock')],
    siren:[pick('车辆带有完整官方救援编号','The vehicle carries complete official rescue markings')],
    cable:[pick('电缆是长期自然磨损断裂的','The cable failed from long-term natural wear')],
    badge:[pick('徽章编号属于陌生人，与程野无关','The badge belongs to a stranger, not Cheng Ye')],
    shutter:[pick('敲门节奏与广播底噪完全不同','The knock pattern differs from the broadcast noise')],
    backdoor:[pick('货架后方是实心承重墙','The wall behind the shelves is solid')],
    radio:[pick('两个频道的底噪没有任何相似处','The two channels share no background noise')],
    redlamp:[pick('红灯闪烁没有固定节奏','The red light has no repeatable pattern')],
    rainbarrel:[pick('桶底只有普通泥沙，不受磁片影响','The barrel contains ordinary mud unaffected by magnets')],
    flyer:[pick('传单背面只印着普通避难通知','The flyer contains only a generic shelter notice')],
    filter:[pick('切口由外向内，像搬运损伤','The cut runs outside-in like transport damage')],
    bluepowder:[pick('粉末遇水后完全失去亮度','The powder becomes completely dark in water')],
    rationmark:[pick('新旧配给线处在完全相同的位置','The old and new ration marks are identical')],
    sickbird:[pick('脚环没有任何白塔编号','The leg band has no White Tower number')],
    tracker:[pick('遥控器没有发送任何位置信号','The remote sends no position data')],
    tripwire:[pick('细线只连接路边护栏','The line connects only to the roadside rail')],
    valve:[pick('阀门附近没有任何供电接口','There is no power bypass near the valve')],
    seal:[pick('封条编号与便利店节点完全不同','The seal number differs from the store node')],
    antenna:[pick('天线只上传天气，不记录人口','The antenna uploads weather only, not population')],
    sistercode:[pick('锈层下的数字格式与你姐姐无关','The code format has no link to your sister')]
  };

  /* Replace the repetitive slider with physical steps followed by an observation check. */
  if (typeof focusDirectorClue === 'function') {
    const baseFocusDirectorClueUX = focusDirectorClue;
    focusDirectorClue = function(index, sourceButton) {
      baseFocusDirectorClueUX(index, sourceButton);
      const clue=(investigations[s.node]||[])[index];
      if(!clue)return;
      const [id,,,label,text]=clue, operation=evidenceOperations[id];
      const root=clueCloseup?.querySelector('.evidence-operation');
      if(!operation||!root)return;
      clearDirectorTimers?.();
      const wrong=falseObservations[id]?.[0]||pick('检查结果并不支持这个说法','The inspection does not support this claim');
      const answers=id.length%2===0?[[text,true],[wrong,false]]:[[wrong,false],[text,true]];
      root.innerHTML='<div class="operation-steps"><button type="button" class="logic-operation step-one">'+operation[0]+'</button><button type="button" class="logic-operation step-two" disabled>'+operation[1]+'</button></div><div class="operation-observation" hidden><small>'+pick('观察判断','OBSERVATION CHECK')+'</small><b>'+pick('哪一项是真正由检查结果支持的细节？','Which detail is actually supported by the inspection?')+'</b><div class="observation-options">'+answers.map((answer,i)=>'<button type="button" data-observation="'+i+'">'+answer[0]+'</button>').join('')+'</div><p class="operation-result"></p></div>';
      const stepOne=root.querySelector('.step-one'),stepTwo=root.querySelector('.step-two'),observation=root.querySelector('.operation-observation'),result=root.querySelector('.operation-result');
      stepOne.onclick=e=>{e.stopPropagation();stepOne.disabled=true;stepOne.classList.add('done');stepTwo.disabled=false;stepTwo.focus()};
      stepTwo.onclick=e=>{e.stopPropagation();stepTwo.disabled=true;stepTwo.classList.add('done');observation.hidden=false;observation.querySelector('button')?.focus()};
      observation.querySelectorAll('[data-observation]').forEach(button=>button.onclick=e=>{
        e.stopPropagation();const answer=answers[Number(button.dataset.observation)];
        if(!answer[1]){
          button.classList.add('wrong');result.textContent=pick('这个结论与检查到的细节矛盾。重新比较两项证据。','That conclusion conflicts with the inspected detail. Compare the evidence again.');result.classList.add('show','wrong');
          setTimeout(()=>{button.classList.remove('wrong');result.classList.remove('show','wrong')},1050);return;
        }
        observation.querySelectorAll('button').forEach(b=>b.disabled=true);button.classList.add('correct');result.textContent=text;result.classList.add('show');
        recordDirectorEvidence(id,label);if(sourceButton){sourceButton.classList.add('consumed');sourceButton.setAttribute('aria-hidden','true')}
        afterShot(()=>{if(ready())showDecision();else showInvestigation(true)},1450);
      });
    };
  }

  /* Dialogue is now player-paced so text is never missed on mobile or in English. */
  if (typeof playDirectorDialogue === 'function') {
    playDirectorDialogue = function() {
      const lines=dialogues[s.node]||[];
      if(!lines.length||directorDialoguePlaying)return;
      directorDialoguePlaying=true;const node=s.node;clearDirectorTimers();applyDirectorShot('person');directorScene.classList.add('dialogue-playing');
      let index=s.talked[node]?0:Math.min(s.line[node]||0,Math.max(0,lines.length-1));
      const finish=()=>{
        s.talked[node]=true;s.line[node]=lines.length;directorDialoguePlaying=false;directorScene.classList.remove('dialogue-playing');$('speech').classList.remove('show');updateLocks();localStorage.setItem('lastLightStory',JSON.stringify(s));
        directorCaption.classList.add('closing');setTimeout(()=>{directorCaption.classList.remove('show','closing');if(ready())showDecision();else showInvestigation(true)},260);
      };
      const showLine=()=>{
        if(s.node!==node){directorDialoguePlaying=false;directorScene.classList.remove('dialogue-playing');return}
        if(index>=lines.length){finish();return}
        const spoken=lines[index++];s.line[node]=index;const match=spoken.match(/^([^:：]+)[:：]\s*(.*)$/);const name=match?match[1]:(nodes[node]?.speaker||pick('幸存者','Survivor'));const words=match?match[2]:spoken;
        setDirectorCaption(index===1?pick('靠近交谈','TALK'):pick('对话继续','CONTINUE'),name,words,2);const speech=$('speech');speech.textContent=spoken;speech.classList.add('show');
        const next=document.createElement('button');next.type='button';next.className='dialogue-next';next.textContent=index>=lines.length?pick('开始调查','Begin Investigation'):pick('继续','Continue');next.onclick=e=>{e.stopPropagation();index>=lines.length?finish():showLine()};directorCaption.appendChild(next);next.focus({preventScroll:true});
      };
      showLine();
    };
  }

  /* A compact four-step flow tells the player what the screen expects next. */
  const clueBar=document.querySelector('.cluebar');
  const logicFlow=document.createElement('div');logicFlow.className='logic-flow';
  const hintButton=document.createElement('button');hintButton.type='button';hintButton.className='logic-hint-button';hintButton.textContent=pick('提示','Hint');
  clueBar?.append(logicFlow,hintButton);

  function getLogicState(){
    const clues=investigations[s.node]||[],found=s.found[s.node]||[];
    const needsTalk=typeof sceneHasPerson==='function'?sceneHasPerson():(dialogues[s.node]||[]).length>0;
    const needsCase=typeof directorCases!=='undefined'&&!!directorCases[s.node];
    return {clues,found,needsTalk,talked:!needsTalk||!!s.talked[s.node],needsCase,caseDone:!needsCase||!!s.flags['case_'+s.node]};
  }
  function updateLogicFlow(){
    if(!logicFlow)return;const hidden=s.node==='ending'||s.node==='c2_end'||document.querySelector('.liveops-shell.show');logicFlow.hidden=hidden;hintButton.hidden=hidden;if(hidden)return;
    const st=getLogicState();let active=3;if(!st.talked)active=0;else if(st.found.length<st.clues.length)active=1;else if(!st.caseDone)active=2;
    const labels=[[pick('交谈','Talk'),st.talked],[pick('检查','Inspect'),st.found.length>=st.clues.length],[pick('推理','Deduce'),st.caseDone],[pick('决定','Decide'),active===3]];
    logicFlow.innerHTML=labels.map((entry,index)=>'<span class="logic-step '+(entry[1]?'done ':'')+(index===active?'active':'')+'"><i>'+(index+1)+'</i><b>'+entry[0]+'</b></span>').join('');
  }
  function clearHintFocus(){document.querySelectorAll('.logic-hint-focus').forEach(el=>el.classList.remove('logic-hint-focus'))}
  hintButton.onclick=e=>{
    e.stopPropagation();clearHintFocus();const st=getLogicState();let target,message;
    if(!st.talked){target=$('character');message=pick('先和画面中的人物交谈。她的话会告诉你应该检查什么。','Talk to the person first. Their words tell you what to inspect.')}
    else if(st.found.length<st.clues.length){const foundSet=new Set(st.found);const index=st.clues.findIndex(clue=>!foundSet.has(clue[0]));target=$('hotspots')?.querySelectorAll('.hotspot')?.[index];const label=st.clues[index]?.[3]||pick('异常位置','suspicious area');message=pick('还有一处证物没有检查：','One clue remains unchecked: ')+label}
    else if(!st.caseDone){target=caseButton;message=pick('两件证物已经齐全。不要猜剧情，比较它们共同支持的结论。','Both clues are complete. Compare what they jointly prove instead of guessing the story.')}
    else{target=$('choices');message=pick('推理已经完成。现在根据资源、关系和风险选择行动。','The deduction is complete. Choose an action based on resources, relationships and risk.')}
    target?.classList.add('logic-hint-focus');if(typeof say==='function')say(message);setTimeout(clearHintFocus,2200);
  };

  const baseUpdateLocksUX=typeof updateLocks==='function'?updateLocks:null;
  if(baseUpdateLocksUX)updateLocks=function(){baseUpdateLocksUX();updateLogicFlow()};
  const baseRenderUX=typeof render==='function'?render:null;
  if(baseRenderUX)render=function(){baseRenderUX();setTimeout(updateLogicFlow,0)};

  /* Night Shift must ask the player to infer risk; investigation no longer reveals the answer. */
  function neutralizeNightRisk(root=document){
    const badge=root.querySelector?.('.liveops-risk');if(badge&&/风险较低|风险很高|LOW RISK|HIGH RISK/i.test(badge.textContent||'')){badge.textContent=pick('证据已显示','Evidence Revealed');badge.classList.remove('safe','danger');badge.classList.add('evidence-ready')}
    const clues=root.querySelector?.('.liveops-clues');if(clues&&!root.querySelector?.('.liveops-reasoning-note')){const note=document.createElement('p');note.className='liveops-reasoning-note';note.textContent=pick('比较来客说法与两条证据，再决定交易或关门。','Compare the visitor’s claim with both clues, then trade or keep the door closed.');clues.after(note)}
  }
  neutralizeNightRisk();
  const riskObserver=new MutationObserver(records=>{records.forEach(record=>{const root=record.target.nodeType===1?record.target:record.target.parentElement;if(root?.closest?.('.liveops-shell')||root?.querySelector?.('.liveops-shell'))neutralizeNightRisk(document)})});
  riskObserver.observe(sceneEl,{childList:true,subtree:true,characterData:true});

  updateLogicFlow();
})();
