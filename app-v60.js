/* Last Light Mart v60 — single-controller architecture. */

export const VERSION = '60.0.0';
export const SAVE_KEY = 'lastLightV60';

const text = (en, zh) => ({ en, zh });
const clone = value => JSON.parse(JSON.stringify(value));

export const SCENES = {
  dawn: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Last Light Mart · Rain at Dawn', '最后一盏灯 · 雨晨来客'),
    stamp: text('07:10 · Half-open shutter', '07:10 · 卷帘门只开一半'),
    asset: 'assets/story/opening-suyan-store-v5.png',
    actor: { x: 15, y: 7, w: 27, h: 62, label: text('Talk to Su Yan', '和苏妍交谈') },
    intro: text(
      'Su Yan enters from the storm and sets a red medical bag beside the counter. She asks for help, but her eyes move first to the medicine cabinet, rear door and radio. The set is part of the scene itself—there is no separate character cutout.',
      '苏妍从暴雨里钻进店内，把红色医疗包放在柜台旁。她嘴上说着求助，目光却先扫过药柜、后门和收音机。人物已经融入场景，不再叠加独立贴图。'
    ),
    dialogue: [
      text('“Check whether I am armed before you decide whether to trust me.”', '“先确认我有没有武器，再决定要不要相信我。”'),
      text('“One box of medicine is missing. Someone came here before me.”', '“药少了一盒。有人比我更早来过。”'),
      text('“The ambulance outside is not mine. Watch where I step.”', '“外面那辆救护车不是我的。看清我踩过的位置。”')
    ],
    clues: [
      { id: 'ledger', x: 64, y: 82, label: text('Altered inventory', '被改过的清单'), detail: text('A wet fingerprint touches only the missing-medicine row. The rest of the page is dry.', '半枚湿指纹只落在缺药一行，其他位置都是干的。') },
      { id: 'key', x: 35, y: 84, label: text('Fresh red paint', '钥匙上的新鲜红漆'), detail: text('Fresh red paint is trapped between the key teeth. It was used recently near painted equipment.', '钥匙齿缝里卡着新鲜红漆，说明它刚接触过某种设备。') }
    ],
    deduction: {
      question: text('Why did Su Yan find this store so precisely?', '苏妍为什么能准确找到这家店？'),
      options: [
        { correct: true, label: text('She arrived with inventory and key information.', '她提前掌握了库存与钥匙情报。'), result: text('The selective fingerprint and fresh paint support a planned visit.', '湿指纹与新鲜红漆共同证明这不是随机求助。') },
        { correct: false, label: text('She entered the first lit building she saw.', '她只是随机进入第一家亮灯商店。'), result: text('A random visitor could not know which medicine was missing.', '随机闯入无法解释她对缺药位置的了解。') },
        { correct: false, label: text('She had been hiding inside overnight.', '她整晚都躲在店内。'), result: text('The rain trail begins at the entrance.', '雨水痕迹从门口向内延伸。') }
      ]
    },
    choices: [
      { label: text('Follow her, keeping the medicine yourself', '带药跟上，但药由你保管'), hint: text('Caution +1', '谨慎 +1'), next: 'alley', effect: { flags: { cautious: 1 } } },
      { label: text('Make her walk ahead while you check the ground', '让她走前面，你检查地面'), hint: text('Evidence focus', '优先观察线索'), next: 'alley', effect: { flags: { tailedSuyan: 1 }, trust: 1 } },
      { label: text('Keep the medical bag as collateral', '扣下医疗包作为抵押'), hint: text('Control the pace', '掌握主动权'), next: 'alley', effect: { flags: { collateral: 1 }, trust: 1 } }
    ]
  },
  alley: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Ambulance Alley', '救护车后巷'),
    stamp: text('08:05 · Patrol approaching', '08:05 · 巡逻车逼近'),
    asset: 'assets/story/suyan-first-alley-v4.webp',
    actor: { x: 15, y: 10, w: 31, h: 65, label: text('Question Su Yan', '追问苏妍') },
    intro: text('The warm ambulance lamp pulls attention upward. A nearly invisible wire lies across the water below.', '救护车暖色警示灯把视线引向上方，水面下却横着一根几乎看不见的细线。'),
    dialogue: [
      text('“Come closer—or keep watching the wire. You have five seconds.”', '“靠近，或者继续盯着那根线。你只有五秒。”'),
      text('“Good. You noticed the danger was not where I wanted you to look.”', '“很好。你发现危险不在我希望你看的地方。”')
    ],
    clues: [
      { id: 'wire', x: 70, y: 79, label: text('Wire in the water', '积水里的细线'), detail: text('The wire is too weak to trip a person. It connects to empty cans that would reveal movement.', '钢丝不足以绊倒成年人，却连接着会暴露位置的空罐。') },
      { id: 'brick', x: 35, y: 74, label: text('Dry stepping stone', '唯一干燥落脚点'), detail: text('Su Yan keeps one foot on the only safe brick and reaches across the wire.', '苏妍始终踩着唯一安全的砖面，伸手方向正好越过钢丝。') }
    ],
    deduction: {
      question: text('What is Su Yan controlling by reaching toward you?', '苏妍伸手真正想控制什么？'),
      options: [
        { correct: true, label: text('Your route across an alarm wire.', '你跨过报警钢丝时的落脚路线。'), result: text('The empty cans and safe brick make the route deliberate.', '空罐与安全砖面共同证明她在控制你的路线。') },
        { correct: false, label: text('She only needs help crossing deep water.', '她只是需要借力过深水。'), result: text('She is already standing on the safe point.', '她自己已经站在唯一安全点上。') },
        { correct: false, label: text('She wants to steal the medicine bag.', '她想抢走医疗包。'), result: text('Her hand directs your step, not your bag.', '她控制的是你的落脚点，而不是背包。') }
      ]
    },
    choices: [
      { label: text('Cut the wire and use her safe route', '剪断钢丝，沿安全路线前进'), hint: text('Trust +1', '信任 +1'), next: 'clinic', effect: { trust: 1, flags: { cutWire: 1 } } },
      { label: text('Mark the wire and take the long route', '标记钢丝，绕路前往诊所'), hint: text('No exposure', '避免暴露'), next: 'clinic', effect: { flags: { longRoute: 1 } } }
    ]
  },
  clinic: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Qinghe Clinic · Sealed Entrance', '青禾诊所 · 封锁门厅'),
    stamp: text('08:40 · Patrol light on the wall', '08:40 · 巡逻灯扫过院墙'),
    asset: 'assets/story/lin-clinic-integrated-v3.webp',
    actor: { x: 40, y: 42, w: 22, h: 27, label: text('Talk to Lin Xiao', '和林晓交谈') },
    intro: text('Lin Xiao opens the side door a hand-width. Patients inside drank from the same rain barrels.', '林晓只把侧门拉开一条缝。门内病人都喝过同一批接雨水。'),
    dialogue: [
      text('“Someone stole fever medicine and left your warehouse key by the bed.”', '“有人偷走退烧药，又把你仓库的钥匙留在病床边。”'),
      text('“The broadcast was not sent from this room.”', '“广播不是从这间病房发出的。”')
    ],
    clues: [
      { id: 'footprint', x: 38, y: 70, label: text('Painted footprint', '带红漆的脚印'), detail: text('The same shoes travelled between the clinic and store. Fresh red paint remains in the heel.', '同一双鞋往返诊所与便利店，鞋跟还夹着新鲜红漆。') },
      { id: 'window', x: 72, y: 46, label: text('23:47 on the glass', '玻璃上的 23:47'), detail: text('The writing faces outward, so it was written from inside the room.', '笔画朝外，说明时间是从病房内部写下的。') }
    ],
    deduction: {
      question: text('What links the clinic, store and rooftop?', '什么把诊所、便利店和屋顶连在一起？'),
      options: [
        { correct: true, label: text('A courier carried clinic information and the key toward rooftop equipment.', '有人带着诊所情报和钥匙前往屋顶设备。'), result: text('The footprints, written time and paint form one route.', '脚印、时间与红漆形成一条可复核路线。') },
        { correct: false, label: text('Lin Xiao sent the broadcast alone.', '林晓独自发出了广播。'), result: text('There is no transmitter in the room and the footprints leave the clinic.', '病房没有发射设备，脚印也离开了诊所。') },
        { correct: false, label: text('The matching time is only coincidence.', '相同时间只是巧合。'), result: text('The route evidence repeats across three locations.', '路线证据在三个地点连续出现。') }
      ]
    },
    choices: [
      { label: text('Examine the black-water symptoms', '检查黑水中毒症状'), hint: text('Unlock diagnosis', '进入水样诊断'), next: 'diagnose', effect: { flags: { examinedPatient: 1 } } },
      { label: text('Follow the painted tracks to the old pharmacy', '沿红漆脚印去旧药房'), hint: text('Move quickly', '快速推进'), next: 'search', effect: { flags: { skippedDiagnosis: 1 } } }
    ]
  },
  diagnose: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Clinic Lab · Black Water', '诊所病房 · 黑色水样'),
    stamp: text('09:05 · Magnetic sediment', '09:05 · 磁性沉淀出现'),
    asset: 'assets/story/ali-clinic-diagnosis-v4.webp',
    actor: { x: 48, y: 29, w: 31, h: 49, label: text('Talk to Ali', '和阿梨交谈') },
    intro: text('Ali raises a water sample under the lamp. Black particles follow the metal bottle cap.', '阿梨把水样举到灯下，黑色颗粒沿着金属瓶盖移动。'),
    dialogue: [
      text('“This is not an infection. The particles respond to electromagnetic pulses.”', '“这不是感染。颗粒会响应电磁脉冲。”'),
      text('“The map connects rooftop antennas, rain pipes and the underground pump.”', '“地图把屋顶天线、雨水管和地下泵站连成了闭环。”')
    ],
    clues: [
      { id: 'sample', x: 54, y: 57, label: text('Magnetic sediment', '磁性沉淀'), detail: text('The particles align along metal instead of settling like ordinary mud.', '颗粒沿金属边缘排列，不像普通淤泥那样沉降。') },
      { id: 'map', x: 79, y: 29, label: text('Closed maintenance loop', '闭环检修路线'), detail: text('Rooftop antenna, rain system and pump station share the same marked loop.', '屋顶天线、雨水系统与泵站被同一条红线连成闭环。') }
    ],
    deduction: {
      question: text('What is the black rain being used for?', '黑雨正在被用来做什么？'),
      options: [
        { correct: true, label: text('Mark occupied buildings through the water system.', '通过水路标记有人居住的建筑。'), result: text('Magnetic particles and infrastructure routing point to tracking.', '磁性颗粒与基础设施闭环共同指向示踪。') },
        { correct: false, label: text('Create a virus that magnetizes blood.', '制造让血液磁化的病毒。'), result: text('The effect appears in containers and pipes, not blood.', '反应只出现在容器与管路中。') },
        { correct: false, label: text('Hide supplies in a normal shelter.', '在普通避难所藏物资。'), result: text('The rooftop antenna has no role in a simple shelter.', '普通避难所不需要接入屋顶天线。') }
      ]
    },
    choices: [
      { label: text('Take the map and follow the key trail', '带上地图，继续追踪钥匙'), hint: text('Evidence retained', '保留关键证据'), next: 'search', effect: { trust: 1, flags: { hasMap: 1 } } }
    ]
  },
  search: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Old Pharmacy · No-ID Patrol', '旧药房 · 无编号巡逻车'),
    stamp: text('11:20 · Blockade closing', '11:20 · 封锁线合拢'),
    asset: 'assets/story/zhou-pharmacy-integrated-v3.webp',
    actor: { x: 13, y: 35, w: 32, h: 36, label: text('Question Old Zhou', '询问老周') },
    intro: text('Old Zhou holds your warehouse key. Outside, an unmarked vehicle scans the street every seven seconds.', '老周手里拿着你的仓库钥匙。窗外无编号车辆每七秒扫描一次街道。'),
    dialogue: [
      text('“A gray-hatted trader paid me with an evacuation frequency.”', '“灰帽商人用一段撤离频率让我送钥匙上楼。”'),
      text('“The main road is blocked. The maintenance garage is our only exit.”', '“主路被堵死了，后仓机修间是唯一出口。”')
    ],
    clues: [
      { id: 'warehouseKey', x: 28, y: 62, label: text('Warehouse key', '仓库钥匙'), detail: text('Its teeth match the store lock and carry the same red paint as rooftop equipment.', '齿形与后仓锁吻合，红漆也与屋顶设备一致。') },
      { id: 'patrol', x: 72, y: 37, label: text('Unmarked patrol light', '无编号巡逻灯'), detail: text('The vehicle scans on a fixed seven-second cycle and carries rooftop sealant on its tyres.', '车辆按固定七秒节奏扫描，轮胎还沾着屋顶防水材料。') }
    ],
    deduction: {
      question: text('Who is controlling the route?', '谁在控制幸存者的移动路线？'),
      options: [
        { correct: true, label: text('A group using rooftop equipment and fake patrol vehicles to filter survivors.', '有人利用屋顶设备和假巡逻车筛选幸存者。'), result: text('The key and vehicle belong to one coordinated system.', '钥匙与车辆属于同一套协同系统。') },
        { correct: false, label: text('Old Zhou stole a vehicle to find food.', '老周偷车寻找食物。'), result: text('He cannot explain the scanning cycle or rooftop material.', '他无法解释固定扫描与屋顶材料。') },
        { correct: false, label: text('A normal rescue quarantine is underway.', '正规救援队正在执行隔离。'), result: text('A legitimate rescue vehicle would keep its identification.', '正规救援车辆不会抹去编号。') }
      ]
    },
    choices: [
      { label: text('Enter the maintenance garage', '进入后仓机修间'), hint: text('Only open route', '唯一可行路线'), next: 'garage', effect: { flags: { zhouJoined: 1 } } }
    ]
  },
  garage: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Maintenance Garage · Falling Shutter', '后仓机修间 · 下坠卷帘门'),
    stamp: text('13:10 · Motor overheating', '13:10 · 电机过热'),
    asset: 'assets/story/chengye-garage-integrated-v2.webp',
    actor: { x: 42, y: 34, w: 34, h: 38, label: text('Talk to Cheng Ye', '和程野配合') },
    intro: text('Cheng Ye braces the shutter while the winch motor smokes. A cut cable hangs beside the control box.', '程野顶住下坠卷帘门，卷扬机电机冒烟，断裂电缆垂在控制箱旁。'),
    dialogue: [
      text('“Cut power first. The motor will ignite if it stalls again.”', '“先断电。电机再堵一次就会起火。”'),
      text('“There is a service route back to the store.”', '“这里有一条回便利店的检修道。”')
    ],
    clues: [
      { id: 'cable', x: 78, y: 37, label: text('Freshly cut cable', '新切断的电缆'), detail: text('The copper strands were cut cleanly from the control-box side.', '铜丝从控制箱一侧被整齐切断。') },
      { id: 'badge', x: 43, y: 55, label: text('Rescue badge', '救援徽章'), detail: text('The badge number matches a former fire-rescue maintenance unit.', '徽章编号属于曾参与消防救援维护的队伍。') }
    ],
    deduction: {
      question: text('Was the shutter failure accidental?', '卷帘门故障是意外吗？'),
      options: [
        { correct: true, label: text('No. Someone cut the control cable to trap people inside.', '不是。有人切断控制电缆，想把人困在里面。'), result: text('The clean cut and valid rescue badge separate sabotage from repair work.', '整齐切口与真实救援身份把破坏行为和维修工作区分开。') },
        { correct: false, label: text('Yes. The old motor failed naturally.', '是。旧电机自然老化。'), result: text('Natural wear does not produce a clean cut.', '自然老化不会留下整齐切口。') },
        { correct: false, label: text('Cheng Ye cut it to steal supplies.', '程野为了偷物资切断电缆。'), result: text('His badge and actions support a rescue role.', '他的身份和行为都支持救援者角色。') }
      ]
    },
    choices: [
      { label: text('Repair the winch and return to the store', '修复卷扬机，返回便利店'), hint: text('Shelter secured', '店铺防线加强'), next: 'knock', effect: { trust: 1, flags: { chengJoined: 1 } } }
    ]
  },
  knock: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Last Light Mart · Night Knock', '最后一盏灯 · 夜间敲门'),
    stamp: text('20:40 · Three long, two short', '20:40 · 三长两短'),
    asset: 'assets/fp/store-fp.webp',
    actor: null,
    intro: text('The shutter receives three long knocks and two short ones. The same rhythm answers from behind the warehouse shelves.', '卷帘门响起三长两短，仓库货架后方也传来同样节奏。'),
    dialogue: [],
    clues: [
      { id: 'shutter', x: 52, y: 42, label: text('Knock pattern', '敲门节奏'), detail: text('The rhythm matches the noise hidden beneath the old broadcast.', '敲门节奏与旧广播底噪完全吻合。') },
      { id: 'backdoor', x: 20, y: 70, label: text('Cold air behind shelves', '货架后的冷风'), detail: text('Cold air passes through a hollow wall behind the storage shelves.', '货架后方墙体是空的，有冷风持续渗出。') }
    ],
    deduction: {
      question: text('What does the matching rhythm reveal?', '相同节奏说明了什么？'),
      options: [
        { correct: true, label: text('The broadcast and the person outside are using the same hidden route.', '广播与门外的人都在利用同一条隐藏路线。'), result: text('The matching signal and hollow wall point to an underground connection.', '相同信号与空心墙共同指向地下连接。') },
        { correct: false, label: text('The noise is random storm interference.', '这只是暴雨产生的随机杂音。'), result: text('A repeated coded rhythm is not random.', '重复出现的编码节奏并非随机。') },
        { correct: false, label: text('The warehouse shelves are expanding in the cold.', '货架受冷后自然膨胀发声。'), result: text('Expansion cannot reproduce the broadcast pattern.', '材料膨胀无法复制广播节奏。') }
      ]
    },
    choices: [
      { label: text('Open the hidden passage', '打开隐藏通道'), hint: text('Truth route', '真相路线'), next: 'tunnel', effect: { flags: { tunnel: 1 } } },
      { label: text('Leave through the rear route and reach the rooftop', '从后路直接前往屋顶'), hint: text('Faster, fewer supplies', '更快，但物资较少'), next: 'radio', effect: { flags: { rushedRadio: 1 } } }
    ]
  },
  tunnel: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Underground Broadcast Room', '地下广播室'),
    stamp: text('21:15 · Loop still running', '21:15 · 循环广播仍在运行'),
    asset: 'assets/story/backroom.webp',
    actor: null,
    intro: text('A recorder repeats the distress call beside sealed emergency crates. The final seconds contain a live vehicle challenge code.', '录音机循环播放求救声，旁边堆着封存物资。磁带末尾藏着一段车辆挑战码。'),
    dialogue: [],
    clues: [
      { id: 'recorder', x: 34, y: 58, label: text('Loop recorder', '循环录音机'), detail: text('The distress call repeats perfectly, but a real coordinate appears at the end.', '求救声完全重复，末尾却混入一组真人坐标。') },
      { id: 'crates', x: 72, y: 64, label: text('Emergency seals', '应急物资封条'), detail: text('The seals belong to a dissolved department that once managed evacuation signals.', '封条属于一个早已解散、曾管理撤离信号的部门。') }
    ],
    deduction: {
      question: text('Why was the loop created?', '为什么有人制作这段循环广播？'),
      options: [
        { correct: true, label: text('To draw survivors to a controlled collection point.', '把幸存者引向受控的集中点。'), result: text('The automated call and sealed supply authority support deliberate collection.', '自动广播与封存部门共同支持“集中诱导”。') },
        { correct: false, label: text('To entertain people sheltering underground.', '给地下避难者提供娱乐。'), result: text('The message contains coordinates and vehicle authentication.', '录音包含坐标与车辆验证信息。') },
        { correct: false, label: text('To test the store radio speakers.', '测试便利店收音机扬声器。'), result: text('The system is tied to evacuation infrastructure.', '系统连接的是撤离基础设施。') }
      ]
    },
    choices: [
      { label: text('Take the challenge code to the rooftop', '带挑战码前往屋顶'), hint: text('Expose the fake convoy', '识破假车队'), next: 'radio', effect: { trust: 1, flags: { challengeCode: 1 } } }
    ]
  },
  radio: {
    chapter: text('Chapter 1 · The Missing Signal', '第一章 · 失联者'),
    title: text('Rooftop Radio · Two Convoys', '屋顶电台 · 两辆撤离车'),
    stamp: text('23:47 · Both channels answer', '23:47 · 两个频道同时回应'),
    asset: 'assets/story/ali-rooftop-integrated-v2.webp',
    actor: { x: 35, y: 37, w: 32, h: 40, label: text('Talk to Ali', '和阿梨交谈') },
    intro: text('Two vehicles answer the same distress frequency. Only one knows the challenge code hidden in the loop.', '两辆车同时回应求救频率，只有一辆知道循环录音里的挑战码。'),
    dialogue: [
      text('“One vehicle is rescue. The other is following the leaked coordinates.”', '“一辆是真救援，另一辆在追踪泄露坐标。”'),
      text('“Your answer decides who reaches the street first.”', '“你的回答决定谁先抵达这条街。”')
    ],
    clues: [
      { id: 'channels', x: 42, y: 68, label: text('Overlapping radio noise', '重合的频道底噪'), detail: text('One channel carries the same background engine as the unmarked patrol vehicle.', '其中一个频道带着与无编号巡逻车相同的发动机底噪。') },
      { id: 'signalLamp', x: 72, y: 24, label: text('Three short, one long', '三短一长验证灯'), detail: text('The genuine East Line response repeats the challenge code correctly.', '真正的东线车辆正确回应了挑战码。') }
    ],
    deduction: {
      question: text('Which vehicle is genuine?', '哪一辆车才是真的？'),
      options: [
        { correct: true, label: text('East Line—the only vehicle that answers the challenge code.', '东线车辆——唯一正确回应挑战码的车辆。'), result: text('The code and engine noise expose the false convoy.', '挑战码与发动机底噪共同识破假车队。') },
        { correct: false, label: text('The unmarked convoy because it arrived first.', '无编号车队，因为它先到。'), result: text('Arrival speed is not authentication.', '先到并不能证明身份。') },
        { correct: false, label: text('Both vehicles are genuine.', '两辆都是真的。'), result: text('One shares the patrol vehicle’s noise and fails the code.', '其中一辆与假巡逻车同源且验证失败。') }
      ]
    },
    choices: [
      { label: text('Send the clinic coordinates first', '先发送诊所坐标'), hint: text('Save patients', '优先救病人'), next: 'ending', effect: { flags: { ending: 'clinic' }, trust: 2 } },
      { label: text('Send the store coordinates and evacuate supplies', '发送便利店坐标，带走物资'), hint: text('Save inventory', '优先保住物资'), next: 'ending', effect: { flags: { ending: 'store' } } },
      { label: text('Stay silent and use the tunnel', '保持静默，带众人走地下通道'), hint: text('Requires tunnel knowledge', '依赖地下通道'), next: 'ending', requires: 'tunnel', effect: { flags: { ending: 'tunnel' }, trust: 1 } }
    ]
  },
  ending: {
    chapter: text('Chapter 1 Complete', '第一章完成'),
    title: text('The Signal Is Sent', '选择已经发出'),
    stamp: text('00:03 · Consequences recorded', '00:03 · 后果已记录'),
    asset: 'assets/story/ali-rooftop-integrated-v2.webp',
    actor: null,
    intro: text('The first night ends. The next morning, black rain begins to collect in every barrel.', '第一夜结束。第二天清晨，每个接雨桶里都出现了黑色沉淀。'),
    dialogue: [], clues: [], deduction: null,
    endingText: state => {
      const end = state.flags.ending;
      if (end === 'tunnel') return text('You never answer the radio. Everyone leaves through the underground route while both convoys chase an empty signal.', '你没有回应无线电。所有人从地下通道撤离，两支车队扑向空坐标。');
      if (end === 'clinic') return text('East Line reaches the clinic first. You lose supplies, but the district gains people willing to protect one another.', '东线车辆先抵达诊所。你失去部分物资，却换来一个愿意互相保护的街区。');
      return text('The vehicle stops at the store. The shelves survive, but the clinic lights vanish in the rear-view mirror.', '车辆停在便利店前。货架保住了，诊所的灯却在后视镜里熄灭。');
    },
    choices: [
      { label: text('Begin Chapter 2', '进入第二章'), hint: text('Black Rain', '黑雨'), next: 'c2_dawn', effect: { flags: { chapter2: 1 } } },
      { label: text('Return to menu', '返回菜单'), hint: text('Progress saved', '进度已保存'), action: 'menu' }
    ]
  },
  c2_dawn: {
    chapter: text('Chapter 2 · Black Rain', '第二章 · 黑雨'),
    title: text('Last Light Mart · Water Alert', '最后一盏灯 · 水源警报'),
    stamp: text('06:40 · Dark sediment', '06:40 · 黑色沉淀'),
    asset: 'assets/story/lin-store-integrated-v3.webp',
    actor: { x: 18, y: 35, w: 32, h: 34, label: text('Talk to Lin Xiao', '询问林晓') },
    intro: text('Every rain barrel contains dark particles. White Tower leaflets call the collection process “settlement recovery.”', '所有接雨桶都出现黑色颗粒，白塔传单把回收流程称为“聚居点回收”。'),
    dialogue: [
      text('“The rain is not only poison. It is a marker.”', '“黑雨不只是毒，它还是一种标记。”'),
      text('“We can trace it from the rooftop or protect the ration yard first.”', '“可以先追屋顶源头，也可以先保护居民院配水点。”')
    ],
    clues: [
      { id: 'rainbarrel', x: 30, y: 68, label: text('Reactive sediment', '会反应的沉淀'), detail: text('The particles gather around metal and brighten under a scanner.', '颗粒聚集在金属周围，并在扫描下变亮。') },
      { id: 'flyer', x: 76, y: 38, label: text('White Tower leaflet', '白塔传单'), detail: text('Fine print describes “settlement tracking and recovery.”', '背面细字写着“聚居点示踪与回收”。') }
    ],
    deduction: {
      question: text('What do the sediment and leaflet prove together?', '沉淀与传单共同证明了什么？'),
      options: [
        { correct: true, label: text('The rain marks occupied buildings for White Tower.', '黑雨在为白塔标记有人居住的建筑。'), result: text('The detectable material and recovery notice describe one tracking system.', '可识别材料与回收说明属于同一套追踪系统。') },
        { correct: false, label: text('Ordinary acid rain damaged every barrel.', '普通酸雨腐蚀了所有水桶。'), result: text('Corrosion does not explain magnetic tracking material.', '腐蚀无法解释可被设备识别的颗粒。') },
        { correct: false, label: text('Expired medicine contaminated the rain.', '过期药品污染了雨水。'), result: text('Both clues originate from the collection system.', '两件证物都来自雨水回收系统。') }
      ]
    },
    choices: [
      { label: text('Trace the source on the rooftop', '前往屋顶追踪污染源'), hint: text('Source route', '源头路线'), next: 'c2_roof', effect: { flags: { roofRoute: 1 } } },
      { label: text('Protect the ration yard first', '先保护居民院配水点'), hint: text('People route', '人群路线'), next: 'c2_market', effect: { trust: 1, flags: { marketRoute: 1 } } }
    ]
  },
  c2_roof: {
    chapter: text('Chapter 2 · Black Rain', '第二章 · 黑雨'),
    title: text('Rooftop Collection System', '屋顶集水系统'),
    stamp: text('07:25 · Filter opened from inside', '07:25 · 滤芯由内部割开'),
    asset: 'assets/story/chengye-roof-integrated-v3.webp',
    actor: { x: 20, y: 34, w: 42, h: 36, label: text('Talk to Cheng Ye', '询问程野') },
    intro: text('A filter was cut from inside the housing. Blue powder glows when touched by rain.', '滤芯外壳从内部被割开，蓝色粉末遇雨发光。'),
    dialogue: [
      text('“This cut was made after installation. Someone injected the powder.”', '“切口形成于安装后。有人主动注入了粉末。”')
    ],
    clues: [
      { id: 'filter', x: 42, y: 50, label: text('Inside-out filter cut', '由内向外的滤芯切口'), detail: text('The fresh cut opens outward from inside the casing.', '新切口从滤芯内部向外翻开。') },
      { id: 'bluepowder', x: 76, y: 42, label: text('Rain-reactive powder', '遇雨发光的蓝粉'), detail: text('The powder emits a signal visible to the rooftop drone.', '粉末发出可被屋顶无人机识别的信号。') }
    ],
    deduction: {
      question: text('How did contamination enter the system?', '污染是怎样进入系统的？'),
      options: [
        { correct: true, label: text('Someone opened the filter from inside and injected tracking powder.', '有人从内部割开滤芯并注入示踪粉。'), result: text('The cut direction and reactive powder show deliberate insertion.', '切口方向与发光粉末共同证明人为投放。') },
        { correct: false, label: text('The filter aged and absorbed rooftop dust.', '滤芯老化后吸入了屋顶灰尘。'), result: text('Natural wear does not create a fresh inside-out cut.', '自然老化不会形成新鲜的由内向外切口。') },
        { correct: false, label: text('Cheng Ye spilled harmless dye.', '程野误撒了无害染料。'), result: text('The powder is transmitting to a drone.', '这种粉末正在向无人机传递信号。') }
      ]
    },
    choices: [
      { label: text('Follow the drone toward the ration yard', '跟随无人机前往居民院'), hint: text('Track the counting route', '追踪统计路线'), next: 'c2_market', effect: { flags: { trackedDrone: 1 } } },
      { label: text('Follow Su Yan’s locator signal', '追踪苏妍的定位信号'), hint: text('Risky shortcut', '高风险捷径'), next: 'c2_suyan', effect: { flags: { trackedSuyan: 1 } } }
    ]
  },
  c2_market: {
    chapter: text('Chapter 2 · Black Rain', '第二章 · 黑雨'),
    title: text('Ration Yard · Drone Count', '居民院配水点 · 无人机统计'),
    stamp: text('11:10 · Crowd concentrated', '11:10 · 人群被集中'),
    asset: 'assets/story/lin-ration-integrated-v3.webp',
    actor: { x: 40, y: 38, w: 30, h: 35, label: text('Help Lin Xiao', '协助林晓') },
    intro: text('A raised ration mark creates conflict exactly where a drone slows to count the crowd.', '被抬高的配给线制造争抢，而无人机恰好在冲突最激烈的位置减速统计。'),
    dialogue: [
      text('“The shortage is real, but someone made the line worse on purpose.”', '“净水确实不足，但有人故意把配给线改得更高。”')
    ],
    clues: [
      { id: 'rationmark', x: 31, y: 72, label: text('Altered ration line', '被改过的配给线'), detail: text('Fresh chalk sits above the older allocation mark.', '新粉笔线被画在旧配给线之上。') },
      { id: 'tag', x: 71, y: 34, label: text('Monitoring tag', '监测脚环'), detail: text('The tag broadcasts a White Tower counting ID.', '脚环持续广播白塔统计编号。') }
    ],
    deduction: {
      question: text('Why were conflict and monitoring placed together?', '为什么冲突与监测会同时出现？'),
      options: [
        { correct: true, label: text('To concentrate people where the drone can count them.', '为了把人群集中到无人机最容易统计的位置。'), result: text('The altered ration line creates conflict while the tag confirms active counting.', '被改配给线制造冲突，监测编号证明统计正在进行。') },
        { correct: false, label: text('People are fighting only because water is scarce.', '人们只是因为缺水自然争吵。'), result: text('Scarcity does not explain the deliberately raised line.', '自然短缺解释不了人为抬高的配给线。') },
        { correct: false, label: text('A bird consumed the missing water.', '鸟喝掉了所有缺失净水。'), result: text('The tag is a monitoring device, not a ration record.', '脚环是监测设备，不是配给记录。') }
      ]
    },
    choices: [
      { label: text('Use the locator to find the next trap', '用定位器追踪下一处陷阱'), hint: text('Su Yan route', '苏妍路线'), next: 'c2_suyan', effect: { trust: 1, flags: { protectedYard: 1 } } }
    ]
  },
  c2_suyan: {
    chapter: text('Chapter 2 · Black Rain', '第二章 · 黑雨'),
    title: text('Flooded Underpass · Bait Signal', '积水隧道 · 诱饵信号'),
    stamp: text('15:30 · Locator still transmitting', '15:30 · 定位器仍在发送'),
    asset: 'assets/story/suyan-underpass-yoga-v4.webp',
    actor: { x: 15, y: 14, w: 33, h: 55, label: text('Challenge Su Yan', '质问苏妍') },
    intro: text('Su Yan reaches toward you beside an overturned truck. A courier trapped to the right shakes her head in warning.', '苏妍靠着翻倒货车向你伸手，右侧被困的快递员却拼命摇头。'),
    dialogue: [
      text('“You came anyway. That means the signal still works.”', '“你还是来了。说明这个信号依然有效。”'),
      text('“Look at my hand before you decide who needs saving.”', '“先看清我的手，再决定谁需要被救。”')
    ],
    clues: [
      { id: 'tracker', x: 39, y: 54, label: text('Active remote', '仍在发送的遥控器'), detail: text('The remote refreshes your location every two seconds.', '遥控器每两秒刷新一次你的位置。') },
      { id: 'tripwire', x: 58, y: 78, label: text('Submerged tripwire', '水下绊线'), detail: text('The line connects to a shock canister beneath the truck.', '细线连接货车底部的震爆罐。') }
    ],
    deduction: {
      question: text('What is Su Yan’s task here?', '苏妍在这里的真实任务是什么？'),
      options: [
        { correct: true, label: text('Act as bait between a locator and a shock trap.', '充当定位器与震爆机关之间的诱饵。'), result: text('The remote transmits your position while the wire arms the trap.', '遥控器持续回传位置，绊线则连接震爆机关。') },
        { correct: false, label: text('Protect the trapped courier.', '保护被困快递员。'), result: text('The courier is warning you about Su Yan’s hidden remote.', '快递员正在警告你注意苏妍藏着的遥控器。') },
        { correct: false, label: text('Repair a pump-station safety alarm.', '维修泵站安全警报。'), result: text('The line ends at a truck canister, not the pump.', '细线连接货车震爆罐，而不是泵站。') }
      ]
    },
    choices: [
      { label: text('Disable the remote and free the courier', '关闭遥控器并救出快递员'), hint: text('Trust +2', '信任 +2'), next: 'c2_pump', effect: { trust: 2, flags: { defeatedSuyanTrap: 1 } } },
      { label: text('Use the remote to send a false position', '利用遥控器发送假坐标'), hint: text('Counter-tracking', '反向误导追踪'), next: 'c2_pump', effect: { flags: { falsePosition: 1 } } }
    ]
  },
  c2_pump: {
    chapter: text('Chapter 2 · Black Rain', '第二章 · 黑雨'),
    title: text('L-17 Pump Station', 'L-17 地下泵站'),
    stamp: text('18:10 · Bypass still powered', '18:10 · 跨接端口仍有电'),
    asset: 'assets/story/ali-pump-integrated-v3.webp',
    actor: { x: 25, y: 22, w: 38, h: 42, label: text('Talk to Ali', '询问阿梨') },
    intro: text('The pump station and store carry the same L-17 node seal. A powered bypass can isolate black water from the clean line.', '泵站与便利店拥有相同的 L-17 节点封条，通电跨接口能把黑水切离净水管。'),
    dialogue: [
      text('“The store is not just a shop. It is part of the same lighthouse node.”', '“便利店不只是商店，它属于同一个灯塔节点。”')
    ],
    clues: [
      { id: 'valve', x: 69, y: 42, label: text('Powered bypass valve', '仍可通电的跨接阀门'), detail: text('The bypass can restart the main pump and isolate the marked water.', '跨接端口可以重启主泵，并隔离被标记的水路。') },
      { id: 'seal', x: 30, y: 64, label: text('L-17 node seal', 'L-17 节点封条'), detail: text('The exact node number also appears beneath the store radio panel.', '相同节点编号也出现在便利店收音机面板下方。') }
    ],
    deduction: {
      question: text('How are the store and pump connected?', '便利店与泵站是什么关系？'),
      options: [
        { correct: true, label: text('They are one lighthouse node controlling water and tracking signals.', '它们属于同一个控制水路与示踪信号的灯塔节点。'), result: text('The shared seal and live bypass connect both facilities.', '相同封条与可用跨接口把两个设施连成同一系统。') },
        { correct: false, label: text('The store was built nearby by coincidence.', '便利店只是碰巧建在泵站附近。'), result: text('Matching node IDs are not geographic coincidence.', '完全相同的节点编号不是地理巧合。') },
        { correct: false, label: text('The pump was permanently abandoned.', '泵站已经永久报废。'), result: text('The bypass still restarts the main pump.', '跨接口仍能重启主泵。') }
      ]
    },
    choices: [
      { label: text('Restart the pump and climb to the antenna', '重启主泵并前往天线'), hint: text('Final system access', '获得最终系统权限'), next: 'c2_choice', effect: { flags: { pumpRestored: 1 } } }
    ]
  },
  c2_choice: {
    chapter: text('Chapter 2 · Black Rain', '第二章 · 黑雨'),
    title: text('White Tower Antenna', '白塔示踪天线'),
    stamp: text('23:47 · Population list uploading', '23:47 · 人口名单正在上传'),
    asset: 'assets/story/ali-rooftop-integrated-v2.webp',
    actor: { x: 35, y: 37, w: 32, h: 40, label: text('Talk to Ali', '询问阿梨') },
    intro: text('The antenna begins uploading names and locations. A verification code left by your sister can take control once.', '天线开始上传姓名与坐标。姐姐留下的校验码只能接管系统一次。'),
    dialogue: [
      text('“You can expose the list, erase it, or turn it back on White Tower.”', '“你可以公开名单、删除名单，或者把追踪信号反向送回白塔。”')
    ],
    clues: [
      { id: 'antenna', x: 62, y: 26, label: text('Upload fields', '正在上传的字段'), detail: text('The antenna uploads names, household count and exact coordinates.', '天线上传姓名、家庭人数与精确坐标。') },
      { id: 'sistercode', x: 44, y: 62, label: text('Sister’s verification code', '姐姐留下的校验码'), detail: text('The code grants one authenticated takeover of the tracking network.', '这组校验码能对追踪网络进行一次有效接管。') }
    ],
    deduction: {
      question: text('What can the code and antenna do together?', '校验码与天线共同赋予了什么能力？'),
      options: [
        { correct: true, label: text('Take over the broadcast and turn the hidden population list into evidence.', '接管广播，把秘密人口名单变成公开证据。'), result: text('The antenna provides data; the code provides authenticated control.', '天线提供数据，校验码提供有效控制权限。') },
        { correct: false, label: text('Only switch off the store radio.', '只能关闭便利店收音机。'), result: text('The code belongs to the city tracking network.', '校验码属于城市追踪网络。') },
        { correct: false, label: text('Permanently purify all black rain.', '永久净化所有黑雨。'), result: text('Signal control cannot change rain chemistry.', '信号控制无法直接改变雨水成分。') }
      ]
    },
    choices: [
      { label: text('Broadcast the population list publicly', '公开广播人口名单'), hint: text('Expose White Tower', '揭露白塔'), next: 'c2_end', effect: { flags: { c2Ending: 'expose' }, trust: 2 } },
      { label: text('Erase every civilian coordinate', '删除所有平民坐标'), hint: text('Protect survivors', '保护幸存者'), next: 'c2_end', effect: { flags: { c2Ending: 'erase' }, trust: 1 } },
      { label: text('Send the tracking signal back to White Tower', '把追踪信号反向送回白塔'), hint: text('Counterattack', '反向追踪'), next: 'c2_end', effect: { flags: { c2Ending: 'counter' } } }
    ]
  },
  c2_end: {
    chapter: text('Chapter 2 Complete', '第二章完成'),
    title: text('The Black Rain Network Falls Silent', '黑雨网络暂时沉默'),
    stamp: text('00:12 · L-17 remains lit', '00:12 · L-17 仍亮着'),
    asset: 'assets/story/ali-rooftop-integrated-v2.webp',
    actor: null,
    intro: text('The antenna stops counting the district. The store below remains the last reliable light in the rain.', '天线停止统计街区。雨幕中的便利店仍是最后一盏可靠的灯。'),
    dialogue: [], clues: [], deduction: null,
    endingText: state => {
      const end = state.flags.c2Ending;
      if (end === 'erase') return text('Every civilian coordinate disappears. White Tower loses the list, but the public never learns what happened.', '所有平民坐标被删除。白塔失去名单，但公众暂时不知道真相。');
      if (end === 'counter') return text('The signal turns back toward White Tower. Their own vehicles begin reporting one another.', '追踪信号反向指向白塔，他们的车辆开始互相上报。');
      return text('The hidden list reaches every open radio. White Tower can no longer pretend the tracking program never existed.', '秘密名单传遍所有开放频道，白塔再也无法否认追踪计划。');
    },
    choices: [
      { label: text('Return to main menu', '返回主菜单'), hint: text('Progress saved', '进度已保存'), action: 'menu' },
      { label: text('Replay from Chapter 1', '从第一章重新开始'), hint: text('New route', '尝试新路线'), action: 'new' }
    ]
  }
};

