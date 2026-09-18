const firebaseConfig = {
  apiKey: "AIzaSyChZ12uOT7E1Pn-N1XlWUgpaUKA62QHiVU",
  authDomain: "gospel-global-efootball.firebaseapp.com",
  projectId: "gospel-global-efootball",
  storageBucket: "gospel-global-efootball.firebasestorage.app",
  messagingSenderId: "274171168871",
  appId: "1:274171168871:web:fc0e74fea03e173d436cc2"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const seasonId = "season-1";
const seasonName = "Season 1";

const catalog = [
  {name:"Arsenal",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9825.png"},
  {name:"Aston Villa",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/10252.png"},
  {name:"Bournemouth",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8678.png"},
  {name:"Brentford",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9937.png"},
  {name:"Brighton",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/10204.png"},
  {name:"Chelsea",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8455.png"},
  {name:"Crystal Palace",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9826.png"},
  {name:"Everton",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8668.png"},
  {name:"Fulham",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9879.png"},
  {name:"Leeds United",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8463.png"},
  {name:"Liverpool",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8650.png"},
  {name:"Manchester City",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8456.png"},
  {name:"Manchester United",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/10260.png"},
  {name:"Newcastle United",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/10261.png"},
  {name:"Nottingham Forest",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/10203.png"},
  {name:"Sunderland",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8472.png"},
  {name:"Tottenham Hotspur",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8586.png"},
  {name:"West Ham United",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8654.png"},
  {name:"Wolverhampton",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8602.png"},
  {name:"Burnley",competition:"Premier League",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8191.png"},
  {name:"Real Madrid",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8633.png"},
  {name:"Barcelona",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8634.png"},
  {name:"Bayern Munich",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9823.png"},
  {name:"Paris Saint-Germain",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9847.png"},
  {name:"Inter",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8636.png"},
  {name:"AC Milan",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8564.png"},
  {name:"Juventus",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9885.png"},
  {name:"Borussia Dortmund",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9789.png"},
  {name:"Atletico Madrid",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9906.png"},
  {name:"Benfica",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9772.png"},
  {name:"Porto",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/9773.png"},
  {name:"Ajax",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8590.png"},
  {name:"Galatasaray",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/8639.png"},
  {name:"Al Ahly",competition:"UCL",logo:"https://images.fotmob.com/image_resources/logo/teamlogo/10231.png"},
  {name:"Simba SC",competition:"Championship",logo:""},
  {name:"Yanga SC",competition:"Championship",logo:""},
  {name:"Azam FC",competition:"Championship",logo:""},
  {name:"APR FC",competition:"Championship",logo:""},
  {name:"TP Mazembe",competition:"Championship",logo:""},
  {name:"Mamelodi Sundowns",competition:"Championship",logo:""},
  {name:"KMC FC",competition:"Championship",logo:""},
  {name:"Coastal Union",competition:"Championship",logo:""}
];

const state = {teams:[], players:[], fixtures:[], results:[], news:[], hall:[], season:null, authReady:false};
const $ = id => document.getElementById(id);

function logoUrl(team){
  const t = state.teams.find(x => x.name === team) || catalog.find(x => x.name === team);
  return t && t.logo ? t.logo : '';
}
function logoImg(team, small=false){
  const src = logoUrl(team);
  if(src) return `<img class="team-logo${small?' sm':''}" src="${src}" alt="${escapeHtml(team)} logo" onerror="this.style.display='none'">`;
  return `<span class="player-avatar${small?' sm':''}" style="width:${small?25:30}px;height:${small?25:30}px;font-size:${small?8:9}px">${initials(team)}</span>`;
}
function initials(name){return String(name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function formatDate(v){if(!v)return 'Date TBA';let d=v?.toDate?v.toDate():new Date(v);if(Number.isNaN(d.getTime()))return 'Date TBA';return d.toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'});}
function timestampDate(f){return f?.date?.toDate?f.date.toDate():f?.date?new Date(f.date):f?.kickoff?.toDate?f.kickoff.toDate():f?.kickoff?new Date(f.kickoff):null}
function scoreFor(f){const h=f.homeScore ?? f.homeGoals ?? f.homeResult;const a=f.awayScore ?? f.awayGoals ?? f.awayResult;return h!==undefined&&h!==null&&a!==undefined&&a!==null&&h!==''&&a!==''?{h:Number(h),a:Number(a)}:null}

function go(page){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.dataset.pageContent===page));document.querySelectorAll('.nav-item,.admin-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});if(page==='standings')renderStandings();if(page==='fixtures')renderFixtures();if(page==='teams')renderTeams();if(page==='players')renderPlayers();}

document.addEventListener('click',e=>{const btn=e.target.closest('[data-page]');if(btn)go(btn.dataset.page)});
$('mobileMenu').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('registerCta').addEventListener('click',openRegister);$('registerPlayerBtn').addEventListener('click',openRegister);
$('closeRegister').addEventListener('click',closeRegister);$('registerModal').addEventListener('click',e=>{if(e.target===$('registerModal'))closeRegister()});
$('competition').addEventListener('change',()=>populateClubPicker($('clubSearch').value));$('clubSearch').addEventListener('input',()=>populateClubPicker($('clubSearch').value));
$('teamSearch').addEventListener('input',()=>renderTeams());$('fixtureCompetition').addEventListener('change',renderFixtures);$('fixtureStatus').addEventListener('change',renderFixtures);$('standingsCompetition').addEventListener('change',renderStandings);
document.querySelectorAll('.competition-card').forEach(card=>card.addEventListener('click',()=>{go('competitions');showCompetition(card.dataset.competition)}));
$('globalSearch').addEventListener('input',e=>searchSite(e.target.value));
$('adminLoginBtn').addEventListener('click',adminLogin);$('adminLoginBtn2').addEventListener('click',adminLogin);

function openRegister(){ $('registerModal').hidden=false; populateClubPicker(''); setTimeout(()=>$('name').focus(),50)}
function closeRegister(){ $('registerModal').hidden=true; $('registrationMsg').textContent=''; $('registrationMsg').className='form-msg'; }
function populateClubPicker(query=''){
  const comp=$('competition').value;const q=query.trim().toLowerCase();
  const teams=(state.teams.length?state.teams.filter(t=>t.enabled!==false&&(!t.competition||t.competition===comp)):catalog.filter(t=>t.competition===comp));
  const filtered=teams.filter(t=>t.name.toLowerCase().includes(q));
  $('club').innerHTML=filtered.map(t=>`<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)}</option>`).join('');
}

async function ensureAuth(){if(auth.currentUser){state.authReady=true;return true}try{await auth.signInAnonymously();state.authReady=true;return true}catch(e){console.error(e);return false}}

$('registrationForm').addEventListener('submit',async e=>{
  e.preventDefault();const msg=$('registrationMsg');msg.className='form-msg';msg.textContent='Saving registration…';
  if(!(await ensureAuth())){msg.className='form-msg error';msg.textContent='Firebase authentication is not available. Check Anonymous sign-in.';return}
  const name=$('name').value.trim(),rawId=$('pid').value.trim(),id=rawId.toLowerCase().replace(/\s+/g,''),competition=$('competition').value,club=$('club').value;
  if(!name||!id||!club){msg.className='form-msg error';msg.textContent='Fill all required fields.';return}
  const docId=`${seasonId}_${id.replace(/[^a-z0-9_-]/g,'_')}`;const ref=db.collection('players').doc(docId);
  try{
    const existing=await ref.get();
    if(existing.exists){msg.className='form-msg error';msg.textContent=`Already registered with ${existing.data().club||'another club'} for ${seasonName}.`;return}
    await ref.set({name,playerId:rawId,playerIdKey:id,competition,club,seasonId,createdAt:firebase.firestore.FieldValue.serverTimestamp(),status:'active'});
    msg.className='form-msg ok';msg.textContent=`Registration successful — ${club}`;e.target.reset();populateClubPicker('');await loadPlayers();setTimeout(closeRegister,900);
  }catch(err){console.error(err);msg.className='form-msg error';msg.textContent='Registration failed. Please check Firestore rules.'}
});

async function safeGet(collection){try{const snap=await db.collection(collection).get();return snap.docs.map(d=>({id:d.id,...d.data()}));}catch(e){console.warn(collection,e);return []}}
async function loadData(){
  const [teams,players,fixtures,results,news,hall,seasons]=await Promise.all([safeGet('teams'),safeGet('players'),safeGet('fixtures'),safeGet('results'),safeGet('news'),safeGet('hallOfFame'),safeGet('seasons')]);
  state.teams=teams;state.players=players.filter(p=>p.seasonId===seasonId||!p.seasonId);state.fixtures=fixtures;state.results=results;state.news=news;state.hall=hall;state.season=seasons.find(s=>s.id===seasonId)||seasons.find(s=>s.current===true)||null;
  updateSeasonUI();renderAll();
}
async function loadPlayers(){state.players=(await safeGet('players')).filter(p=>p.seasonId===seasonId||!p.seasonId);renderPlayers();updateCounts();}
function updateSeasonUI(){const s=state.season||{};const n=s.name||seasonName;['sideSeason','topSeason','footerSeason'].forEach(id=>$(id).textContent=n);$('seasonStatus').textContent=s.status||'Ongoing';$('seasonDates').textContent=`${n} • ${s.year||'2026'}`;}
function updateCounts(){const played=state.fixtures.filter(f=>scoreFor(f));$('dashPlayers').textContent=state.players.length;$('dashFixtures').textContent=state.fixtures.length;$('dashPlayed').textContent=played.length}
function renderAll(){renderDashboardTable();renderDashboardMatches();renderTeams();renderFixtures();renderStandings();renderPlayers();renderHall();renderNews();updateCounts();}

function teamObjects(comp){
  const fromDb=state.teams.filter(t=>t.enabled!==false&&(!comp||t.competition===comp));
  if(fromDb.length)return fromDb;
  return catalog.filter(t=>!comp||t.competition===comp);
}
function getTable(comp){
  const teams=teamObjects(comp).map(t=>({team:t.name,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}));const map=new Map(teams.map(x=>[x.team,x]));
  const matches=state.fixtures.filter(f=>(f.competition||'Premier League')===comp).filter(f=>scoreFor(f));
  matches.forEach(f=>{const s=scoreFor(f);const h=f.homeTeam||f.home||f.teamA,a=f.awayTeam||f.away||f.teamB;if(!map.has(h))map.set(h,{team:h,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0});if(!map.has(a))map.set(a,{team:a,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0});const H=map.get(h),A=map.get(a);H.mp++;A.mp++;H.gf+=s.h;H.ga+=s.a;A.gf+=s.a;A.ga+=s.h;if(s.h>s.a){H.w++;H.pts+=3;A.l++}else if(s.h<s.a){A.w++;A.pts+=3;H.l++}else{H.d++;A.d++;H.pts++;A.pts++}});
  return [...map.values()].map(x=>({...x,gd:x.gf-x.ga})).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.team.localeCompare(b.team));
}
function tableRows(comp,limit){const rows=getTable(comp).slice(0,limit);if(!rows.length)return `<tr><td colspan="8" class="empty">No published standings yet.</td></tr>`;return rows.map((r,i)=>`<tr><td><b>${String(i+1).padStart(2,'0')}</b></td><td><div class="team-cell">${logoImg(r.team,true)}<b>${escapeHtml(r.team)}</b></div></td><td>${r.mp}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join('')}
function renderDashboardTable(){$('dashTable').innerHTML=tableRows('Premier League',8)}
function fixtureData(f){const h=f.homeTeam||f.home||f.teamA||'Home';const a=f.awayTeam||f.away||f.teamB||'Away';return {h,a,s:scoreFor(f),date:timestampDate(f),comp:f.competition||'Premier League',status:scoreFor(f)?'played':'upcoming'} }
function matchHtml(f){const x=fixtureData(f);return `<div class="match-item"><div class="match-team">${logoImg(x.h,true)}<span>${escapeHtml(x.h)}</span></div><div><div class="match-score">${x.s?`${x.s.h} - ${x.s.a}`:'VS'}</div><div class="match-meta">${escapeHtml(x.comp)} • ${x.date?formatDate(x.date):'TBA'}</div></div><div class="match-team away"><span>${escapeHtml(x.a)}</span>${logoImg(x.a,true)}</div></div>`}
function renderDashboardMatches(){const upcoming=state.fixtures.filter(f=>!scoreFor(f)).sort((a,b)=>(timestampDate(a)||0)-(timestampDate(b)||0)).slice(0,4);$('dashMatches').innerHTML=upcoming.length?upcoming.map(matchHtml).join(''):`<div class="empty-block">No fixtures published yet.</div>`}
function renderTeams(){const q=($('teamSearch')?.value||'').trim().toLowerCase();const teams=(state.teams.length?state.teams.filter(t=>t.enabled!==false):catalog).filter(t=>!q||t.name.toLowerCase().includes(q));$('teamsGrid').innerHTML=teams.map(t=>`<article class="team-card"><div class="team-card-top">${logoImg(t.name)}<div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.competition||'Competition TBA')}</p></div></div><span class="team-comp">${escapeHtml(t.competition||'Available')}</span></article>`).join('')||`<div class="empty-block">No teams found.</div>`}
function renderFixtures(){const comp=$('fixtureCompetition').value,status=$('fixtureStatus').value;let fs=state.fixtures.map(f=>({...f,_:fixtureData(f)}));if(comp!=='all')fs=fs.filter(f=>f._.comp===comp);if(status!=='all')fs=fs.filter(f=>f._.status===status);fs.sort((a,b)=>(a._.date||0)-(b._.date||0));$('fixturesList').innerHTML=fs.length?fs.map(f=>{const x=f._;return `<article class="fixture-card"><div class="fixture-meta"><b>${escapeHtml(x.comp)}</b>${x.date?formatDate(x.date):'Date TBA'}</div><div class="fixture-teams"><div class="fixture-team">${logoImg(x.h,true)}<span>${escapeHtml(x.h)}</span></div><div class="fixture-score">${x.s?`${x.s.h} - ${x.s.a}`:'VS'}<small>${x.s?'FULL TIME':'UPCOMING'}</small></div><div class="fixture-team">${logoImg(x.a,true)}<span>${escapeHtml(x.a)}</span></div></div><div class="fixture-status"><span class="badge ${x.s?'played':''}">${x.s?'RESULT':'FIXTURE'}</span></div></article>`}).join(''):`<div class="empty-block">No fixtures match your filters.</div>`}
function renderStandings(){const comp=$('standingsCompetition').value;const rows=getTable(comp);$('standingsTable').innerHTML=rows.length?rows.map((r,i)=>`<tr><td><b>${i+1}</b></td><td><div class="team-cell">${logoImg(r.team)}<b>${escapeHtml(r.team)}</b></div></td><td>${r.mp}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join(''):`<tr><td colspan="10" class="empty">No published results yet.</td></tr>`}
function renderPlayers(){const ps=state.players.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name)));$('playersGrid').innerHTML=ps.length?ps.map(p=>`<article class="player-card"><div class="player-avatar">${initials(p.name)}</div><div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.club||'Club TBA')} • ${escapeHtml(p.competition||'Competition')}</p></div></article>`).join(''):`<div class="empty-block">No player registrations yet.</div>`}
function renderHall(){const hs=state.hall.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));$('hallGrid').innerHTML=hs.length?hs.map(h=>`<article class="hall-card"><div class="trophy">🏆</div><p>${escapeHtml(h.season||h.seasonName||'Season')}</p><h2>${escapeHtml(h.winner||h.team||'Champion')}</h2><p>${escapeHtml(h.competition||'Competition')} ${h.date?'• '+escapeHtml(h.date):''}</p></article>`).join(''):`<div class="empty-block">No champions published yet.</div>`}
function renderNews(){const ns=state.news.slice().sort((a,b)=>String(b.createdAt||b.date||'').localeCompare(String(a.createdAt||a.date||'')));$('newsGrid').innerHTML=ns.length?ns.map(n=>`<article class="news-card"><time>${escapeHtml(n.date||formatDate(n.createdAt))}</time><h2>${escapeHtml(n.title||'League Update')}</h2><p>${escapeHtml(n.body||n.content||'')}</p></article>`).join(''):`<div class="empty-block">No announcements published yet.</div>`}
function showCompetition(comp){$('competitionDetail').innerHTML=`<div class="panel-head"><div><p class="eyebrow">${escapeHtml(comp)}</p><h2>${escapeHtml(comp)} Overview</h2></div><button class="text-btn" id="detailRegister">Register for ${escapeHtml(comp)} →</button></div><div class="detail-grid"><div class="detail-stat"><b>${teamObjects(comp).length}</b><span>Teams in catalog</span></div><div class="detail-stat"><b>${state.fixtures.filter(f=>(f.competition||'Premier League')===comp).length}</b><span>Published fixtures</span></div><div class="detail-stat"><b>${state.players.filter(p=>p.competition===comp).length}</b><span>Registered players</span></div></div>`;$('detailRegister').onclick=()=>{openRegister();$('competition').value=comp;populateClubPicker('')}}
function searchSite(q){q=q.trim().toLowerCase();if(!q)return;const team=state.teams.find(t=>t.name.toLowerCase().includes(q))||catalog.find(t=>t.name.toLowerCase().includes(q));const player=state.players.find(p=>String(p.name).toLowerCase().includes(q)||String(p.playerId).toLowerCase().includes(q));const fixture=state.fixtures.find(f=>{const x=fixtureData(f);return x.h.toLowerCase().includes(q)||x.a.toLowerCase().includes(q)});if(team)go('teams');else if(player)go('players');else if(fixture)go('fixtures')}

async function adminLogin(){const email=prompt('Admin email:');if(!email)return;const password=prompt('Admin password:');if(password===null)return;try{await auth.signInWithEmailAndPassword(email.trim(),password);renderAdminSignedIn();}catch(e){alert('Admin login failed. Check email/password in Firebase Authentication.');console.error(e)}}
function renderAdminSignedIn(){const a=$('adminArea');a.innerHTML=`<div class="panel"><div class="panel-head"><div><p class="eyebrow">ADMIN CONTROL CENTER</p><h2>Management modules</h2></div><button class="ghost" id="adminSignOut">Sign out</button></div><div class="admin-tools"><div class="tool-card"><h3>Season Management</h3><p>Create, start, complete and archive seasons.</p></div><div class="tool-card"><h3>Teams & Players</h3><p>Manage clubs, logos, competition availability and registrations.</p></div><div class="tool-card"><h3>Fixtures & Results</h3><p>Publish fixtures, enter scores and update standings.</p></div><div class="tool-card"><h3>UCL Groups</h3><p>Select teams, lock groups and generate knockout stages.</p></div><div class="tool-card"><h3>News</h3><p>Publish official league announcements.</p></div><div class="tool-card"><h3>Hall of Fame</h3><p>Record champions by Season and competition.</p></div></div></div>`;$('adminSignOut').onclick=()=>{auth.signOut();location.reload()}}

auth.onAuthStateChanged(user=>{state.authReady=!!user;if(user){if(user.isAnonymous)loadData();else loadData()}else ensureAuth().then(loadData)});
