'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const SAVE_KEY='cookie_clicker_mockup_v1';
const BUILDINGS=[
 {id:'cursor',name:'Curseur',icon:'🖱️',baseCost:15,cps:1,desc:'Clique automatiquement.'},
 {id:'grandma',name:'Grand-mère',icon:'👵',baseCost:100,cps:1,desc:'Fait des cookies avec amour.'},
 {id:'farm',name:'Ferme',icon:'🏡',baseCost:1100,cps:8,desc:'Cultive des cookies.'},
 {id:'mine',name:'Mine',icon:'⛏️',baseCost:12000,cps:47,desc:'Extrait des pépites de cookie.'},
 {id:'factory',name:'Usine',icon:'🏭',baseCost:130000,cps:260,desc:'Produit en masse.'},
 {id:'bank',name:'Banque',icon:'🏛️',baseCost:1400000,cps:1400,desc:'Investit dans les cookies.'},
 {id:'temple',name:'Temple',icon:'🛕',baseCost:20000000,cps:7800,desc:'Bénédiction sacrée.'},
 {id:'wizard',name:'Tour de sorcier',icon:'🧙‍♂️',baseCost:330000000,cps:44000,desc:'Magie biscuitée.'},
 {id:'shipment',name:'Expédition',icon:'🚀',baseCost:5100000000,cps:260000,desc:'Cookies depuis l’espace.'},
 {id:'lab',name:'Laboratoire',icon:'🧪',baseCost:75000000000,cps:1600000,desc:'Science du cookie.'}
];
const UPGRADES=[
 ['u1','Pointeur précis','🖱️',100,'+1 par clic',g=>g.totalClicks>=10,g=>g.cpc+=1],['u2','Main rapide','👆',750,'+2 par clic',g=>g.totalClicks>=50,g=>g.cpc+=2],['u3','Souris renforcée','🖱️',2500,'Clics x2',g=>g.totalClicks>=100,g=>g.cpc*=2],['u4','Éclair de clic','⚡',9000,'Clics x2',g=>g.totalClicks>=250,g=>g.cpc*=2],['u5','Cookie doré','🍪',25000,'+10 par clic',g=>g.totalBaked>=10000,g=>g.cpc+=10],
 ['u6','Mamie experte','👵',1000,'Grand-mères x2',g=>g.buildings.grandma.count>=1,g=>g.buildings.grandma.mult*=2],['u7','Fournée familiale','🍪',5000,'Grand-mères x2',g=>g.buildings.grandma.count>=5,g=>g.buildings.grandma.mult*=2],['u8','Chapeau de sorcier','🧙‍♂️',25000,'Sorciers x2',g=>g.buildings.wizard.count>=1,g=>g.buildings.wizard.mult*=2],['u9','Chef pâtissier','👨‍🍳',80000,'Usines x2',g=>g.buildings.factory.count>=2,g=>g.buildings.factory.mult*=2],['u10','Rouleau magique','🥖',120000,'+50 par clic',g=>g.totalBaked>=50000,g=>g.cpc+=50],
 ['u11','Étoile sucrée','🌟',300000,'Production totale +10%',g=>g.totalBaked>=100000,g=>g.globalMult*=1.10],['u12','Potion de levure','🧪',900000,'Fermes x2',g=>g.buildings.farm.count>=5,g=>g.buildings.farm.mult*=2],['u13','Pioche diamant','⛏️',1600000,'Mines x2',g=>g.buildings.mine.count>=5,g=>g.buildings.mine.mult*=2],['u14','Cargo rapide','🚀',3500000,'Expéditions x2',g=>g.buildings.shipment.count>=1,g=>g.buildings.shipment.mult*=2],['u15','Bombe de sucre','💣',7000000,'Production totale +25%',g=>g.totalBaked>=1000000,g=>g.globalMult*=1.25],
 ['u16','Livre ancien','📕',12000000,'Temples x2',g=>g.buildings.temple.count>=1,g=>g.buildings.temple.mult*=2],['u17','Banque dorée','🏛️',25000000,'Banques x2',g=>g.buildings.bank.count>=3,g=>g.buildings.bank.mult*=2],['u18','Engrenages','⚙️',50000000,'Usines x3',g=>g.buildings.factory.count>=5,g=>g.buildings.factory.mult*=3],['u19','Sablier','⌛',120000000,'Production totale +50%',g=>g.totalBaked>=50000000,g=>g.globalMult*=1.5],['u20','Trèfle chanceux','☘️',300000000,'+500 par clic',g=>g.totalClicks>=1000,g=>g.cpc+=500],
 ['u21','Œuf mystérieux','🥚',750000000,'Laboratoires x2',g=>g.buildings.lab.count>=1,g=>g.buildings.lab.mult*=2],['u22','Cadeau royal','🎁',1500000000,'Production totale x2',g=>g.totalBaked>=1000000000,g=>g.globalMult*=2],['u23','Cookie ultime','🍪',5000000000,'Clics x5',g=>g.totalBaked>=2500000000,g=>g.cpc*=5],['u24','Chat porte-bonheur','🐱',12000000000,'Production totale x2',g=>g.totalBaked>=5000000000,g=>g.globalMult*=2],['u25','Planète biscuit','🪐',50000000000,'Expéditions x5',g=>g.buildings.shipment.count>=10,g=>g.buildings.shipment.mult*=5]
].map(([id,name,icon,cost,desc,unlock,effect])=>({id,name,icon,cost,desc,unlock,effect}));
const ACH=[['a1','🍪','Premier cookie','Cuire 1 cookie',g=>g.totalBaked>=1],['a2','👆','Cliqueur','Faire 100 clics',g=>g.totalClicks>=100],['a3','💰','Millionnaire','Cuire 1 million',g=>g.totalBaked>=1e6],['a4','💯','Centenaire','Cuire 100 cookies',g=>g.totalBaked>=100],['a5','👑','Baron du cookie','Cuire 1 milliard',g=>g.totalBaked>=1e9],['a6','🏭','Industriel','Avoir 1 usine',g=>g.buildings.factory.count>=1]].map(([id,icon,name,desc,done])=>({id,icon,name,desc,done}));
const NEWS=['Les sorciers transforment la farine en or. ✦','La bourse du biscuit explose. ✦','Des grand-mères réclament plus de chocolat. ✦','Un cargo rempli de cookies arrive à Los Santos. ✦'];
let game={cookies:0,totalBaked:0,totalClicks:0,cpc:1,cps:0,globalMult:1,playTime:0,lastSave:Date.now(),buyMode:'1',clickVolume:.35,buildings:Object.fromEntries(BUILDINGS.map(b=>[b.id,{count:0,mult:1}])),upgrades:{},achievements:{},lastFrame:0,lastUi:0};
let audioCtx;function ctx(){return audioCtx||(audioCtx=new(window.AudioContext||window.webkitAudioContext)())}function clickSound(){let c=ctx(),v=game.clickVolume;let o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='square';o.frequency.setValueAtTime(900,c.currentTime);o.frequency.exponentialRampToValueAtTime(420,c.currentTime+.04);f.type='highpass';f.frequency.value=280;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.08*v,c.currentTime+.004);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.045);o.connect(f);f.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.05)}
function fmt(n){n=Math.max(0,Number(n)||0);if(n<1000)return Math.floor(n).toString();let u=['','k','M','B','T','Qa','Qi','Sx','Sp','Oc'],i=0;while(n>=1000&&i<u.length-1){n/=1000;i++}return n.toFixed(2)+' '+u[i]}function time(s){s=Math.floor(s);let h=s/3600|0,m=s%3600/60|0;return h?`${h}h ${m}m`:m?`${m}m ${s%60}s`:`${s}s`}function bcost(b,c=game.buildings[b.id].count){return Math.ceil(b.baseCost*Math.pow(1.15,c))}function costFor(b,n){let t=0,c=game.buildings[b.id].count;for(let i=0;i<n;i++)t+=bcost(b,c+i);return t}function maxAff(b){let n=0,t=0,c=game.buildings[b.id].count;while(n<10000){let nx=bcost(b,c+n);if(t+nx>game.cookies)break;t+=nx;n++}return{n,total:t}}function recalc(){game.cps=BUILDINGS.reduce((s,b)=>s+game.buildings[b.id].count*b.cps*game.buildings[b.id].mult,0)*game.globalMult}
function floating(x,y,txt){let f=document.createElement('div');f.className='floating';f.textContent=txt;f.style.left=x+'px';f.style.top=y+'px';$('#floatLayer').appendChild(f);setTimeout(()=>f.remove(),850)}function toast(m){let t=document.createElement('div');t.className='toast';t.textContent=m;$('#toastLayer').appendChild(t);setTimeout(()=>t.remove(),2400)}function log(m){let d=document.createElement('div');d.textContent='• '+m;$('#log').prepend(d);while($('#log').children.length>5)$('#log').lastChild.remove()}
function clickCookie(e){game.cookies+=game.cpc;game.totalBaked+=game.cpc;game.totalClicks++;clickSound();floating(e.clientX-8,e.clientY-20,'+'+fmt(game.cpc));checkAch();renderAll()}
function buyBuilding(id){let b=BUILDINGS.find(x=>x.id===id),qty=game.buyMode==='max'?maxAff(b).n:Number(game.buyMode);if(!qty)return;let price=game.buyMode==='max'?maxAff(b).total:costFor(b,qty);if(price>game.cookies)return;game.cookies=Math.max(0,game.cookies-price);game.buildings[id].count+=qty;recalc();clickSound();log(`Acheté ${qty} x ${b.name}`);checkAch();renderAll()}
function buyUpgrade(id){let u=UPGRADES.find(x=>x.id===id);if(!u||game.upgrades[id]||!u.unlock(game)||game.cookies<u.cost)return;game.cookies=Math.max(0,game.cookies-u.cost);game.upgrades[id]=true;u.effect(game);recalc();clickSound();toast('⭐ '+u.name);log('Amélioration : '+u.name);renderAll()}
function checkAch(){for(let a of ACH){if(!game.achievements[a.id]&&a.done(game)){game.achievements[a.id]=true;toast('🏆 '+a.name);log('Succès : '+a.name)}}}
function tip(el,html){const tt=$('#tooltip');el.addEventListener('mouseenter',()=>{tt.innerHTML=html;tt.style.display='block'});el.addEventListener('mousemove',e=>{let x=e.clientX+16,y=e.clientY+14;if(x+280>innerWidth)x=e.clientX-290;if(y+120>innerHeight)y=e.clientY-125;tt.style.left=x+'px';tt.style.top=y+'px'});el.addEventListener('mouseleave',()=>tt.style.display='none')}
function renderUpgrades(){
  const box=$('#upgrades');
  box.innerHTML='';
  for(const u of UPGRADES){
    const unlocked=u.unlock(game);
    const bought=!!game.upgrades[u.id];
    const affordable=unlocked && !bought && game.cookies>=u.cost;
    const d=document.createElement('button');
    d.type='button';
    d.dataset.upgradeId=u.id;
    d.className='upgrade '+(!unlocked?'locked':bought?'bought':affordable?'affordable':'');
    d.textContent=u.icon;
    d.disabled=!unlocked || bought;
    d.setAttribute('aria-label',u.name);
    tip(d,`<b>${u.icon} ${u.name}</b>${u.desc}<br><span class="green">${fmt(u.cost)} cookies</span>`);
    box.appendChild(d);
  }
}
function renderShop(){
  const shop=$('#shop');
  shop.innerHTML='';
  for(const b of BUILDINGS){
    const qty=game.buyMode==='max'?maxAff(b).n:Number(game.buyMode);
    const price=game.buyMode==='max'?maxAff(b).total:costFor(b,qty);
    const affordable=price>0 && game.cookies>=price;
    const owned=game.buildings[b.id];
    const each=b.cps*owned.mult*game.globalMult;
    const total=each*owned.count;
    const d=document.createElement('div');
    d.dataset.buildingId=b.id;
    d.className='shopItem '+(affordable?'affordable':'disabled');
    d.innerHTML=`<div class="shopIcon">${b.icon}</div><div><div class="shopName">${b.name}</div><div class="shopDesc">${b.desc}<br>+${fmt(each)}/s chacun</div></div><div class="shopOwned">${owned.count}</div><div class="shopCost">🍪 ${fmt(price||bcost(b))}</div>`;
    tip(d,`<b>${b.icon} ${b.name}</b>${b.desc}<br>Possédés : <span class="green">${owned.count}</span><br>Production chacun : <span class="green">${fmt(each)}/s</span><br>Production totale : <span class="green">${fmt(total)}/s</span>`);
    shop.appendChild(d);
  }
}
function renderOwned(){let box=$('#ownedItems');let arr=BUILDINGS.filter(b=>game.buildings[b.id].count>0);box.innerHTML=arr.length?'':'Aucun item acheté';for(let b of arr){let d=document.createElement('div');d.className='ownedItem';d.innerHTML=`<span>${b.icon}</span><small>${game.buildings[b.id].count}</small>`;box.appendChild(d)}}
function renderAchievements(){let box=$('#achievements');box.innerHTML='';for(let a of ACH){let ok=game.achievements[a.id];let d=document.createElement('div');d.className='achievement '+(ok?'':'locked');d.innerHTML=`<div class="title">${ok?'✅':'🔒'} ${a.icon} ${a.name}</div><div class="desc">${a.desc}</div>`;box.appendChild(d)}}
function renderStats(){ $('#cookieCount').textContent=fmt(game.cookies); $('#cps').textContent=fmt(game.cps)+' / seconde'; $('#cpc').textContent='+'+fmt(game.cpc)+' / clic'; $('#totalBaked').textContent=fmt(game.totalBaked); $('#totalClicks').textContent=fmt(game.totalClicks); $('#playTime').textContent=time(game.playTime); $('#achCount').textContent=Object.values(game.achievements).filter(Boolean).length+'/'+ACH.length; $('#prodBig').textContent=fmt(game.cps)+' cookies / seconde'; $('#bonusClick').textContent='Bonus de clic : +'+fmt(game.cpc)+' / clic'}
function renderAll(){renderStats();renderUpgrades();renderShop();renderOwned();renderAchievements()}
function save(){game.cookies=Math.max(0,Number(game.cookies)||0);game.lastSave=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(game));$('#saveStatus').textContent='🇫🇷 Sauvegardé';setTimeout(()=>$('#saveStatus').textContent='🇫🇷 Sauvegarde locale',1000)}function load(){let raw=localStorage.getItem(SAVE_KEY);if(!raw)return;try{let data=JSON.parse(raw);game={...game,...data};game.cookies=Math.max(0,Number(game.cookies)||0);game.totalBaked=Math.max(0,Number(game.totalBaked)||0);for(let b of BUILDINGS)game.buildings[b.id]||={count:0,mult:1};recalc()}catch(e){console.error(e)}}function exportSave(){navigator.clipboard.writeText(btoa(unescape(encodeURIComponent(JSON.stringify(game)))));toast('Sauvegarde copiée')}function importSave(){let code=prompt('Colle ta sauvegarde :');if(!code)return;try{let data=JSON.parse(decodeURIComponent(escape(atob(code))));data.cookies=Math.max(0,Number(data.cookies)||0);localStorage.setItem(SAVE_KEY,JSON.stringify(data));location.reload()}catch(e){toast('Sauvegarde invalide')}}function reset(){if(confirm('Reset la partie ?')){localStorage.removeItem(SAVE_KEY);location.reload()}}
function loop(ts){if(!game.lastFrame)game.lastFrame=ts;let dt=(ts-game.lastFrame)/1000;game.lastFrame=ts;game.playTime+=dt;let gain=game.cps*dt;game.cookies+=gain;game.totalBaked+=gain;if(ts-game.lastUi>120){renderStats();renderShop();renderUpgrades();game.lastUi=ts}requestAnimationFrame(loop)}
function init(){load();$('#cookieBtn').onclick=clickCookie;$('#volume').value=Math.round(game.clickVolume*100);$('#volume').oninput=e=>game.clickVolume=e.target.value/100;$$('.mode').forEach(b=>b.onclick=()=>{$$('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');game.buyMode=b.dataset.mode;renderShop()});$('#shop').addEventListener('click',e=>{const card=e.target.closest('.shopItem');if(!card)return;buyBuilding(card.dataset.buildingId)});$('#upgrades').addEventListener('click',e=>{const card=e.target.closest('.upgrade');if(!card||card.disabled)return;buyUpgrade(card.dataset.upgradeId)});$('#exportBtn').onclick=exportSave;$('#importBtn').onclick=importSave;$('#resetBtn').onclick=reset;setInterval(save,10000);setInterval(()=>$('#newsText').textContent=NEWS[Math.floor(Math.random()*NEWS.length)],12000);recalc();renderAll();log('Partie chargée');requestAnimationFrame(loop)}
window.addEventListener('load',init);