export const NIGHT_ENCOUNTERS = [
  ['medic', true, text('Lin Xiao', '林晓'), text('Clinic doctor', '诊所医生'), 'water', text('The clinic has water only until dawn. I can trade ration records.', '诊所净水只够到天亮，我用配给记录交换。'), [text('Badge matches clinic records.', '胸牌与诊所记录一致。'), text('Bottle carries a sterilization mark.', '水壶有消毒标记。')]],
  ['repair', true, text('Old Zhou', '老周'), text('Repair technician', '修理工'), 'food', text('Give me one food ration and I will repair the shutter.', '给我一份罐头，我修好卷帘门。'), [text('Tool wear matches his trade.', '工具磨损符合工种。'), text('He identifies the exact fault.', '能准确指出故障点。')]],
  ['infected', false, text('Unknown traveler', '无名旅客'), text('Injured traveler', '伤者'), 'med', text('It is only a cut. Give me medicine.', '只是划伤，给我药。'), [text('Black webbing surrounds the wound.', '伤口边缘有黑色网纹。'), text('Pupils do not track light.', '瞳孔不追随灯光。')]],
  ['mapper', true, text('Ali', '阿梨'), text('Surveyor', '测绘员'), 'food', text('A safe route map for one ration.', '安全路线图换一份食物。'), [text('Flood depth is accurate.', '积水深度准确。'), text('Pack contains only surveying tools.', '背包只有测绘工具。')]],
  ['scout', false, text('Gray Hat', '灰帽商人'), text('Supply trader', '物资贩子'), 'water', text('I pay well for water. Do not ask where my vehicle is.', '高价换水，别问车在哪。'), [text('Crowbar has fresh red paint.', '撬棍有新鲜红漆。'), text('Three sets of footprints wait outside.', '门外有三组脚印。')]],
  ['courier', true, text('Zhou Ran', '周冉'), text('Courier', '骑手'), 'water', text('I know the rooftop bridge route.', '我知道屋顶连桥。'), [text('Route stickers cover several districts.', '路线贴纸覆盖多个街区。'), text('Mud came from the rear alley.', '鞋底泥来自后巷。')]],
  ['guard', true, text('Zheng Kai', '郑凯'), text('Security captain', '保安队长'), 'food', text('I need supplies to reopen the fire doors.', '我需要补给去开消防门。'), [text('Radio receives the mall channel.', '对讲机仍接收商场频道。'), text('Key fits a fire door.', '钥匙符合消防门。')]],
  ['bait', false, text('Distress caller', '求救者'), text('Unknown identity', '身份不明'), 'med', text('I am alone in the alley. Open the door.', '后巷只有我一个人，开门。'), [text('Clothes are dry.', '衣服是干的。'), text('Plea matches the knock pattern.', '求救节奏与敲门一致。')]],
  ['accountant', true, text('He Xiulan', '何秀兰'), text('Accountant', '会计'), 'water', text('I can decode White Tower ration ledgers.', '我能看懂白塔配给账。'), [text('Ledger calculations are continuous.', '账本有连续核算。'), text('She identifies duplicate IDs.', '她能指出重复编号。')]],
  ['fakeMedic', false, text('Traveling nurse', '巡回护士'), text('Medical worker', '医疗人员'), 'med', text('Give me all medicine for central distribution.', '把药全部交给我统一分配。'), [text('No sterile supplies in the bag.', '急救包没有无菌耗材。'), text('Badge hospital closed years ago.', '胸牌医院早已关闭。')]],
  ['firefighter', true, text('Cheng Ye', '程野'), text('Fire rescuer', '消防救援'), 'water', text('I can clear the rear exit.', '我能移开堵住后门的架子。'), [text('Gloves show hydraulic-cutter wear.', '手套有液压剪磨痕。'), text('He knows the load-bearing walls.', '知道承重墙位置。')]],
  ['convoy', false, text('Convoy liaison', '车队联络员'), text('Evacuation staff', '撤离人员'), 'food', text('Bring the food outside for inspection.', '先把食物搬出来核验。'), [text('Vehicle has no rescue number.', '车辆没有救援编号。'), text('Radio repeats headcounts without a call sign.', '无线电只报人数，不报呼号。')]]
].map(([id, safe, name, role, need, claim, clues]) => ({ id, safe, name, role, need, claim, clues }));

