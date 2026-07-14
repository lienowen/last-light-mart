const customers=[
 {name:'林晓',role:'受伤的护士',face:'assets/nurse.webp',text:'“诊所还有两个孩子，我只要一瓶水。”',need:'water',price:10,safe:true,clues:['袖口有新鲜血迹','胸牌信息吻合'],truth:'她救活了避难所的孩子。'},
 {name:'老周',role:'疲惫的修理工',face:'assets/repairman.webp',text:'“给我罐头，我今晚能把你的卷帘门修好。”',need:'food',price:8,safe:true,clues:['工具箱磨损严重','认识发电机型号'],truth:'他兑现承诺，加固了店铺。',bonus:'wall'},
 {name:'无名旅客',role:'神情闪躲',face:'assets/infected.webp',text:'“药……快给我药，我只是被铁丝划了。”',need:'med',price:24,safe:false,clues:['伤口边缘发黑','瞳孔对光无反应'],truth:'他已经感染，闯入时破坏了店铺。'},
 {name:'阿梨',role:'独行女孩',face:'assets/girl.webp',text:'“我没钱，用这张地图换一个罐头。”',need:'food',price:0,safe:true,clues:['地图标注了仓库','背包里没有武器'],truth:'地图是真的，你找到了补给。',bonus:'stock'},
 {name:'灰帽',role:'流浪商人',face:'assets/trader.webp',text:'“高价买水，别问我带着什么。”',need:'water',price:28,safe:false,clues:['腰间藏着撬棍','门外还有脚印'],truth:'这是劫匪的探子，拒绝才安全。'}
];
let s={day:1,coins:60,hp:3,shelter:40,trust:0,food:4,water:4,med:2,i:0,acted:false,served:0};
const $=id=>document.getElementById(id); const stock={food:'food',water:'water',med:'med'};
function draw(){['day','coins','hp','shelter','trust','food','water','med'].forEach(k=>$(k).textContent=s[k]);$('progress').textContent=`顾客 ${Math.min(s.i+1,5)} / 5`;let c=customers[(s.i+s.day-1)%customers.length];$('name').textContent=c.name;$('role').textContent=c.role;$('dialog').textContent=c.text;$('person').src=c.face;$('person').alt=c.name;$('clues').innerHTML='<span>表面观察：信息不足</span>';$('risk').textContent='风险 ?';$('result').textContent='';s.acted=false}
function inspect(){if(s.acted||s.coins<2)return;s.coins-=2;let c=customers[(s.i+s.day-1)%customers.length];$('clues').innerHTML=c.clues.map(x=>`<span>${x}</span>`).join('');$('risk').textContent=c.safe?'风险 低':'风险 高';$('risk').style.color=c.safe?'#8fd694':'#ff6f51';$('coins').textContent=s.coins}
function decide(sell){if(s.acted)return;let c=customers[(s.i+s.day-1)%customers.length],msg='';s.acted=true;if(sell){if(s[c.need]<=0){s.acted=false;$('result').textContent='库存不足，无法成交';return}s[c.need]--;s.coins+=c.price;if(c.safe){s.trust+=2;msg='判断正确！'+c.truth;if(c.bonus==='wall')s.shelter+=10;if(c.bonus==='stock'){s.food+=2;s.water+=2}}else{s.hp--;s.shelter-=12;msg='危险！'+c.truth}}else{if(c.safe){s.trust=Math.max(0,s.trust-1);msg='你拒绝了他。'+c.truth}else{s.trust++;msg='判断正确！'+c.truth}}$('result').textContent=msg;update();setTimeout(next,1300)}
function update(){['coins','hp','shelter','trust','food','water','med'].forEach(k=>$(k).textContent=s[k])}
function next(){s.i++;s.served++;if(s.hp<=0||s.shelter<=0)return gameover();if(s.i>=5)return night();draw()}
function night(){$('game').classList.add('hidden');$('night').classList.remove('hidden');$('phase').textContent='闭店';$('summary').textContent=`今天接待了 ${s.served} 位客人。风暴使店铺耐久 -5。`;s.shelter-=5;update();if(s.shelter<=0)gameover()}
function buy(type){let cost={stock:12,wall:15,heal:20}[type];if(s.coins<cost)return;s.coins-=cost;if(type==='stock'){s.food+=2;s.water+=2;s.med++}if(type==='wall')s.shelter+=15;if(type==='heal')s.hp=Math.min(3,s.hp+1);update()}
function newDay(){s.day++;s.i=0;s.served=0;$('night').classList.add('hidden');$('game').classList.remove('hidden');$('phase').textContent='营业中';draw()}
function gameover(){$('night').classList.add('hidden');$('game').classList.remove('hidden');$('game').innerHTML=`<div style="text-align:center;padding:70px 10px"><h2>灯熄灭了</h2><p style="margin:18px">你坚持了 ${s.day} 天，获得 ${s.trust} 点信任。</p><button class="primary wide" onclick="location.reload()">再守一次</button></div>`}
$('inspect').onclick=inspect;$('sell').onclick=()=>decide(true);$('refuse').onclick=()=>decide(false);$('nextDay').onclick=newDay;$('reset').onclick=()=>location.reload();document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.buy));draw();
