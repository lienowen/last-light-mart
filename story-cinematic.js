/* Cinematic travel, adult deception, roadside trap and strength-based rescue. */
const travelOverlay=document.createElement('div');travelOverlay.className='travel-overlay';sceneEl.appendChild(travelOverlay);
const adultTag=document.createElement('div');adultTag.className='adult-tag';adultTag.hidden=true;sceneEl.appendChild(adultTag);
const trapWarning=document.createElement('div');trapWarning.className='trap-warning';sceneEl.appendChild(trapWarning);
let travelBusy=false;
const travelWarnings={
  'dawn>alley':'积水下有金属反光，前方却有人挥手求救。',
  'alley>clinic':'后巷出现人为布置的钢丝和空罐警报。',
  'search>garage':'主路被无编号巡逻车封死，只能穿过后仓机修间。',
  'garage>radio':'卷扬机正在过热，闸门随时会再次坠落。',
  'ambush>radio':'假车队已经开始怀疑灰帽商人的回答。'
};
function travelTitle(nodeId){return (nodes[nodeId]?.title||nodeId).split(' · ')[0]}
function showTravel(from,next){
  const warning=travelWarnings[from+'>'+next]||'雨势正在增强，远处有脚步跟上来。';travelOverlay.innerHTML='<div class="travel-card"><small>ROUTE / 路线推进</small><h2>'+travelTitle(from)+' → '+travelTitle(next)+'</h2><p>你离开安全位置，进入下一段路程。</p><div class="route-line"><i></i></div><div class="travel-steps"><span>离开</span><span>穿越</span><span>抵达</span></div><div class="travel-alert">'+warning+'</div></div>';travelOverlay.classList.add('show')
}
function showTrap(text){trapWarning.textContent=text;trapWarning.classList.remove('show');void trapWarning.offsetWidth;trapWarning.classList.add('show');if(typeof playTone==='function')playTone('danger');if(typeof buzz==='function')buzz([35,25,55])}

itemLabels.wire='绊线机关';itemLabels.cable='卷扬机电缆';evidenceNames.wire='积水绊线';evidenceNames.cleanboot='干净鞋底';evidenceNames.cable='断裂电缆';evidenceNames.badge='消防徽章';
relationLabels.suyan='苏妍';relationLabels.chengye='程野';
investigations.alley=[['wire',12,70,'积水反光','水面下绷着一根透明钢丝，末端连着会发声的空罐。'],['cleanboot',78,43,'鞋底','她全身湿透，鞋底却干净得反常。']];
investigations.garage=[['cable',12,66,'断裂电缆','卷扬机电缆被人为割断，可以用电池临时跨接。'],['badge',78,42,'旧徽章','地上压着一枚消防救援徽章，编号属于程野。']];
dialogues.alley=['苏妍：我叫苏妍，二十八岁。别盯着我看，先扶我离开这里。','苏妍：你还挺谨慎。可谨慎的人，通常更容易相信自己的判断。'];
dialogues.garage=['程野：程野，三十二岁，前消防救援。闸门我能顶十秒。','程野：别逞强。你接电，我扛住，所有人一起过去。'];
poseSets.alley=['suyan'];poseSets.garage=['chengye'];

nodes.alley={scene:'courtyard',title:'积水后巷 · 雨幕',stamp:'08:05 / 路线中断',speaker:'苏妍',text:'一个漂亮得过分的成年女人靠在雨棚下。湿透的白色制服勾出利落腰线，她故意靠得很近，声音柔软：“巡逻队在追我，前面有条近路。”她的手已经搭上你的背包带，积水里却闪过一线金属光。',choices:[['扶住她，跟她走近路','她似乎需要帮助','clinic',x=>{x.flags.suyanBetray=1;if(x.battery>0)x.battery--;else x.water=Math.max(0,x.water-1);bond('suyan',-1)}],['假装中招，反手剪断钢丝','反制成功 · 电池 +1','clinic',x=>{x.flags.outsmartedSuyan=1;x.battery++;x.trust++;bond('suyan',2);if(typeof gainMomentum==='function')gainMomentum(20,'反设陷阱')}],['让她走在前面替你带路','逼她先过机关','clinic',x=>{x.flags.suyanConfessed=1;x.trust++;bond('suyan',1)}]]};
choiceRequirements.alley={1:x=>x.evidence.wire?null:'先找到积水里的机关'};
nodes.garage={scene:'backroom',title:'后仓机修间 · 封锁线',stamp:'20:10 / 闸门下坠',speaker:'程野',text:'闸门轰然下坠，一只缠着绷带的手硬生生把它撑停。程野肩背宽阔，湿衬衫贴着绷紧的肌肉轮廓。他咬着牙抬头：“我撑住，你把电接上。别让我帅不过十秒。”',choices:[['和他一起抬起闸门','程野加入','radio',x=>{x.flags.chengyeJoined=1;x.trust+=2;bond('chengye',2)}],['启动卷扬机，带所有人通过','修好后全员通过','radio',x=>{x.flags.powerLift=1;x.trust+=2;bond('chengye',2)}],['让他断后，你先带老周离开','信任 -1','knock',x=>{x.flags.leftChengye=1;x.trust--;bond('chengye',-2)}]]};
choiceRequirements.garage={1:x=>x.flags.winch?null:'把电池拖到卷扬机电缆'};