const DEFAULT_STATE = {
  version: VERSION,
  screen: 'menu',
  mode: 'story',
  lang: 'en',
  node: 'dawn',
  phase: 'scene',
  dialogueIndex: 0,
  found: [],
  activeClue: null,
  clueOperationStep: 0,
  deductionFeedback: null,
  resources: { food: 4, water: 3, med: 1, battery: 1, trust: 0 },
  flags: {},
  history: [],
  night: null,
  meta: { tokens: 80, reputation: 0, shifts: 0, bestScore: 0 }
};

export function createInitialState(lang = 'en') {
  return { ...clone(DEFAULT_STATE), lang, screen: 'menu' };
}

function enterNode(state, node) {
  const scene = SCENES[node];
  if (!scene) throw new Error(`Unknown scene: ${node}`);
  return {
    ...state,
    screen: 'game',
    mode: 'story',
    node,
    phase: scene.dialogue?.length ? 'scene' : (scene.clues?.length ? 'investigate' : 'ending'),
    dialogueIndex: 0,
    found: [],
    activeClue: null,
    clueOperationStep: 0,
    deductionFeedback: null,
    history: [...state.history, node].slice(-30)
  };
}

function applyEffect(state, effect = {}) {
  const resources = { ...state.resources };
  for (const key of ['food', 'water', 'med', 'battery', 'trust']) {
    if (Number.isFinite(effect[key])) resources[key] = Math.max(0, (resources[key] || 0) + effect[key]);
  }
  return { ...state, resources, flags: { ...state.flags, ...(effect.flags || {}) } };
}

