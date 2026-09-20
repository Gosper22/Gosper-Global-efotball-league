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
// CHAMPIONSHIP — smaller clubs from England, Spain, Germany and Italy
['Everton','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8668.png'],['West Ham United','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8654.png'],['Fulham','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9879.png'],['Crystal Palace','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9826.png'],
['Real Betis','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8603.png'],['Villarreal','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/10268.png'],['Real Sociedad','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8560.png'],['Celta Vigo','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8662.png'],
['Borussia Monchengladbach','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9788.png'],['Werder Bremen','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8697.png'],['Wolfsburg','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8721.png'],['Mainz 05','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9905.png'],
['Atalanta','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8524.png'],['Fiorentina','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/8535.png'],['Bologna','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9857.png'],['Torino','Championship','https://images.fotmob.com/image_resources/logo/teamlogo/9804.png']
].map(([name,competition,logo])=>({name,competition,logo}));

const state={teams:[],players:[],fixtures:[],news:[],hall:[],awards:[],comments:[],awardVotes:[],season:null,admin:false};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const initials=s=>String(s||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
function dateObj(v){if(!v)return null; if(v.toDate)return v.toDate(); const d=new Date(v); return isNaN(d)?null:d;}
function dateText(v){const d=dateObj(v);return d?d.toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'}):'TBA';}
function logoUrl(name){const t=state.teams.find(x=>x.name===name)||catalog.find(x=>x.name===name);return t?.logo||'';}
function logo(name,small=false){const src=logoUrl(name);return src?`<span class="logo-box ${small?'sm':''}"><img class="team-logo ${small?'sm':''}" src="${src}" alt="${esc(name)} logo" loading="lazy" onerror="this.parentElement.classList.add('failed');this.remove()"><span class="logo-fallback ${small?'sm':''}">${esc(initials(name))}</span></span>`:`<span class="logo-box ${small?'sm':''}"><span class="logo-fallback ${small?'sm':''}">${esc(initials(name))}</span></span>`}

function go(page){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.dataset.pageContent===page));document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));$('sidebar')?.classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});if(page==='teams')renderTeams();if(page==='fixtures')renderFixtures();if(page==='standings')renderStandings();if(page==='players')renderPlayers();if(page==='hall')renderHall();if(page==='awards')renderAwards();if(page==='community')renderComments();if(page==='news')renderNews();if(page==='admin')renderAdmin();}
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
$('registrationForm')?.addEventListener('submit',async e=>{
 e.preventDefault();
 const m=$('registrationMsg'); m.className='form-msg'; m.textContent='Registering…';
 const name=$('name').value.trim(), raw=$('pid').value.trim(), key=raw.toLowerCase().replace(/\s+/g,''), competition=$('competition').value, club=$('club').value;
 if(!name||!key||!club){m.className='form-msg error';m.textContent='Fill all required fields.';return;}
 const playerDocId=`${SEASON_ID}_${key.replace(/[^a-z0-9_-]/g,'_')}`;
 const ref=db.collection('players').doc(playerDocId);
 const lockKey=`${SEASON_ID}__${competition}__${club}`.toLowerCase().replace(/[^a-z0-9_-]/g,'_');
 const lockRef=db.collection('playerTeamLocks').doc(lockKey);
 try{
   if(state.players.some(p=>p.seasonId===SEASON_ID&&p.competition===competition&&String(p.club||'').trim().toLowerCase()===club.trim().toLowerCase()&&p.status!=='cancelled')){
     m.className='form-msg error'; m.textContent=`${club} is already registered by another player in ${competition}. Choose another club.`; populateClubPicker(''); return;
   }
   if((await ref.get()).exists) throw new Error('PLAYER_EXISTS');
   if((await lockRef.get()).exists) throw new Error('TEAM_TAKEN');
   await ref.set({name,playerId:raw,playerIdKey:key,lockId:lockKey,competition,club,seasonId:SEASON_ID,status:'active',createdAt:firebase.firestore.FieldValue.serverTimestamp()});
   await lockRef.set({playerDocId,playerIdKey:key,competition,club,seasonId:SEASON_ID,status:'active',createdAt:firebase.firestore.FieldValue.serverTimestamp()});
   m.className='form-msg ok'; m.textContent=`Registration successful — ${club}`;
   e.target.reset(); populateClubPicker(''); await loadData(); setTimeout(closeRegister,900);
 }catch(err){
   console.error('registration failed',err); m.className='form-msg error';
   if(err.message==='PLAYER_EXISTS') m.textContent=`This Player ID is already registered for ${state.season?.name||DEFAULT_SEASON}.`;
   else if(err.message==='TEAM_TAKEN') m.textContent=`${club} is already registered by another player in ${competition}. Choose another club.`;
   else m.textContent=`Registration failed: ${err.code||err.message||'Firebase error'}`;
 }
});

