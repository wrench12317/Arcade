'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const SAVE_KEY='cookie_clicker_final_raullyon_v3';
const BUILDINGS=[
{id:'cursor',name:'Curseur',icon:'🖱️',baseCost:15,baseCps:.1,desc:'Clique automatiquement.'},
{id:'grandma',name:'Grand-mère',icon:'👵',baseCost:100,baseCps:1,desc:'Fait des cookies avec amour.'},
{id:'farm',name:'Ferme',icon:'🏡',baseCost:1100,baseCps:8,desc:'Cultive des cookies.'},
{id:'mine',name:'Mine',icon:'⛏️',baseCost:12000,baseCps:47,desc:'Extrait des pépites de cookie.'},
{id:'factory',name:'Usine',icon:'🏭',baseCost:130000,baseCps:260,desc:'Produit en masse.'},
{id:'bank',name:'Banque',icon:'🏛️',baseCost:1400000,baseCps:1400,desc:'Investit dans les cookies.'},
{id:'temple',name:'Temple',icon:'🛕',baseCost:20000000,baseCps:7800,desc:'Bénédiction sacrée.'},
{id:'wizard',name:'Tour de sorcier',icon:'🧙‍♂️',baseCost:330000000,baseCps:44000,desc:'Magie biscuitée.'},
{id:'shipment',name:'Expédition',icon:'🚀',baseCost:5100000000,baseCps:260000,desc:'Cookies depuis l’espace.'},
{id:'lab',name:'Laboratoire',icon:'🧪',baseCost:75000000000,baseCps:1600000,desc:'Science du cookie.'}
];
const UPGRADES=[
{id:'mouse1',icon:'🖱️',name:'Meilleure souris',cost:100,desc:'+1 par clic',unlock:g=>g.totalClicks>=10,effect:g=>g.cpc+=1},
{id:'mouse2',icon:'👆',name:'Doigt renforcé',cost:500,desc:'+2 par clic',unlock:g=>g.totalClicks>=35,effect:g=>g.cpc+=2},
{id:'mouse3',icon:'🖱️',name:'Souris dorée',cost:2500,desc:'Clics x2',unlock:g=>g.totalClicks>=100,effect:g=>g.cpc*=2},
{id:'clickstorm',icon:'⚡',name:'Double clic',cost:10000,desc:'+10 par clic',unlock:g=>g.totalClicks>=250,effect:g=>g.cpc+=10},
{id:'cookie1',icon:'🍪',name:'Cookie moelleux',cost:25000,desc:'Clics x2',unlock:g=>g.totalBaked>=10000,effect:g=>g.cpc*=2},
{id:'grandma1',icon:'👵',name:'Lunettes de mamie',cost:1000,desc:'Grand-mères x2',unlock:g=>g.buildings.grandma.count>=1,effect:g=>g.buildings.grandma.mult*=2},
{id:'grandma2',icon:'🍪',name:'Recette familiale',cost:15000,desc:'Grand-mères x2',unlock:g=>g.buildings.grandma.count>=5,effect:g=>g.buildings.grandma.mult*=2},
{id:'wizard1',icon:'🧙‍♂️',name:'Grimoire sucré',cost:500000000,desc:'Sorcier x2',unlock:g=>g.buildings.wizard.count>=1,effect:g=>g.buildings.wizard.mult*=2},
{id:'chef1',icon:'👨‍🍳',name:'Chef pâtissier',cost:75000,desc:'Toutes productions +10%',unlock:g=>g.totalBaked>=50000,effect:g=>allMult(g,1.1)},
{id:'roller',icon:'🥖',name:'Rouleau magique',cost:120000,desc:'+50 par clic',unlock:g=>g.totalClicks>=500,effect:g=>g.cpc+=50},
{id:'farm1',icon:'🌟',name:'Engrais étoilé',cost:12000,desc:'Fermes x2',unlock:g=>g.buildings.farm.count>=3,effect:g=>g.buildings.farm.mult*=2},
{id:'potion',icon:'🧪',name:'Potion levante',cost:200000,desc:'Fermes et mines x2',unlock:g=>g.buildings.farm.count>=8,effect:g=>{g.buildings.farm.mult*=2;g.buildings.mine.mult*=2}},
{id:'mine1',icon:'⛏️',name:'Pioche sucrée',cost:200000,desc:'Mines x2',unlock:g=>g.buildings.mine.count>=3,effect:g=>g.buildings.mine.mult*=2},
{id:'rocket1',icon:'🚀',name:'Fusée cookie',cost:7500000000,desc:'Expéditions x2',unlock:g=>g.buildings.shipment.count>=1,effect:g=>g.buildings.shipment.mult*=2},
{id:'bomb',icon:'💣',name:'Bombe caramel',cost:1000000,desc:'Mines x3',unlock:g=>g.buildings.mine.count>=8,effect:g=>g.buildings.mine.mult*=3},
{id:'book',icon:'📕',name:'Manuel industriel',cost:2500000,desc:'Usines x2',unlock:g=>g.buildings.factory.count>=2,effect:g=>g.buildings.factory.mult*=2},
{id:'bank1',icon:'🏛️',name:'Intérêts composés',cost:15000000,desc:'Banques x2',unlock:g=>g.buildings.bank.count>=1,effect:g=>g.buildings.bank.mult*=2},
{id:'gear',icon:'⚙️',name:'Rouages huilés',cost:5000000,desc:'Usines x2',unlock:g=>g.buildings.factory.count>=5,effect:g=>g.buildings.factory.mult*=2},
{id:'hourglass',icon:'⏳',name:'Temps de cuisson',cost:50000000,desc:'Production globale +25%',unlock:g=>g.totalBaked>=25000000,effect:g=>allMult(g,1.25)},
{id:'clover',icon:'☘️',name:'Chance du pâtissier',cost:100000000,desc:'Clics x3',unlock:g=>g.totalBaked>=50000000,effect:g=>g.cpc*=3},
{id:'egg',icon:'🥚',name:'Œuf doré',cost:500000000,desc:'Production globale +50%',unlock:g=>g.totalBaked>=250000000,effect:g=>allMult(g,1.5)},
{id:'gift',icon:'🎁',name:'Cadeau sucré',cost:1000000000,desc:'+1 heure de production',unlock:g=>g.cps>=10000,effect:g=>{g.cookies+=g.cps*3600;g.totalBaked+=g.cps*3600}},
{id:'cookie2',icon:'🍪',name:'Cookie légendaire',cost:5000000000,desc:'Clics x5',unlock:g=>g.totalBaked>=1000000000,effect:g=>g.cpc*=5},
{id:'cat',icon:'😺',name:'Chat pâtissier',cost:10000000000,desc:'Production globale +100%',unlock:g=>g.totalBaked>=2000000000,effect:g=>allMult(g,2)},
{id:'planet',icon:'🪐',name:'Planète cookie',cost:50000000000,desc:'Expéditions et labos x3',unlock:g=>g.buildings.lab.count>=1,effect:g=>{g.buildings.shipment.mult*=3;g.buildings.lab.mult*=3}}
];
const ACH=[
{id:'a1',icon:'🍪',name:'Premier cookie',desc:'Cuire 1 cookie',done:g=>g.totalBaked>=1},
{id:'a2',icon:'🖱️',name:'Cliqueur',desc:'Faire 100 clics',done:g=>g.totalClicks>=100},
{id:'a3',icon:'💰',name:'Millionnaire',desc:'Cuire 1 million cookies',done:g=>g.totalBaked>=1e6},
{id:'a4',icon:'💯',name:'Centenaire',desc:'Cuire 100 cookies',done:g=>g.totalBaked>=100},
{id:'a5',icon:'👑',name:'Baron du cookie',desc:'Cuire 1 milliard cookies',done:g=>g.totalBaked>=1e9},
{id:'a6',icon:'🏭',name:'Industriel',desc:'Avoir 1 usine',done:g=>g.buildings.factory.count>=1}
];
const NEWS=['La bourse du biscuit explose.','Des grand-mères réclament une prime chocolat.','Un cookie géant aperçu à Los Santos.','La production industrielle bat un record.','Les sorciers transforment la farine en or.'];
const base=()=>({cookies:0,totalBaked:0,totalClicks:0,cpc:1,cps:0,playTime:0,lastSave:Date.now(),buyMode:'1',clickVolume:.35,buildings:Object.fromEntries(BUILDINGS.map(b=>[b.id,{count:0,mult:1}])),upgrades:{},achievements:{},lastFrame:0,lastUi:0,dirtyShop:true,dirtyAch:true});
let game=base(),audioCtx;
function allMult(g,m){for(const b of BUILDINGS)g.buildings[b.id].mult*=m}
function ctx(){audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();return audioCtx}
function beep(freq=900,dur=.04,vol=.08){try{const c=ctx(),o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='square';o.frequency.setValueAtTime(freq,c.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.55,c.currentTime+dur);f.type='highpass';f.frequency.value=350;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(vol*game.clickVolume,c.currentTime+.004);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dur);o.connect(f);f.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+dur)}catch(e){}}
function fmt(n){n=Math.max(0,Number(n)||0);if(n<1000)return Math.floor(n).toString();const u=['','k','M','B','T','Qa','Qi','Sx','Sp','Oc'];let i=0;while(n>=1000&&i<u.length-1){n/=1000;i++}return n.toFixed(2)+' '+u[i]}
function time(s){s=Math.floor(s);let h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}h ${m}m`:m?`${m}m ${x}s`:`${x}s`}
function bCost(b,c=game.buildings[b.id].count){return Math.ceil(b.baseCost*Math.pow(1.15,c))}
function costFor(b,n){let t=0,c=game.buildings[b.id].count;for(let i=0;i<n;i++)t+=bCost(b,c+i);return t}
function maxAff(b){let n=0,t=0,c=game.buildings[b.id].count;while(n<10000){let nx=bCost(b,c+n);if(t+nx>game.cookies)break;t+=nx;n++}return{n,total:t}}
function recalc(){game.cps=BUILDINGS.reduce((s,b)=>s+game.buildings[b.id].count*b.baseCps*game.buildings[b.id].mult,0)}
function log(m){let d=document.createElement('div');d.textContent='• '+m;$('#log').prepend(d);while($('#log').children.length>35)$('#log').lastChild.remove()}
function toast(m){let t=document.createElement('div');t.className='toast';t.textContent=m;$('#toastLayer').appendChild(t);setTimeout(()=>t.remove(),2400)}
function floating(x,y,text){let f=document.createElement('div');f.className='floating';f.textContent=text;f.style.left=x+'px';f.style.top=y+'px';$('#floatLayer').appendChild(f);setTimeout(()=>f.remove(),900)}
function clickCookie(e){game.cookies+=game.cpc;game.totalBaked+=game.cpc;game.totalClicks++;game.dirtyShop=true;beep(950,.045,.12);floating(e.clientX-15,e.clientY-20,'+'+fmt(game.cpc));checkAch()}
function buyBuilding(id){let b=BUILDINGS.find(x=>x.id===id);let qty=game.buyMode==='max'?maxAff(b).n:Number(game.buyMode);if(!qty)return;let price=game.buyMode==='max'?maxAff(b).total:costFor(b,qty);if(price<=0||price>game.cookies)return;game.cookies=Math.max(0,game.cookies-price);game.buildings[id].count+=qty;recalc();game.dirtyShop=true;beep(300,.06,.1);log(`Acheté ${qty} x ${b.name}`);checkAch()}
function buyUpgrade(id){let u=UPGRADES.find(x=>x.id===id);if(!u||game.upgrades[id]||!u.unlock(game)||game.cookies<u.cost)return;game.cookies=Math.max(0,game.cookies-u.cost);game.upgrades[id]=true;u.effect(game);recalc();game.dirtyShop=true;game.dirtyAch=true;beep(1100,.07,.12);toast('⭐ '+u.name);log('Amélioration : '+u.name)}
function checkAch(){let ch=false;for(const a of ACH){if(!game.achievements[a.id]&&a.done(game)){game.achievements[a.id]=true;ch=true;toast('🏆 '+a.name);log('Succès débloqué : '+a.name)}}if(ch)game.dirtyAch=true}
function tip(el,html){const d=document.createElement('div');d.className='tooltip';d.innerHTML=html;el.appendChild(d);el.onmousemove=e=>{d.style.left=Math.min(e.clientX+16,innerWidth-340)+'px';d.style.top=Math.min(e.clientY+16,innerHeight-180)+'px'}}
function renderShop(){const shop=$('#shop');shop.innerHTML='';for(const b of BUILDINGS){let qty=game.buyMode==='max'?maxAff(b).n:Number(game.buyMode);let price=game.buyMode==='max'?maxAff(b).total:costFor(b,qty);let owned=game.buildings[b.id].count,each=b.baseCps*game.buildings[b.id].mult,total=owned*each;let div=document.createElement('div');div.className='building '+(price&&game.cookies>=price?'affordable':'disabled');div.onclick=()=>buyBuilding(b.id);div.innerHTML=`<div class="b-icon">${b.icon}</div><div><div class="b-name">${b.name}</div><div class="b-desc">${b.desc}</div><div class="b-prod">+${fmt(each)}/s chacun</div></div><div class="b-owned">${owned}</div><div class="b-price">${fmt(price||bCost(b))}</div>`;tip(div,`<div class="tip-title">${b.icon} ${b.name}</div><div>${b.desc}</div><div>Possédés : <b>${owned}</b></div><div>Production unité : <b>${fmt(each)}/s</b></div><div>Production totale : <b>${fmt(total)}/s</b></div><div class="tip-cost">Coût : ${fmt(price||bCost(b))} cookies</div>`);shop.appendChild(div)}game.dirtyShop=false}
function renderUpgrades(){const g=$('#upgradeGrid');g.innerHTML='';for(const u of UPGRADES){let unlocked=u.unlock(game)||game.upgrades[u.id];let afford=unlocked&&!game.upgrades[u.id]&&game.cookies>=u.cost;let d=document.createElement('button');d.className='upgrade-tile '+(unlocked?'unlocked ':'')+(afford?'affordable ':'')+(game.upgrades[u.id]?'bought':'');d.innerHTML=u.icon;d.onclick=()=>buyUpgrade(u.id);tip(d,`<div class="tip-title">${u.icon} ${u.name}</div><div>${u.desc}</div><div class="tip-cost">${fmt(u.cost)} cookies</div>${game.upgrades[u.id]?'<div>✅ Achetée</div>':''}`);g.appendChild(d)}}
function renderOwned(){const g=$('#ownedGrid');g.innerHTML='';for(const b of BUILDINGS.filter(x=>game.buildings[x.id].count>0)){let d=document.createElement('div');d.className='owned-item';d.innerHTML=`${b.icon}<span>${game.buildings[b.id].count}</span>`;g.appendChild(d)}if(!g.children.length)g.innerHTML='<small>Aucun item acheté</small>'}
function renderAch(){const box=$('#achievements');box.innerHTML='';for(const a of ACH){let ok=!!game.achievements[a.id],d=document.createElement('div');d.className='achievement '+(ok?'':'locked');d.innerHTML=`<div class="title">${ok?'✅':'🔒'} ${a.icon} ${a.name}</div><div class="desc">${a.desc}</div>`;box.appendChild(d)}game.dirtyAch=false}
function updateUI(){game.cookies=Math.max(0,game.cookies);$('#cookieCount').textContent=fmt(game.cookies);$('#cps').textContent=fmt(game.cps)+' / seconde';$('#cpc').textContent='+'+fmt(game.cpc)+' / clic';$('#totalBaked').textContent=fmt(game.totalBaked);$('#totalClicks').textContent=fmt(game.totalClicks);$('#playTime').textContent=time(game.playTime);$('#achCount').textContent=Object.values(game.achievements).filter(Boolean).length+'/'+ACH.length;$('#prodTotal').textContent=fmt(game.cps)+' cookies / seconde';$('#clickBonus').textContent='Bonus de clic : +'+fmt(game.cpc)+' / clic';if(game.dirtyShop){renderShop();renderUpgrades();renderOwned()}if(game.dirtyAch)renderAch()}
function clean(){game.cookies=Math.max(0,Number(game.cookies)||0);game.totalBaked=Math.max(0,Number(game.totalBaked)||0);game.cpc=Math.max(1,Number(game.cpc)||1);for(const b of BUILDINGS)game.buildings[b.id]||={count:0,mult:1};game.upgrades||={};game.achievements||={};recalc()}
function save(){clean();game.lastSave=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(game));$('#saveStatus').textContent='🇺🇸 Sauvegardé';setTimeout(()=>$('#saveStatus').textContent='🇺🇸 Sauvegarde locale',1000)}
function load(){let raw=localStorage.getItem(SAVE_KEY);if(!raw)return;try{let data=JSON.parse(raw);game={...base(),...data,buildings:{...base().buildings,...(data.buildings||{})},upgrades:data.upgrades||{},achievements:data.achievements||{}};clean();let off=Math.min(28800,Math.floor((Date.now()-(game.lastSave||Date.now()))/1000));if(off>10&&game.cps>0){let gain=off*game.cps;game.cookies+=gain;game.totalBaked+=gain;toast('⏱️ Hors ligne : +'+fmt(gain))}}catch(e){console.error(e);localStorage.removeItem(SAVE_KEY);game=base()}}
function exportSave(){save();navigator.clipboard.writeText(btoa(unescape(encodeURIComponent(JSON.stringify(game)))));toast('Sauvegarde copiée')}
function importSave(){let code=prompt('Colle ta sauvegarde :');if(!code)return;try{let data=JSON.parse(decodeURIComponent(escape(atob(code))));game={...base(),...data};clean();save();location.reload()}catch(e){toast('Sauvegarde invalide')}}
function reset(){if(confirm('Reset toute la progression ?')){localStorage.removeItem(SAVE_KEY);location.reload()}}
function loop(ts){if(!game.lastFrame)game.lastFrame=ts;let dt=Math.min(.1,(ts-game.lastFrame)/1000);game.lastFrame=ts;game.playTime+=dt;let gain=game.cps*dt;game.cookies+=gain;game.totalBaked+=gain;if(ts-game.lastUi>100){updateUI();game.lastUi=ts}requestAnimationFrame(loop)}
function init(){load();$('#cookieBtn').onclick=clickCookie;$('#volume').value=Math.round(game.clickVolume*100);$('#volume').oninput=e=>game.clickVolume=e.target.value/100;$$('.mode').forEach(b=>b.onclick=()=>{$$('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');game.buyMode=b.dataset.mode;game.dirtyShop=true});$('#exportBtn').onclick=exportSave;$('#importBtn').onclick=importSave;$('#resetBtn').onclick=reset;recalc();renderShop();renderUpgrades();renderOwned();renderAch();updateUI();setInterval(save,10000);setInterval(()=>$('#newsText').textContent=NEWS[Math.floor(Math.random()*NEWS.length)]+' •',12000);log('Partie chargée');requestAnimationFrame(loop)}
window.addEventListener('load',init);