function requirementMet(state, choice) {
  return !choice.requires || Boolean(state.flags[choice.requires]);
}

function orderedNight(seed) {
  let n = [...String(seed)].reduce((a, c) => ((a * 33 + c.charCodeAt(0)) >>> 0), 2166136261);
  const list = [...NIGHT_ENCOUNTERS];
  for (let i = list.length - 1; i > 0; i -= 1) {
    n = (n * 1664525 + 1013904223) >>> 0;
    const j = n % (i + 1);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, 6);
}

export function reduce(state, action) {
  switch (action.type) {
    case 'SET_LANG': return { ...state, lang: action.lang === 'zh' ? 'zh' : 'en' };
    case 'OPEN_MENU': return { ...state, screen: 'menu' };
    case 'CONTINUE_STORY': return { ...state, screen: 'game', mode: 'story' };
    case 'START_NEW': return enterNode({ ...createInitialState(state.lang), screen: 'game' }, 'dawn');
    case 'ENTER_NODE': return enterNode(state, action.node);
    case 'START_DIALOGUE': {
      const scene = SCENES[state.node];
      if (!scene.dialogue?.length) return { ...state, phase: 'investigate' };
      return { ...state, phase: 'dialogue', dialogueIndex: 0 };
    }
    case 'DIALOGUE_NEXT': {
      const scene = SCENES[state.node];
      if (state.phase !== 'dialogue') return state;
      const next = state.dialogueIndex + 1;
      if (next >= scene.dialogue.length) return { ...state, phase: scene.clues.length ? 'investigate' : 'ending', dialogueIndex: next };
      return { ...state, dialogueIndex: next };
    }
    case 'INSPECT': {
      const scene = SCENES[state.node];
      const clue = scene.clues.find(item => item.id === action.id);
      if (!clue) return state;
      const found = state.found.includes(clue.id) ? state.found : [...state.found, clue.id];
      return { ...state, found, activeClue: clue.id, clueOperationStep: 0, phase: 'clue' };
    }
    case 'OPERATE_CLUE': {
      if (state.phase !== 'clue' || !state.activeClue) return state;
      return { ...state, clueOperationStep: Math.min(2, (state.clueOperationStep || 0) + 1) };
    }
    case 'CLOSE_CLUE': {
      if ((state.clueOperationStep || 0) < 2) return state;
      const scene = SCENES[state.node];
      const complete = state.found.length >= scene.clues.length;
      return { ...state, activeClue: null, clueOperationStep: 0, phase: complete && scene.deduction ? 'deduce-ready' : 'investigate' };
    }
    case 'OPEN_DEDUCTION': return { ...state, phase: 'deduce', deductionFeedback: null };
    case 'ANSWER_DEDUCTION': {
      const scene = SCENES[state.node];
      const option = scene.deduction?.options[action.index];
      if (!option) return state;
      if (option.correct) return { ...state, phase: 'decide', deductionFeedback: { correct: true, result: option.result } };
      return { ...state, phase: 'deduce', deductionFeedback: { correct: false, result: option.result } };
    }
    case 'CHOOSE': {
      const scene = SCENES[state.node];
      const choice = scene.choices[action.index];
      if (!choice || !requirementMet(state, choice)) return state;
      if (choice.action === 'menu') return { ...state, screen: 'menu' };
      if (choice.action === 'new') return enterNode({ ...createInitialState(state.lang), screen: 'game' }, 'dawn');
      return enterNode(applyEffect(state, choice.effect), choice.next);
    }
    case 'START_NIGHT': {
      const order = orderedNight(`${Date.now()}-${state.meta.shifts}`);
      return {
        ...state,
        screen: 'game',
        mode: 'night',
        night: { index: 0, order, inspected: false, acted: false, shelter: 60, food: 3, water: 3, med: 1, focus: 3, correct: 0, score: 0, result: null }
      };
    }
    case 'NIGHT_INSPECT': {
      if (!state.night || state.night.inspected || state.night.focus <= 0) return state;
      return { ...state, night: { ...state.night, inspected: true, focus: state.night.focus - 1 } };
    }
    case 'NIGHT_DECIDE': {
      if (!state.night || state.night.acted) return state;
      const encounter = state.night.order[state.night.index];
      const accept = Boolean(action.accept);
      const stock = state.night[encounter.need];
      if (accept && stock <= 0) return { ...state, night: { ...state.night, result: { correct: false, text: text('Not enough stock.', '物资不足。'), blocked: true } } };
      const correct = (accept && encounter.safe) || (!accept && !encounter.safe);
      const nextNight = { ...state.night, acted: true };
      if (accept) nextNight[encounter.need] -= 1;
      if (correct) {
        nextNight.correct += 1;
        nextNight.score += 20 + (nextNight.inspected ? 5 : 0);
      } else nextNight.shelter = Math.max(0, nextNight.shelter - 14);
      nextNight.result = { correct, text: correct ? text('Correct decision.', '判断正确。') : text('Wrong decision. The shutter is damaged.', '判断失误，卷帘门受损。') };
      return { ...state, night: nextNight };
    }
    case 'NIGHT_NEXT': {
      if (!state.night?.acted) return state;
      const nextIndex = state.night.index + 1;
      if (nextIndex >= state.night.order.length || state.night.shelter <= 0) {
        const finalScore = state.night.score + state.night.shelter;
        const reward = 20 + state.night.correct * 6;
        return {
          ...state,
          night: { ...state.night, finished: true, finalScore, reward },
          meta: { ...state.meta, tokens: state.meta.tokens + reward, reputation: state.meta.reputation + state.night.correct, shifts: state.meta.shifts + 1, bestScore: Math.max(state.meta.bestScore, finalScore) }
        };
      }
      return { ...state, night: { ...state.night, index: nextIndex, inspected: false, acted: false, result: null } };
    }
    default: return state;
  }
}

