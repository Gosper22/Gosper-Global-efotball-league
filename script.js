/* Gosper Global eFootball League — functional dashboard + Firebase admin/registration */
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
const SEASON_ID='season-1', DEFAULT_SEASON='Season 1';

// Logos are stored with the team, so the same logo is reused in registration, tables and fixtures.
const catalog=[
// ENGLAND — TOP 6
['Liverpool','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8650.png'],['Arsenal','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/9825.png'],['Manchester City','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8456.png'],['Manchester United','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/10260.png'],['Chelsea','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8455.png'],['Tottenham Hotspur','Premier League','https://images.fotmob.com/image_resources/logo/teamlogo/8586.png'],
// SPAIN — TOP 6
['Real Madrid','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8633.png'],['Barcelona','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8634.png'],['Atletico Madrid','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/9906.png'],['Athletic Bilbao','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/10205.png'],['Sevilla','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8302.png'],['Valencia','LaLiga','https://images.fotmob.com/image_resources/logo/teamlogo/8661.png'],
// ITALY — TOP 6
['Inter','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8636.png'],['AC Milan','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8564.png'],['Juventus','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/9885.png'],['Napoli','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/9875.png'],['Roma','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8686.png'],['Lazio','Serie A','https://images.fotmob.com/image_resources/logo/teamlogo/8543.png'],
// GERMANY — TOP 6
['Bayern Munich','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/9823.png'],['Borussia Dortmund','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/9789.png'],['Bayer Leverkusen','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/8178.png'],['RB Leipzig','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/178475.png'],['Eintracht Frankfurt','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/9810.png'],['VfB Stuttgart','Bundesliga','https://images.fotmob.com/image_resources/logo/teamlogo/10269.png'],
// FRANCE — TOP 6
['Paris Saint-Germain','Ligue 1','https://images.fotmob.com/image_resources/logo/teamlogo/9847.png'],['Marseille','Ligue 1','https://images.fotmob.com/image_resources/logo/teamlogo/8592.png'],['Lyon','Ligue 1','https://images.fotmob.com/image_resources/logo/teamlogo/9748.png'],['Monaco','Ligue 1','https://images.fotmob.com/image_resources/logo/teamlogo/9829.png'],['Lille','Ligue 1','https://images.fotmob.com/image_resources/logo/teamlogo/8630.png'],['Nice','Ligue 1','https://images.fotmob.com/image_resources/logo/teamlogo/9831.png'],
// NETHERLANDS — TOP 6
['Ajax','Eredivisie','https://images.fotmob.com/image_resources/logo/teamlogo/8590.png'],['PSV Eindhoven','Eredivisie','https://images.fotmob.com/image_resources/logo/teamlogo/8640.png'],['Feyenoord','Eredivisie','https://images.fotmob.com/image_resources/logo/teamlogo/10229.png'],['AZ Alkmaar','Eredivisie','https://images.fotmob.com/image_resources/logo/teamlogo/10228.png'],['FC Twente','Eredivisie','https://images.fotmob.com/image_resources/logo/teamlogo/8614.png'],['FC Utrecht','Eredivisie','https://images.fotmob.com/image_resources/logo/teamlogo/8615.png'],
// TANZANIA — NBC PREMIER LEAGUE TOP 6
['Simba SC','NBC Premier League',''],['Yanga SC','NBC Premier League',''],['Azam FC','NBC Premier League',''],['Singida Black Stars','NBC Premier League',''],['Coastal Union','NBC Premier League',''],['KMC FC','NBC Premier League',''],
// EGYPT — TOP 6
['Al Ahly','Egypt League',''],['Zamalek','Egypt League',''],['Pyramids FC','Egypt League',''],['Al Masry','Egypt League',''],['Future FC','Egypt League',''],['Ismaily','Egypt League',''],
// CHAMPIONSHIP — smaller clubs from England, Spain, Germany and Italy
['Everton','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8668.png'],['West Ham United','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8654.png'],['Fulham','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9879.png'],['Crystal Palace','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9826.png'],
['Real Betis','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8603.png'],['Villarreal','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10268.png'],['Real Sociedad','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8560.png'],['Celta Vigo','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8662.png'],
['Borussia Monchengladbach','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9788.png'],['Werder Bremen','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8697.png'],['Wolfsburg','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8721.png'],['Mainz 05','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9905.png'],
['Atalanta','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8524.png'],['Fiorentina','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8535.png'],['Bologna','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9857.png'],['Torino','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9804.png']
].map(([name,competition,logo])=>({name,competition,logo}));

