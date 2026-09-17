const clubs=["Arsenal","Chelsea","Liverpool","Manchester City","Manchester United","Tottenham","Newcastle United","Aston Villa","Real Madrid","Barcelona","Bayern Munich","PSG","Inter Milan","AC Milan"];
const club=document.getElementById("club");
clubs.forEach(x=>{let o=document.createElement("option");o.value=x;o.textContent=x;club.appendChild(o)});
const get=()=>JSON.parse(localStorage.getItem("gosperPlayers")||"[]");
const count=document.getElementById("count");
count.textContent=get().length;
document.getElementById("form").addEventListener("submit",e=>{
 e.preventDefault();
 let players=get(), id=document.getElementById("pid").value.trim().toLowerCase();
 let msg=document.getElementById("msg");
 if(players.some(p=>p.id===id)){msg.textContent="This Player ID / phone is already registered for Season 1.";msg.style.color="#ff7777";return}
 players.push({name:document.getElementById("name").value.trim(),id,competition:document.getElementById("competition").value,club:club.value,season:"Season 1"});
 localStorage.setItem("gosperPlayers",JSON.stringify(players));
 msg.textContent="Registration successful — "+club.value;msg.style.color="#b8ff38";e.target.reset();count.textContent=players.length;
});