export function validateContent() {
  const errors = [];
  for (const [id, scene] of Object.entries(SCENES)) {
    if (!scene.asset) errors.push(`${id}: missing asset`);
    const clueIds = (scene.clues || []).map(clue => clue.id);
    if (new Set(clueIds).size !== clueIds.length) errors.push(`${id}: duplicate clue id`);
    for (const choice of scene.choices || []) if (choice.next && !SCENES[choice.next]) errors.push(`${id}: missing target ${choice.next}`);
  }
  return errors;
}

function localeValue(value, lang) {
  if (typeof value === 'function') return localeValue(value, lang);
  if (value && typeof value === 'object' && ('en' in value || 'zh' in value)) return value[lang] || value.en || value.zh || '';
  return String(value ?? '');
}

function migrateLegacy(lang) {
  if (typeof localStorage === 'undefined') return createInitialState(lang);
  try {
    const existing = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (existing?.version === VERSION && SCENES[existing.node]) return { ...createInitialState(lang), ...existing, lang: existing.lang || lang };
  } catch {}
  try {
    const legacyRaw = localStorage.getItem('lastLightStory');
    if (legacyRaw) localStorage.setItem('lastLightLegacyBackup', legacyRaw);
    const legacy = JSON.parse(legacyRaw || 'null');
    if (legacy && SCENES[legacy.node]) {
      const migrated = enterNode(createInitialState(lang), legacy.node);
      migrated.resources = {
        food: Number.isFinite(+legacy.food) ? +legacy.food : 4,
        water: Number.isFinite(+legacy.water) ? +legacy.water : 3,
        med: Number.isFinite(+legacy.med) ? +legacy.med : 1,
        battery: Number.isFinite(+legacy.battery) ? +legacy.battery : 1,
        trust: Number.isFinite(+legacy.trust) ? +legacy.trust : 0
      };
      migrated.flags = { ...(legacy.flags || {}) };
      migrated.screen = 'menu';
      return migrated;
    }
  } catch {}
  return createInitialState(lang);
}

