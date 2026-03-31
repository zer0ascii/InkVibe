// Speicher
let points = Number(localStorage.getItem("points"))||0;
let collection = JSON.parse(localStorage.getItem("cards"))||{};
let selected = null;
let loggedIn = localStorage.getItem("loggedIn")==="true";

// Karten
const cards=[
{name:"Feuerdrache",rarity:"Legendary",power:30},
{name:"Eisdrache",rarity:"Legendary",power:28},
{name:"Nachtelfe",rarity:"Legendary",power:26},
{name:"Wassergeist",rarity:"Epic",power:18},
{name:"Flammenfuchs",rarity:"Epic",power:17},
{name:"Schattenwolf",rarity:"Rare",power:12},
{name:"Sonnenkrieger",rarity:"Rare",power:11},
{name:"Lichtfee",rarity:"Common",power:6},
{name:"Mondkatze",rarity:"Common",power:5}
];

// Gegner
const enemies=[
{name:"Goblin",strength:8},
{name:"Ork",strength:12},
{name:"Dämon",strength:18},
{name:"Drache",strength:30}
];

// Sprache
let lang="de";

function changeLang(l){lang=l;}

// Draw Gacha
function getCard(){
  let r=Math.random();
  let rarity;
  if(r<0.7) rarity="Common";
  else if(r<0.9) rarity="Rare";
  else if(r<0.99) rarity="Epic";
  else rarity="Legendary"; // 1%
  let pool=cards.filter(c=>c.rarity===rarity);
  return pool[Math.floor(Math.random()*pool.length)];
}

// Draw mit Animation
function draw(){
  if(points<5){alert("Not enough Ink"); return;}
  points-=5;

  let anim=document.getElementById("drawAnimation");
  let i=0;
  let interval=setInterval(()=>{
    anim.innerText=["Common","Rare","Epic","???"][Math.floor(Math.random()*4)];
    i++;
    if(i>10){
      clearInterval(interval);
      let c=getCard();
      anim.innerText="✨ "+c.rarity+" ✨";

      if(!collection[c.name]) collection[c.name]={...c,count:0};
      collection[c.name].count++;

      if(c.rarity==="Legendary"){points+=20; alert("🔥 LEGENDARY!!!");}
      save(); render();
    }
  },100);
}

// Daily
function collectDaily(){
  let bonus=10;
  if(loggedIn) bonus+=5;
  points+=bonus;
  save();
}

// Fight
function fight(){
  if(!selected){alert("Select card"); return;}
  let enemy=enemies[Math.floor(Math.random()*enemies.length)];
  let power=selected.power;
  if(loggedIn) power+=3;
  if(power>=enemy.strength){alert("Win!"); points+=5;}
  else alert("Lose!");
  save();
}

// Auswahl
function selectCard(n){
  selected=collection[n];
  render();
}

// Anzeige
function render(){
  document.getElementById("points").innerText="Ink: "+points;
  let html="";
  Object.values(collection).forEach(c=>{
    html+=`
    <div class="card ${c.rarity} ${selected?.name===c.name?"selected":""}"
    onclick="selectCard('${c.name}')">
      <h4>${c.name}</h4>
      <p>⚔️ ${c.power}</p>
      <p>x${c.count}</p>
    </div>`;
  });
  document.getElementById("collection").innerHTML=html;
}

// Save
function save(){
  localStorage.setItem("points",points);
  localStorage.setItem("cards",JSON.stringify(collection));
  localStorage.setItem("loggedIn",loggedIn);
  render();
}

// Login-Seite
function goLogin(){window.location.href="login.html";}

// Start
render();
