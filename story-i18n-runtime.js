/* Final dynamic-text localization pass for live operations, item interactions and continuously updated UI. */
(() => {
  const locale=window.LastLightLocale;
  if(!locale)return;

  const zhCleanup=new Map([
    ['试玩版当前开放：第一章、第二章','当前开放：第一章、第二章'],
    ['第一季试玩进度 2 / 7','第一季进度 2 / 7']
  ]);

  const en={
    '场景人物':'Scene character','旁白':'Narrator','门外的人':'Voice Outside','无线电':'Radio',
    '林晓':'Lin Xiao','老周':'Old Zhou','阿梨':'Ali','苏妍':'Su Yan','程野':'Cheng Ye','灰帽商人':'Gray Hat','周冉':'Zhou Ran','郑凯':'Zheng Kai','何秀兰':'He Xiulan','无名旅客':'Unknown Traveler','求救者':'Distress Caller','巡回护士':'Traveling Nurse','车队联络员':'Convoy Liaison',
    '诊所医生':'Clinic Doctor','修理工':'Repair Technician','伤者':'Injured Traveler','无线电测绘员':'Radio Surveyor','物资贩子':'Supply Trader','外卖骑手':'Courier','保安队长':'Security Captain','身份不明':'Identity Unknown','退休会计':'Retired Accountant','医疗人员':'Medical Worker','前消防救援':'Former Fire Rescuer','撤离人员':'Evacuation Liaison',
    '“诊所的净水只够撑到天亮。我可以用药品配给记录交换。”':'“The clinic has enough clean water only until dawn. I can trade the medicine ration records.”',
    '“给我一份罐头，我把卷帘门的卡榫修好。”':'“Give me one food ration and I will repair the shutter latch.”',
    '“只是被铁丝划伤，给我药，快。”':'“It is only a wire cut. Give me medicine—now.”',
    '“我用一张安全路线图换一份食物。”':'“I will trade a safe-route map for one food ration.”',
    '“高价换水。别问我的车停在哪里。”':'“I pay well for water. Do not ask where my vehicle is.”',
    '“我知道屋顶连桥，但要先喝口水。”':'“I know the rooftop bridge route, but I need water first.”',
    '“商场还有人，我需要补给回去开消防门。”':'“People are still inside the mall. I need supplies to reopen the fire doors.”',
    '“后巷只有我一个人，求你开门。”':'“I am alone in the alley. Please open the door.”',
    '“我能看懂白塔配给账，但眼下需要净水。”':'“I can decode White Tower’s ration ledger, but I need clean water first.”',
    '“伤员很多，把药全部交给我统一分配。”':'“There are many casualties. Give me all the medicine for central distribution.”',
    '“给我水，我能把后门堵住的金属架移开。”':'“Give me water and I can move the metal frame blocking the rear exit.”',
    '“车上还有位置，先把食物搬出来核验。”':'“There is room in the vehicle. Bring the food out for inspection first.”',
    '胸牌编号与诊所记录一致':'Her badge number matches the clinic records.','水壶内侧有消毒标记':'The bottle carries the clinic sterilization mark.',
    '工具箱磨损与工种吻合':'The toolbox wear matches his trade.','能准确指出门轴故障':'He identifies the shutter fault precisely.',
    '伤口边缘出现黑色网状纹':'A black web pattern surrounds the wound.','瞳孔没有追随手电移动':'His pupils do not track the flashlight.',
    '地图标出了真实积水深度':'The map records accurate flood depth.','背包里只有测绘工具':'Her pack contains only surveying tools.',
    '腰间撬棍刚沾过红漆':'The crowbar at his waist has fresh red paint.','门外有三组脚印而不是一组':'Three sets of footprints wait outside, not one.',
    '头盔路线贴纸覆盖多个街区':'The route stickers cover several districts.','鞋底泥水来自后巷而非主路':'The mud on her shoes came from the alley, not the main road.',
    '对讲机仍在接收商场频道':'His radio is still receiving the mall channel.','钥匙串有消防门专用齿形':'His keyring includes a fire-door key.',
    '衣服干燥却声称淋雨两小时':'The clothes are dry despite a claim of two hours in the rain.','求救间隔与外面敲击节奏一致':'The calls match the knock pattern outside.',
    '账本数字有连续核算痕迹':'The ledger contains continuous audit calculations.','能指出配给表中的重复编号':'She identifies duplicate ration IDs.',
    '急救包里没有任何无菌耗材':'The medical bag contains no sterile supplies.','胸牌医院在灾前已关闭':'The hospital on the badge closed before the disaster.',
    '手套有液压剪磨痕':'His gloves carry hydraulic-cutter wear.','能说出建筑承重墙位置':'He correctly identifies the load-bearing walls.',
    '车身没有任何救援编号':'The vehicle has no rescue markings.','无线电只重复人数而不报呼号':'The radio repeats headcounts but never gives a call sign.',
    '她把记录交给你，街区信任上升。':'She hands over the records, increasing district trust.','卷帘门耐久得到修复。':'The shutter is reinforced.','他突然撞向柜台，店铺受损。':'He lunges at the counter and damages the store.','路线图让你避开下一次巡逻。':'The route map helps you avoid the next patrol.','他是在替车队确认店内人数。':'He was counting the people inside for the convoy.','她留下了一条快速撤离路线。':'She leaves a fast evacuation route.','他兑现承诺，送来一批工具。':'He keeps his promise and returns with tools.','这是诱导你开门的暗号。':'The distress call is a code meant to make you open the door.','她找出了隐藏的人口评级规则。':'She uncovers the hidden population-rating rule.','她试图一次带走全部药品。':'She was trying to take the entire medicine stock.','后门逃生路线被重新打开。':'The rear escape route is reopened.','假车队开始冲击卷帘门。':'The fake convoy begins ramming the shutter.',
    '加固背包':'Reinforced Pack','净水滤芯':'Water Filter','短波监听':'Shortwave Monitor','卷帘门锁':'Shutter Lock',
    '每次夜班额外携带 1 份罐头':'Start each shift with +1 Food.','每次夜班额外携带 1 份净水':'Start each shift with +1 Water.','每次夜班额外获得 1 次调查':'Start each shift with +1 Investigation.','每次夜班额外获得 10 点店铺耐久':'Start each shift with +10 Shutter Durability.',
    '调查后才能看到关键细节':'Investigate to reveal the key details.','已经调查':'Investigated','灯还亮着':'The Light Stays On','卷帘门失守':'The Shutter Fell',
    '林晓已经收下药了。':'Lin Xiao already has the medicine.','药品已经用完。':'No medicine remains.','孩子已经喝过净水。':'The child already received clean water.','净水已经用完。':'No clean water remains.','红灯暗号已经记录。':'The red-light signal is already recorded.','没有可用电池。':'No battery remains.','老周已经说明钥匙来历。':'Old Zhou already explained the key.','暗门已经打开。':'The hidden door is already open.','录音机的完整记录已经读出。':'The complete recording has already been recovered.','没有电池，录音机无法读取。':'A battery is required to read the recorder.','两个频道已经比对完成。':'The two channels have already been compared.','撤离车身份已经验证。':'The evacuation vehicle is already verified.','她已经收下药。':'She already has the medicine.','已经没有药品。':'No medicine remains.','卷扬机已经重新通电。':'The winch is already powered.','主泵已经通电。':'The main pump is already powered.',
    '林晓接过药，第一次放下了挡在你面前的手：“我欠你一次。”':'Lin Xiao takes the medicine and lowers her guard for the first time. “I owe you.”',
    '孩子喝下净水后停止抽搐。阿梨低声说：“现在她会相信我们了。”':'The child stops convulsing after drinking clean water. Ali whispers, “Now she will believe us.”',
    '接收器亮起：三短一长。这个节奏能排除一辆冒牌撤离车。':'The receiver flashes three short pulses and one long. The pattern can expose a fake evacuation vehicle.',
    '老周盯着钥匙沉默片刻：“灰帽、左手缺两根指头。他不是救援队的人。”':'Old Zhou studies the key. “Gray hat. Two missing fingers on the left hand. He is not rescue personnel.”',
    '钥匙转动半圈，整面货架向里松开。冷风里混着循环播放的求救声。':'The key turns halfway and the shelving releases inward. A looping distress call rides the cold air.',
    '磁带末尾不是求救，而是一串挑战码。真正的撤离车从不回答这串码。':'The tape ends with a challenge code, not a distress call. The real evacuation vehicle never answers it.',
    '波形重合。东线撤离车是真的，另一辆车正沿着假坐标逼近。':'The waveforms match. East Line is real; the other convoy is closing on false coordinates.',
    '你发出三短一长。只有东线车辆正确回应，假车队暴露了。':'You transmit three short pulses and one long. Only East Line responds correctly.',
    '苏妍握住你的手腕，靠得很近：“这么快就信我？你会吃亏的。”她收下药，却没有立刻离开。':'Su Yan takes your wrist. “Trusting me this quickly will cost you.” She accepts the medicine but does not leave.',
    '你把电池跨接进断线，卷扬机重新咆哮。程野单臂顶住闸门：“干得漂亮！”':'You bridge the severed cable with the battery. The winch roars back to life as Cheng Ye holds the shutter. “Good work!”',
    '电池接入跨接端口，沉寂多年的主泵重新震动。黑水被切离净水管，墙上亮起“密钥 2/7”。':'The battery powers the bypass. The old pump shudders awake, isolates the black water and lights “KEY 2/7” on the wall.',
    '「药品」用在这里没有作用。试试与线索相关的人或物。':'Medicine has no effect here. Try a person or object connected to the evidence.','还缺少关键信息。点击人物和发光位置。':'Key information is missing. Talk to people and inspect glowing areas.',
    '没有可用药品':'No medicine available','需要信任 2，或得到林晓担保':'Requires Trust 2 or Lin Xiao’s guarantee','需要识破假撤离车':'Requires exposing the fake evacuation vehicle','先找到积水里的机关':'Find the trap in the water first','把电池拖到卷扬机电缆':'Drag the battery onto the winch cable','林晓不会替你冒险':'Lin Xiao will not take this risk for you','需要完成证据链并积攒25反制能量':'Complete an evidence chain and build 25 Counter Energy','把电池拖到泵站阀门':'Drag the battery onto the pump valve','缺少校验码或定位器':'Missing the verification code or tracker','不知道白塔接收规则':'White Tower reception protocol is unknown','程野还没有加入':'Cheng Ye has not joined','先看清她藏遥控器的手':'Inspect the hand hiding the remote first',
    '林晓关系 +2':'Lin Xiao +2','药品 -1 · 信任 +2':'Medicine -1 · Trust +2','判断得到验证':'Diagnosis Confirmed','净水 -1 · 林晓 +2 · 阿梨 +1':'Water -1 · Lin Xiao +2 · Ali +1','发现隐藏规则':'Hidden Rule Found','电池 -1 · 电台路线已验证':'Battery -1 · Radio route verified','老周关系 +1':'Old Zhou +1','获得：灰帽商人的体貌':'Gained: Gray Hat description','隐藏路线开启':'Hidden Route Open','地下通道结局已解锁':'Tunnel ending unlocked','掌握反制频率':'Counter Frequency Acquired','电池 -1 · 真相路线已解锁':'Battery -1 · Truth route unlocked','识破假撤离车':'Fake Evacuation Exposed','特殊结局已解锁':'Special ending unlocked','身份验证成功':'Identity Verified',
    '你被她骗了':'You Were Deceived','反诱捕成功':'Counter-Ambush Successful','她先认输了':'She Gave In First','路途反制':'ROUTE COUNTER','主动权回到你手里':'Initiative Restored',
    '你用整个下午把幸存者、药和证据搬回便利店。卷帘门外终于敲出三长两短；灰帽商人仍在兜售撤离名单，但你已经能把一路线索反过来变成陷阱。':'You spend the afternoon moving survivors, medicine and evidence back to the store. Three long knocks and two short strike the shutter. Gray Hat is still selling his list, but your clues can now become a trap.',
    '第一季试玩进度 2 / 7':'Season One Progress 2 / 7','试玩版当前开放：第一章、第二章':'Available now: Chapters One and Two'
  };

  const patterns=[
    [/^调查身份 · (\d+)次$/,'Investigate · $1 left'],
    [/^(罐头|净水|药品)不足，无法交易$/,(m,r)=>`${r==='罐头'?'Food':r==='净水'?'Water':'Medicine'} is insufficient for this trade.`],
    [/^判断正确：(.*)$/,(m,rest)=>`Correct Call: ${translateCore(rest)}`],
    [/^判断失误：(.*)$/,(m,rest)=>`Wrong Call: ${translateCore(rest)}`],
    [/^正确判断 (\d+)\/6 · 店铺耐久 (\d+) · 本局得分 (\d+)$/,'Correct calls $1/6 · Shutter $2 · Run score $3'],
    [/^灯票 (\d+)$/,'Light Tokens $1'],
    [/^(\d+) 灯票$/,'$1 Light Tokens'],
    [/^保持隐蔽 · 谨慎路线 (\d+)(.*)$/,(m,n,rest)=>`Stay Hidden · Careful Routes ${n}${translateTail(rest)}`],
    [/^抢到先机 · 强攻路线 (\d+) · 反制能量 \+5$/,'Seize Initiative · Bold Routes $1 · Counter Energy +5'],
    [/^(.*)，先在场景中寻找办法。$/,(m,reason)=>`${translateCore(reason)}. Search the scene for another way.`],
    [/^把「(.*)」拖到人物或发光物体上。$/,(m,item)=>`Drag “${translateCore(item)}” onto a person or glowing object.`],
    [/^「(.*)」用在这里没有作用。试试与线索相关的人或物。$/,(m,item)=>`“${translateCore(item)}” has no effect here. Try a related person or object.`]
  ];

  function translateTail(value){return value.replace(' · 信任 +1',' · Trust +1').replace(' · 终局判断时间 +10秒',' · Finale decision time +10s')}
  function translateCore(value){
    const core=String(value||'').trim();
    if(!core)return core;
    if(en[core])return en[core];
    const base=locale.t(core).trim();
    if(base!==core)return base;
    for(const [rule,replacement] of patterns){rule.lastIndex=0;if(rule.test(core))return core.replace(rule,replacement)}
    return core;
  }
  function translateValue(value){
    const raw=String(value??'');const lead=raw.match(/^\s*/)?.[0]||'',trail=raw.match(/\s*$/)?.[0]||'',core=raw.trim();
    return lead+translateCore(core)+trail;
  }
  function translateTree(root){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){const next=locale.isEnglish?translateValue(root.nodeValue):(zhCleanup.get(root.nodeValue.trim())||root.nodeValue);if(next!==root.nodeValue)root.nodeValue=next;return}
    if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;const list=[];while((node=walker.nextNode()))if(!node.parentElement?.closest('script,style'))list.push(node);list.forEach(translateTree);
    root.querySelectorAll?.('[title],[aria-label],[data-label]').forEach(el=>['title','aria-label','data-label'].forEach(attr=>{if(el.hasAttribute(attr)){const old=el.getAttribute(attr),next=locale.isEnglish?translateValue(old):(zhCleanup.get(old)||old);if(next!==old)el.setAttribute(attr,next)}}));
  }

  translateTree(document.body);
  const observer=new MutationObserver(records=>records.forEach(record=>{
    if(record.type==='characterData')translateTree(record.target);
    else record.addedNodes.forEach(translateTree);
  }));
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