function mount() {
  const root = document.getElementById('app');
  if (!root) return;
  const storedLang = (() => { try { return localStorage.getItem('lastLightLang') || 'en'; } catch { return 'en'; } })();
  let state = migrateLegacy(storedLang === 'zh' ? 'zh' : 'en');
  const timers = new Set();
  const T = value => localeValue(value, state.lang);

  function clearTimers() { for (const timer of timers) clearTimeout(timer); timers.clear(); }
  function persist() {
    try {
      const previous = localStorage.getItem(SAVE_KEY);
      if (previous) localStorage.setItem(`${SAVE_KEY}:backup`, previous);
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      localStorage.setItem('lastLightLang', state.lang);
    } catch {}
  }
  function dispatch(action) {
    if (action.type === 'START_NEW') clearTimers();
    state = reduce(state, action);
    persist();
    render();
  }

  function resourcesHtml() {
    const r = state.resources;
    return `<div class="hud-resources"><span>${T(text('Food','罐头'))}<b>${r.food}</b></span><span>${T(text('Water','净水'))}<b>${r.water}</b></span><span>${T(text('Medicine','药品'))}<b>${r.med}</b></span><span>${T(text('Battery','电池'))}<b>${r.battery}</b></span><span>${T(text('Trust','信任'))}<b>${r.trust}</b></span></div>`;
  }

  function menuHtml() {
    const hasProgress = state.history.length > 0 || state.node !== 'dawn';
    return `<main class="menu-screen">
      <section class="menu-card">
        <small>LAST LIGHT MART · V${VERSION}</small>
        <h1>${T(text('The Missing Signal','失联信号'))}</h1>
        <p>${T(text('One story controller. Integrated scene art. No stacked runtime patches.','单一剧情状态控制器，人物与场景融合，不再叠加补丁脚本。'))}</p>
        <div class="menu-actions">
          ${hasProgress ? `<button class="primary" data-action="continue-story">${T(text('Continue Story','继续故事'))}<span>${T(SCENES[state.node].title)}</span></button>` : ''}
          <button class="primary" data-action="start-new">${T(text('New Story','新的故事'))}<span>${T(text('Clears all active dialogue and timers','彻底清理对话与计时状态'))}</span></button>
          <button data-action="start-night">${T(text('Night Shift','夜班守店'))}<span>${T(text('Six visitors · one controller','六名来客 · 同一状态控制器'))}</span></button>
          <button data-action="toggle-lang">${state.lang === 'en' ? '中文' : 'English'}<span>${T(text('Switch language','切换语言'))}</span></button>
        </div>
        <div class="menu-meta"><span>${T(text('Tokens','灯票'))} <b>${state.meta.tokens}</b></span><span>${T(text('Reputation','声望'))} <b>${state.meta.reputation}</b></span><span>${T(text('Best shift','夜班最高分'))} <b>${state.meta.bestScore}</b></span></div>
      </section>
    </main>`;
  }

  function scenePanel(scene) {
    if (state.phase === 'scene') {
      return `<div class="story-copy"><small>${T(text('SCENE','场景'))}</small><h2>${T(scene.title)}</h2><p>${T(scene.intro)}</p>${scene.dialogue.length ? `<button class="primary" data-action="start-dialogue">${T(scene.actor?.label || text('Begin dialogue','开始对话'))}</button>` : `<button class="primary" data-action="begin-investigation">${T(text('Begin investigation','开始调查'))}</button>`}</div>`;
    }
    if (state.phase === 'dialogue') {
      const line = scene.dialogue[Math.min(state.dialogueIndex, scene.dialogue.length - 1)];
      return `<div class="dialogue-panel"><small>${T(text('DIALOGUE','对话'))} ${state.dialogueIndex + 1}/${scene.dialogue.length}</small><h2>${T(scene.actor?.label || scene.title)}</h2><p>${T(line)}</p><button class="primary" data-action="dialogue-next">${state.dialogueIndex + 1 >= scene.dialogue.length ? T(text('Begin investigation','开始调查')) : T(text('Continue','继续'))}</button></div>`;
    }
    if (state.phase === 'clue') {
      const clue = scene.clues.find(item => item.id === state.activeClue);
      const step = state.clueOperationStep || 0;
      const actions = [text('Expose the object','露出证物'), text('Rotate and inspect the detail','转动并检查细节')];
      const operation = step < 2
        ? `<div class="clue-operation"><div class="evidence-object step-${step}" aria-hidden="true"><span></span></div><p>${T(step === 0 ? text('Move the obstruction and expose the whole object.','移开遮挡，露出完整证物。') : text('Turn it toward the light and find the abnormal detail.','把证物转向光线，找出异常细节。'))}</p><button class="primary" data-action="operate-clue">${T(actions[step])}</button></div>`
        : `<div class="clue-reveal"><b>${T(text('Observation confirmed','观察确认'))}</b><p>${T(clue.detail)}</p></div><button class="primary" data-action="close-clue">${T(text('Record evidence','记录证物'))}</button>`;
      return `<div class="clue-panel"><small>${T(text('EVIDENCE OPERATION','证物操作'))} ${Math.min(step + 1, 3)}/3</small><h2>${T(clue.label)}</h2>${operation}</div>`;
    }
    if (state.phase === 'deduce-ready') {
      return `<div class="story-copy"><small>${T(text('EVIDENCE COMPLETE','证物齐全'))}</small><h2>${T(scene.deduction.question)}</h2><p>${T(text('Compare both observations before choosing a conclusion.','比较两处观察结果，再选择唯一成立的结论。'))}</p><button class="primary" data-action="open-deduction">${T(text('Open deduction','整理证据'))}</button></div>`;
    }
    if (state.phase === 'deduce') {
      const feedback = state.deductionFeedback ? `<p class="feedback ${state.deductionFeedback.correct ? 'correct' : 'wrong'}">${T(state.deductionFeedback.result)}</p>` : '';
      return `<div class="deduction-panel"><small>${T(text('DEDUCTION','推理'))}</small><h2>${T(scene.deduction.question)}</h2><div class="deduction-options">${scene.deduction.options.map((option, index) => `<button data-action="answer-deduction" data-index="${index}">${T(option.label)}</button>`).join('')}</div>${feedback}</div>`;
    }
    if (state.phase === 'decide') {
      return `<div class="decision-panel"><small>${T(text('DECISION','决定'))}</small><h2>${T(scene.title)}</h2><div class="decision-options">${scene.choices.map((choice, index) => { const locked = !requirementMet(state, choice); return `<button data-action="choose" data-index="${index}" ${locked ? 'disabled' : ''}><b>${T(choice.label)}</b><span>${locked ? T(text('Locked by missing evidence','缺少必要线索')) : T(choice.hint)}</span></button>`; }).join('')}</div></div>`;
    }
    if (state.phase === 'ending') {
      const ending = scene.endingText ? T(scene.endingText(state)) : T(scene.intro);
      return `<div class="ending-panel"><small>${T(text('CHAPTER RESULT','章节结算'))}</small><h2>${T(scene.title)}</h2><p>${ending}</p><div class="decision-options">${scene.choices.map((choice, index) => `<button data-action="choose" data-index="${index}"><b>${T(choice.label)}</b><span>${T(choice.hint)}</span></button>`).join('')}</div></div>`;
    }
    return '';
  }

  function storyHtml() {
    const scene = SCENES[state.node];
    const canInspect = ['investigate', 'deduce-ready'].includes(state.phase);
    return `<main class="game-screen">
      <header class="topbar"><div><small>${T(scene.chapter)}</small><h1>${T(scene.title)}</h1></div><button data-action="open-menu">${T(text('Menu','菜单'))}</button></header>
      ${resourcesHtml()}
      <section class="scene-frame" style="--scene-image:url('${scene.asset}')">
        <div class="scene-shade"></div>
        <div class="scene-stamp">${T(scene.stamp)}</div>
        ${state.phase === 'scene' && scene.actor ? `<button class="actor-hotspot" data-action="start-dialogue" style="left:${scene.actor.x}%;top:${scene.actor.y}%;width:${scene.actor.w}%;height:${scene.actor.h}%" aria-label="${T(scene.actor.label)}"><span>${T(scene.actor.label)}</span></button>` : ''}
        ${canInspect ? scene.clues.map(clue => `<button class="clue-hotspot ${state.found.includes(clue.id) ? 'found' : ''}" data-action="inspect" data-id="${clue.id}" style="left:${clue.x}%;top:${clue.y}%" aria-label="${T(clue.label)}"><span>${T(clue.label)}</span></button>`).join('') : ''}
        <div class="phase-panel">${scenePanel(scene)}</div>
        <div class="evidence-strip"><b>${T(text('Evidence','证物'))}</b>${scene.clues.length ? scene.clues.map(clue => `<span class="${state.found.includes(clue.id) ? 'found' : ''}">${state.found.includes(clue.id) ? '✓ ' : ''}${T(clue.label)}</span>`).join('') : `<span>${T(text('No investigation required','无需调查'))}</span>`}</div>
      </section>
    </main>`;
  }

  function nightHtml() {
    const n = state.night;
    if (n.finished) return `<main class="night-screen"><section class="night-card result"><small>NIGHT SHIFT</small><h1>${n.shelter > 0 ? T(text('The Light Stays On','灯还亮着')) : T(text('The Shutter Falls','卷帘门失守'))}</h1><p>${T(text('Correct decisions','正确判断'))}: ${n.correct}/${n.order.length} · ${T(text('Score','得分'))}: ${n.finalScore}</p><div class="night-rewards"><span>+${n.reward} ${T(text('Tokens','灯票'))}</span><span>+${n.correct} ${T(text('Reputation','声望'))}</span></div><button class="primary" data-action="start-night">${T(text('Another shift','再守一夜'))}</button><button data-action="open-menu">${T(text('Main menu','主菜单'))}</button></section></main>`;
    const encounter = n.order[n.index];
    const result = n.result ? `<p class="feedback ${n.result.correct ? 'correct' : 'wrong'}">${T(n.result.text)}</p>` : '';
    return `<main class="night-screen"><header class="topbar"><div><small>NIGHT SHIFT</small><h1>${T(text('Last Light Mart · Door Check','最后一盏灯 · 门前判断'))}</h1></div><button data-action="open-menu">${T(text('Menu','菜单'))}</button></header><div class="night-hud"><span>${n.index + 1}/${n.order.length}</span><span>${T(text('Shelter','店铺'))} <b>${n.shelter}</b></span><span>${T(text('Inspect','调查'))} <b>${n.focus}</b></span><span>${T(text('Food','罐头'))} <b>${n.food}</b></span><span>${T(text('Water','净水'))} <b>${n.water}</b></span><span>${T(text('Medicine','药品'))} <b>${n.med}</b></span></div><section class="night-card"><small>${T(encounter.role)}</small><h1>${T(encounter.name)}</h1><p class="claim">“${T(encounter.claim)}”</p><div class="night-clues">${n.inspected ? encounter.clues.map(clue => `<span>${T(clue)}</span>`).join('') : `<span>${T(text('Inspect to reveal two observations.','调查后显示两条观察结果。'))}</span>`}</div>${result}<div class="night-actions">${n.acted ? `<button class="primary" data-action="night-next">${T(text('Next visitor','下一位来客'))}</button>` : `<button data-action="night-inspect" ${n.inspected || n.focus <= 0 ? 'disabled' : ''}>${T(text('Inspect identity','调查身份'))}</button><button class="primary" data-action="night-decide" data-accept="1">${T(text('Accept trade','接受交易'))}</button><button data-action="night-decide" data-accept="0">${T(text('Keep door closed','拒绝开门'))}</button>`}</div></section></main>`;
  }

  function render() {
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    const next = state.screen === 'menu' ? menuHtml() : (state.mode === 'night' ? nightHtml() : storyHtml());
    const update = () => { root.innerHTML = next; };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(update);
    else update();
  }

  root.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'continue-story') dispatch({ type: 'CONTINUE_STORY' });
    else if (action === 'start-new') dispatch({ type: 'START_NEW' });
    else if (action === 'open-menu') dispatch({ type: 'OPEN_MENU' });
    else if (action === 'toggle-lang') dispatch({ type: 'SET_LANG', lang: state.lang === 'en' ? 'zh' : 'en' });
    else if (action === 'start-dialogue') dispatch({ type: 'START_DIALOGUE' });
    else if (action === 'begin-investigation') state = reduce(state, { type: 'DIALOGUE_NEXT' });
    else if (action === 'dialogue-next') dispatch({ type: 'DIALOGUE_NEXT' });
    else if (action === 'inspect') dispatch({ type: 'INSPECT', id: button.dataset.id });
    else if (action === 'operate-clue') dispatch({ type: 'OPERATE_CLUE' });
    else if (action === 'close-clue') dispatch({ type: 'CLOSE_CLUE' });
    else if (action === 'open-deduction') dispatch({ type: 'OPEN_DEDUCTION' });
    else if (action === 'answer-deduction') dispatch({ type: 'ANSWER_DEDUCTION', index: Number(button.dataset.index) });
    else if (action === 'choose') dispatch({ type: 'CHOOSE', index: Number(button.dataset.index) });
    else if (action === 'start-night') dispatch({ type: 'START_NIGHT' });
    else if (action === 'night-inspect') dispatch({ type: 'NIGHT_INSPECT' });
    else if (action === 'night-decide') dispatch({ type: 'NIGHT_DECIDE', accept: button.dataset.accept === '1' });
    else if (action === 'night-next') dispatch({ type: 'NIGHT_NEXT' });
  });

  window.LastLightV60 = {
    getState: () => clone(state),
    dispatch,
    validateContent,
    selfTest: () => runSelfTest()
  };
  persist();
  render();
}

