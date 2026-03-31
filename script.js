// --- Speicher & Status ---
let points = Number(localStorage.getItem("points")) || 0;
let collection = JSON.parse(localStorage.getItem("cards")) || {};
let selected = null;
let loggedIn = localStorage.getItem("loggedIn") === "true";

// --- Karten ---
const cards = [
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

// --- Gegner ---
const enemies = [
  {name:"Goblin",strength:8},
  {name:"Ork",strength:12},
  {name:"Dämon",strength:18},
  {name:"Drache",strength:30}
];

// --- Sprache ---
let lang = "de";
function changeLang(l){ lang = l; }

// --- Karten ziehen (Gacha) ---
function getCard(){
  let r = Math.random();
  let rarity;
  if(r < 0.7) rarity = "Common";
  else if(r < 0.9) rarity = "Rare";
  else if(r < 0.99) rarity = "Epic";
  else rarity = "Legendary"; // nur 1%
  
  const pool = cards.filter(c => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function draw(){
  if(points < 5){ alert(lang==="de"?"Nicht genug Ink!":"Not enough Ink!"); return; }
  points -= 5;

  const anim = document.getElementById("drawAnimation");
  let i = 0;
  const interval = setInterval(()=>{
    anim.innerText = ["Common","Rare","Epic","???"][Math.floor(Math.random()*4)];
    i++;
    if(i>10){
      clearInterval(interval);
      const c = getCard();
      anim.innerText = "✨ " + c.rarity + " ✨";

      if(!collection[c.name]) collection[c.name] = {...c,count:0};
      collection[c.name].count++;

      if(c.rarity === "Legendary"){
        points += 20;
        alert(lang==="de"?"🔥 LEGENDARY!!! Bonus Ink!":"🔥 LEGENDARY!!! Bonus Ink!");
      }
      save(); render();
    }
  },100);
}

// --- Daily Ink mit Tages-Limit ---
function collectDaily(){
  const today = new Date().toISOString().slice(0,10);
  const lastDaily = localStorage.getItem("lastDaily");

  if(lastDaily === today){
    alert(lang==="de"?"Heute schon abgeholt!":"Already collected today!");
    return;
  }

  let bonus = 10;
  if(loggedIn) bonus += 5;

  points += bonus;
  localStorage.setItem("lastDaily", today);
  save();
  alert(lang==="de"?`Du hast ${bonus} Ink bekommen!`:`You received ${bonus} Ink!`);
}

// --- Kampf ---
function fight(){
  if(!selected){ alert(lang==="de"?"Wähle zuerst eine Karte!":"Select a card first!"); return; }

  const enemy = enemies[Math.floor(Math.random() * enemies.length)];
  let power = selected.power;
  if(loggedIn) power += 3;

  if(power >= enemy.strength){
    alert(`${enemy.name} (Stärke: ${enemy.strength})\n${power} vs ${enemy.strength}\n` + (lang==="de"?"Gewonnen!":"You won!"));
    points += 5;
  } else {
    alert(`${enemy.name} (Stärke: ${enemy.strength})\n${power} vs ${enemy.strength}\n` + (lang==="de"?"Verloren!":"You lost!"));
  }
  save();
}

// --- Karte auswählen ---
function selectCard(name){
  selected = collection[name];
  render();
}

// --- Anzeige / Render ---
function render(){
  document.getElementById("points").innerText = "Ink: " + points;

  let html = "";
  Object.values(collection).forEach(c=>{
    html += `
      <div class="card ${c.rarity} ${selected?.name===c.name?"selected":""}" onclick="selectCard('${c.name}')">
        <h4>${c.name}</h4>
        <p>⚔️ ${c.power}</p>
        <p>x${c.count}</p>
      </div>`;
  });
  document.getElementById("collection").innerHTML = html;
}

// --- Speichern ---
function save(){
  localStorage.setItem("points", points);
  localStorage.setItem("cards", JSON.stringify(collection));
  localStorage.setItem("loggedIn", loggedIn);
  render();
}

// --- Login-Seite ---
function goLogin(){
  window.location.href = "login.html";
}

// --- Start ---
render();