async function getAll(c){
 try{const snap=await db.collection(c).get();return snap.docs.map(d=>({id:d.id,...d.data()}));}
 catch(e){console.error(`Firestore read failed: ${c}`,e);state.firebaseErrors=state.firebaseErrors||{};state.firebaseErrors[c]=e;return[];}
}
async function loadData(){
 state.firebaseErrors={};
 const [teams,players,fixtures,news,hall,seasons,awards,comments,awardVotes]=await Promise.all(['teams','players','fixtures','news','hallOfFame','seasons','awards','comments','awardVotes'].map(getAll));
 state.teams=teams;state.players=players.filter(p=>p.seasonId===SEASON_ID||!p.seasonId);state.fixtures=fixtures;state.news=news;state.hall=hall;
 state.awards=awards.filter(a=>!a.seasonId||a.seasonId===SEASON_ID);state.comments=comments.filter(c=>!c.seasonId||c.seasonId===SEASON_ID);state.awardVotes=awardVotes.filter(v=>!v.seasonId||v.seasonId===SEASON_ID);
 state.season=seasons.find(s=>s.id===SEASON_ID)||seasons.find(s=>s.current===true)||{id:SEASON_ID,name:DEFAULT_SEASON,status:'Ongoing',year:'2026',activeCompetitions:ALL_COMPETITIONS};
 renderAll();renderAwards();renderComments();if(state.admin)renderAdmin();updateFirebaseStatus();
}
function updateFirebaseStatus(){
 let el=document.getElementById('firebaseStatus');
 if(!el){el=document.createElement('div');el.id='firebaseStatus';el.className='firebase-status';document.body.appendChild(el);}
 const errors=Object.keys(state.firebaseErrors||{});
 if(errors.length){el.className='firebase-status error';el.textContent=`Firebase: read error (${errors.length})`;el.title='Collections failing: '+errors.join(', ');}
 else{el.className='firebase-status ok';el.textContent='Firebase: connected';el.title='Firestore reads are working.';}
}