export function runSelfTest() {
  const errors = [...validateContent()];
  let state = reduce(createInitialState('en'), { type: 'START_NEW' });
  if (state.node !== 'dawn' || state.phase !== 'scene') errors.push('new story did not enter dawn scene');
  state = reduce(state, { type: 'START_DIALOGUE' });
  const firstIndex = state.dialogueIndex;
  state = reduce(state, { type: 'DIALOGUE_NEXT' });
  if (state.dialogueIndex !== firstIndex + 1) errors.push('dialogue did not advance');
  while (state.phase === 'dialogue') state = reduce(state, { type: 'DIALOGUE_NEXT' });
  if (state.phase !== 'investigate') errors.push('dialogue did not exit to investigation');
  for (const clue of SCENES.dawn.clues) {
    state = reduce(state, { type: 'INSPECT', id: clue.id });
    state = reduce(state, { type: 'OPERATE_CLUE' });
    state = reduce(state, { type: 'OPERATE_CLUE' });
    state = reduce(state, { type: 'CLOSE_CLUE' });
  }
  if (state.phase !== 'deduce-ready') errors.push('clues did not unlock deduction');
  state = reduce(state, { type: 'OPEN_DEDUCTION' });
  const correctIndex = SCENES.dawn.deduction.options.findIndex(option => option.correct);
  state = reduce(state, { type: 'ANSWER_DEDUCTION', index: correctIndex });
  if (state.phase !== 'decide') errors.push('correct deduction did not unlock decision');
  state = reduce(state, { type: 'CHOOSE', index: 0 });
  if (state.node !== 'alley' || state.phase !== 'scene') errors.push('choice did not transition to next scene');
  state = reduce(state, { type: 'START_DIALOGUE' });
  state = reduce(state, { type: 'START_NEW' });
  if (state.node !== 'dawn' || state.phase !== 'scene' || state.dialogueIndex !== 0) errors.push('new story retained stale dialogue state');
  return { ok: errors.length === 0, errors, scenes: Object.keys(SCENES).length, encounters: NIGHT_ENCOUNTERS.length };
}

if (typeof document !== 'undefined') mount();