useRules['alley:character:med']=()=>{if(s.used.suyanMed)return'她已经收下药。';if(!spend('med'))return'已经没有药品。';s.used.suyanMed=1;s.flags.suyanHasMed=1;bond('suyan',1);return'苏妍握住你的手腕，靠得很近：“这么快就信我？你会吃亏的。”她收下药，却没有立刻离开。'};
useRules['garage:cable:battery']=()=>{if(s.used.winch)return'卷扬机已经重新通电。';if(!spend('battery'))return'没有可用电池。';s.used.winch=1;s.flags.winch=1;s.trust++;bond('chengye',1);return'你把电池跨接进断线，卷扬机重新咆哮。程野单臂顶住闸门：“干得漂亮！”'};

nodes.dawn.choices[0][2]='alley';
nodes.search.choices[0][2]='garage';
// Requirements are live: discovering a clue or using an item immediately changes the action.
const baseUpdateLocksCinematic=updateLocks;updateLocks=function(){
  baseUpdateLocksCinematic();const choices=nodes[s.node]?.choices||[],buttons=$('choices').querySelectorAll('button');
  buttons.forEach((button,index)=>{const [label,cost,next,effect]=choices[index]||[],liveReq=choiceRequirements[s.node]?.[index]?.(s);if(!label)return;button.innerHTML=label+'<small>'+(liveReq||cost)+'</small>';button.classList.toggle('unavailable',!!liveReq);button.onclick=()=>{const reqNow=choiceRequirements[s.node]?.[index]?.(s);if(reqNow){say(reqNow+'，先在场景中寻找办法。');return}if(button.classList.contains('locked')){say('还缺少关键信息。点击人物和发光位置。');return}go(next,effect)}});localStorage.setItem('lastLightStory',JSON.stringify(s))
};
const baseEnterCinematic=enterConsequences;enterConsequences=function(next){
  baseEnterCinematic(next);
  if(next==='clinic'&&s.flags.suyanBetray&&!s.flags.suyanBetrayShown){s.flags.suyanBetrayShown=1;s.pendingCinematic={type:'trap',title:'你被她骗了',text:'苏妍借着贴近你的瞬间割开背包侧袋，带走电池后消失在雨里。'}}
  if(next==='clinic'&&s.flags.outsmartedSuyan&&!s.flags.suyanWinShown){s.flags.suyanWinShown=1;s.pendingCinematic={type:'win',title:'反诱捕成功',text:'钢丝绷紧前，你扣住她的手腕。苏妍笑意僵住，只能交出备用电池和真正的安全路线。'}}
  if(next==='clinic'&&s.flags.suyanConfessed&&!s.flags.suyanTruthShown){s.flags.suyanTruthShown=1;s.pendingCinematic={type:'win',title:'她先认输了',text:'苏妍看见你让她走前面，停在钢丝前：“行，你赢了。我只是在替别人测试你。”'}}
  if(next==='radio'&&s.flags.chengyeJoined)s.echo='程野用肩膀扛开最后一道闸门。他没有漂亮话，只把所有人送上了屋顶。';
};

const baseGoCinematic=go;go=function(next,effect){
  if(travelBusy)return;if(next==='dawn'||s.node==='ending'){baseGoCinematic(next,effect);return}
  travelBusy=true;clearInterval(crisisInterval);const from=s.node;showTravel(from,next);
  setTimeout(()=>{baseGoCinematic(next,effect);setTimeout(()=>{travelOverlay.classList.remove('show');sceneEl.classList.add('arriving');travelBusy=false;setTimeout(()=>sceneEl.classList.remove('arriving'),760)},330)},850)
};
const baseRenderCinematic=render;render=function(){
  baseRenderCinematic();const isSuyan=s.node==='alley',isChengye=s.node==='garage';sceneEl.classList.toggle('suyan-scene',isSuyan);sceneEl.classList.toggle('chengye-scene',isChengye);adultTag.hidden=!(isSuyan||isChengye);adultTag.textContent=isSuyan?'苏妍 · 28岁 · 前战地护士':isChengye?'程野 · 32岁 · 前消防救援':'';
  if(s.pendingCinematic){const hit=s.pendingCinematic;delete s.pendingCinematic;setTimeout(()=>{if(hit.type==='trap')showTrap(hit.title+'：'+hit.text);else if(typeof showImpact==='function')showImpact('路途反制',hit.title,hit.text,'主动权回到你手里')},500)}
};
render();