function awardArt(category, cls=''){
 const c=String(category||'').toLowerCase();
 let kind='star'; if(c.includes('ballon'))kind='ballon'; else if(c.includes('top scorer'))kind='boot'; else if(c.includes('defender'))kind='defender'; else if(c.includes('player of the tournament'))kind='player';
 const common=`class="inline-award-svg ${cls}" viewBox="0 0 180 220" role="img" aria-label="${esc(category||'Award')}"`;
 if(kind==='ballon') return `<div class="ballon-real-art"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Ballon_d%27Or.png" alt="Ballon d'Or trophy" loading="eager" referrerpolicy="no-referrer"></div>`; if(kind==='boot') return `<svg ${common}><defs><linearGradient id="goldBoot" x1="0" x2="1"><stop stop-color="#fff0a2"/><stop offset=".5" stop-color="#d6a52a"/><stop offset="1" stop-color="#76500d"/></linearGradient></defs><circle cx="90" cy="105" r="76" fill="#d6a52a" opacity=".08"/><path d="M53 37 C67 44 80 48 96 49 L103 87 C108 99 126 103 139 114 L145 131 L42 131 L35 121 L44 111 L57 107 L62 88 L48 58Z" fill="url(#goldBoot)" stroke="#ffe999" stroke-width="2"/><path d="M56 53 L95 61 M51 67 L98 75 M47 82 L101 89" stroke="#fff1a7" stroke-width="4" opacity=".6"/><path d="M42 131 H145" stroke="#fff0a0" stroke-width="6"/></svg>`;
 if(kind==='defender') return `<svg ${common}><defs><linearGradient id="shield" x1="0" x2="1"><stop stop-color="#e7f4d2"/><stop offset=".5" stop-color="#8bb34f"/><stop offset="1" stop-color="#38541f"/></linearGradient></defs><path d="M90 18 L150 39 V92 C150 137 121 169 90 187 C59 169 30 137 30 92 V39Z" fill="url(#shield)" stroke="#eaffbf" stroke-width="3"/><path d="M90 48 L100 72 L126 75 L106 92 L112 117 L90 103 L68 117 L74 92 L54 75 L80 72Z" fill="#17240e" opacity=".9"/></svg>`;
 if(kind==='player') return `<svg ${common}><defs><linearGradient id="pl" x1="0" x2="1"><stop stop-color="#fff3b0"/><stop offset=".55" stop-color="#c99a22"/><stop offset="1" stop-color="#68470b"/></linearGradient></defs><circle cx="90" cy="72" r="35" fill="url(#pl)"/><path d="M37 166 Q45 113 90 113 Q135 113 143 166Z" fill="url(#pl)"/><circle cx="90" cy="72" r="17" fill="#fff0a0" opacity=".45"/><path d="M55 167 H125" stroke="#fff1a3" stroke-width="8" stroke-linecap="round"/></svg>`;
 return `<svg ${common}><defs><linearGradient id="st" x1="0" x2="1"><stop stop-color="#fff1a3"/><stop offset=".5" stop-color="#d2a32a"/><stop offset="1" stop-color="#6b4b0e"/></linearGradient></defs><path d="M90 22 L103 64 L148 64 L112 90 L126 132 L90 106 L54 132 L68 90 L32 64 L77 64Z" fill="url(#st)" stroke="#fff0a1" stroke-width="3"/></svg>`;
}
function awardImage(category){return awardArt(category);}
function awardIdFor(category,competition='GLOBAL'){
 return `${SEASON_ID}__${String(competition||'GLOBAL').toLowerCase().replace(/[^a-z0-9]+/g,'-')}__${String(category).toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
}
function awardVotesFor(id){return state.awardVotes.filter(v=>v.awardId===id);}
function voteCounts(award){
 const counts={}; (award.nominees||[]).forEach(n=>counts[n]=0);
 awardVotesFor(award.id).forEach(v=>{if(counts[v.nominee]!==undefined)counts[v.nominee]++;});
 return counts;
}
function renderAwards(){
 const awards=state.awards.filter(a=>!a.seasonId||a.seasonId===SEASON_ID);
 $('awardsSeason').textContent=state.season?.name||DEFAULT_SEASON; if($('ballonArt')) $('ballonArt').innerHTML=awardArt("Ballon d'Or",'hero-art');
 const ballon=awards.find(a=>String(a.category).toLowerCase()==="ballon d'or" || String(a.category).toLowerCase()==="ballon dor");
 $('ballonWinner').innerHTML=ballon?.winner
   ? `<span>WINNER • ${esc(ballon.season||state.season?.name||DEFAULT_SEASON)}</span><strong>${esc(ballon.winner)}</strong>`
   : `<span>WINNER</span><strong>Winner not announced yet</strong>`;
 const top8=(ballon?.top8||[]).filter(Boolean).slice(0,8);
 $('ballonTop8').innerHTML=top8.length
   ? `<div class="top8-title"><span>FINAL BALLOT</span><h3>Ballon d'Or Top 8</h3></div><div class="top8-grid">${top8.map((n,i)=>`<div class="top8-card"><b>${i+1}</b><span>${esc(n)}</span></div>`).join('')}</div>`
   : `<div class="top8-empty">The Ballon d'Or Top 8 will appear here when the administrator publishes the final list.</div>`;
 const global=awards.filter(a=>['ballon d\'or','ballon dor','european top scorer','european best defender'].includes(String(a.category).toLowerCase()));
 $('globalAwardsGrid').innerHTML=global.length ? global.map(a=>awardCard(a,true)).join('') : '<div class="empty-block">Global award results will appear here.</div>';
 const comps=[...MAJOR_LEAGUES,'Championship','UCL'];
 $('competitionAwards').innerHTML=comps.map(comp=>{
   const aa=awards.filter(a=>String(a.competition||'')===comp && ['Player of the Tournament','Top Scorer','Best Defender'].includes(a.category));
   return `<section class="competition-award-block"><div class="competition-award-heading"><div><span class="award-kicker">${comp==='UCL'?'EUROPEAN NIGHT':'COMPETITION HONOURS'}</span><h3>${esc(comp)}</h3></div><span>3 AWARDS</span></div><div class="awards-grid">${['Player of the Tournament','Top Scorer','Best Defender'].map(cat=>{const a=aa.find(x=>x.category===cat);return a?awardCard(a,false):emptyAwardCard(cat,comp);}).join('')}</div></section>`;
 }).join('');
}
function emptyAwardCard(category,competition){
 return `<article class="award-card award-empty-card"><div class="award-art">${awardArt(category)}<span>${esc(competition)}</span></div><div class="award-card-copy"><span class="award-kicker">${esc(competition)}</span><h3>${esc(category)}</h3><p>Administrator has not published this award yet.</p></div></article>`;
}
function awardCard(a,global=false){
 const counts=voteCounts(a), nominees=(a.nominees||[]).filter(Boolean);
 const isVote=a.category==='Player of the Tournament' && nominees.length;
 return `<article class="award-card ${global?'global-award-card':''}">
   <div class="award-art">${awardArt(a.category)}<span>${esc(a.competition||'GLOBAL')}</span></div>
   <div class="award-card-copy"><span class="award-kicker">${esc(a.season||state.season?.name||DEFAULT_SEASON)}</span><h3>${esc(a.category)}</h3>
   ${a.winner?`<div class="award-winner-line"><small>WINNER</small><strong>${esc(a.winner)}</strong></div>`:'<p>Winner not announced yet.</p>'}
   ${isVote?`<div class="vote-title">VOTE FOR PLAYER OF THE TOURNAMENT</div><div class="nominee-list">${nominees.map(n=>`<button class="nominee-btn" onclick="castAwardVote('${a.id}',${JSON.stringify(n)})"><span>${esc(n)}</span><b>${counts[n]||0}</b></button>`).join('')}</div><small class="vote-note">One vote per award on this device/session.</small>`:''}
   </div></article>`;
}
async function castAwardVote(awardId,nominee){
 try{
   let visitorId=localStorage.getItem('gosperVisitorId');
   if(!visitorId){visitorId=(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now());localStorage.setItem('gosperVisitorId',visitorId);}
   const key=`gosper_voted_${awardId}`;
   if(localStorage.getItem(key)){alert('You have already voted in this award on this device.');return;}
   const ref=db.collection('awardVotes').doc(`${awardId}__${visitorId}`);
   await ref.set({awardId,nominee,visitorId,seasonId:SEASON_ID,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
   localStorage.setItem(key,'1'); await loadData(); alert(`Vote recorded for ${nominee}.`);
 }catch(e){console.error(e);alert('Vote could not be recorded. Please try again.');}
}
window.castAwardVote=castAwardVote;

// ---------- Community Comments ----------
function renderComments(){
  const list=$('commentsList'), count=$('commentCount');
  if(!list)return;
  const comments=state.comments.slice().sort((a,b)=>(dateObj(b.createdAt)?.getTime()||0)-(dateObj(a.createdAt)?.getTime()||0));
  if(count)count.textContent=`${comments.length} message${comments.length===1?'':'s'}`;
  list.innerHTML=comments.length ? comments.map(x=>`<article class="comment-card"><div class="comment-avatar">${esc(initials(x.name||'Guest'))}</div><div class="comment-body"><div class="comment-meta"><strong>${esc(x.name||'Guest')}</strong><span>${esc(dateText(x.createdAt)==='TBA'?'Just now':dateText(x.createdAt))}</span></div><p>${esc(x.text||'')}</p></div></article>`).join('') : '<div class="empty-block">No comments yet. Be the first to start the conversation.</div>';
}
const commentForm=$('commentForm');
commentForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  const name=$('commentName')?.value.trim(), text=$('commentText')?.value.trim(), msg=$('commentMsg'), btn=commentForm.querySelector('button[type="submit"]');
  if(!name||!text){if(msg){msg.className='form-msg error';msg.textContent='Enter your name and message.';}return;}
  btn.disabled=true;btn.textContent='Posting…';
  if(msg){msg.className='form-msg';msg.textContent='';}
  try{
    // Public comments intentionally do not require Firebase Authentication.
    await db.collection('comments').add({name:name.slice(0,40),text:text.slice(0,500),seasonId:SEASON_ID,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    $('commentText').value='';
    if(msg){msg.className='form-msg ok';msg.textContent='Comment posted successfully.';}
    await loadData();
  }catch(err){
    console.error('comment post failed',err);
    if(msg){msg.className='form-msg error';msg.textContent='Comment could not be posted. Please try again.';}
  }finally{btn.disabled=false;btn.textContent='Post Comment';}
});
window.deleteComment=async id=>{if(!state.admin||!confirm('Delete this comment?'))return;try{await db.collection('comments').doc(id).delete();await loadData();adminTab('community');}catch(e){console.error(e);alert('Could not delete comment.');}};

// ---------- Admin ----------
$('adminLoginBtn')?.addEventListener('click',openAdminLogin);$('adminLoginBtn2')?.addEventListener('click',openAdminLogin);
function openAdminLogin(){
 const email=prompt('Admin email:');if(!email)return;const password=prompt('Admin password:');if(password===null)return;
 auth.signInWithEmailAndPassword(email.trim(),password).then(async()=>{state.admin=true;await loadData();go('admin');}).catch(e=>{
  console.error('Firebase admin login failed',e);
  const map={'auth/user-not-found':'No Firebase user exists for this email.','auth/wrong-password':'Wrong password.','auth/invalid-credential':'Wrong email or password.','auth/operation-not-allowed':'Email/Password sign-in is disabled in Firebase Authentication.','auth/invalid-api-key':'The Firebase API key is invalid.','auth/network-request-failed':'Network connection to Firebase failed.'};
  alert(`Admin login failed\n\n${map[e.code]||e.message||e.code}`);
 });
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
 a.innerHTML=`<div class="admin-shell"><div class="admin-nav"><button class="admin-tab active" data-admin-tab="overview">Overview</button><button class="admin-tab" data-admin-tab="competitions">Competitions</button><button class="admin-tab" data-admin-tab="teams">Teams</button><button class="admin-tab" data-admin-tab="fixtures">Fixtures</button><button class="admin-tab" data-admin-tab="ucl">UCL Groups</button><button class="admin-tab" data-admin-tab="results">Results</button><button class="admin-tab" data-admin-tab="members">Members</button><button class="admin-tab" data-admin-tab="promotion">Promotion / Relegation</button><button class="admin-tab" data-admin-tab="news">News</button><button class="admin-tab" data-admin-tab="hall">Hall of Fame</button><button class="admin-tab" data-admin-tab="awards">🏆 Awards</button><button class="admin-tab" data-admin-tab="community">💬 Community</button><button class="admin-tab" data-admin-tab="season">Season</button><button class="ghost" id="adminSignOut">Sign out</button></div><div id="adminContent"></div></div>`;
 document.querySelectorAll('.admin-tab').forEach(b=>b.onclick=()=>adminTab(b.dataset.adminTab));$('adminSignOut').onclick=()=>auth.signOut().then(()=>{state.admin=false;renderAdmin();});adminTab('overview');
}
function adminTab(tab){
 document.querySelectorAll('.admin-tab').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===tab));
 const c=$('adminContent');
 if(tab==='overview')adminOverview(c);if(tab==='competitions')adminCompetitions(c);if(tab==='teams')adminTeams(c);if(tab==='fixtures')adminFixtures(c);if(tab==='ucl')adminUCL(c);if(tab==='results')adminResults(c);if(tab==='members')adminMembers(c);if(tab==='promotion')adminPromotion(c);if(tab==='news')adminNews(c);if(tab==='hall')adminHall(c);if(tab==='awards')adminAwards(c);if(tab==='community')adminCommunity(c);if(tab==='season')adminSeason(c);
}
function adminOverview(c){
 const active=(state.season?.activeCompetitions||ALL_COMPETITIONS);
 c.innerHTML=`<div class="admin-grid"><div class="admin-stat"><b>${state.teams.length||catalog.length}</b><span>Clubs in system</span></div><div class="admin-stat"><b>${state.players.length}</b><span>Players</span></div><div class="admin-stat"><b>${state.fixtures.length}</b><span>Fixtures</span></div><div class="admin-stat"><b>${state.fixtures.filter(f=>score(f)).length}</b><span>Results entered</span></div></div><div class="admin-control-card"><div><p class="eyebrow">CURRENT SEASON</p><h2>${esc(state.season?.name||DEFAULT_SEASON)}</h2><p class="muted">Active competitions: ${active.map(esc).join(' • ')}</p></div><button class="primary" id="quickComp">Choose competitions</button></div><div class="admin-control-card"><div><p class="eyebrow">SEASON MOVEMENT</p><h2>Automatic promotion & relegation</h2><p class="muted">At season end: bottom 2 clubs in each of the four major leagues move to Championship.</p></div><button class="primary" id="quickMove">Open</button></div>`;
 $('quickComp').onclick=()=>adminTab('competitions');$('quickMove').onclick=()=>adminTab('promotion');
}
function adminCompetitions(c){
 const active=state.season?.activeCompetitions||ALL_COMPETITIONS;
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">COMPETITION CONTROL</p><h2>Season competition setup</h2><p>Four major leagues have 6 clubs each. Championship contains smaller clubs. UCL clubs are created from the top 4 of every major league.</p></div></div><div class="competition-control-grid">${ALL_COMPETITIONS.map(x=>`<label class="competition-toggle"><input type="checkbox" data-active-comp="${x}" ${active.includes(x)?'checked':''}><span class="toggle-copy"><b>${x}</b><small>${x==='UCL'?'16 qualified clubs • 4 groups of 4 • Group Stage':'6 clubs • Home & Away'}</small></span><strong>${active.includes(x)?'ACTIVE':'OFF'}</strong></label>`).join('')}</div><div class="admin-actions-row"><button class="primary" id="saveActiveComps">Save Competition Setup</button></div>`;
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
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">SEASON MOVEMENT</p><h2>Relegation</h2><p>At season end, the bottom 2 teams in each major league are relegated to Championship. Championship is excluded from UCL qualification and major-league relegation. UCL qualification uses the top 4 from each major league.</p></div></div>
 <div class="admin-grid">${movements.map(m=>`<div class="tool-card"><h3>RELEGATION — ${esc(m.league)}</h3>${m.relegated.map((r,i)=>`<div class="admin-item"><b>${i+1}. ${esc(r.team)}</b><span>${r.pts} pts • ${r.gd} GD</span></div>`).join('')||'<p class="muted">No table data yet.</p>'}</div>`).join('')}</div>`;
}
function adminNews(c){c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">PUBLISH</p><h2>News & Announcements</h2><p>Publish updates that appear on the public News page.</p></div></div><div class="admin-form"><input id="newsTitle" placeholder="Headline"><input id="newsDate" type="date"><textarea id="newsBody" placeholder="Write announcement..."></textarea><button class="primary" id="saveNews">Publish Announcement</button></div><div class="admin-list">${state.news.map(n=>`<article class="admin-item"><b>${esc(n.title)}</b><span>${esc(n.date||'')}</span><p>${esc(n.body||n.content||'')}</p><button class="mini-btn danger" onclick="deleteNews('${n.id}')">Delete</button></article>`).join('')||'<p class="muted">No news published yet.</p>'}</div>`;$('saveNews').onclick=async()=>{const title=$('newsTitle').value.trim(),body=$('newsBody').value.trim();if(!title||!body)return alert('Headline and announcement text are required.');const btn=$('saveNews');btn.disabled=true;btn.textContent='Publishing…';try{await adminSave('news',null,{title,date:$('newsDate').value,body,seasonId:SEASON_ID,createdAt:firebase.firestore.FieldValue.serverTimestamp()});alert('News published successfully.');adminTab('news');}catch(e){console.error(e);alert('News could not be published. Make sure you are signed in as admin and the latest Firestore Rules are published.');btn.disabled=false;btn.textContent='Publish Announcement';}};}
function adminMembers(c){const ps=state.players.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name)));c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">PLAYER MANAGEMENT</p><h2>Registered Members</h2><p>Remove a registration when necessary. This deletes the member from the current Season.</p></div></div><div class="admin-list">${ps.map(p=>`<article class="admin-item member-admin-item"><div><b>${esc(p.name)}</b><span>${esc(p.club||'Club TBA')}</span><p>${esc(p.playerId||'')} • ${esc(p.competition||'')} • ${esc(state.season?.name||DEFAULT_SEASON)}</p></div><button class="mini-btn danger" onclick="deleteMember('${p.id}')">Remove Member</button></article>`).join('')||'<p class="muted">No registered members.</p>'}</div>`;}
window.deleteMember=async id=>{const p=state.players.find(x=>x.id===id);if(!p)return;if(!confirm(`Remove ${p.name} from ${state.season?.name||DEFAULT_SEASON}? This deletes the registration.`))return;try{const batch=db.batch();batch.delete(db.collection('players').doc(id));if(p.lockId)batch.delete(db.collection('playerTeamLocks').doc(p.lockId));await batch.commit();await loadData();alert('Member removed.');adminTab('members');}catch(e){console.error(e);alert('Could not remove member. Check Firestore Rules for admin writes.');}};
window.deleteNews=id=>adminDelete('news',id);
function adminHall(c){c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">LEGACY</p><h2>Hall of Fame</h2><p>Record champions by competition and Season.</p></div></div><div class="admin-form"><input id="hallSeason" value="${esc(state.season?.name||DEFAULT_SEASON)}" placeholder="Season"><select id="hallComp"><option>Premier League</option><option>Championship</option><option>UCL</option></select><input id="hallWinner" placeholder="Champion / Team"><input id="hallDate" type="date"><button class="primary" id="saveHall">Add Champion</button></div><div class="admin-list">${state.hall.map(h=>`<article class="admin-item"><b>🏆 ${esc(h.winner||h.team)}</b><span>${esc(h.season||'Season')} • ${esc(h.competition||'')}</span></article>`).join('')}</div>`;$('saveHall').onclick=async()=>{await adminSave('hallOfFame',null,{season:$('hallSeason').value.trim(),competition:$('hallComp').value,winner:$('hallWinner').value.trim(),date:$('hallDate').value,seasonId:SEASON_ID});adminTab('hall');};}

function adminAwards(c){
 const current=state.awards.filter(a=>!a.seasonId||a.seasonId===SEASON_ID);
 const categories=['Player of the Tournament','Top Scorer','Best Defender','Ballon d\'Or','European Top Scorer','European Best Defender'];
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">AWARDS CONTROL</p><h2>Awards Management</h2><p>Manually publish nominees, winners and the Ballon d'Or Top 8. Player of the Tournament supports public voting.</p></div></div>
 <div class="admin-form awards-admin-form">
  <select id="awardCategory">${categories.map(x=>`<option>${x}</option>`).join('')}</select>
  <select id="awardCompetition"><option>GLOBAL</option>${[...MAJOR_LEAGUES,'Championship','UCL'].map(x=>`<option>${x}</option>`).join('')}</select>
  <input id="awardWinner" placeholder="Winner / announced player">
  <input id="awardNominees" placeholder="Player of Tournament: exactly 3 names, separated by commas">
  <input id="awardTop8" placeholder="Ballon d'Or Top 8: 8 names, separated by commas">
  <input id="awardSeason" value="${esc(state.season?.name||DEFAULT_SEASON)}" placeholder="Season">
  <button class="primary" id="saveAward">Publish / Update Award</button>
 </div>
 <div class="admin-list">${current.map(a=>`<article class="admin-item"><div><b>${esc(a.category)} • ${esc(a.competition||'GLOBAL')}</b><span>${esc(a.winner||'Winner not announced')}</span></div><p>${a.category==='Player of the Tournament'?`Nominees: ${esc((a.nominees||[]).join(', '))}`:''}${a.category==="Ballon d'Or"&&a.top8?.length?`Top 8: ${esc(a.top8.join(', '))}`:''}</p><button class="mini-btn danger" onclick="deleteAward('${a.id}')">Delete</button></article>`).join('')||'<p class="muted">No awards published yet.</p>'}</div>`;
 $('saveAward').onclick=async()=>{
   const category=$('awardCategory').value, comp=(['Ballon d\'Or','European Top Scorer','European Best Defender'].includes(category)?'GLOBAL':$('awardCompetition').value);
   const nominees=$('awardNominees').value.split(',').map(x=>x.trim()).filter(Boolean).slice(0,3);
   const top8=$('awardTop8').value.split(',').map(x=>x.trim()).filter(Boolean).slice(0,8);
   if(category==='Player of the Tournament' && nominees.length!==3){alert('Enter exactly 3 nominees for Player of the Tournament.');return;}
   const id=awardIdFor(category,comp);
   await adminSave('awards',id,{id,category,competition:comp,season:$('awardSeason').value.trim()||DEFAULT_SEASON,seasonId:SEASON_ID,winner:$('awardWinner').value.trim(),nominees,top8,image:awardImage(category)});
   adminTab('awards');
 };
}
async function deleteAward(id){if(!state.admin||!confirm('Delete this award?'))return;await db.collection('awards').doc(id).delete();await loadData();adminTab('awards');}
window.deleteAward=deleteAward;
function adminCommunity(c){
 const cs=state.comments.slice().sort((a,b)=>(dateObj(b.createdAt)||0)-(dateObj(a.createdAt)||0));
 c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">COMMUNITY CONTROL</p><h2>Comments & Chat</h2><p>Moderate public community messages.</p></div></div><div class="admin-list">${cs.length?cs.map(x=>`<article class="admin-item"><div><b>${esc(x.name||'Guest')}</b><span>${esc(dateText(x.createdAt)||'Just now')}</span></div><p>${esc(x.text||'')}</p><button class="mini-btn danger" onclick="deleteComment('${x.id}')">Delete</button></article>`).join(''):'<p class="muted">No community messages yet.</p>'}</div>`;
}

function adminSeason(c){const s=state.season||{};c.innerHTML=`<div class="admin-heading"><div><p class="eyebrow">SEASON MANAGEMENT</p><h2>Season settings</h2></div></div><div class="admin-form"><input id="seasonName" value="${esc(s.name||DEFAULT_SEASON)}" placeholder="Season name"><select id="seasonStatus"><option ${s.status==='Upcoming'?'selected':''}>Upcoming</option><option ${s.status==='Ongoing'?'selected':''}>Ongoing</option><option ${s.status==='Completed'?'selected':''}>Completed</option></select><input id="seasonYear" value="${esc(s.year||'2026')}" placeholder="Year"><button class="primary" id="saveSeason">Save Season</button></div>`;$('saveSeason').onclick=async()=>{const active=state.season?.activeCompetitions||ALL_COMPETITIONS;await adminSave('seasons',SEASON_ID,{name:$('seasonName').value.trim(),status:$('seasonStatus').value,year:$('seasonYear').value,current:true,activeCompetitions:active});adminTab('season');};}
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});
auth.onAuthStateChanged(async u=>{state.admin=!!u&&!u.isAnonymous;await loadData();if(document.querySelector('[data-page-content=\"admin\"]')?.classList.contains('active'))renderAdmin();});function adminResults(c){
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
  if(hv===''||av===''||!/^\d+$/.test(hv)||!/^\d+$/.test(av)){alert('Enter valid whole-number scores for both teams.');return;}
  const btn=hEl?.parentElement?.querySelector('button');
  if(btn){btn.disabled=true;btn.textContent='Saving…';}
  try{
    await db.collection('fixtures').doc(id).set({homeScore:Number(hv),awayScore:Number(av),resultStatus:'completed',resultUpdatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
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
    await db.collection('fixtures').doc(id).update({homeScore:firebase.firestore.FieldValue.delete(),awayScore:firebase.firestore.FieldValue.delete(),resultStatus:firebase.firestore.FieldValue.delete(),resultUpdatedAt:firebase.firestore.FieldValue.delete(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
    await loadData();
    adminTab('results');
  }catch(e){
    console.error('clearFixtureResult failed',e);
    alert('Result could not be cleared.');
  }
}
window.clearFixtureResult=clearFixtureResult;

function resultFixtureHtml(f){
 const [h,a]=teamsInFixture(f),sc=score(f);
 return `<article class="admin-item"><div><b>${esc(h)} vs ${esc(a)}</b><span>${esc(compOf(f))} • ${esc(f.round||'Matchday')} • ${esc(dateText(f.date||f.kickoff))}</span></div><div class="admin-result-form"><input type="number" min="0" id="homeScore-${f.id}" value="${sc?sc.h:''}" placeholder="Home"><strong>-</strong><input type="number" min="0" id="awayScore-${f.id}" value="${sc?sc.a:''}" placeholder="Away"><button class="mini-btn" onclick="saveFixtureResult('${f.id}')">Save Result</button>${sc?`<button class="mini-btn danger" onclick="clearFixtureResult('${f.id}')">Clear</button>`:''}</div></article>`;
}

