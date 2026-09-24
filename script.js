/* Gosper Global eFootball League — Seasons Notebook v2026.09.24 */
const firebaseConfig = {
  apiKey: "AIzaSyChZ12uOT7E1Pn-N1XlWUgpaUKA62QHiVU",
  authDomain: "gospel-global-efootball.firebaseapp.com",
  projectId: "gospel-global-efootball",
  storageBucket: "gospel-global-efootball.firebasestorage.app",
  messagingSenderId: "274171168871",
  appId: "1:274171168871:web:fc0e74fea03e173d436cc2"
};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth(), db=firebase.firestore();
let SEASON_ID='season-1';
const DEFAULT_SEASON='Season 1';

// Logos are stored with the team, so the same logo is reused in registration, tables and fixtures.
const catalog=[
// ENGLAND — TOP 6
['Liverpool','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8650.png'],['Arsenal','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/9825.png'],['Manchester City','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8456.png'],['Manchester United','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/10260.png'],['Chelsea','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8455.png'],['Tottenham Hotspur','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8586.png'],['Newcastle United','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/10261.png'],['Leeds United','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8463.png'],
// SPAIN — TOP 6
['Real Madrid','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8633.png'],['Barcelona','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8634.png'],['Atletico Madrid','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/9906.png'],['Athletic Bilbao','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/10205.png'],['Sevilla','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8302.png'],['Valencia','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8661.png'],['Real Betis','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8603.png'],['Villarreal','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/10268.png'],
// ITALY — TOP 6
['Inter','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8636.png'],['AC Milan','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8564.png'],['Juventus','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/9885.png'],['Napoli','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/9875.png'],['Roma','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8686.png'],['Lazio','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8543.png'],['Atalanta','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8524.png'],['Fiorentina','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8535.png'],
// GERMANY — TOP 6
['Bayern Munich','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/9823.png'],['Borussia Dortmund','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/9789.png'],['Bayer Leverkusen','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/8178.png'],['RB Leipzig','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/178475.png'],['Eintracht Frankfurt','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/9810.png'],['VfB Stuttgart','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/10269.png'],['Wolfsburg','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/9830.png'],['Borussia Monchengladbach','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/9788.png'],
// AFRICA CHAMPIONSHIP — exactly 8 clubs
['Al Ahly','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10280.png'],['Zamalek','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10073.png'],['Esperance Tunis','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10072.png'],['Wydad Casablanca','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10071.png'],['Mamelodi Sundowns','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10070.png'],['Simba SC','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10069.png'],['Young Africans','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10068.png'],['TP Mazembe','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10067.png']
].map(([name,competition,logo])=>({name,competition,logo}));

const state={teams:[],players:[],fixtures:[],news:[],hall:[],season:null,seasons:[],admin:false,awards:[],comments:[],awardVotes:[]};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const initials=s=>String(s||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
function dateObj(v){if(!v)return null; if(v.toDate)return v.toDate(); const d=new Date(v); return isNaN(d)?null:d;}
function dateText(v){const d=dateObj(v);return d?d.toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'}):'TBA';}
function logoUrl(name){const t=state.teams.find(x=>x.name===name)||catalog.find(x=>x.name===name);return t?.logo||'';}
function logo(name,small=false){const src=logoUrl(name);return src?`<span class="logo-box ${small?'sm':''}"><img class="team-logo ${small?'sm':''}" src="${src}" alt="${esc(name)} logo" loading="lazy" onerror="this.parentElement.classList.add('failed');this.remove()"><span class="logo-fallback ${small?'sm':''}">${esc(initials(name))}</span></span>`:`<span class="logo-box ${small?'sm':''}"><span class="logo-fallback ${small?'sm':''}">${esc(initials(name))}</span></span>`}

function go(page){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.dataset.pageContent===page));document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));$('sidebar')?.classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});if(page==='teams')renderTeams();if(page==='fixtures')renderFixtures();if(page==='standings')renderStandings();if(page==='players')renderPlayers();if(page==='hall')renderHall();if(page==='news')renderNews();if(page==='awards')renderAwards();if(page==='community')renderComments();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)go(b.dataset.page);});
$('mobileMenu')?.addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('registerCta')?.addEventListener('click',openRegister);$('registerPlayerBtn')?.addEventListener('click',openRegister);$('closeRegister')?.addEventListener('click',closeRegister);$('registerModal')?.addEventListener('click',e=>{if(e.target===$('registerModal'))closeRegister()});
$('competition')?.addEventListener('change',()=>populateClubPicker($('clubSearch').value));$('clubSearch')?.addEventListener('input',()=>populateClubPicker($('clubSearch').value));$('teamSearch')?.addEventListener('input',renderTeams);$('fixtureCompetition')?.addEventListener('change',renderFixtures);$('fixtureStatus')?.addEventListener('change',renderFixtures);$('standingsCompetition')?.addEventListener('change',renderStandings);$('globalSearch')?.addEventListener('input',searchSite);$('seasonSelector')?.addEventListener('change',e=>switchSeason(e.target.value));$('startNewSeason')?.addEventListener('click',startNewSeason);
document.querySelectorAll('.competition-card').forEach(c=>c.addEventListener('click',()=>{go('competitions');showCompetition(c.dataset.competition)}));

function openRegister(){ $('registerModal').hidden=false; populateClubPicker(''); setTimeout(()=>$('name')?.focus(),60); }
function closeRegister(){ $('registerModal').hidden=true; if($('registrationMsg')){$('registrationMsg').textContent='';$('registrationMsg').className='form-msg';} }
function teamCompetitions(t){return Array.isArray(t.competitions)&&t.competitions.length?t.competitions:(t.competition?[t.competition]:[])}
function isCompActive(comp){const a=state.season?.activeCompetitions;return !Array.isArray(a)||!a.length||a.includes(comp)}
function teamObjects(comp){
 const merged=catalog.map(base=>{const saved=state.teams.find(x=>x.name===base.name&&(!x.seasonId||x.seasonId===SEASON_ID));return {...base,...(saved||{}),logo:saved?.logo||base.logo,competition:saved?.competition||base.competition,competitions:Array.isArray(saved?.competitions)&&saved.competitions.length?saved.competitions:[base.competition]};});
 if(comp==='UCL'){
   return qualifiedUCLTeams().map(q=>{const base=merged.find(t=>t.name===q.name)||catalog.find(t=>t.name===q.name)||{};return {...base,name:q.name,competition:'UCL',competitions:['UCL'],enabled:true,qualifiedFrom:q.league,qualificationRank:q.rank};});
 }
 const pool=merged.filter(t=>t.enabled!==false&&isCompActive(t.competition)&&(!comp||teamCompetitions(t).includes(comp)));
 if(comp==='Championship') return pool.slice(0,8);
 return pool;
}
function catalogObjects(){return catalog.slice();}
const MAJOR_LEAGUES=['Premier League','LaLiga','Serie A','Bundesliga'];
const ALL_COMPETITIONS=[...MAJOR_LEAGUES,'Championship','UCL'];
function qualifiedUCLTeams(){
 const stored=Array.isArray(state.season?.uclTeams)?state.season.uclTeams:[];
 if(stored.length===16)return stored;
 return MAJOR_LEAGUES.flatMap(league=>table(league).slice(0,4).map((r,i)=>({name:r.team,league,rank:i+1})));
}