const state={teams:[],players:[],fixtures:[],news:[],hall:[],season:null,admin:false};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const initials=s=>String(s||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
function dateObj(v){if(!v)return null; if(v.toDate)return v.toDate(); const d=new Date(v); return isNaN(d)?null:d;}
function dateText(v){const d=dateObj(v);return d?d.toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'}):'TBA';}
function logoUrl(name){const t=state.teams.find(x=>x.name===name)||catalog.find(x=>x.name===name);return t?.logo||'';}
function logo(name,small=false){const src=logoUrl(name);return src?`<span class="logo-box ${small?'sm':''}"><img class="team-logo ${small?'sm':''}" src="${src}" alt="${esc(name)} logo" loading="lazy" onerror="this.parentElement.classList.add('failed');this.remove()"><span class="logo-fallback ${small?'sm':''}">${esc(initials(name))}</span></span>`:`<span class="logo-box ${small?'sm':''}"><span class="logo-fallback ${small?'sm':''}">${esc(initials(name))}</span></span>`}

function go(page){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.dataset.pageContent===page));document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));$('sidebar')?.classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});if(page==='teams')renderTeams();if(page==='fixtures')renderFixtures();if(page==='standings')renderStandings();if(page==='players')renderPlayers();if(page==='hall')renderHall();if(page==='news')renderNews();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)go(b.dataset.page);});
$('mobileMenu')?.addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('registerCta')?.addEventListener('click',openRegister);$('registerPlayerBtn')?.addEventListener('click',openRegister);$('closeRegister')?.addEventListener('click',closeRegister);$('registerModal')?.addEventListener('click',e=>{if(e.target===$('registerModal'))closeRegister()});
$('competition')?.addEventListener('change',()=>populateClubPicker($('clubSearch').value));$('clubSearch')?.addEventListener('input',()=>populateClubPicker($('clubSearch').value));$('teamSearch')?.addEventListener('input',renderTeams);$('fixtureCompetition')?.addEventListener('change',renderFixtures);$('fixtureStatus')?.addEventListener('change',renderFixtures);$('standingsCompetition')?.addEventListener('change',renderStandings);$('globalSearch')?.addEventListener('input',searchSite);
document.querySelectorAll('.competition-card').forEach(c=>c.addEventListener('click',()=>{go('competitions');showCompetition(c.dataset.competition)}));

function openRegister(){ $('registerModal').hidden=false; populateClubPicker(''); setTimeout(()=>$('name')?.focus(),60); }
function closeRegister(){ $('registerModal').hidden=true; if($('registrationMsg')){$('registrationMsg').textContent='';$('registrationMsg').className='form-msg';} }
function teamCompetitions(t){return Array.isArray(t.competitions)&&t.competitions.length?t.competitions:(t.competition?[t.competition]:[])}
function isCompActive(comp){const a=state.season?.activeCompetitions;return !Array.isArray(a)||!a.length||a.includes(comp)}
function teamObjects(comp){
 const merged=catalog.map(base=>{const saved=state.teams.find(x=>x.name===base.name);return {...base,...(saved||{}),logo:saved?.logo||base.logo,competition:saved?.competition||base.competition,competitions:Array.isArray(saved?.competitions)&&saved.competitions.length?saved.competitions:[base.competition]};});
 if(comp==='UCL'){
   return qualifiedUCLTeams().map(q=>{const base=merged.find(t=>t.name===q.name)||catalog.find(t=>t.name===q.name)||{};return {...base,name:q.name,competition:'UCL',competitions:['UCL'],enabled:true,qualifiedFrom:q.league,qualificationRank:q.rank};});
 }
 return merged.filter(t=>t.enabled!==false&&isCompActive(t.competition)&&(!comp||teamCompetitions(t).includes(comp)));
}
function catalogObjects(){return catalog.slice();}
const MAJOR_LEAGUES=['Premier League','LaLiga','Serie A','Bundesliga'];
const ALL_COMPETITIONS=[...MAJOR_LEAGUES,'Championship','UCL'];
function qualifiedUCLTeams(){return MAJOR_LEAGUES.flatMap(league=>table(league).slice(0,4).map((r,i)=>({name:r.team,league,rank:i+1})));}

