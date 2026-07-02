'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const SAVE='cookie_clicker_stable_v5';
const BUILDINGS=[
{id:'cursor',name:'Curseur',icon:'🖱️',baseCost:15,baseCps:.1,desc:'Clique automatiquement.'},
{id:'grandma',name:'Grand-mère',icon:'👵',baseCost:100,baseCps:1,desc:'Fait des cookies avec amour.'},
{id:'farm',name:'Ferme',icon:'🏡',baseCost:1100,baseCps:8,desc:'Cultive des cookies.'},
{id:'mine',name:'Mine',icon:'⛏️',baseCost:12000,baseCps:47,desc:'Extrait des pépites de cookie.'},
{id:'factory',name:'Usine',icon:'🏭',baseCost:130000,baseCps:260,desc:'Produit en masse.'},
{id:'bank',name:'Banque',icon:'🏛️',baseCost:1400000,baseCps:1400,desc:'Investit dans les cookies.'},
{id:'temple',name:'Temple',icon:'🛕',baseCost:20000000,baseCps:7800,desc:'Bénédiction sacrée.'},
{id:'wizard',name:'Tour de sorcier',icon:'🧙',baseCost:330000000,baseCps:44000,desc:'Magie biscuitée.'},
{id:'shipment',name:'Expédition',icon:'🚀',baseCost:5100000000,baseCps:260000,desc:'Cookies depuis l’espace.'},
{id:'lab',name:'Laboratoire',icon:'🧪',baseCost:75000000000,baseCps:1600000,desc:'Science du cookie.'}
];
const UPGRADES=[
{id:'u1',name:'Meilleure souris',icon:'🖱️',cost:100,desc:'+1 par clic',unlock:g=>g.totalClicks>=10,effect:g=>g.cpc+=1},
{id:'u2',name:'Doigt doré',icon:'👆',cost:500,desc:'+2 par clic',unlock:g=>g.totalClicks>=35,effect:g=>g.cpc+=2},
{id:'u3',name:'Double clic',icon:'⚡',cost:5000,desc:'Clics x2',unlock:g=>g.totalClicks>=100,effect:g=>g.cpc*=2},
{id:'u4',name:'Cookie renforcé',icon:'🍪',cost:12000,desc:'+10 par clic',unlock:g=>g.totalBaked>=5000,effect:g=>g.cpc+=10},
{id:'u5',name:'Mamie experte',icon:'👵',cost:1500,desc:'Grand-mères x2',unlock:g=>g.buildings.grandma.count>=1,effect:g=>g.buildings.grandma.mult*=2},
{id:'u6',name:'Plateau de cookies',icon:'🍪',cost:15000,desc:'Curseurs x2',unlock:g=>g.buildings.cursor.count>=10,effect:g=>g.buildings.cursor.mult*=2},
{id:'u7',name:'Chapeau magique',icon:'🧙',cost:50000,desc:'+50 par clic',unlock:g=>g.totalClicks>=250,effect:g=>g.cpc+=50},
{id:'u8',name:'Chef pâtissier',icon:'👨‍🍳',cost:90000,desc:'Grand-mères x3',unlock:g=>g.buildings.grandma.count>=10,effect:g=>g.buildings.grandma.mult*=3},
{id:'u9',name:'Rouleau magique',icon:'🥖',cost:120000,desc:'+50 par clic',unlock:g=>g.totalBaked>=50000,effect:g=>g.cpc+=50},
{id:'u10',name:'Étoile sucrée',icon:'🌟',cost:250000,desc:'Fermes x2',unlock:g=>g.buildings.farm.count>=3,effect:g=>g.buildings.farm.mult*=2},
{id:'u11',name:'Potion de levure',icon:'🧪',cost:550000,desc:'Mines x2',unlock:g=>g.buildings.mine.count>=2,effect:g=>g.buildings.mine.mult*=2},
{id:'u12',name:'Pioche dorée',icon:'⛏️',cost:900000,desc:'Mines x3',unlock:g=>g.buildings.mine.count>=5,effect:g=>g.buildings.mine.mult*=3},
{id:'u13',name:'Fusée biscuit',icon:'🚀',cost:2500000,desc:'Expéditions x2',unlock:g=>g.buildings.shipment.count>=1,effect:g=>g.buildings.shipment.mult*=2},
{id:'u14',name:'Bombe chocolat',icon:'💣',cost:4000000,desc:'Usines x2',unlock:g=>g.buildings.factory.count>=3,effect:g=>g.buildings.factory.mult*=2},
{id:'u15',name:'Livre ancien',icon:'📕',cost:9000000,desc:'Temples x2',unlock:g=>g.buildings.temple.count>=1,effect:g=>g.buildings.temple.mult*=2},
{id:'u16',name:'Banque dorée',icon:'🏛️',cost:18000000,desc:'Banques x2',unlock:g=>g.buildings.bank.count>=3,effect:g=>g.buildings.bank.mult*=2},
{id:'u17',name:'Engrenage parfait',icon:'⚙️',cost:50000000,desc:'Usines x3',unlock:g=>g.buildings.factory.count>=8,effect:g=>g.buildings.factory.mult*=3},
{id:'u18',name:'Sablier',icon:'⌛',cost:120000000,desc:'Tous les items x1.5',unlock:g=>g.totalBaked>=100000000,effect:g=>BUILDINGS.forEach(b=>g.buildings[b.id].mult*=1.5)},
{id:'u19',name:'Trèfle',icon:'☘️',cost:350000000,desc:'+1000 par clic',unlock:g=>g.totalBaked>=250000000,effect:g=>g.cpc+=1000},
{id:'u20',name:'Œuf doré',icon:'🥚',cost:1000000000,desc:'Laboratoires x2',unlock:g=>g.buildings.lab.count>=1,effect:g=>g.buildings.lab.mult*=2},
{id:'u21',name:'Cadeau sucré',icon:'🎁',cost:15000000000,desc:'Tous les items x2',unlock:g=>g.totalBaked>=10000000000,effect:g=>BUILDINGS.forEach(b=>g.buildings[b.id].mult*=2)},
{id:'u22',name:'Chat porte-bonheur',icon:'🐱',cost:70000000000,desc:'+10000 par clic',unlock:g=>g.totalBaked>=50000000000,effect:g=>g.cpc+=10000},
{id:'u23',name:'Anneau cosmique',icon:'🪐',cost:150000000000,desc:'Tours sorciers x3',unlock:g=>g.buildings.wizard.count>=5,effect:g=>g.buildings.wizard.mult*=3}
];
const ACH=[
{id:'a1',icon:'🍪',name:'Premier cookie',desc:'Cuire 1 cookie',done:g=>g.totalBaked>=1},
{id:'a2',icon:'💯',name:'Centenaire',desc:'Cuire 100 cookies',done:g=>g.totalBaked>=100},
{id:'a3',icon:'🖱️',name:'Cliqueur',desc:'Faire 100 clics',done:g=>g.totalClicks>=100},
{id:'a4',icon:'🏭',name:'Industriel',desc:'Avoir 1 usine',done:g=>g.buildings.factory.count>=1},
{id:'a5',icon:'💰',name:'Millionnaire',desc:'Cuire 1 million',done:g=>g.totalBaked>=1e6},
{id:'a6',icon:'👑',name:'Baron du cookie',desc:'Cuire 1 milliard',done:g=>g.totalBaked>=1e9}
];
const NEWS=['Les sorciers transforment la farine en or.','La bourse du biscuit explose.','Des grand-mères réclament plus de sucre.','Un cookie géant aperçu au-dessus de Los Santos.'];
function blank(){return{cookies:0,totalBaked:0,totalClicks:0,cpc:1,cps:0,playTime:0,lastSave:Date.now(),buyMode:'1',clickVolume:.35,buildings:Object.fromEntries(BUILDINGS.map(b=>[b.id,{count:0,mult:1}])),upgrades:{},achievements:{},lastFrame:0,lastUi:0,lastShopRefresh:0,needShop:true,needAch:true}}
let game=blank(),audioCtx=null;
function safe(v){return Math.max(0,Number(v)||0)}
function ctx(){return audioCtx||(audioCtx=new(window.AudioContext||window.webkitAudioContext)())}
function clickSound(){try{const c=ctx(),v=Math.max(0,Math.min(1,Number(game.clickVolume)||.35)),o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='square';o.frequency.setValueAtTime(950,c.currentTime);o.frequency.exponentialRampToValueAtTime(520,c.currentTime+.035);f.type='highpass';f.frequency.value=350;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.08*v,c.currentTime+.004);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.045);o.connect(f);f.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.05)}catch(e){}}
function fmt(n){n=safe(n);if(n<1000)return Math.floor(n).toString();let u=['','k','M','B','T','Qa','Qi','Sx','Sp'],i=0;while(n>=1000&&i<u.length-1){n/=1000;i++}return n.toFixed(2)+' '+u[i]}
function tm(s){s=Math.floor(safe(s));let h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h?`${h}h ${m}m`:m?`${m}m ${s%60}s`:`${s}s`}
function bcost(b,c=game.buildings[b.id].count){return Math.ceil(b.baseCost*Math.pow(1.15,safe(c)))}
function costFor(b,n){let t=0,c=game.buildings[b.id].count;n=Math.max(0,Math.floor(n));for(let i=0;i<n;i++)t+=bcost(b,c+i);return t}
function maxBuy(b){let n=0,t=0,c=game.buildings[b.id].count;while(n<1000){let p=bcost(b,c+n);if(t+p>game.cookies)break;t+=p;n++}return{n,total:t}}
function recalc(){game.cps=BUILDINGS.reduce((s,b)=>s+safe(game.buildings[b.id].count)*b.baseCps*(Number(game.buildings[b.id].mult)||1),0)}
function log(m){let d=document.createElement('div');d.className='logLine';d.textContent='• '+m;$('#log').prepend(d);while($('#log').children.length>12)$('#log').lastChild.remove()}
function float(x,y,t){let f=document.createElement('div');f.className='floating';f.style.left=x+'px';f.style.top=y+'px';f.textContent=t;$('#floatLayer').appendChild(f);setTimeout(()=>f.remove(),850)}
function toast(m){let t=document.createElement('div');t.className='toast';t.textContent=m;$('#toastLayer').appendChild(t);setTimeout(()=>t.remove(),2300)}
function showTip(html,e){let t=$('#globalTooltip');t.innerHTML=html;t.style.display='block';moveTip(e)}
function moveTip(e){let t=$('#globalTooltip');if(t.style.display!=='block')return;let x=e.clientX+14,y=e.clientY+14;let r=t.getBoundingClientRect();if(x+r.width>innerWidth-8)x=e.clientX-r.width-14;if(y+r.height>innerHeight-8)y=e.clientY-r.height-14;t.style.left=Math.max(8,x)+'px';t.style.top=Math.max(8,y)+'px'}
function hideTip(){let t=$('#globalTooltip');t.style.display='none';t.innerHTML=''}
function addTip(el,html){el.onmouseenter=e=>showTip(html,e);el.onmousemove=moveTip;el.onmouseleave=hideTip}
function clickCookie(e){game.cookies+=game.cpc;game.totalBaked+=game.cpc;game.totalClicks++;game.needShop=true;clickSound();float(e.clientX-15,e.clientY-20,'+'+fmt(game.cpc));checkAch()}
function buyBuilding(id){let b=BUILDINGS.find(x=>x.id===id);if(!b)return;let q=game.buyMode==='max'?maxBuy(b).n:Number(game.buyMode);if(!q)return;let p=game.buyMode==='max'?maxBuy(b).total:costFor(b,q);if(!p||p>game.cookies)return;game.cookies=Math.max(0,game.cookies-p);game.buildings[id].count+=q;recalc();game.needShop=true;clickSound();log(`Acheté ${q} x ${b.name}`);checkAch();updateAll(true)}
function buyUpgrade(id){let u=UPGRADES.find(x=>x.id===id);if(!u||game.upgrades[id]||!u.unlock(game)||game.cookies<u.cost)return;game.cookies=Math.max(0,game.cookies-u.cost);game.upgrades[id]=true;u.effect(game);recalc();game.needShop=true;clickSound();toast('⭐ '+u.name);log('Amélioration : '+u.name);checkAch();updateAll(true)}
function checkAch(){let changed=false;for(const a of ACH){if(!game.achievements[a.id]&&a.done(game)){game.achievements[a.id]=true;changed=true;toast('🏆 '+a.name);log('Succès : '+a.name)}}if(changed)game.needAch=true}
function renderUpgrades(){let grid=$('#upgradeGrid');grid.innerHTML='';let unlocked=UPGRADES.filter(u=>u.unlock(game));for(const u of unlocked){let d=document.createElement('div');d.className='upgrade '+(game.upgrades[u.id]?'bought':game.cookies>=u.cost?'available':'');d.textContent=u.icon;d.onclick=()=>buyUpgrade(u.id);addTip(d,`<b>${u.icon} ${u.name}</b><br>${u.desc}<br><span style="color:#70ff70">${fmt(u.cost)} cookies</span>`);grid.appendChild(d)}}
function renderOwned(){let owned=BUILDINGS.filter(b=>game.buildings[b.id].count>0);$('#ownedItems').innerHTML=owned.length?owned.map(b=>`<span class="ownedRow">${b.icon} ${game.buildings[b.id].count}</span>`).join(''):'Aucun item acheté'}
function renderShop(){let s=$('#shopList');s.innerHTML='';for(const b of BUILDINGS){let q=game.buyMode==='max'?maxBuy(b).n:Number(game.buyMode),price=game.buyMode==='max'?maxBuy(b).total:costFor(b,q),count=game.buildings[b.id].count,each=b.baseCps*(game.buildings[b.id].mult||1),total=each*count,d=document.createElement('div');d.className='shopItem '+(price&&game.cookies>=price?'affordable':'disabled');d.onclick=()=>buyBuilding(b.id);d.innerHTML=`<div class="sicon">${b.icon}</div><div><div class="sname">${b.name}</div><div class="sdesc">${b.desc}<br>+${fmt(each)}/s chacun</div></div><div class="sown">${count}</div><div class="scost">${fmt(price||bcost(b))}</div>`;addTip(d,`<b>${b.icon} ${b.name}</b><br>Possédés : ${count}<br>Production chacun : ${fmt(each)} /s<br>Production totale : ${fmt(total)} /s<br>Prix : ${fmt(price||bcost(b))} cookies`);s.appendChild(d)}}
function renderAch(){let box=$('#achievements');box.innerHTML='';for(const a of ACH){let ok=!!game.achievements[a.id];box.innerHTML+=`<div class="achievement ${ok?'':'locked'}"><div class="name">${ok?'✅':'🔒'} ${a.icon} ${a.name}</div><div class="desc">${a.desc}</div></div>`}game.needAch=false}
function updateStats(){game.cookies=safe(game.cookies);game.totalBaked=safe(game.totalBaked);$('#cookieCount').textContent=fmt(game.cookies);$('#cps').textContent=fmt(game.cps)+' / seconde';$('#cpc').textContent='+'+fmt(game.cpc)+' / clic';$('#totalBaked').textContent=fmt(game.totalBaked);$('#totalClicks').textContent=fmt(game.totalClicks);$('#playTime').textContent=tm(game.playTime);$('#achCount').textContent=Object.values(game.achievements).filter(Boolean).length+'/'+ACH.length;$('#prodTotal').textContent=fmt(game.cps)+' cookies / seconde';$('#clickBonus').textContent='Bonus de clic : +'+fmt(game.cpc)+' / clic'}
function updateAll(force=false){updateStats();let hovering=!!document.querySelector('.shopItem:hover,.upgrade:hover');let now=performance.now();if(force||(!hovering&&(game.needShop||now-game.lastShopRefresh>700))){renderUpgrades();renderOwned();renderShop();game.needShop=false;game.lastShopRefresh=now}if(force||game.needAch)renderAch()}
function normalize(){game.cookies=safe(game.cookies);game.totalBaked=safe(game.totalBaked);game.totalClicks=safe(game.totalClicks);game.cpc=Math.max(1,Number(game.cpc)||1);game.clickVolume=Math.min(1,Math.max(0,Number(game.clickVolume)||.35));game.buyMode=['1','10','100','max'].includes(String(game.buyMode))?String(game.buyMode):'1';for(const b of BUILDINGS){game.buildings[b.id]||={count:0,mult:1};game.buildings[b.id].count=safe(game.buildings[b.id].count);game.buildings[b.id].mult=Math.max(.1,Number(game.buildings[b.id].mult)||1)}game.upgrades=game.upgrades||{};game.achievements=game.achievements||{};recalc()}
function save(){normalize();game.lastSave=Date.now();localStorage.setItem(SAVE,JSON.stringify(game));$('#saveStatus').textContent='💾 Sauvegardé';setTimeout(()=>$('#saveStatus').textContent='💾 Sauvegarde locale',1000)}
function load(){try{let r=localStorage.getItem(SAVE);if(!r)return;game={...blank(),...JSON.parse(r)};normalize()}catch(e){console.error(e);game=blank();normalize()}}
function exportSave(){save();navigator.clipboard.writeText(btoa(unescape(encodeURIComponent(JSON.stringify(game)))));toast('Sauvegarde copiée')}
function importSave(){let c=prompt('Colle ta sauvegarde :');if(!c)return;try{let data=JSON.parse(decodeURIComponent(escape(atob(c))));game={...blank(),...data};normalize();save();location.reload()}catch(e){toast('Sauvegarde invalide')}}
function reset(){if(confirm('Reset ?')){localStorage.removeItem(SAVE);location.reload()}}
function loop(ts){if(!game.lastFrame)game.lastFrame=ts;let dt=Math.min(.25,(ts-game.lastFrame)/1000);game.lastFrame=ts;game.playTime+=dt;let gain=game.cps*dt;game.cookies+=gain;game.totalBaked+=gain;if(ts-game.lastUi>140){updateAll(false);game.lastUi=ts}requestAnimationFrame(loop)}
function init(){load();$('#cookieBtn').onclick=clickCookie;$('#volume').value=Math.round(game.clickVolume*100);$('#volume').oninput=e=>{game.clickVolume=e.target.value/100};$$('.mode').forEach(b=>{if(b.dataset.mode===game.buyMode)b.classList.add('active');else b.classList.remove('active');b.onclick=()=>{$$('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');game.buyMode=b.dataset.mode;game.needShop=true;updateAll(true)}});$('#exportBtn').onclick=exportSave;$('#importBtn').onclick=importSave;$('#resetBtn').onclick=reset;setInterval(save,10000);setInterval(()=>$('#newsText').textContent=NEWS[Math.random()*NEWS.length|0]+' •',15000);log('Partie chargée');updateAll(true);requestAnimationFrame(loop)}
window.addEventListener('load',init);