function activeTeams(comp){const teams=teamObjects(comp).filter(t=>isCompActive(comp));return comp==='Championship'?teams.slice(0,8):teams;}
function populateClubPicker(q=''){
 const comp=$('competition').value, query=q.toLowerCase();
 const registeredClubs=new Set(
   state.players
     .filter(p=>p.seasonId===SEASON_ID && p.competition===comp && p.status!=='cancelled')
     .map(p=>String(p.club||'').trim().toLowerCase())
 );
 const teams=activeTeams(comp).filter(t=>
   t.name.toLowerCase().includes(query) &&
   !registeredClubs.has(t.name.trim().toLowerCase())
 );
 $('club').innerHTML=teams.length
   ? teams.map(t=>`<option value="${esc(t.name)}">${esc(t.name)}</option>`).join('')
   : '<option value="">No available clubs</option>';
}
async function ensureAnon(){if(auth.currentUser)return true;try{const cred=await auth.signInAnonymously();return !!cred.user}catch(e){console.warn('Anonymous authentication unavailable; continuing with public registration.',e);return false}}
$('registrationForm')?.addEventListener('submit',async e=>{e.preventDefault();const m=$('registrationMsg');m.className='form-msg';m.textContent='Registering…';await ensureAnon();const name=$('name').value.trim(),raw=$('pid').value.trim(),key=raw.toLowerCase().replace(/\s+/g,''),competition=$('competition').value,club=$('club').value;if(!name||!key||!club){m.className='form-msg error';m.textContent='Fill all required fields.';return;}const playerDocId=`${SEASON_ID}_${key.replace(/[^a-z0-9_-]/g,'_')}`;
const ref=db.collection('players').doc(playerDocId);
const lockKey=`${SEASON_ID}__${competition}__${club}`.toLowerCase().replace(/[^a-z0-9_-]/g,'_');
const lockRef=db.collection('playerTeamLocks').doc(lockKey);
try{
  if(state.players.some(p=>p.seasonId===SEASON_ID&&p.competition===competition&&String(p.club||'').trim().toLowerCase()===club.trim().toLowerCase()&&p.status!=='cancelled')){
    m.className='form-msg error';
    m.textContent=`${club} is already registered by another player in ${competition}. Choose another club.`;
    populateClubPicker('');
    return;
  }
  await db.runTransaction(async tx=>{
    const snap=await tx.get(ref);
    if(snap.exists) throw new Error('PLAYER_EXISTS');
    const lockSnap=await tx.get(lockRef);
    if(lockSnap.exists) throw new Error('TEAM_TAKEN');

    const registrationUid=auth.currentUser?.uid || `guest_${key}`;
    tx.set(ref,{name,playerId:raw,phone:raw,playerIdKey:key,uid:registrationUid,lockId:lockKey,competition,club,seasonId:SEASON_ID,status:'active',createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    tx.set(lockRef,{playerDocId,playerIdKey:key,uid:registrationUid,competition,club,seasonId:SEASON_ID,status:'active',createdAt:firebase.firestore.FieldValue.serverTimestamp()});
  });
  m.className='form-msg ok';
  m.textContent=`Registration successful — ${club}`;
  e.target.reset();
  populateClubPicker('');
  await loadData();
  setTimeout(closeRegister,900);
}catch(err){
  console.error(err);
  m.className='form-msg error';
  if(err.message==='PLAYER_EXISTS') m.textContent=`This Player ID is already registered for ${state.season?.name||DEFAULT_SEASON}.`;
  else if(err.message==='TEAM_TAKEN') m.textContent=`${club} is already registered by another player in ${competition}. Choose another club.`;
  else if(err&&err.code==='auth/operation-not-allowed') m.textContent='Registration failed: Firebase Authentication is not available.';
  else if(err&&(err.code==='permission-denied'||err.code==='firestore/permission-denied')) m.textContent='Registration failed: Firestore Rules are blocking registration. Publish the included firestore.rules.';
  else m.textContent=`Registration failed: ${err?.message||'Unknown Firebase error'}`;
}});

async function getAll(c){try{const s=await db.collection(c).get();return s.docs.map(d=>({id:d.id,...d.data()}));}catch(e){console.warn(c,e);return[];}}
async function loadData(){
 const [teams,players,fixtures,news,hall,seasons,awards,comments,awardVotes]=await Promise.all(['teams','players','fixtures','news','hallOfFame','seasons','awards','comments','awardVotes'].map(getAll));
 state.seasons=seasons.sort((a,b)=>(Number(a.order||0)-Number(b.order||0))||String(a.name||'').localeCompare(String(b.name||'')));
 if(!state.seasons.some(s=>s.id==='season-1')) state.seasons.unshift({id:'season-1',name:'Season 1',year:'2026',status:'Ongoing',order:1,theme:1,activeCompetitions:ALL_COMPETITIONS,current:true});
 if(!state.seasons.some(s=>s.id===SEASON_ID)){
   const fallback=state.seasons.find(s=>s.current===true)||state.seasons[0];
   if(fallback) SEASON_ID=fallback.id;
 }
 state.season=state.seasons.find(s=>s.id===SEASON_ID)||{id:SEASON_ID,name:DEFAULT_SEASON,status:'Ongoing',year:'2026',order:1,theme:1,activeCompetitions:ALL_COMPETITIONS};
 state.teams=teams.filter(t=>!t.seasonId?(SEASON_ID==='season-1'):t.seasonId===SEASON_ID);
 state.players=players.filter(p=>p.seasonId===SEASON_ID||(!p.seasonId&&SEASON_ID==='season-1'));
 state.fixtures=fixtures.filter(f=>f.seasonId===SEASON_ID||(!f.seasonId&&SEASON_ID==='season-1'));
 state.news=news.filter(n=>n.seasonId===SEASON_ID||(!n.seasonId&&SEASON_ID==='season-1'));
 state.hall=hall;
 state.awards=awards.filter(a=>!a.seasonId||a.seasonId===SEASON_ID);
 state.comments=comments.filter(c=>!c.seasonId||c.seasonId===SEASON_ID);
 state.awardVotes=awardVotes.filter(v=>!v.seasonId||v.seasonId===SEASON_ID);
 applySeasonTheme(); renderAll(); renderAwards(); renderComments(); if(state.admin)renderAdmin();
}
function currentSeasonRecord(){
 const live=state.seasons.find(s=>s.current===true);
 return live||state.seasons.find(s=>s.id==='season-1')||state.seasons[0]||null;
}
async function getAllStrict(c){
 const snap=await db.collection(c).get();
 return snap.docs.map(d=>({id:d.id,...d.data()}));
}
function cleanFirestoreDoc(obj){
 return Object.fromEntries(Object.entries(obj||{}).filter(([,v])=>v!==undefined));
}

function score(f){const h=f.homeScore??f.homeGoals,a=f.awayScore??f.awayGoals;return h!==undefined&&h!==null&&a!==undefined&&a!==null&&h!==''&&a!==''?{h:+h,a:+a}:null;}
function teamsInFixture(f){return [f.homeTeam||f.home||f.teamA||'',f.awayTeam||f.away||f.teamB||''];}
function compOf(f){return f.competition||'Premier League';}
function table(comp){const map=new Map(teamObjects(comp).map(t=>[t.name,{team:t.name,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}]));state.fixtures.filter(f=>compOf(f)===comp&&score(f)&&map.has((f.homeTeam||f.home))&&map.has((f.awayTeam||f.away))).forEach(f=>{const s=score(f),[h,a]=teamsInFixture(f);if(!map.has(h))map.set(h,{team:h,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0});if(!map.has(a))map.set(a,{team:a,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0});const H=map.get(h),A=map.get(a);H.mp++;A.mp++;H.gf+=s.h;H.ga+=s.a;A.gf+=s.a;A.ga+=s.h;if(s.h>s.a){H.w++;H.pts+=3;A.l++;}else if(s.a>s.h){A.w++;A.pts+=3;H.l++;}else{H.d++;A.d++;H.pts++;A.pts++;}});return [...map.values()].map(x=>({...x,gd:x.gf-x.ga})).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.team.localeCompare(b.team));}
function rowHtml(r,i){return `<tr><td><b>${i+1}</b></td><td><div class="team-cell">${logo(r.team,true)}<b>${esc(r.team)}</b></div></td><td>${r.mp}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gd}</td><td><b>${r.pts}</b></td></tr>`;}
function uclGroupTable(group){
 const seasonGroups=state.season?.uclGroups||{};
 const raw=Array.isArray(seasonGroups[group])?seasonGroups[group]:[];
 const names=raw.map(x=>typeof x==='string'?x:x.name).filter(Boolean);
 const map=new Map(names.map(name=>[name,{team:name,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}]));
 state.fixtures.filter(f=>compOf(f)==='UCL'&&String(f.group||'').toUpperCase()===group&&score(f)).forEach(f=>{
   const s=score(f),[h,a]=teamsInFixture(f);
   if(!map.has(h)||!map.has(a))return;
   const H=map.get(h),A=map.get(a); H.mp++; A.mp++; H.gf+=s.h; H.ga+=s.a; A.gf+=s.a; A.ga+=s.h;
   if(s.h>s.a){H.w++;H.pts+=3;A.l++;}else if(s.a>s.h){A.w++;A.pts+=3;H.l++;}else{H.d++;A.d++;H.pts++;A.pts++;}
 });
 return [...map.values()].map(x=>({...x,gd:x.gf-x.ga})).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.team.localeCompare(b.team));
}
function renderUclGroups(){
 const box=$('uclGroupsStandings'),standard=$('standardStandingsPanel');
 if(!box||!standard)return;
 const groups=['A','B','C','D'];
 const hasGroups=groups.some(g=>Array.isArray(state.season?.uclGroups?.[g])&&state.season.uclGroups[g].length);
 standard.hidden=true; box.hidden=false;
 box.innerHTML=groups.map(g=>{
   const rows=uclGroupTable(g);
   return `<div class="tool-card"><h3>GROUP ${g}</h3><div class="table-wrap"><table class="standings-table"><thead><tr><th>#</th><th>CLUB</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>PTS</th></tr></thead><tbody>${rows.length?rows.map((r,i)=>`<tr><td><b>${i+1}</b></td><td><div class="team-cell">${logo(r.team,true)}<b>${esc(r.team)}</b></div></td><td>${r.mp}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join(''):'<tr><td colspan="8" class="empty">No teams assigned.</td></tr>'}</tbody></table></div><p class="muted" style="margin-top:10px">${hasGroups?`Group ${g} • ${rows.length} clubs • Home & Away`: 'UCL groups have not been generated yet.'}</p></div>`;
 }).join('');
}
function renderStandings(){
 const c=$('standingsCompetition')?.value||'Premier League';
 if(c==='UCL'){renderUclGroups();return;}
 const box=$('uclGroupsStandings'),standard=$('standardStandingsPanel');
 if(box)box.hidden=true;if(standard)standard.hidden=false;
 const rows=table(c);
 $('standingsTable').innerHTML=rows.length?rows.map(rowHtml).join(''):`<tr><td colspan="10" class="empty">No results published yet.</td></tr>`;
}
function fixtureHtml(f,admin=false){const [h,a]=teamsInFixture(f),s=score(f);return `<article class="fixture-card"><div class="fixture-meta"><span class="competition-pill">${esc(compOf(f))}</span><span>${dateText(f.date||f.kickoff)}</span><span>${esc(f.round||'Match')}</span></div><div class="fixture-teams"><div class="fixture-team">${logo(h)}<strong>${esc(h)}</strong></div><div class="fixture-score"><b>${s?`${s.h} - ${s.a}`:'VS'}</b><small>${s?'FULL TIME':'UPCOMING'}</small></div><div class="fixture-team">${logo(a)}<strong>${esc(a)}</strong></div></div>${admin?`<div class="fixture-admin-actions"><button class="mini-btn" onclick="editFixture('${f.id}')">Edit</button><button class="mini-btn danger" onclick="deleteFixture('${f.id}')">Delete</button></div>`:''}</article>`;}
function renderFixtures(){
 let fs=state.fixtures.filter(f=>{const c=compOf(f);const [h,a]=teamsInFixture(f);return !!teamObjects(c).find(t=>t.name===h)&&!!teamObjects(c).find(t=>t.name===a);});
 const c=$('fixtureCompetition')?.value||'all',st=$('fixtureStatus')?.value||'all';
 if(c!=='all')fs=fs.filter(f=>compOf(f)===c);
 if(st==='upcoming')fs=fs.filter(f=>!score(f));
 if(st==='played')fs=fs.filter(f=>!!score(f));
 fs.sort((a,b)=>{
   const ra=parseInt(String(a.round||'').match(/\d+/)?.[0]||'9999',10);
   const rb=parseInt(String(b.round||'').match(/\d+/)?.[0]||'9999',10);
   return ra-rb || (dateObj(a.date||a.kickoff)||0)-(dateObj(b.date||b.kickoff)||0);
 });
 const competitions=new Map();
 fs.forEach(f=>{
   const comp=compOf(f), round=f.round||'Matchday';
   if(!competitions.has(comp))competitions.set(comp,new Map());
   const days=competitions.get(comp);
   if(!days.has(round))days.set(round,[]);
   days.get(round).push(f);
 });
 const compOrder=[...MAJOR_LEAGUES,'Championship','UCL'];
 const ordered=[...competitions.entries()].sort((a,b)=>{
   const ia=compOrder.indexOf(a[0]), ib=compOrder.indexOf(b[0]);
   return (ia<0?999:ia)-(ib<0?999:ib);
 });
 $('fixturesList').innerHTML=ordered.length?ordered.map(([comp,days])=>{
   const orderedDays=[...days.entries()].sort((a,b)=>{
     const ra=parseInt(String(a[0]).match(/\d+/)?.[0]||'9999',10);
     const rb=parseInt(String(b[0]).match(/\d+/)?.[0]||'9999',10);
     return ra-rb;
   });
   return `<section class="competition-fixtures-block"><div class="competition-fixtures-heading"><span>COMPETITION</span><h2>${esc(comp)}</h2></div>${orderedDays.map(([round,games])=>`<div class="matchday-block"><div class="matchday-title"><h3>${esc(round)}</h3><span>${games.length} match${games.length===1?'':'es'}</span></div><div class="matchday-row" style="--match-count:${games.length}">${games.map(f=>fixtureHtml(f)).join('')}</div></div>`).join('')}</section>`;
 }).join(''):`<div class="empty-block">No fixtures found.</div>`;
}
function renderTeams(){const q=($('teamSearch')?.value||'').toLowerCase(),c=$('teamCompetition')?.value||'all';let ts=teamObjects().filter(t=>!q||t.name.toLowerCase().includes(q));if(c!=='all')ts=ts.filter(t=>teamCompetitions(t).includes(c));$('teamsGrid').innerHTML=ts.map(t=>`<article class="team-card"><div class="team-logo-wrap">${logo(t.name)}</div><div><h3>${esc(t.name)}</h3><p>${esc(t.competition||'Competition TBA')}</p></div><span class="status-dot ${t.enabled===false?'off':''}">${t.enabled===false?'Disabled':'Available'}</span></article>`).join('')||`<div class="empty-block">No teams found.</div>`;}
function renderPlayers(){const ps=state.players.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name)));$('playersGrid').innerHTML=ps.length?ps.map(p=>`<article class="player-card"><div class="player-avatar">${esc(initials(p.name))}</div><div><h3>${esc(p.name)}</h3><p>${esc(p.club||'Club TBA')}</p><small>${esc(p.competition||'')} • ${esc(state.season?.name||DEFAULT_SEASON)}</small></div></article>`).join(''):`<div class="empty-block">No player registrations yet.</div>`;}
function renderHall(){const hs=state.hall.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));$('hallGrid').innerHTML=hs.length?hs.map(h=>`<article class="hall-card"><div class="trophy">🏆</div><span>${esc(h.season||h.seasonName||DEFAULT_SEASON)}</span><h2>${esc(h.winner||h.team||'Champion')}</h2><p>${esc(h.competition||'Competition')} ${h.date?'• '+esc(h.date):''}</p></article>`).join(''):`<div class="empty-block">No champions published yet.</div>`;}
function renderNews(){
 const ns=state.news.slice().sort((a,b)=>String(b.date||b.createdAt||'').localeCompare(String(a.date||a.createdAt||'')));
 if(!ns.length){$('newsGrid').innerHTML='<div class="news-empty"><div class="news-empty-icon">✦</div><h3>No news published yet</h3><p>The latest league announcements will appear here.</p></div>';return;}
 const featured=ns[0], rest=ns.slice(1);
 const fmtDate=n=>{const d=n.date?new Date(n.date+'T00:00:00'):null;return d&&!isNaN(d)?d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):(n.date||dateText(n.createdAt)||'LATEST');};
 const category=n=>n.category||n.competition||'League Update';
 const excerpt=(n,max=190)=>{const x=String(n.body||n.content||'');return x.length>max?x.slice(0,max).trim()+'…':x;};
 const card=n=>`<article class="news-modern-card"><div class="news-card-top"><span class="news-category">${esc(category(n))}</span><span class="news-date">${esc(fmtDate(n))}</span></div><div class="news-card-icon">⚽</div><h3>${esc(n.title||'League Update')}</h3><p>${esc(excerpt(n))}</p><div class="news-card-foot"><span>Gosper Global eFootball League</span><b>→</b></div></article>`;
 $('newsGrid').innerHTML=`<div class="news-ticker"><span class="ticker-label">LATEST</span><div class="ticker-text">${esc(featured.title||'League Update')}</div><span class="ticker-date">${esc(fmtDate(featured))}</span></div><article class="news-featured"><div class="news-featured-glow"></div><div class="news-featured-content"><div class="news-featured-meta"><span class="news-category bright">${esc(category(featured))}</span><span>${esc(fmtDate(featured))}</span></div><h2>${esc(featured.title||'League Update')}</h2><p>${esc(excerpt(featured,320))}</p><div class="news-featured-foot"><span>OFFICIAL LEAGUE ANNOUNCEMENT</span><span class="news-arrow">↗</span></div></div><div class="news-featured-mark">GG</div></article><div class="news-feed-head"><div><p class="eyebrow">LATEST STORIES</p><h2>From the League</h2></div><span>${ns.length} ${ns.length===1?'update':'updates'}</span></div><div class="news-feed">${rest.length?rest.map(card).join(''): '<div class="news-single-note">That’s the latest update. New announcements will appear here.</div>'}</div>`;
}
function renderDashboard(){
 const pl=table('Premier League');
 $('dashTable').innerHTML=pl.slice(0,6).map(rowHtml).join('')||`<tr><td colspan="10" class="empty">No standings yet.</td></tr>`;
 const up=state.fixtures.filter(f=>!score(f));
 const grouped=new Map();
 up.forEach(f=>{const comp=compOf(f),round=f.round||'Matchday';if(!grouped.has(comp))grouped.set(comp,new Map());const days=grouped.get(comp);if(!days.has(round))days.set(round,[]);days.get(round).push(f);});
 const compOrder=[...MAJOR_LEAGUES,'Championship','UCL'];
 const ordered=[...grouped.entries()].sort((a,b)=>(compOrder.indexOf(a[0])<0?999:compOrder.indexOf(a[0]))-(compOrder.indexOf(b[0])<0?999:compOrder.indexOf(b[0])));
 $('dashMatches').innerHTML=ordered.length?ordered.map(([comp,days])=>{
   const rounds=[...days.entries()].sort((a,b)=>(parseInt(String(a[0]).match(/\d+/)?.[0]||9999,10)-parseInt(String(b[0]).match(/\d+/)?.[0]||9999,10)));
   return `<section class="dashboard-fixture-competition"><div class="dashboard-fixture-heading"><span>COMPETITION</span><h3>${esc(comp)}</h3></div>${rounds.map(([round,games])=>`<div class="dashboard-fixture-matchday"><div class="dashboard-matchday-title"><b>${esc(round)}</b><span>${games.length} match${games.length===1?'':'es'}</span></div><div class="dashboard-fixture-games">${games.map(fixtureHtml).join('')}</div></div>`).join('')}</section>`;
 }).join(''):`<div class="empty-block">No fixtures published yet.</div>`;
 $('dashPlayers').textContent=state.players.length;$('dashFixtures').textContent=state.fixtures.length;$('dashPlayed').textContent=state.fixtures.filter(f=>score(f)).length;$('dashTeams').textContent=teamObjects().length;
}

// ---------------- AWARDS + COMMUNITY (additive; existing league logic remains untouched) ----------------
const AWARD_COMPETITIONS=[...new Set([...(typeof catalog!=='undefined'?catalog.map(x=>x[1]):[]),'Premier League','LaLiga','Serie A','Bundesliga','Championship','UCL'])];
const GLOBAL_AWARDS=["Ballon d'Or","European Top Scorer","European Best Defender"];
function awardKey(category,competition='GLOBAL'){return `${SEASON_ID}__${competition}__${category}`.replace(/[^a-zA-Z0-9_-]/g,'_');}
function awardBy(category,competition='GLOBAL'){const id=awardKey(category,competition);return state.awards.find(a=>a.id===id)||state.awards.find(a=>a.category===category&&a.competition===competition);}
function safeText(v){return esc(v||'');}
function realisticBallonSvg(){return `<svg class="ballon-real" viewBox="0 0 260 300" aria-label="Ballon d'Or trophy"><defs><radialGradient id="br1"><stop stop-color="#fff7c4"/><stop offset=".35" stop-color="#e8c24b"/><stop offset=".72" stop-color="#9c6d13"/><stop offset="1" stop-color="#4b3108"/></radialGradient><linearGradient id="br2" x1="0" x2="1"><stop stop-color="#fff8cf"/><stop offset=".45" stop-color="#d7a72e"/><stop offset="1" stop-color="#76500b"/></linearGradient><filter id="brShadow"><feDropShadow dx="0" dy="7" stdDeviation="5" flood-opacity=".45"/></filter></defs><ellipse cx="130" cy="268" rx="72" ry="13" fill="#000" opacity=".35"/><path d="M103 211 L157 211 L170 254 L90 254 Z" fill="url(#br2)" stroke="#ffe995" stroke-width="3" filter="url(#brShadow)"/><path d="M76 247 Q130 229 184 247 L177 264 Q130 278 83 264Z" fill="#b7831d" stroke="#ffeaa0" stroke-width="3"/><g filter="url(#brShadow)"><circle cx="130" cy="112" r="78" fill="url(#br1)" stroke="#fff0a2" stroke-width="4"/><path d="M62 112 Q130 42 198 112 Q130 92 62 112Z" fill="#fff4b2" opacity=".2"/><path d="M69 143 Q130 186 191 143" fill="none" stroke="#80570c" stroke-width="5" opacity=".55"/><path d="M80 78 Q130 130 180 78 M66 99 Q130 153 194 99 M76 131 Q130 165 184 131" fill="none" stroke="#6e4b0b" stroke-width="3" opacity=".45"/><circle cx="106" cy="82" r="13" fill="#fff9d8" opacity=".55"/></g><path d="M116 186 L144 186 L150 215 L110 215Z" fill="url(#br2)"/><circle cx="130" cy="221" r="7" fill="#fff0a2"/></svg>`;}
function awardArt(category){const c=String(category).toLowerCase();if(c.includes('ballon'))return realisticBallonSvg();if(c.includes('top scorer'))return `<svg class="award-svg" viewBox="0 0 160 180"><path d="M45 42h70v70H45z" fill="#d6a52a"/><path d="M58 112h44l8 27H50z" fill="#9b7117"/><path d="M35 42h-18c0 28 15 43 28 43M125 42h18c0 28-15 43-28 43" fill="none" stroke="#e6bd4a" stroke-width="9"/><path d="M55 42l50 70" stroke="#fff3af" stroke-width="7" opacity=".55"/><rect x="38" y="139" width="84" height="12" rx="6" fill="#6d4b0a"/></svg>`;if(c.includes('defender'))return `<svg class="award-svg" viewBox="0 0 160 180"><path d="M80 15l58 22v53c0 38-26 61-58 77-32-16-58-39-58-77V37z" fill="#6f9b3b" stroke="#dff3a6" stroke-width="5"/><path d="M80 46l9 22 24 2-18 15 6 24-21-13-21 13 6-24-18-15 24-2z" fill="#17230d"/></svg>`;if(c.includes('player of the tournament'))return `<svg class="award-svg" viewBox="0 0 160 180"><circle cx="80" cy="52" r="27" fill="#d9aa2f"/><path d="M38 145q7-55 42-55t42 55z" fill="#b78118"/><circle cx="80" cy="52" r="12" fill="#fff2a7" opacity=".6"/><path d="M47 150h66" stroke="#fff1a4" stroke-width="8"/></svg>`;return `<svg class="award-svg" viewBox="0 0 160 180"><path d="M80 12l15 48h51l-41 30 16 49-41-30-41 30 16-49-41-30h51z" fill="#d3a22a" stroke="#fff1a3" stroke-width="4"/></svg>`;}
function fixtureScorerEntries(f){
  const norm=v=>Array.isArray(v)?v:[];
  return {home:norm(f.homeScorers),away:norm(f.awayScorers)};
}
function normalizeScorerName(v){return String(v||'').trim().replace(/\s+/g,' ');}
function parseScorers(text){
  return String(text||'').split(/[,\n]+/).map(x=>x.trim()).filter(Boolean).map(part=>{
    let m=part.match(/^(.*?)\s*(?:x|×|:|-)\s*(\d+)$/i);
    const player=normalizeScorerName(m?m[1]:part), goals=m?Math.max(1,Number(m[2])):1;
    return player?{player,goals}:null;
  }).filter(Boolean);
}
function scorerText(list){return (Array.isArray(list)?list:[]).map(x=>`${x.player||x.name||''}${Number(x.goals||1)>1?' x'+Number(x.goals||1):''}`).filter(x=>x.trim()).join(', ');}
function validateScorersForClub(list,club){
  const bad=(list||[]).filter(x=>{const p=state.players.find(q=>q.seasonId===SEASON_ID&&q.status!=='cancelled'&&String(q.name||'').trim().toLowerCase()===String(x.player||'').trim().toLowerCase());return !p||String(p.club||'').trim().toLowerCase()!==String(club||'').trim().toLowerCase();});
  return bad.map(x=>x.player);
}
function aggregateScorers(comps=AWARD_COMPETITIONS){
  const map=new Map();
  state.fixtures.filter(f=>comps.includes(compOf(f))&&score(f)).forEach(f=>{
    const {home,away}=fixtureScorerEntries(f), [ht,at]=teamsInFixture(f);
    [...home.map(x=>({...x,club:ht,competition:compOf(f)})),...away.map(x=>({...x,club:at,competition:compOf(f)}))].forEach(x=>{
      const name=normalizeScorerName(x.player||x.name); const goals=Math.max(1,Number(x.goals||1)); if(!name)return;
      const key=name.toLowerCase(); const row=map.get(key)||{player:name,goals:0,clubs:new Set(),competitions:new Set()};
      row.goals+=goals; row.clubs.add(x.club); row.competitions.add(x.competition); map.set(key,row);
    });
  });
  return [...map.values()];
}
function registeredPlayerByName(name){
  return state.players.find(p=>p.seasonId===SEASON_ID&&p.status!=='cancelled'&&String(p.name||'').trim().toLowerCase()===String(name||'').trim().toLowerCase());
}
function registeredPlayersForCompetition(comp){
  return state.players.filter(p=>p.seasonId===SEASON_ID&&p.status!=='cancelled'&&(!comp||p.competition===comp));
}
function awardAutoWinner(category, competition){
  if(category==='Top Scorer'){
    // In this league one registered player represents one club. Therefore the
    // club's GF is the player's tournament goals. This also works with older
    // results that were saved before scorer fields were introduced.
    const rows=table(competition).filter(r=>r.mp>0), registered=registeredPlayersForCompetition(competition);
    const candidates=registered.map(p=>{const r=rows.find(x=>String(x.team).trim().toLowerCase()===String(p.club||'').trim().toLowerCase());return r?{player:p.name,club:r.team,goals:r.gf,mp:r.mp}:null}).filter(Boolean);
    return candidates.sort((a,b)=>b.goals-a.goals||b.mp-a.mp||a.player.localeCompare(b.player))[0]||null;
  }
  if(category==='Best Defender'){
    const rows=table(competition).filter(r=>r.mp>0), registered=registeredPlayersForCompetition(competition);
    const candidates=registered.map(p=>{const r=rows.find(x=>String(x.team).toLowerCase()===String(p.club||'').toLowerCase());return r?{player:p.name,club:r.team,ga:r.ga,mp:r.mp}:null}).filter(Boolean);
    return candidates.sort((a,b)=>a.ga-b.ga||b.mp-a.mp||a.player.localeCompare(b.player))[0]||null;
  }
  return null;
}
function globalAutoWinner(category){
  if(category==='European Top Scorer'){
    // Sum the registered player's club GF across every domestic league plus UCL.
    const registered=state.players.filter(p=>p.seasonId===SEASON_ID&&p.status!=='cancelled');
    const map=new Map();
    AWARD_COMPETITIONS.forEach(comp=>{
      table(comp).filter(r=>r.mp>0).forEach(r=>{
        const key=String(r.team).trim().toLowerCase();
        const row=map.get(key)||{gf:0,played:false};
        row.gf+=r.gf; row.played=true; map.set(key,row);
      });
    });
    const candidates=registered.map(p=>{const row=map.get(String(p.club||'').trim().toLowerCase());return row&&row.played?{player:p.name,club:p.club,goals:row.gf}:null;}).filter(Boolean);
    return candidates.sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player))[0]||null;
  }
  if(category==='European Best Defender'){
    const registered=state.players.filter(p=>p.seasonId===SEASON_ID&&p.status!=='cancelled'), map=new Map();
    AWARD_COMPETITIONS.forEach(comp=>table(comp).filter(r=>r.mp>0).forEach(r=>{const key=String(r.team).toLowerCase();const row=map.get(key)||{ga:0,played:false};row.ga+=r.ga;row.played=true;map.set(key,row);}));
    const candidates=registered.map(p=>{const row=map.get(String(p.club||'').toLowerCase());return !row||!row.played?null:{player:p.name,club:p.club,ga:row.ga};}).filter(Boolean);
    return candidates.sort((a,b)=>a.ga-b.ga||a.player.localeCompare(b.player))[0]||null;
  }
  return null;
}
function voteWinner(a){
  if(!a || a.category!=='Player of the Tournament') return null;
  const rows=(a.nominees||[]).map(n=>({player:n,votes:state.awardVotes.filter(v=>v.awardId===a.id&&v.nominee===n).length}));
  rows.sort((x,y)=>y.votes-x.votes||x.player.localeCompare(y.player));
  return rows[0]?.votes>0?rows[0].player:null;
}
function awardWinnerFor(a){
  if(!a)return null;
  if(a.category==='Player of the Tournament') return a.winnerDeclared&&a.winner ? a.winner : null;
  if(a.category==='Top Scorer'||a.category==='Best Defender') return awardAutoWinner(a.category,a.competition)?.player||null;
  if(a.competition==='GLOBAL'&&(a.category==='European Top Scorer'||a.category==='European Best Defender')) return globalAutoWinner(a.category)?.player||null;
  return a.winner||null;
}
function displayAward(category,competition='GLOBAL'){
  return awardBy(category,competition)||{id:awardKey(category,competition),category,competition,season:state.season?.name||DEFAULT_SEASON,seasonId:SEASON_ID,nominees:[],top8:[]};
}
function awardPlayer(category, competition='GLOBAL'){
  const a=displayAward(category,competition);
  const winner=awardWinnerFor(a);
  if(winner){
    const p=registeredPlayerByName(winner);
    if(p)return {name:p.name,club:p.club};
    return {name:winner,club:''};
  }
  const first=(a.nominees||[]).map(registeredPlayerByName).find(Boolean);
  return first?{name:first.name,club:first.club}:null;
}
function awardLogo(category,competition='GLOBAL'){
  const p=awardPlayer(category,competition);
  return p?.club?logo(p.club):'<span class="award-logo-placeholder">🏆</span>';
}
function nomineeVoteRows(a){
  return (a.nominees||[]).map(n=>{
    const p=registeredPlayerByName(n);
    return {name:n,club:p?.club||'',count:state.awardVotes.filter(v=>v.awardId===a.id&&v.nominee===n).length};
  });
}
function renderAwards(){
  const ballon=displayAward("Ballon d'Or");
  if($('awardsSeason'))$('awardsSeason').textContent=state.season?.name||DEFAULT_SEASON;
  if($('ballonArt'))$('ballonArt').innerHTML=realisticBallonSvg();
  if($('ballonWinner')){
    const bw=ballon.winner||'Not announced yet';
    $('ballonWinner').innerHTML=`<span>WINNER</span><strong>${safeText(bw)}</strong>`;
  }
  if($('ballonTop8')){
    const top=(ballon.top8||[]).slice(0,8);
    $('ballonTop8').innerHTML=top.length?top.map((n,i)=>{
      const p=registeredPlayerByName(n);
      return `<div class="top8-row"><b>${i+1}</b><span>${p?.club?logo(p.club,true):''}${safeText(n)}</span></div>`;
    }).join(''):'<div class="muted">Top 8 not announced yet.</div>';
  }

  if($('leagueAwardsGrid'))$('leagueAwardsGrid').innerHTML=AWARD_COMPETITIONS.map(comp=>`<section class="award-competition">
    <div class="award-comp-head"><div><p class="eyebrow">${safeText(comp)}</p><h2>Competition Awards</h2></div></div>
    <div class="award-cards">
      ${['Player of the Tournament','Top Scorer','Best Defender'].map(cat=>{
        const a=displayAward(cat,comp), winner=awardWinnerFor(a), player=awardPlayer(cat,comp), votes=nomineeVoteRows(a), totalVotes=votes.reduce((x,v)=>x+v.count,0);
        const auto=awardAutoWinner(cat,comp);
        const status=cat==='Player of the Tournament'
          ? (winner?`WINNER DECLARED • ${totalVotes} total vote${totalVotes===1?'':'s'}`:'Voting open • '+totalVotes+' vote'+(totalVotes===1?'':'s'))
          : cat==='Top Scorer'
            ? `AUTO • ${auto?.goals||0} goal${auto?.goals===1?'':'s'} • ${auto?.mp||0} match${auto?.mp===1?'':'es'}`
            : `Auto-calculated • ${auto?.ga||0} goals conceded`;
        return `<article class="award-card">
          <div class="award-card-art ${player?.club?'has-club-logo':''}">
            ${awardLogo(cat,comp)}
          </div>
          <div class="award-card-body">
            <p class="eyebrow">${safeText(cat)}</p>
            <h3>${safeText(winner||'To be announced')}</h3>
            ${player?.club?`<div class="award-club-line">${logo(player.club,true)}<span>${safeText(player.club)}</span></div>`:''}
            <span class="award-status">${safeText(status)}</span>
            ${cat==='Player of the Tournament'&&a.nominees?.length?`<div class="vote-total">Nominees</div><div class="nominees">${votes.map(v=>`<button class="vote-btn" data-award="${safeText(a.id)}" data-nominee="${safeText(v.name)}">${v.club?logo(v.club,true):''}<b>${safeText(v.name)}</b><span>${v.count}</span></button>`).join('')}</div>`:''}
          </div>
        </article>`;
      }).join('')}
    </div>
  </section>`).join('');

  if($('globalAwardsGrid'))$('globalAwardsGrid').innerHTML=GLOBAL_AWARDS.filter(x=>x!=="Ballon d'Or").map(cat=>{
    const a=displayAward(cat),winner=awardWinnerFor(a),player=awardPlayer(cat),auto=globalAutoWinner(cat);
    const detail=winner
      ? `AUTO • ${cat==='European Top Scorer'?auto?.goals||0:auto?.ga||0} ${cat==='European Top Scorer'?'goals':'goals conceded'} across all leagues + UCL`
      : 'Auto-calculated from published results';
    return `<article class="global-award-card">
      <div class="global-award-art">${awardLogo(cat)}</div>
      <div class="global-award-copy"><p class="eyebrow">EUROPEAN AWARD</p><h3>${safeText(cat)}</h3><strong>${safeText(winner||'To be announced')}</strong>${player?.club?`<div class="award-club-line">${logo(player.club,true)}<span>${safeText(player.club)}</span></div>`:''}<small class="award-status">${safeText(detail)}</small></div>
    </article>`;
  }).join('');

  document.querySelectorAll('.vote-btn').forEach(btn=>btn.onclick=async()=>{
    const ok=await ensureAnon();
    if(!ok)return alert('Voting is temporarily unavailable.');
    const id=btn.dataset.award,nominee=btn.dataset.nominee,key='gosper_vote_'+id;
    if(localStorage.getItem(key))return alert('You have already voted for this award on this device.');
    try{
      await db.collection('awardVotes').add({awardId:id,nominee,seasonId:SEASON_ID,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      localStorage.setItem(key,'1');await loadData();alert('Vote submitted.');
    }catch(e){console.error(e);alert('Vote failed.');}
  });
}
function renderComments(){const box=$('commentsList');if(!box)return;const arr=state.comments.slice().sort((a,b)=>{const da=dateObj(a.createdAt),db=dateObj(b.createdAt);return (db?.getTime()||0)-(da?.getTime()||0);});box.innerHTML=arr.length?arr.map(c=>`<article class="comment"><div class="comment-avatar">${safeText(initials(c.name))}</div><div><b>${safeText(c.name)}</b><small>${dateText(c.createdAt)}</small><p>${safeText(c.text)}</p></div></article>`).join(''):'<div class="empty-block">No comments yet. Start the conversation.</div>';}
async function postComment(e){e.preventDefault();const name=$('commentName').value.trim(),text=$('commentText').value.trim(),msg=$('commentMsg');if(!name||!text)return;msg.textContent='Posting…';try{if(!(await ensureAnon()))throw new Error('auth');await db.collection('comments').add({name:name.slice(0,40),text:text.slice(0,500),seasonId:SEASON_ID,createdAt:firebase.firestore.FieldValue.serverTimestamp()});$('commentText').value='';msg.textContent='Posted';await loadData();}catch(err){console.error(err);msg.textContent='Could not post. Please try again.';}}
function adminAwards(c){
 const rows=[
  ['Player of the Tournament','Premier League'],['Player of the Tournament','LaLiga'],['Player of the Tournament','Serie A'],['Player of the Tournament','Bundesliga'],['Player of the Tournament','Championship'],['Player of the Tournament','UCL'],
  ['Top Scorer','Premier League'],['Top Scorer','LaLiga'],['Top Scorer','Serie A'],['Top Scorer','Bundesliga'],['Top Scorer','Championship'],['Top Scorer','UCL'],
  ['Best Defender','Premier League'],['Best Defender','LaLiga'],['Best Defender','Serie A'],['Best Defender','Bundesliga'],['Best Defender','Championship'],['Best Defender','UCL'],
  ["Ballon d'Or",'GLOBAL'],['European Top Scorer','GLOBAL'],['European Best Defender','GLOBAL']
 ];
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">AWARDS CONTROL</p><h2>Awards Management</h2><p>Manual awards and automatic awards are separated. Automatic awards update from published match results.</p></div></div>
 <div class="admin-award-form">
   <label class="admin-field-label">Choose award<select id="awardCategory">${rows.map((r,i)=>`<option value="${i}">${safeText(r[0])} — ${safeText(r[1])}</option>`).join('')}</select></label>
   <div id="awardManualFields"></div>
   <div id="awardAutoInfo" class="admin-control-card" hidden></div>
   <button class="primary" id="saveAward" hidden>Save Award</button>
 </div>
 <div class="admin-list" id="adminAwardsList"></div>`;
 const cat=$('awardCategory'), manual=$('awardManualFields'), auto=$('awardAutoInfo'), save=$('saveAward');
 const renderList=()=>{
   $('adminAwardsList').innerHTML=state.awards.length?state.awards.map(a=>{const w=awardWinnerFor(a);const votes=a.category==='Player of the Tournament'?(a.nominees||[]).map(n=>`${safeText(n)}: ${state.awardVotes.filter(v=>v.awardId===a.id&&v.nominee===n).length}`).join(' • '):'';return `<article class="admin-item"><div><b>${safeText(a.category)}</b><span>${safeText(a.competition||'GLOBAL')}</span><p>Winner: ${safeText(w||'Not announced')}</p>${a.category==='Player of the Tournament'&&a.nominees?.length?`<p>Nominees: ${a.nominees.map(safeText).join(', ')}</p><small>${votes}</small><button class="mini-btn" data-declare-award="${safeText(a.id)}">Declare Winner</button>`:''}${a.category==="Ballon d'Or"&&a.top8?.length?`<p>Top 8: ${a.top8.slice(0,8).map((n,i)=>`${i+1}. ${safeText(n)}`).join(' • ')}</p>`:''}</div></article>`}).join(''):'<p class="muted">No manual awards configured yet.</p>';
 };
 const fill=()=>{
   const [category,comp]=rows[Number(cat.value)],a=awardBy(category,comp);
   const isPot=category==='Player of the Tournament',isBallon=category==="Ballon d'Or",isManual=isPot||isBallon;
   auto.hidden=isManual;save.hidden=!isManual;manual.innerHTML='';
   if(isPot){
     const ns=[0,1,2].map(i=>a?.nominees?.[i]||'');
     manual.innerHTML=`<div class="manual-award-title"><b>🗳️ Public Voting</b><span>Enter exactly 3 nominees. Winner is calculated automatically from votes.</span></div><div class="nominee-inputs">${ns.map((n,i)=>`<label>Nominee ${i+1}<input id="potNominee${i}" value="${safeText(n)}" placeholder="Player name"></label>`).join('')}</div><div class="manual-vote-preview">Current winner: <strong>${safeText(voteWinner(a)||'No votes yet')}</strong></div>`;
   } else if(isBallon){
     const top=(a?.top8||[]).slice(0,8),winner=a?.winner||'';
     manual.innerHTML=`<div class="manual-award-title"><b>🌟 Ballon d'Or — Manual</b><span>Admin chooses the winner and Top 8 positions.</span></div><label>Winner<input id="ballonWinnerInput" value="${safeText(winner)}" placeholder="Winner"></label><div class="ballon-input-grid">${Array.from({length:8},(_,i)=>`<label>#${i+1}<input id="ballonTop${i}" value="${safeText(top[i]||'')}" placeholder="Player ${i+1}"></label>`).join('')}</div>`;
   } else {
     const calc=comp==='GLOBAL'?globalAutoWinner(category):awardAutoWinner(category,comp);
     let detail='No completed results yet.';
     if(category==='Top Scorer') detail=calc?`${calc.player} — ${calc.goals} goals`:'No recorded scorers yet';
     if(category==='Best Defender') detail=calc?`${calc.player} — ${calc.ga} goals conceded`:'No completed results yet';
     if(category==='European Top Scorer') detail=calc?`${calc.player} — ${calc.goals} goals across all leagues + UCL`:'No recorded scorers yet';
     if(category==='European Best Defender') detail=calc?`${calc.player} — ${calc.ga} total goals conceded across all leagues + UCL`:'No completed results yet';
     auto.innerHTML=`<b>⚡ AUTOMATIC AWARD</b><p class="auto-award-value">${safeText(detail)}</p><small>Updates automatically when a published result changes. There is nothing to save here.</small>`;
   }
 };
 cat.onchange=fill;fill();
 save.onclick=async()=>{
   const [category,comp]=rows[Number(cat.value)];
   let data={category,competition:comp,season:state.season?.name||DEFAULT_SEASON,seasonId:SEASON_ID};
   if(category==='Player of the Tournament'){
     const nominees=[0,1,2].map(i=>$('potNominee'+i).value.trim()).filter(Boolean);
     if(nominees.length!==3||new Set(nominees.map(x=>x.toLowerCase())).size!==3){alert('Enter exactly 3 different nominees.');return;}
     data.nominees=nominees;data.winner='';data.top8=[];
   } else if(category==="Ballon d'Or"){
     const top8=Array.from({length:8},(_,i)=>$('ballonTop'+i).value.trim()).filter(Boolean).slice(0,8),winner=$('ballonWinnerInput').value.trim();
     if(!winner){alert('Enter the Ballon d’Or winner.');return;}
     if(top8.length!==8){alert('Enter all Top 8 positions from #1 to #8.');return;}
     data.winner=winner;data.top8=top8;data.nominees=top8;
   }
   try{await adminSave('awards',awardKey(category,comp),data);alert('Award saved successfully.');await loadData();adminTab('awards');}catch(e){console.error(e);alert('Award could not be saved. Check your admin login and Firestore Rules.');}
 };
 renderList();
 c.querySelectorAll('[data-declare-award]').forEach(b=>b.onclick=async()=>{const a=state.awards.find(x=>x.id===b.dataset.declareAward);if(!a)return;const winner=voteWinner(a);if(!winner)return alert('There are no votes yet.');if(!confirm(`Declare ${winner} as the winner?`))return;await db.collection('awards').doc(a.id).set({winner, winnerDeclared:true, winnerDeclaredAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});await loadData();adminTab('awards');});
}
function adminCommunity(c){c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">COMMUNITY CONTROL</p><h2>Comments</h2><p>Moderate public comments.</p></div></div><div class="admin-list">${state.comments.map(x=>`<article class="admin-item"><div><b>${safeText(x.name)}</b><span>${dateText(x.createdAt)}</span><p>${safeText(x.text)}</p></div><button class="mini-btn danger" data-delete-comment="${safeText(x.id)}">Delete</button></article>`).join('')||'<p class="muted">No comments.</p>'}</div>`;c.querySelectorAll('[data-delete-comment]').forEach(b=>b.onclick=async()=>{if(!confirm('Delete this comment?'))return;await db.collection('comments').doc(b.dataset.deleteComment).delete();await loadData();adminTab('community');});}
$('commentForm')?.addEventListener('submit',postComment);

function applySeasonTheme(){const theme=Number(state.season?.theme||((Number(state.season?.order||1)-1)%6)+1);document.body.dataset.seasonTheme=theme;const sel=$('seasonSelector');if(sel){sel.innerHTML=state.seasons.map(s=>`<option value="${esc(s.id)}">${esc(s.name||s.id)}</option>`).join('');sel.value=SEASON_ID;}}
async function switchSeason(id){
 if(!id||id===SEASON_ID)return;
 document.body.classList.remove('season-page-turn');
 void document.body.offsetWidth;
 document.body.classList.add('season-page-turn');
 SEASON_ID=id;
 await loadData();
 setTimeout(()=>document.body.classList.remove('season-page-turn'),650);
}
function renderAll(){renderDashboard();renderTeams();renderFixtures();renderStandings();renderPlayers();renderHall();renderNews();renderAwards();renderComments();$('sideSeason').textContent=$('topSeason').textContent=$('footerSeason').textContent=state.season?.name||DEFAULT_SEASON;if($('seasonStatus'))$('seasonStatus').textContent=state.season?.status||'Ongoing';applySeasonTheme();}
function showCompetition(c){const teams=activeTeams(c);$('competitionDetail').innerHTML=`<div class="panel-head"><div><span class="eyebrow">${esc(c)}</span><h2>${esc(c)} Control</h2></div><button class="primary" id="detailRegister">Register Player</button></div><div class="detail-grid"><div><b>${teams.length}</b><span>Available teams</span></div><div><b>${state.fixtures.filter(f=>compOf(f)===c).length}</b><span>Fixtures</span></div><div><b>${state.players.filter(p=>p.competition===c).length}</b><span>Players</span></div></div><div class="mini-team-list">${teams.slice(0,12).map(t=>`<span>${logo(t.name,true)}${esc(t.name)}</span>`).join('')}</div>`;$('detailRegister').onclick=()=>{openRegister();$('competition').value=c;populateClubPicker('');};}
function searchSite(e){const q=(e.target?.value||e||'').trim().toLowerCase();if(!q)return;const t=teamObjects().find(x=>x.name.toLowerCase().includes(q));const p=state.players.find(x=>String(x.name).toLowerCase().includes(q)||String(x.playerId).toLowerCase().includes(q));const f=state.fixtures.find(x=>teamsInFixture(x).some(n=>n.toLowerCase().includes(q)));if(t)go('teams');else if(p)go('players');else if(f)go('fixtures');}

// ---------- Admin ----------
$('adminLoginBtn')?.addEventListener('click',openAdminLogin);$('adminLoginBtn2')?.addEventListener('click',openAdminLogin);
function openAdminLogin(){
  const email=prompt('Admin email:'); if(!email)return;
  const password=prompt('Admin password:'); if(password===null)return;
  auth.signInWithEmailAndPassword(email.trim(),password).then(async()=>{state.admin=true;await loadData();go('admin');}).catch(e=>alert('Admin login failed. Check Firebase Authentication email/password.'));
}
async function adminSave(collection,id,data){
  const user=auth.currentUser;
  if(!user || user.isAnonymous) throw new Error('ADMIN_SESSION_REQUIRED');
  const ref=db.collection(collection).doc(id||db.collection(collection).doc().id);
  await ref.set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
  await loadData();
}
async function adminDelete(collection,id){if(!confirm('Delete this item?'))return;await db.collection(collection).doc(id).delete();await loadData();}
function renderAdmin(){
 const a=$('adminArea');
 if(!state.admin){a.innerHTML=`<div class="admin-lock"><div class="lock-icon">⚙</div><h2>Admin access required</h2><p>Sign in with your Firebase administrator account.</p><button class="primary" id="adminLoginBtn2">Sign in to Control Center</button></div>`;$('adminLoginBtn2').onclick=openAdminLogin;return;}
 a.innerHTML=`<div class="admin-shell"><div class="admin-nav"><button class="admin-tab active" data-admin-tab="overview">Overview</button><button class="admin-tab season-launch-tab" data-admin-tab="newseason">▶ Start New Season</button><button class="admin-tab" data-admin-tab="competitions">Competitions</button><button class="admin-tab" data-admin-tab="teams">Teams</button><button class="admin-tab" data-admin-tab="fixtures">Fixtures</button><button class="admin-tab" data-admin-tab="ucl">UCL Groups</button><button class="admin-tab" data-admin-tab="results">Results</button><button class="admin-tab" data-admin-tab="members">Members</button><button class="admin-tab" data-admin-tab="promotion">Promotion / Relegation</button><button class="admin-tab" data-admin-tab="news">News</button><button class="admin-tab" data-admin-tab="awards">🏆 Awards</button><button class="admin-tab" data-admin-tab="community">💬 Community</button><button class="admin-tab" data-admin-tab="hall">Hall of Fame</button><button class="admin-tab" data-admin-tab="season">Season</button><button class="ghost" id="adminSignOut">Sign out</button></div><div id="adminContent"></div></div>`;
 document.querySelectorAll('.admin-tab').forEach(b=>b.onclick=()=>adminTab(b.dataset.adminTab));$('adminSignOut').onclick=()=>auth.signOut().then(()=>{state.admin=false;renderAdmin();});adminTab('overview');
}
function adminTab(tab){
 document.querySelectorAll('.admin-tab').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===tab));
 const c=$('adminContent');
 if(tab==='overview')adminOverview(c);if(tab==='newseason')adminNewSeason(c);if(tab==='competitions')adminCompetitions(c);if(tab==='teams')adminTeams(c);if(tab==='fixtures')adminFixtures(c);if(tab==='ucl')adminUCL(c);if(tab==='results')adminResults(c);if(tab==='members')adminMembers(c);if(tab==='promotion')adminPromotion(c);if(tab==='news')adminNews(c);if(tab==='awards')adminAwards(c);if(tab==='community')adminCommunity(c);if(tab==='hall')adminHall(c);if(tab==='season')adminSeason(c);
}
function adminNewSeason(c){
 const s=state.season||{};
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">SEASON CONTROL</p><h2>Start New Season</h2><p>Finish the current season, save its champions, apply promotion/relegation, carry registered players forward, qualify the 16 UCL clubs and generate fresh fixtures.</p></div></div>
 <div class="admin-control-card season-start-card"><div><p class="eyebrow">CURRENT SEASON</p><h2>${esc(s.name||DEFAULT_SEASON)}</h2><p class="muted">Status: ${esc(s.status||'Ongoing')} • ${esc(s.year||'')}</p></div><button class="primary" id="startSeasonNow" style="font-size:1.05rem;padding:14px 22px">▶ Start New Season</button></div>
 <div class="admin-control-card"><div><p class="eyebrow">WHAT WILL HAPPEN</p><h3>Season transition</h3><p class="muted">1. Current season is archived. 2. Champions go to Hall of Fame. 3. Championship #1–#4 are promoted. 4. Each major league #8 is relegated. 5. Top 4 from each major league enter the 16-team UCL. 6. New home-and-away fixtures are generated.</p></div></div>`;
 $('startSeasonNow').onclick=startNewSeason;
}
function adminOverview(c){
 const active=(state.season?.activeCompetitions||ALL_COMPETITIONS);
 c.innerHTML=`<div class="admin-grid"><div class="admin-stat"><b>${state.teams.length||catalog.length}</b><span>Clubs in system</span></div><div class="admin-stat"><b>${state.players.length}</b><span>Players</span></div><div class="admin-stat"><b>${state.fixtures.length}</b><span>Fixtures</span></div><div class="admin-stat"><b>${state.fixtures.filter(f=>score(f)).length}</b><span>Results entered</span></div></div><div class="admin-control-card season-start-card"><div><p class="eyebrow">SEASON CONTROL</p><h2>Start a New Season</h2><p class="muted">Archive the current season, apply promotion/relegation, carry members forward, save champions and generate fresh domestic + UCL fixtures.</p></div><button class="primary" id="adminStartNewSeason">▶ Start New Season</button></div><div class="admin-control-card"><div><p class="eyebrow">CURRENT SEASON</p><h2>${esc(state.season?.name||DEFAULT_SEASON)}</h2><p class="muted">Active competitions: ${active.map(esc).join(' • ')}</p></div><button class="primary" id="quickComp">Choose competitions</button></div><div class="admin-control-card"><div><p class="eyebrow">SEASON MOVEMENT</p><h2>Manual promotion & relegation</h2><p class="muted">Promotion and relegation are selected manually before starting the next season.</p></div><button class="primary" id="quickMove">Open</button></div>`;
 $('adminStartNewSeason').onclick=startNewSeason;$('quickComp').onclick=()=>adminTab('competitions');$('quickMove').onclick=()=>adminTab('promotion');
}
function adminCompetitions(c){
 const active=state.season?.activeCompetitions||ALL_COMPETITIONS;
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">COMPETITION CONTROL</p><h2>Season competition setup</h2><p>Premier League, LaLiga, Serie A and Bundesliga each have an 8-club pool. Championship is exactly 8 African clubs. UCL clubs are created from the top 4 of every major league.</p></div></div><div class="competition-control-grid">${ALL_COMPETITIONS.map(x=>`<label class="competition-toggle"><input type="checkbox" data-active-comp="${x}" ${active.includes(x)?'checked':''}><span class="toggle-copy"><b>${x}</b><small>${x==='UCL'?'16 qualified clubs • 4 groups of 4 • Group Stage':x==='Championship'?'8 African clubs • Home & Away':x==='Premier League'?'8 clubs • Home & Away':['Premier League','LaLiga','Serie A','Bundesliga'].includes(x)?'8 clubs • Home & Away':'6 clubs • Home & Away'}</small></span><strong>${active.includes(x)?'ACTIVE':'OFF'}</strong></label>`).join('')}</div><div class="admin-actions-row"><button class="primary" id="saveActiveComps">Save Competition Setup</button></div>`;
 $('saveActiveComps').onclick=async()=>{const active=[...document.querySelectorAll('[data-active-comp]:checked')].map(x=>x.dataset.activeComp);if(!active.length)return alert('Select at least one competition.');await adminSave('seasons',SEASON_ID,{activeCompetitions:active});alert('Competition setup saved.');adminTab('competitions');};
}
function adminTeams(c){
 const all=catalogObjects();
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">CLUB CONTROL</p><h2>Official club pool</h2><p>Original structure: 8 clubs in each major league and 8 African clubs in Championship. Team logos below come directly from the original club catalog.</p></div><div class="admin-actions"><button class="primary" id="restoreOriginalClubs">↩ Restore Original Clubs</button><button class="primary" id="applyClubStructure">Save Club Availability</button></div></div><div class="admin-control-card"><p class="muted"><b>Restore Original Clubs</b> removes promoted/relegated club records from the selected season, restores the original 40 clubs, resets their original competitions and restores every original logo. It does not delete previous seasons.</p></div><div class="admin-team-grid">${all.map(t=>{const saved=state.teams.find(x=>x.name===t.name)||{};return `<div class="admin-team-card"><div class="admin-team-main">${logo(t.name)}<div><b>${esc(t.name)}</b><small>${esc(t.competition)}</small></div></div><div class="comp-checks"><label><input type="checkbox" checked disabled> ${esc(t.competition)}</label><label class="enable-check"><input type="checkbox" data-team-enabled="${esc(t.name)}" ${saved.enabled!==false?'checked':''}> Available</label></div></div>`}).join('')}</div>`;
 $('restoreOriginalClubs').onclick=async()=>{
   if(!state.admin)return alert('Admin access required.');
   const live=currentSeasonRecord();
   const targetId=live?.id||SEASON_ID;
   const targetName=live?.name||state.season?.name||DEFAULT_SEASON;
   if(!confirm(`HARD RESET the clubs for ${targetName}?\n\nThis will remove EVERY team document belonging to the active season, remove non-original promoted clubs, restore exactly the original 40 clubs with their original logos and competitions, clear manual promotion/relegation, and reset the saved UCL group list. Previous seasons will NOT be changed.`))return;
   try{
     const [allTeams,allPlayers,allLocks]=await Promise.all([getAllStrict('teams'),getAllStrict('players'),getAllStrict('playerTeamLocks')]);
     const originalNames=new Set(all.map(t=>t.name));
     const originalByName=new Map(all.map(t=>[t.name,t]));
     const currentTeams=allTeams.filter(t=>!t.seasonId?(targetId==='season-1'):t.seasonId===targetId);

     // Firestore batches have a 500-operation limit. Delete current-season team docs in chunks, then write the exact 40 originals.
     const deleteInChunks=async(collection,docs)=>{
       for(let i=0;i<docs.length;i+=400){
         const b=db.batch();
         docs.slice(i,i+400).forEach(d=>b.delete(db.collection(collection).doc(d.id)));
         if(docs.length)await b.commit();
       }
     };
     await deleteInChunks('teams',currentTeams);

     const originalTeamDocs=all.map(t=>({
       id:`${targetId}__${t.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,
       name:t.name,competition:t.competition,competitions:[t.competition],logo:t.logo||'',enabled:true,seasonId:targetId
     }));
     await batchWriteDocs('teams',originalTeamDocs);

     // Move registered members back to the original competition when their club is one of the original 40.
     // Members attached to a non-original promoted club are removed from this season because that club no longer exists.
     const currentPlayers=allPlayers.filter(p=>p.seasonId===targetId||(!p.seasonId&&targetId==='season-1'));
     const playersToDelete=currentPlayers.filter(p=>!originalNames.has(p.club));
     await deleteInChunks('players',playersToDelete);
     const playersToRestore=currentPlayers.filter(p=>originalNames.has(p.club)).map(p=>({
       ...p,seasonId:targetId,competition:originalByName.get(p.club).competition,status:'active'
     }));
     if(playersToRestore.length)await batchWriteDocs('players',playersToRestore);

     const currentLocks=allLocks.filter(x=>x.seasonId===targetId||(!x.seasonId&&targetId==='season-1'));
     const locksToDelete=currentLocks.filter(x=>!originalNames.has(x.club));
     await deleteInChunks('playerTeamLocks',locksToDelete);

     // Reset season-level movement/UCL state so old promoted teams cannot reappear from cached season data.
     const emptyGroups={A:[],B:[],C:[],D:[]};
     await adminSave('seasons',targetId,{
       activeCompetitions:ALL_COMPETITIONS,
       manualMovement:{promoted:[],relegated:[]},
       promoted:[],
       relegated:[],
       uclTeams:[],
       uclGroups:emptyGroups,
       clubsRestoredAt:firebase.firestore.FieldValue.serverTimestamp()
     });

     SEASON_ID=targetId;
     await loadData();
     alert(`Original clubs restored for ${targetName}.\n\n✓ Exactly 40 original clubs\n✓ Original competitions restored\n✓ Original logos restored\n✓ Promoted/non-original clubs removed\n✓ Manual promotion/relegation cleared\n✓ Saved UCL groups reset\n✓ Previous seasons untouched`);
     adminTab('teams');
   }catch(e){
     console.error('restoreOriginalClubs failed',e);
     alert(`Could not restore the original clubs.\n\nError: ${e.message||e}`);
   }
 };
 $('applyClubStructure').onclick=async()=>{
   try{
     const allTeams=await getAllStrict('teams');
     const batch=db.batch();
     const current=allTeams.filter(t=>!t.seasonId?(SEASON_ID==='season-1'):t.seasonId===SEASON_ID);
     current.forEach(old=>{const wanted=all.some(t=>t.name===old.name);if(!wanted)batch.delete(db.collection('teams').doc(old.id));});
     for(const t of all){
       const enabled=document.querySelector(`[data-team-enabled="${CSS.escape(t.name)}"]`).checked;
       const id=`${SEASON_ID}__${t.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
       batch.set(db.collection('teams').doc(id),{id,name:t.name,competitions:[t.competition],competition:t.competition,logo:t.logo||'',enabled,seasonId:SEASON_ID},{merge:true});
     }
     await batch.commit();
     await adminSave('seasons',SEASON_ID,{activeCompetitions:ALL_COMPETITIONS});
     await loadData();
     alert('Club availability saved with original logos.');
     adminTab('teams');
   }catch(e){console.error(e);alert(`Could not save club structure.\n\nError: ${e.message||e}`);}
 };
}
function adminFixtures(c){
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">FIXTURE ENGINE</p><h2>Domestic fixtures</h2><p>Generate a proper Home & Away round-robin for every domestic league. Each Matchday contains each pairing once; the return leg is placed in the second half of the season.</p></div><div class="admin-actions"><select id="genComp">${[...MAJOR_LEAGUES,'Championship'].map(x=>`<option>${x}</option>`).join('')}</select><button class="primary" id="generateFixtures">Generate Home & Away</button><button class="primary danger" id="deleteAllFixtures">Delete ALL Fixtures</button></div></div><div class="form-grid admin-form"><select id="fxComp">${ALL_COMPETITIONS.map(x=>`<option>${x}</option>`).join('')}</select><input id="fxHome" placeholder="Home team"><input id="fxAway" placeholder="Away team"><input id="fxDate" type="date"><input id="fxRound" placeholder="Round / Matchday"><button class="primary" id="addFixture">Add Fixture</button></div><div class="admin-list">${state.fixtures.slice().sort((a,b)=>(dateObj(a.date)||0)-(dateObj(b.date)||0)).map(f=>fixtureHtml(f,true)).join('')||'<p class="muted">No fixtures yet.</p>'}</div>`;
 $('generateFixtures').onclick=()=>generateFixtures($('genComp').value);
 $('deleteAllFixtures').onclick=deleteAllFixtures;
 $('addFixture').onclick=async()=>{const id=db.collection('fixtures').doc().id;await adminSave('fixtures',id,{competition:$('fxComp').value,homeTeam:$('fxHome').value.trim(),awayTeam:$('fxAway').value.trim(),date:$('fxDate').value,round:$('fxRound').value||'Matchday',seasonId:SEASON_ID});adminTab('fixtures');};
}
async function deleteAllFixtures(){
 if(!state.fixtures.length){alert('There are no fixtures to delete.');return;}
 if(!confirm(`Delete ALL ${state.fixtures.length} fixtures from every competition? This cannot be undone.`))return;
 try{
  const refs=state.fixtures.map(f=>db.collection('fixtures').doc(f.id));
  for(let i=0;i<refs.length;i+=450){
   const batch=db.batch();
   refs.slice(i,i+450).forEach(ref=>batch.delete(ref));
   await batch.commit();
  }
  await loadData();
  alert('All fixtures have been deleted.');
 }catch(e){
  console.error(e);
  alert('Could not delete all fixtures. Check admin permissions and try again.');
 }
}
async function generateFixtures(comp){
 const teams=teamObjects(comp).map(t=>t.name).filter(Boolean);
 if(teams.length<2){alert(`At least 2 teams are required for ${comp}.`);return;}
 const oldFixtures=state.fixtures.filter(f=>compOf(f)===comp);
 if(oldFixtures.length){
  const played=oldFixtures.filter(f=>score(f)).length;
  const warning=played?`\n\nWarning: ${played} fixture(s) already have results. Rebuilding will delete them too.`:'';
  if(!confirm(`${comp} already has ${oldFixtures.length} fixture(s). Rebuild its complete schedule using the correct round-robin order?${warning}`))return;
  try{
   for(let i=0;i<oldFixtures.length;i+=450){
    const batch=db.batch();
    oldFixtures.slice(i,i+450).forEach(f=>batch.delete(db.collection('fixtures').doc(f.id)));
    await batch.commit();
   }
  }catch(e){
   console.error(e);
   alert('Could not clear the old fixtures. Check admin permissions and try again.');
   return;
  }
 }
 // Circle-method round robin. Every team plays exactly once per Matchday.
 // For an even number of teams: N-1 first-leg Matchdays, then N-1 return-leg Matchdays.
 let arr=teams.slice();
 if(arr.length%2)arr.push(null);
 const n=arr.length, rounds=n-1, half=n/2;
 const firstLeg=[];
 for(let r=0;r<rounds;r++){
  const games=[];
  for(let i=0;i<half;i++){
   const home=arr[i], away=arr[n-1-i];
   if(home&&away)games.push([home,away]);
  }
  firstLeg.push(games);
  // Keep the first team fixed and rotate all other teams around it.
  arr=[arr[0],arr[n-1],...arr.slice(1,n-1)];
 }
 const schedule=[];
 firstLeg.forEach(games=>schedule.push(games));
 firstLeg.forEach(games=>schedule.push(games.map(([home,away])=>[away,home])));
 const fixtures=schedule.flatMap((games,r)=>games.map(([home,away])=>({home,away,round:r+1})));
 for(let i=0;i<fixtures.length;i+=450){
  const batch=db.batch();
  fixtures.slice(i,i+450).forEach(({home,away,round})=>{
   const ref=db.collection('fixtures').doc();
   batch.set(ref,{competition:comp,homeTeam:home,awayTeam:away,round:`Matchday ${round}`,date:'',seasonId:SEASON_ID,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
  });
  await batch.commit();
 }
 await loadData();
 const gamesPerDay=fixtures.length/((teams.length%2?teams.length:teams.length)-1)/2;
 alert(`${fixtures.length} fixtures generated for ${comp}. ${rounds} first-leg Matchdays + ${rounds} return-leg Matchdays, with ${Math.floor(gamesPerDay)} match(es) per Matchday.`);
}

function adminUCL(c){
 const qualified=qualifiedUCLTeams();
 const groupsDocId=`${SEASON_ID}_groups`;
 const savedGroups=state.season?.uclGroups||{};
 const groups=['A','B','C','D'].map(g=>({name:g,teams:Array.isArray(savedGroups[g])?savedGroups[g]:[]}));
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">UEFA CHAMPIONS LEAGUE</p><h2>UCL Group Stage</h2><p>Top 4 teams from every major league qualify. Generate 4 groups of 4, then generate home & away group fixtures.</p></div><div class="admin-actions"><button class="primary" id="generateUclGroups">Generate UCL Groups</button><button class="primary" id="generateUclFixtures">Generate UCL Fixtures</button></div></div>
 <div class="admin-control-card"><div><p class="eyebrow">QUALIFIED TEAMS</p><h3>${qualified.length}/16 qualified</h3><p class="muted">Qualification is calculated from the current domestic standings.</p></div></div>
 <div class="admin-grid">${groups.map(g=>`<div class="tool-card"><h3>GROUP ${g.name}</h3><div class="admin-list">${g.teams.length?g.teams.map((t,i)=>`<div class="admin-item"><b>${i+1}. ${esc(t.name||t)}</b><span>${esc(t.league||'')}</span></div>`).join(''):'<p class="muted">No teams assigned yet.</p>'}</div></div>`).join('')}</div>`;
 $('generateUclGroups').onclick=async()=>{
   if(qualified.length!==16){alert(`UCL requires 16 qualified teams. Currently ${qualified.length} are available.`);return;}
   const next={A:[],B:[],C:[],D:[]};
   const slots=['A','B','C','D'];
   const byLeague=new Map();
   qualified.forEach(t=>{if(!byLeague.has(t.league))byLeague.set(t.league,[]);byLeague.get(t.league).push(t);});
   let li=0;
   for(const teams of byLeague.values()){
     const pair=teams.slice().sort(()=>Math.random()-0.5);
     const g1=slots[li%4],g2=slots[(li+2)%4];
     next[g1].push(pair[0]);
     if(pair[1])next[g2].push(pair[1]);
     li++;
   }
   if(!confirm('Generate new UCL groups from the current top 2 teams of every major league? Existing UCL group assignments will be replaced.'))return;
   try{await adminSave('seasons',SEASON_ID,{uclGroups:next,uclGroupsGeneratedAt:firebase.firestore.FieldValue.serverTimestamp()});alert('UCL groups generated successfully.');adminTab('ucl');}
   catch(e){console.error(e);alert('Could not generate UCL groups. Check Firestore Rules.');}
 };
 $('generateUclFixtures').onclick=async()=>{
   const current=state.season?.uclGroups;
   if(!current||!Object.values(current).some(x=>Array.isArray(x)&&x.length))return alert('Generate UCL groups first.');
   const existing=state.fixtures.filter(f=>compOf(f)==='UCL');
   if(existing.length&&!confirm(`UCL already has ${existing.length} fixture(s). Rebuild all UCL group-stage fixtures?`))return;
   try{
     for(let i=0;i<existing.length;i+=450){const batch=db.batch();existing.slice(i,i+450).forEach(f=>batch.delete(db.collection('fixtures').doc(f.id)));await batch.commit();}
     const out=[];
     for(const [group,raw] of Object.entries(current)){
       const teams=raw.map(x=>typeof x==='string'?x:x.name).filter(Boolean);
       if(teams.length!==4)continue;
       for(let r=0;r<3;r++){
         const a=teams.slice();
         const order=[a[0],a[1],a[2],a[3]];
         const pairs=r===0?[[order[0],order[1]],[order[2],order[3]]]:r===1?[[order[0],order[2]],[order[3],order[1]]]:[[order[0],order[3]],[order[1],order[2]]];
         pairs.forEach(([home,away])=>out.push({group,home,away,round:r+1}));
         pairs.forEach(([home,away])=>out.push({group,home:away,away:home,round:r+4}));
       }
     }
     for(let i=0;i<out.length;i+=450){const batch=db.batch();out.slice(i,i+450).forEach(x=>{const ref=db.collection('fixtures').doc();batch.set(ref,{competition:'UCL',group:x.group,homeTeam:x.home,awayTeam:x.away,round:`Matchday ${x.round}`,date:'',seasonId:SEASON_ID,stage:'Group Stage',createdAt:firebase.firestore.FieldValue.serverTimestamp()});});await batch.commit();}
     await loadData();alert(`${out.length} UCL group-stage fixtures generated.`);adminTab('ucl');
   }catch(e){console.error(e);alert('Could not generate UCL fixtures. Check Firestore Rules.');}
 };
}
function adminPromotion(c){
 const manual=state.season?.manualMovement||{};
 const promoted=Array.isArray(manual.promoted)?manual.promoted:[];
 const relegated=Array.isArray(manual.relegated)?manual.relegated:[];
 const championship=teamObjects('Championship').slice(0,8).map(t=>t.name);
 const leagueTeams=Object.fromEntries(MAJOR_LEAGUES.map(l=>[l,teamObjects(l).slice(0,8).map(t=>t.name)]));
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">SEASON MOVEMENT</p><h2>Manual Promotion / Relegation</h2><p>Choose the 4 Championship clubs that will be promoted and the 8th club from each major league that will be relegated. The choices are saved for the <b>next season</b>; the current season is not changed.</p></div></div>
 <div class="admin-grid">${MAJOR_LEAGUES.map((league,i)=>{
   const p=promoted.find(x=>x.to===league)?.team||'';
   const r=relegated.find(x=>x.from===league)?.team||'';
   return `<div class="tool-card movement-card"><h3>${esc(league)}</h3><label>Promote to ${esc(league)}<select data-promote="${esc(league)}"><option value="">Select Championship club</option>${championship.map(t=>`<option value="${esc(t)}" ${t===p?'selected':''}>${esc(t)}</option>`).join('')}</select></label><label>Relegate from ${esc(league)}<select data-relegate="${esc(league)}"><option value="">Select club</option>${leagueTeams[league].map(t=>`<option value="${esc(t)}" ${t===r?'selected':''}>${esc(t)}</option>`).join('')}</select></label></div>`;
 }).join('')}</div>
 <div class="admin-actions-row"><button class="primary" id="saveMovement">Save Promotion / Relegation</button><span class="muted" id="movementMsg"></span></div>`;
 $('saveMovement').onclick=async()=>{
   const nextPromoted=MAJOR_LEAGUES.map(league=>({team:c.querySelector(`[data-promote="${CSS.escape(league)}"]`).value,to:league}));
   const nextRelegated=MAJOR_LEAGUES.map(league=>({team:c.querySelector(`[data-relegate="${CSS.escape(league)}"]`).value,from:league}));
   const missingP=nextPromoted.filter(x=>!x.team).map(x=>x.to), missingR=nextRelegated.filter(x=>!x.team).map(x=>x.from);
   const duplicateP=new Set(nextPromoted.filter(x=>x.team).map(x=>x.team)).size!==nextPromoted.filter(x=>x.team).length;
   if(missingP.length||missingR.length||duplicateP){
     $('movementMsg').textContent=`Complete all 4 promotions and 4 relegations. ${duplicateP?'A Championship club can only be promoted once.':''}`;
     return;
   }
   const btn=$('saveMovement');btn.disabled=true;btn.textContent='Saving…';
   try{
     await adminSave('seasons',SEASON_ID,{manualMovement:{promoted:nextPromoted,relegated:nextRelegated,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}});
     $('movementMsg').textContent='Saved. These movements will be applied when the next season starts.';
     adminTab('promotion');
   }catch(e){console.error(e);$('movementMsg').textContent=`Could not save movement: ${e.message||e}`;btn.disabled=false;btn.textContent='Save Promotion / Relegation';}
 };
}
function adminNews(c){c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">PUBLISH</p><h2>News & Announcements</h2><p>Publish updates that appear on the public News page.</p></div></div><div class="admin-form"><input id="newsTitle" placeholder="Headline"><input id="newsDate" type="date"><textarea id="newsBody" placeholder="Write announcement..."></textarea><button class="primary" id="saveNews">Publish Announcement</button></div><div class="admin-list">${state.news.map(n=>`<article class="admin-item"><b>${esc(n.title)}</b><span>${esc(n.date||'')}</span><p>${esc(n.body||n.content||'')}</p><button class="mini-btn danger" onclick="deleteNews('${n.id}')">Delete</button></article>`).join('')||'<p class="muted">No news published yet.</p>'}</div>`;$('saveNews').onclick=async()=>{const title=$('newsTitle').value.trim(),body=$('newsBody').value.trim();if(!title||!body)return alert('Headline and announcement text are required.');const btn=$('saveNews');btn.disabled=true;btn.textContent='Publishing…';try{await adminSave('news',null,{title,date:$('newsDate').value,body,seasonId:SEASON_ID,createdAt:firebase.firestore.FieldValue.serverTimestamp()});alert('News published successfully.');adminTab('news');}catch(e){console.error(e);alert('News could not be published. Make sure you are signed in as admin and the latest Firestore Rules are published.');btn.disabled=false;btn.textContent='Publish Announcement';}};}
function adminMembers(c){const ps=state.players.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name)));c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">PLAYER MANAGEMENT</p><h2>Registered Members</h2><p>Remove a registration when necessary. This deletes the member from the current Season.</p></div></div><div class="admin-list">${ps.map(p=>`<article class="admin-item member-admin-item"><div><b>${esc(p.name)}</b><span>${esc(p.club||'Club TBA')}</span><p>${esc(p.playerId||'')} • ${esc(p.competition||'')} • ${esc(state.season?.name||DEFAULT_SEASON)}</p></div><button class="mini-btn danger" onclick="deleteMember('${p.id}')">Remove Member</button></article>`).join('')||'<p class="muted">No registered members.</p>'}</div>`;}
window.deleteMember=async id=>{const p=state.players.find(x=>x.id===id);if(!p)return;if(!confirm(`Remove ${p.name} from ${state.season?.name||DEFAULT_SEASON}? This deletes the registration.`))return;try{const batch=db.batch();batch.delete(db.collection('players').doc(id));if(p.lockId)batch.delete(db.collection('playerTeamLocks').doc(p.lockId));await batch.commit();await loadData();alert('Member removed.');adminTab('members');}catch(e){console.error(e);alert('Could not remove member. Check Firestore Rules for admin writes.');}};
window.deleteNews=id=>adminDelete('news',id);
function adminHall(c){
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">LEGACY</p><h2>Hall of Fame</h2><p>Save every champion permanently. Once saved, the record remains available across all future seasons.</p></div></div><div class="admin-form"><input id="hallSeason" value="${esc(state.season?.name||DEFAULT_SEASON)}" placeholder="Season"><select id="hallComp"><option>Premier League</option><option>LaLiga</option><option>Serie A</option><option>Bundesliga</option><option>Championship</option><option>UCL</option></select><input id="hallWinner" placeholder="Champion / Team" required><input id="hallDate" type="date"><button class="primary" id="saveHall">💾 Save Champion</button></div><div id="hallSaveMsg" class="form-msg" aria-live="polite"></div><div class="admin-list">${state.hall.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).map(h=>`<article class="admin-item"><b>🏆 ${esc(h.winner||h.team)}</b><span>${esc(h.season||'Season')} • ${esc(h.competition||'')}</span></article>`).join('')||'<p class="muted">No champions saved yet.</p>'}</div>`;
 $('saveHall').onclick=async()=>{
   const season=$('hallSeason').value.trim()||DEFAULT_SEASON;
   const competition=$('hallComp').value;
   const winner=$('hallWinner').value.trim();
   const date=$('hallDate').value||new Date().toISOString().slice(0,10);
   const msg=$('hallSaveMsg');
   if(!winner){msg.className='form-msg error';msg.textContent='Enter the champion/team first.';return;}
   const btn=$('saveHall'); btn.disabled=true; btn.textContent='Saving…'; msg.className='form-msg'; msg.textContent='Saving Hall of Fame record…';
   try{
     const safeSeason=(season||'Season').toLowerCase().replace(/[^a-z0-9]+/g,'-');
     const safeComp=competition.toLowerCase().replace(/[^a-z0-9]+/g,'-');
     const id=`${safeSeason}__${safeComp}__champion`;
     const user=auth.currentUser;
     if(!user || user.isAnonymous) throw new Error('ADMIN_SESSION_REQUIRED');
     const hallData={season,competition,winner,date,seasonId:SEASON_ID,type:'League Champion',updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
     await db.collection('hallOfFame').doc(id).set(hallData,{merge:true});
     state.hall=[...state.hall.filter(h=>h.id!==id),{id,...hallData,updatedAt:new Date()}];
     msg.className='form-msg success'; msg.textContent='✓ Champion saved permanently to Hall of Fame.';
     btn.disabled=false; btn.textContent='💾 Save Champion';
     adminTab('hall');
   }catch(e){
     console.error(e); msg.className='form-msg error'; msg.textContent=`Could not save: ${e.message||e}`; btn.disabled=false; btn.textContent='💾 Save Champion';
   }
 };
}

function seasonTeamPool(comp){
  const rows=table(comp);
  const names=rows.map(r=>r.team).filter(Boolean);
  const current=teamObjects(comp).map(t=>t.name).filter(Boolean);
  return names.length===8?names:current.slice(0,8);
}
function makeRoundRobinGames(teams, startDate, prefix='Matchday'){
  const arr=teams.slice();
  if(arr.length%2)arr.push(null);
  const n=arr.length, rounds=n-1, half=n/2, first=[];
  for(let r=0;r<rounds;r++){
    const games=[];
    for(let i=0;i<half;i++){
      const home=arr[i], away=arr[n-1-i];
      if(home&&away)games.push([home,away]);
    }
    first.push(games);
    arr=[arr[0],arr[n-1],...arr.slice(1,n-1)];
  }
  const out=[];
  const all=[...first,...first.map(g=>g.map(([h,a])=>[a,h]))];
  const base=new Date(startDate+'T00:00:00Z');
  all.forEach((games,r)=>{
    const d=new Date(base); d.setUTCDate(d.getUTCDate()+r*7);
    const date=d.toISOString().slice(0,10);
    games.forEach(([home,away])=>out.push({home,away,round:`${prefix} ${r+1}`,date}));
  });
  return out;
}
function buildUCLGroups(qualified){
  const groups={A:[],B:[],C:[],D:[]};
  qualified.slice().sort((a,b)=>(a.rank||0)-(b.rank||0)||String(a.league).localeCompare(String(b.league)))
    .forEach(q=>{ const gi=Math.max(0,Math.min(3,(q.rank||1)-1)); groups[['A','B','C','D'][gi]].push(q); });
  return groups;
}
function buildUCLFixtures(groups,startDate){
  const out=[], base=new Date(startDate+'T00:00:00Z'), letters=['A','B','C','D'];
  letters.forEach((g,gi)=>{
    const teams=(groups[g]||[]).map(x=>typeof x==='string'?x:x.name).filter(Boolean);
    if(teams.length!==4)return;
    const rounds=[
      [[teams[0],teams[1]],[teams[2],teams[3]]],
      [[teams[0],teams[2]],[teams[3],teams[1]]],
      [[teams[0],teams[3]],[teams[1],teams[2]]],
      [[teams[1],teams[0]],[teams[3],teams[2]]],
      [[teams[2],teams[0]],[teams[1],teams[3]]],
      [[teams[3],teams[0]],[teams[2],teams[1]]]
    ];
    rounds.forEach((games,r)=>{
      const d=new Date(base); d.setUTCDate(d.getUTCDate()+r*14+gi*2);
      const date=d.toISOString().slice(0,10);
      games.forEach(([home,away])=>out.push({competition:'UCL',group:g,home,away,round:`Matchday ${r+1}`,date,stage:'Group Stage'}));
    });
  });
  return out;
}
async function batchWriteDocs(collection, docs, mapper){
  for(let i=0;i<docs.length;i+=400){
    const batch=db.batch();
    docs.slice(i,i+400).forEach(item=>{
      const ref=db.collection(collection).doc(item.id||db.collection(collection).doc().id);
      batch.set(ref,cleanFirestoreDoc(mapper?mapper(item):item),{merge:true});
    });
    await batch.commit();
  }
}
async function startNewSeason(){
 if(!state.admin){alert('Admin access required. Sign in from Admin Panel first.');return;}
 const adminUser=auth.currentUser;
 if(!adminUser||adminUser.isAnonymous){alert('Admin session required. Sign in again from Admin Panel.');return;}
 const liveSeason=currentSeasonRecord();
 if(!liveSeason){alert('No current season was found.');return;}
 const oldSeasonId=liveSeason.id;
 const oldSeason=liveSeason;
 const nextOrder=(Math.max(0,...state.seasons.map(x=>Number(x.order||0)))||0)+1;
 const newId=`season-${nextOrder}`,newName=`Season ${nextOrder}`;
 const movement=oldSeason.manualMovement||{};
 const promoted=Array.isArray(movement.promoted)?movement.promoted:[];
 const relegated=Array.isArray(movement.relegated)?movement.relegated:[];
 if(promoted.length!==4||relegated.length!==4||promoted.some(x=>!x.team||!MAJOR_LEAGUES.includes(x.to))||relegated.some(x=>!x.team||!MAJOR_LEAGUES.includes(x.from))){
   alert('Manual Promotion / Relegation is not complete. Open Admin → Promotion / Relegation and select 4 promoted clubs and 4 relegated clubs before starting the new season.');
   return;
 }
 if(!confirm(`Start ${newName} now?\n\n${oldSeason.name||'Current season'} will be archived. The promotion/relegation choices you saved manually will be applied to ${newName}. Previous results and history will remain available.`))return;
 let step='preparing the current season';
 try{
   // Always start from the Firestore season marked current, not from an old season the admin may be viewing.
   const [allSeasons,allTeams,allPlayers,allFixtures]=await Promise.all([
     getAllStrict('seasons'),getAllStrict('teams'),getAllStrict('players'),getAllStrict('fixtures')
   ]);
   const live=allSeasons.find(x=>x.current===true)||allSeasons.find(x=>x.id===oldSeasonId)||oldSeason;
   if(!live||live.id!==oldSeasonId)throw new Error('CURRENT_SEASON_CHANGED');
   const currentTeams=allTeams.filter(t=>!t.seasonId?(oldSeasonId==='season-1'):t.seasonId===oldSeasonId);
   const currentPlayers=allPlayers.filter(p=>p.seasonId===oldSeasonId||(!p.seasonId&&oldSeasonId==='season-1'));
   const currentFixtures=allFixtures.filter(f=>f.seasonId===oldSeasonId||(!f.seasonId&&oldSeasonId==='season-1'));
   state.seasons=allSeasons.sort((a,b)=>(Number(a.order||0)-Number(b.order||0))||String(a.name||'').localeCompare(String(b.name||'')));
   state.season=live;state.teams=currentTeams;state.players=currentPlayers;state.fixtures=currentFixtures;SEASON_ID=oldSeasonId;

   step='calculating the final tables';
   const domesticTables={};MAJOR_LEAGUES.forEach(l=>domesticTables[l]=table(l));domesticTables.Championship=table('Championship');
   const championCompetitions=[...MAJOR_LEAGUES,'Championship'];
   const champions=championCompetitions.map(competition=>({season:live.name||`Season ${nextOrder-1}`,seasonId:oldSeasonId,competition,winner:domesticTables[competition]?.[0]?.team||'',date:new Date().toISOString().slice(0,10),type:'League Champion'})).filter(x=>x.winner);

   // Apply the manually selected movement, not table position.
   const currentRoster={};
   MAJOR_LEAGUES.forEach(league=>currentRoster[league]=teamObjects(league).slice(0,8).map(t=>t.name));
   currentRoster.Championship=teamObjects('Championship').slice(0,8).map(t=>t.name);
   const nextRosters={};
   MAJOR_LEAGUES.forEach(league=>{
     const drop=relegated.find(x=>x.from===league)?.team;
     const add=promoted.find(x=>x.to===league)?.team;
     if(!drop||!add)throw new Error(`MOVEMENT_INCOMPLETE_${league}`);
     if(!currentRoster[league].includes(drop))throw new Error(`RELEGATED_TEAM_NOT_FOUND_${league}`);
     if(!currentRoster.Championship.includes(add))throw new Error(`PROMOTED_TEAM_NOT_FOUND_${league}`);
     nextRosters[league]=currentRoster[league].filter(x=>x!==drop);
     if(nextRosters[league].includes(add))throw new Error(`PROMOTED_TEAM_ALREADY_IN_${league}`);
     nextRosters[league].push(add);
     if(nextRosters[league].length!==8)throw new Error(`INVALID_ROSTER_${league}`);
   });
   const promotedNames=new Set(promoted.map(x=>x.team));
   nextRosters.Championship=currentRoster.Championship.filter(x=>!promotedNames.has(x));
   relegated.forEach(x=>{if(!nextRosters.Championship.includes(x.team))nextRosters.Championship.push(x.team);});
   if(nextRosters.Championship.length!==8)throw new Error('INVALID_ROSTER_CHAMPIONSHIP');

   const uclTeams=MAJOR_LEAGUES.flatMap(league=>domesticTables[league].slice(0,4).map((r,i)=>({name:r.team,league,rank:i+1})));
   if(uclTeams.length!==16)throw new Error('UCL_REQUIRES_16_TEAMS');
   const uclGroups=buildUCLGroups(uclTeams);
   const year=String(Number(live.year||new Date().getUTCFullYear())+1),theme=((nextOrder-1)%6)+1;

   // Create the next season as a non-current setup page first. If a later step fails, the old season remains current.
   step='creating the new season page';
   await db.collection('seasons').doc(newId).set({id:newId,name:newName,year,status:'Ongoing',order:nextOrder,theme,current:false,activeCompetitions:ALL_COMPETITIONS,uclTeams,uclGroups,promoted,relegated,previousSeasonId:oldSeasonId,manualMovement:{promoted:[],relegated:[]},createdAt:firebase.firestore.FieldValue.serverTimestamp()});

   const catalogByName=new Map(catalog.map(x=>[x.name,x]));
   const nextTeamDocs=[];Object.entries(nextRosters).forEach(([competition,names])=>names.forEach(name=>{const base=catalogByName.get(name)||{};nextTeamDocs.push({id:`${newId}__${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,name,competition,competitions:[competition],logo:base.logo||'',enabled:true,seasonId:newId});}));
   step='saving the new season teams';await batchWriteDocs('teams',nextTeamDocs);

   const nextPlayers=currentPlayers.filter(p=>p.status!=='cancelled').map(p=>{const movedCompetition=Object.entries(nextRosters).find(([,names])=>names.includes(p.club))?.[0]||p.competition;return {...p,id:`${newId}__${String(p.playerId||p.uid||p.id).replace(/[^a-zA-Z0-9_-]/g,'_')}`,seasonId:newId,competition:movedCompetition,status:'active',previousSeasonId:oldSeasonId};});
   step='carrying members into the new season';await batchWriteDocs('players',nextPlayers);

   const hallDocs=champions.map(x=>({id:`${oldSeasonId}__${x.competition.toLowerCase().replace(/[^a-z0-9]+/g,'-')}__champion`,...x}));
   step='saving champions to Hall of Fame';if(hallDocs.length)await batchWriteDocs('hallOfFame',hallDocs);

   const start=new Date();start.setUTCDate(start.getUTCDate()+7);const startDate=start.toISOString().slice(0,10);const allNewFixtures=[];
   MAJOR_LEAGUES.concat(['Championship']).forEach(comp=>makeRoundRobinGames(nextRosters[comp],startDate).forEach(x=>allNewFixtures.push({id:null,competition:comp,homeTeam:x.home,awayTeam:x.away,round:x.round,date:x.date,seasonId:newId})));
   buildUCLFixtures(uclGroups,startDate).forEach(x=>allNewFixtures.push({...x,id:null,seasonId:newId}));
   step='generating fresh fixtures';await batchWriteDocs('fixtures',allNewFixtures);

   // Commit the season switch only after every new-season document has been written successfully.
   step='activating the new season';
   await db.collection('seasons').doc(oldSeasonId).set({current:false,status:'Completed'},{merge:true});
   await db.collection('seasons').doc(newId).set({current:true,status:'Ongoing'},{merge:true});
   SEASON_ID=newId;await loadData();go('dashboard');
   alert(`${newName} started successfully.\n\n• Manual promotion/relegation applied\n• 5 leagues restarted with fresh fixtures\n• Members carried over\n• Previous champions saved to Hall of Fame\n• 16 UCL qualifiers carried over\n• Previous season remains available as history`);
 }catch(e){
   console.error('startNewSeason failed',e);
   try{await db.collection('seasons').doc(newId).set({status:'Setup Failed',current:false,setupError:String(e.message||e),setupFailedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}catch(_){ }
   alert(`Could not start the new season.\n\nStep: ${step}\nError: ${e.message||e}\n\nThe previous season was kept active where possible.`);
 }
}
window.startNewSeason=startNewSeason;

function adminSeason(c){
 const s=state.season||{};
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">SEASON MANAGEMENT</p><h2>Season notebook</h2><p>Every season is a separate page. Previous seasons remain unchanged.</p></div><button class="primary" id="newSeason">＋ Open New Season</button></div>
 <div class="season-book-grid">${state.seasons.map((x,i)=>`<article class="season-book-card ${x.id===SEASON_ID?'current':''}"><div class="season-page-no">PAGE ${i+1}</div><h3>${esc(x.name||'Season')}</h3><p>${esc(x.year||'')} • ${esc(x.status||'')}</p><button class="mini-btn" data-open-season="${esc(x.id)}">Open page →</button></article>`).join('')}</div>
 <div class="admin-form"><label>Season name<input id="seasonName" value="${esc(s.name||DEFAULT_SEASON)}" placeholder="Season name"></label><label>Status<select id="seasonStatus"><option ${s.status==='Upcoming'?'selected':''}>Upcoming</option><option ${s.status==='Ongoing'?'selected':''}>Ongoing</option><option ${s.status==='Completed'?'selected':''}>Completed</option></select></label><label>Year<input id="seasonYear" value="${esc(s.year||'2026')}" placeholder="Year"></label><label>Theme<select id="seasonTheme">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${(Number(s.theme||1)===n)?'selected':''}>Theme ${n}</option>`).join('')}</select></label><button class="primary" id="saveSeason">Save Page</button></div>`;
 c.querySelectorAll('[data-open-season]').forEach(b=>b.onclick=()=>switchSeason(b.dataset.openSeason).then(()=>adminTab('season')));
 $('saveSeason').onclick=async()=>{const active=s.activeCompetitions||ALL_COMPETITIONS;const live=currentSeasonRecord();const isCurrent=!!live&&live.id===SEASON_ID;await adminSave('seasons',SEASON_ID,{name:$('seasonName').value.trim(),status:$('seasonStatus').value,year:$('seasonYear').value,theme:Number($('seasonTheme').value),current:isCurrent,activeCompetitions:active});await loadData();adminTab('season');};
 $('newSeason').onclick=startNewSeason;
}
auth.onAuthStateChanged(async u=>{state.admin=!!u&&!u.isAnonymous;await loadData();});function adminResults(c){
 const played=state.fixtures.slice().sort((a,b)=>(dateObj(b.date||b.kickoff)||0)-(dateObj(a.date||a.kickoff)||0));
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">RESULT CONTROL</p><h2>Match Results</h2><p>Search for a team or fixture, then enter or update the final score.</p></div></div>
 <div class="form-grid admin-form" style="margin-bottom:16px"><input id="resultSearch" placeholder="Search team, fixture or competition..." autocomplete="off"><button class="primary" id="runResultSearch">Search</button><button class="ghost" id="clearResultSearch">Clear</button></div>
 <div class="admin-list" id="resultsList">${played.map(f=>resultFixtureHtml(f)).join('')||'<p class="muted">No fixtures available. Create fixtures first.</p>'}</div>`;
 const filter=()=>{
   const q=($('resultSearch')?.value||'').trim().toLowerCase();
   $('resultsList').innerHTML=played.filter(f=>{
     if(!q)return true;
     const [h,a]=teamsInFixture(f);
     return [h,a,compOf(f),f.round||'Matchday',dateText(f.date||f.kickoff)].join(' ').toLowerCase().includes(q);
   }).map(f=>resultFixtureHtml(f)).join('')||'<p class="muted">No matching fixtures found.</p>';
 };
 $('resultSearch').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();filter();}};
 $('runResultSearch').onclick=filter;
 $('clearResultSearch').onclick=()=>{ $('resultSearch').value=''; filter(); $('resultSearch').focus(); };
}
async function saveFixtureResult(id){
  if(!state.admin){alert('Admin access required.');return;}
  const fixture=state.fixtures.find(f=>f.id===id);
  if(!fixture){alert('Fixture not found.');return;}
  const hEl=$('homeScore-'+id), aEl=$('awayScore-'+id);
  const hv=hEl?.value.trim(), av=aEl?.value.trim();
  if(hv===''||av===''||!/^[0-9]+$/.test(hv)||!/^[0-9]+$/.test(av)){alert('Enter valid whole-number scores for both teams.');return;}
  const btn=hEl?.parentElement?.querySelector('button');
  if(btn){btn.disabled=true;btn.textContent='Saving…';}
  try{
    await db.collection('fixtures').doc(id).set({homeScore:Number(hv),awayScore:Number(av),resultStatus:'completed',resultUpdatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    await db.collection('fixtures').doc(id).update({homeScorers:firebase.firestore.FieldValue.delete(),awayScorers:firebase.firestore.FieldValue.delete()});
    await loadData();
    adminTab('results');
    alert('Result saved successfully.');
  }catch(e){
    console.error('saveFixtureResult failed',e);
    alert('Result could not be saved. Check that you are logged in with the admin account and that the latest Firestore Rules are published.');
    if(btn){btn.disabled=false;btn.textContent='Save Result';}
  }
}
window.saveFixtureResult=saveFixtureResult;

async function clearFixtureResult(id){
  if(!state.admin)return;
  if(!confirm('Clear this result?'))return;
  try{
    await db.collection('fixtures').doc(id).update({homeScore:firebase.firestore.FieldValue.delete(),awayScore:firebase.firestore.FieldValue.delete(),homeScorers:firebase.firestore.FieldValue.delete(),awayScorers:firebase.firestore.FieldValue.delete(),resultStatus:firebase.firestore.FieldValue.delete(),resultUpdatedAt:firebase.firestore.FieldValue.delete(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
    await loadData();
    adminTab('results');
  }catch(e){
    console.error('clearFixtureResult failed',e);
    alert('Result could not be cleared.');
  }
}
window.clearFixtureResult=clearFixtureResult;

function resultFixtureHtml(f){
 const [h,a]=teamsInFixture(f),sc=score(f),ss=fixtureScorerEntries(f);
 return `<article class="admin-item"><div><b>${esc(h)} vs ${esc(a)}</b><span>${esc(compOf(f))} • ${esc(f.round||'Matchday')} • ${esc(dateText(f.date||f.kickoff))}</span></div><div class="admin-result-form"><input type="number" min="0" id="homeScore-${f.id}" value="${sc?sc.h:''}" placeholder="Home"><strong>-</strong><input type="number" min="0" id="awayScore-${f.id}" value="${sc?sc.a:''}" placeholder="Away"><button class="mini-btn" onclick="saveFixtureResult('${f.id}')">Save Result</button>${sc?`<button class="mini-btn danger" onclick="clearFixtureResult('${f.id}')">Clear</button>`:''}</div></article>`;
}