function activeTeams(comp){return teamObjects(comp).filter(t=>isCompActive(comp))}
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
async function ensureAnon(){if(auth.currentUser)return true;try{await auth.signInAnonymously();return true}catch(e){console.error(e);return false}}
$('registrationForm')?.addEventListener('submit',async e=>{e.preventDefault();const m=$('registrationMsg');m.className='form-msg';m.textContent='Registering…';if(!(await ensureAnon())){m.className='form-msg error';m.textContent='Firebase Anonymous sign-in is not enabled.';return;}const name=$('name').value.trim(),raw=$('pid').value.trim(),key=raw.toLowerCase().replace(/\s+/g,''),competition=$('competition').value,club=$('club').value;if(!name||!key||!club){m.className='form-msg error';m.textContent='Fill all required fields.';return;}const playerDocId=`${SEASON_ID}_${key.replace(/[^a-z0-9_-]/g,'_')}`;
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

    tx.set(ref,{name,playerId:raw,playerIdKey:key,uid:auth.currentUser.uid,lockId:lockKey,competition,club,seasonId:SEASON_ID,status:'active',createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    tx.set(lockRef,{playerDocId,playerIdKey:key,uid:auth.currentUser.uid,competition,club,seasonId:SEASON_ID,status:'active',createdAt:firebase.firestore.FieldValue.serverTimestamp()});
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
  else m.textContent='Registration failed. Please try again.';
}});

async function getAll(c){try{const s=await db.collection(c).get();return s.docs.map(d=>({id:d.id,...d.data()}));}catch(e){console.warn(c,e);return[];}}
async function loadData(){const [teams,players,fixtures,news,hall,seasons]=await Promise.all(['teams','players','fixtures','news','hallOfFame','seasons'].map(getAll));state.teams=teams;state.players=players.filter(p=>p.seasonId===SEASON_ID||!p.seasonId);state.fixtures=fixtures;state.news=news;state.hall=hall;state.season=seasons.find(s=>s.id===SEASON_ID)||seasons.find(s=>s.current===true)||{id:SEASON_ID,name:DEFAULT_SEASON,status:'Ongoing'};renderAll();if(state.admin)renderAdmin();}
function score(f){const h=f.homeScore??f.homeGoals,a=f.awayScore??f.awayGoals;return h!==undefined&&h!==null&&a!==undefined&&a!==null&&h!==''&&a!==''?{h:+h,a:+a}:null;}
function teamsInFixture(f){return [f.homeTeam||f.home||f.teamA||'',f.awayTeam||f.away||f.teamB||''];}
function compOf(f){return f.competition||'Premier League';}
function table(comp){const map=new Map(teamObjects(comp).map(t=>[t.name,{team:t.name,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}]));state.fixtures.filter(f=>compOf(f)===comp&&score(f)&&map.has((f.homeTeam||f.home))&&map.has((f.awayTeam||f.away))).forEach(f=>{const s=score(f),[h,a]=teamsInFixture(f);if(!map.has(h))map.set(h,{team:h,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0});if(!map.has(a))map.set(a,{team:a,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0});const H=map.get(h),A=map.get(a);H.mp++;A.mp++;H.gf+=s.h;H.ga+=s.a;A.gf+=s.a;A.ga+=s.h;if(s.h>s.a){H.w++;H.pts+=3;A.l++;}else if(s.a>s.h){A.w++;A.pts+=3;H.l++;}else{H.d++;A.d++;H.pts++;A.pts++;}});return [...map.values()].map(x=>({...x,gd:x.gf-x.ga})).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.team.localeCompare(b.team));}
function rowHtml(r,i){return `<tr><td><b>${i+1}</b></td><td><div class="team-cell">${logo(r.team,true)}<b>${esc(r.team)}</b></div></td><td>${r.mp}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gd}</td><td><b>${r.pts}</b></td></tr>`;}
function renderStandings(){const c=$('standingsCompetition')?.value||'Premier League';const rows=table(c);$('standingsTable').innerHTML=rows.length?rows.map(rowHtml).join(''):`<tr><td colspan="10" class="empty">No results published yet.</td></tr>`;}
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
function renderAll(){renderDashboard();renderTeams();renderFixtures();renderStandings();renderPlayers();renderHall();renderNews();$('sideSeason').textContent=$('topSeason').textContent=$('footerSeason').textContent=state.season?.name||DEFAULT_SEASON;$('seasonStatus').textContent=state.season?.status||'Ongoing';}
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
  const ref=db.collection(collection).doc(id||db.collection(collection).doc().id);
  await ref.set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
  await loadData();
}
async function adminDelete(collection,id){if(!confirm('Delete this item?'))return;await db.collection(collection).doc(id).delete();await loadData();}
function renderAdmin(){
 const a=$('adminArea');
 if(!state.admin){a.innerHTML=`<div class="admin-lock"><div class="lock-icon">⚙</div><h2>Admin access required</h2><p>Sign in with your Firebase administrator account.</p><button class="primary" id="adminLoginBtn2">Sign in to Control Center</button></div>`;$('adminLoginBtn2').onclick=openAdminLogin;return;}
 a.innerHTML=`<div class="admin-shell"><div class="admin-nav"><button class="admin-tab active" data-admin-tab="overview">Overview</button><button class="admin-tab" data-admin-tab="competitions">Competitions</button><button class="admin-tab" data-admin-tab="teams">Teams</button><button class="admin-tab" data-admin-tab="fixtures">Fixtures</button><button class="admin-tab" data-admin-tab="ucl">UCL Groups</button><button class="admin-tab" data-admin-tab="results">Results</button><button class="admin-tab" data-admin-tab="members">Members</button><button class="admin-tab" data-admin-tab="promotion">Promotion / Relegation</button><button class="admin-tab" data-admin-tab="news">News</button><button class="admin-tab" data-admin-tab="hall">Hall of Fame</button><button class="admin-tab" data-admin-tab="season">Season</button><button class="ghost" id="adminSignOut">Sign out</button></div><div id="adminContent"></div></div>`;
 document.querySelectorAll('.admin-tab').forEach(b=>b.onclick=()=>adminTab(b.dataset.adminTab));$('adminSignOut').onclick=()=>auth.signOut().then(()=>{state.admin=false;renderAdmin();});adminTab('overview');
}
function adminTab(tab){
 document.querySelectorAll('.admin-tab').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===tab));
 const c=$('adminContent');
 if(tab==='overview')adminOverview(c);if(tab==='competitions')adminCompetitions(c);if(tab==='teams')adminTeams(c);if(tab==='fixtures')adminFixtures(c);if(tab==='ucl')adminUCL(c);if(tab==='results')adminResults(c);if(tab==='members')adminMembers(c);if(tab==='promotion')adminPromotion(c);if(tab==='news')adminNews(c);if(tab==='hall')adminHall(c);if(tab==='season')adminSeason(c);
}
function adminOverview(c){
 const active=(state.season?.activeCompetitions||ALL_COMPETITIONS);
 c.innerHTML=`<div class="admin-grid"><div class="admin-stat"><b>${state.teams.length||catalog.length}</b><span>Clubs in system</span></div><div class="admin-stat"><b>${state.players.length}</b><span>Players</span></div><div class="admin-stat"><b>${state.fixtures.length}</b><span>Fixtures</span></div><div class="admin-stat"><b>${state.fixtures.filter(f=>score(f)).length}</b><span>Results entered</span></div></div><div class="admin-control-card"><div><p class="eyebrow">CURRENT SEASON</p><h2>${esc(state.season?.name||DEFAULT_SEASON)}</h2><p class="muted">Active competitions: ${active.map(esc).join(' • ')}</p></div><button class="primary" id="quickComp">Choose competitions</button></div><div class="admin-control-card"><div><p class="eyebrow">SEASON MOVEMENT</p><h2>Automatic promotion & relegation</h2><p class="muted">At season end: bottom 3 Premier League clubs move to Championship; top 3 Championship clubs move to Premier League.</p></div><button class="primary" id="quickMove">Open</button></div>`;
 $('quickComp').onclick=()=>adminTab('competitions');$('quickMove').onclick=()=>adminTab('promotion');
}
function adminCompetitions(c){
 const active=state.season?.activeCompetitions||ALL_COMPETITIONS;
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">COMPETITION CONTROL</p><h2>Season competition setup</h2><p>Eight major leagues have 6 clubs each. Championship contains smaller clubs. UCL clubs are created from the top 2 of every major league.</p></div></div><div class="competition-control-grid">${ALL_COMPETITIONS.map(x=>`<label class="competition-toggle"><input type="checkbox" data-active-comp="${x}" ${active.includes(x)?'checked':''}><span class="toggle-copy"><b>${x}</b><small>${x==='UCL'?'16 qualified clubs • 4 groups of 4 • Group Stage':'6 clubs • Home & Away'}</small></span><strong>${active.includes(x)?'ACTIVE':'OFF'}</strong></label>`).join('')}</div><div class="admin-actions-row"><button class="primary" id="saveActiveComps">Save Competition Setup</button></div>`;
 $('saveActiveComps').onclick=async()=>{const active=[...document.querySelectorAll('[data-active-comp]:checked')].map(x=>x.dataset.activeComp);if(!active.length)return alert('Select at least one competition.');await adminSave('seasons',SEASON_ID,{activeCompetitions:active});alert('Competition setup saved.');adminTab('competitions');};
}
function adminTeams(c){
 const all=catalogObjects();
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">CLUB CONTROL</p><h2>Official club pool</h2><p>Old UCL clubs are no longer part of the catalog. Use “Apply new club structure” once to sync Firestore and remove their UCL membership.</p></div><button class="primary" id="applyClubStructure">Apply new club structure</button></div><div class="admin-team-grid">${all.map(t=>{const saved=state.teams.find(x=>x.name===t.name)||{};const cs=teamCompetitions({...t,...saved});return `<div class="admin-team-card"><div class="admin-team-main">${logo(t.name)}<div><b>${esc(t.name)}</b><small>${esc(t.competition)}</small></div></div><div class="comp-checks"><label><input type="checkbox" data-team-comp="${t.competition}" data-team-name="${esc(t.name)}" checked disabled> ${esc(t.competition)}</label><label class="enable-check"><input type="checkbox" data-team-enabled="${esc(t.name)}" ${saved.enabled!==false?'checked':''}> Available</label></div></div>`}).join('')}</div>`;
 $('applyClubStructure').onclick=async()=>{if(!confirm('Apply the new club structure? This will disable old clubs outside the new catalog and remove old UCL memberships.'))return;try{const batch=db.batch();const wanted=new Set(all.map(t=>t.name));for(const old of state.teams){if(!wanted.has(old.name)){const ref=db.collection('teams').doc(old.id);batch.set(ref,{enabled:false,competitions:old.competitions||[],competition:old.competition||''},{merge:true});}}
 for(const t of all){const enabled=document.querySelector(`[data-team-enabled="${CSS.escape(t.name)}"]`).checked;const ref=db.collection('teams').doc(t.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'));batch.set(ref,{name:t.name,competitions:[t.competition],competition:t.competition,logo:t.logo||'',enabled,seasonId:SEASON_ID},{merge:true});}
 await batch.commit();await adminSave('seasons',SEASON_ID,{activeCompetitions:ALL_COMPETITIONS});await loadData();alert('New club structure applied.');adminTab('teams');}catch(e){console.error(e);alert('Could not apply club structure. Check Firestore Rules.');}};
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
 const movements=MAJOR_LEAGUES.map(league=>{
   const rows=table(league).slice().sort((a,b)=>a.pts-b.pts||a.gd-b.gd||a.gf-b.gf);
   return {league,relegated:rows.slice(0,2)};
 });
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">SEASON MOVEMENT</p><h2>Promotion / Relegation</h2><p>The bottom 2 teams in each major league are relegated to Championship. UCL qualification uses the top 4 from each major league.</p></div></div>
 <div class="admin-grid">${movements.map(m=>`<div class="tool-card"><h3>RELEGATION — ${esc(m.league)}</h3>${m.relegated.map((r,i)=>`<div class="admin-item"><b>${i+1}. ${esc(r.team)}</b><span>${r.pts} pts • ${r.gd} GD</span></div>`).join('')||'<p class="muted">No table data yet.</p>'}</div>`).join('')}</div>`;
}
function adminNews(c){c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">PUBLISH</p><h2>News & Announcements</h2><p>Publish updates that appear on the public News page.</p></div></div><div class="admin-form"><input id="newsTitle" placeholder="Headline"><input id="newsDate" type="date"><textarea id="newsBody" placeholder="Write announcement..."></textarea><button class="primary" id="saveNews">Publish Announcement</button></div><div class="admin-list">${state.news.map(n=>`<article class="admin-item"><b>${esc(n.title)}</b><span>${esc(n.date||'')}</span><p>${esc(n.body||n.content||'')}</p><button class="mini-btn danger" onclick="deleteNews('${n.id}')">Delete</button></article>`).join('')||'<p class="muted">No news published yet.</p>'}</div>`;$('saveNews').onclick=async()=>{const title=$('newsTitle').value.trim(),body=$('newsBody').value.trim();if(!title||!body)return alert('Headline and announcement text are required.');const btn=$('saveNews');btn.disabled=true;btn.textContent='Publishing…';try{await adminSave('news',null,{title,date:$('newsDate').value,body,seasonId:SEASON_ID,createdAt:firebase.firestore.FieldValue.serverTimestamp()});alert('News published successfully.');adminTab('news');}catch(e){console.error(e);alert('News could not be published. Make sure you are signed in as admin and the latest Firestore Rules are published.');btn.disabled=false;btn.textContent='Publish Announcement';}};}
function adminMembers(c){const ps=state.players.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name)));c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">PLAYER MANAGEMENT</p><h2>Registered Members</h2><p>Remove a registration when necessary. This deletes the member from the current Season.</p></div></div><div class="admin-list">${ps.map(p=>`<article class="admin-item member-admin-item"><div><b>${esc(p.name)}</b><span>${esc(p.club||'Club TBA')}</span><p>${esc(p.playerId||'')} • ${esc(p.competition||'')} • ${esc(state.season?.name||DEFAULT_SEASON)}</p></div><button class="mini-btn danger" onclick="deleteMember('${p.id}')">Remove Member</button></article>`).join('')||'<p class="muted">No registered members.</p>'}</div>`;}
window.deleteMember=async id=>{const p=state.players.find(x=>x.id===id);if(!p)return;if(!confirm(`Remove ${p.name} from ${state.season?.name||DEFAULT_SEASON}? This deletes the registration.`))return;try{const batch=db.batch();batch.delete(db.collection('players').doc(id));if(p.lockId)batch.delete(db.collection('playerTeamLocks').doc(p.lockId));await batch.commit();await loadData();alert('Member removed.');adminTab('members');}catch(e){console.error(e);alert('Could not remove member. Check Firestore Rules for admin writes.');}};
window.deleteNews=id=>adminDelete('news',id);
function adminHall(c){c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">LEGACY</p><h2>Hall of Fame</h2><p>Record champions by competition and Season.</p></div></div><div class="admin-form"><input id="hallSeason" value="${esc(state.season?.name||DEFAULT_SEASON)}" placeholder="Season"><select id="hallComp"><option>Premier League</option><option>Championship</option><option>UCL</option></select><input id="hallWinner" placeholder="Champion / Team"><input id="hallDate" type="date"><button class="primary" id="saveHall">Add Champion</button></div><div class="admin-list">${state.hall.map(h=>`<article class="admin-item"><b>🏆 ${esc(h.winner||h.team)}</b><span>${esc(h.season||'Season')} • ${esc(h.competition||'')}</span></article>`).join('')}</div>`;$('saveHall').onclick=async()=>{await adminSave('hallOfFame',null,{season:$('hallSeason').value.trim(),competition:$('hallComp').value,winner:$('hallWinner').value.trim(),date:$('hallDate').value,seasonId:SEASON_ID});adminTab('hall');};}
function adminSeason(c){const s=state.season||{};c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">SEASON MANAGEMENT</p><h2>Season settings</h2></div></div><div class="admin-form"><input id="seasonName" value="${esc(s.name||DEFAULT_SEASON)}" placeholder="Season name"><select id="seasonStatus"><option ${s.status==='Upcoming'?'selected':''}>Upcoming</option><option ${s.status==='Ongoing'?'selected':''}>Ongoing</option><option ${s.status==='Completed'?'selected':''}>Completed</option></select><input id="seasonYear" value="${esc(s.year||'2026')}" placeholder="Year"><button class="primary" id="saveSeason">Save Season</button></div>`;$('saveSeason').onclick=async()=>{const active=state.season?.activeCompetitions||ALL_COMPETITIONS;await adminSave('seasons',SEASON_ID,{name:$('seasonName').value.trim(),status:$('seasonStatus').value,year:$('seasonYear').value,current:true,activeCompetitions:active});adminTab('season');};}
auth.onAuthStateChanged(async u=>{state.admin=!!u&&!u.isAnonymous;await loadData();});function adminResults(c){
 const played=state.fixtures.slice().sort((a,b)=>(dateObj(b.date||b.kickoff)||0)-(dateObj(a.date||a.kickoff)||0));
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">RESULT CONTROL</p><h2>Match Results</h2><p>Search for a team or fixture, then enter or update the final score.</p></div></div>
 <div class="form-grid admin-form" style="margin-bottom:16px"><input id="resultSearch" placeholder="Search team, fixture or competition..." autocomplete="off"><button class="primary" id="clearResultSearch">Clear</button></div>
 <div class="admin-list" id="resultsList">${played.map(f=>resultFixtureHtml(f)).join('')||'<p class="muted">No fixtures available. Create fixtures first.</p>'}</div>`;
 const filter=()=>{
   const q=($('resultSearch')?.value||'').trim().toLowerCase();
   $('resultsList').innerHTML=played.filter(f=>{
     if(!q)return true;
     const [h,a]=teamsInFixture(f);
     return [h,a,compOf(f),f.round||'Matchday',dateText(f.date||f.kickoff)].join(' ').toLowerCase().includes(q);
   }).map(f=>resultFixtureHtml(f)).join('')||'<p class="muted">No matching fixtures found.</p>';
 };
 $('resultSearch').oninput=filter;
 $('clearResultSearch').onclick=()=>{ $('resultSearch').value=''; filter(); };
}
function resultFixtureHtml(f){
 const [h,a]=teamsInFixture(f),sc=score(f);
 return `<article class="admin-item"><div><b>${esc(h)} vs ${esc(a)}</b><span>${esc(compOf(f))} • ${esc(f.round||'Matchday')} • ${esc(dateText(f.date||f.kickoff))}</span></div><div class="admin-result-form"><input type="number" min="0" id="homeScore-${f.id}" value="${sc?sc.h:''}" placeholder="Home"><strong>-</strong><input type="number" min="0" id="awayScore-${f.id}" value="${sc?sc.a:''}" placeholder="Away"><button class="mini-btn" onclick="saveFixtureResult('${f.id}')">Save Result</button>${sc?`<button class="mini-btn danger" onclick="clearFixtureResult('${f.id}')">Clear</button>`:''}</div></article>`;
}

