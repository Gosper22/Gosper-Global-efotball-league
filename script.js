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
const clubs = [
  'Manchester City','Chelsea','Arsenal','Liverpool','Manchester United','Tottenham Hotspur',
  'Newcastle United','Aston Villa','West Ham United','Brighton','Crystal Palace','Everton',
  'Fulham','Brentford','Wolverhampton','Nottingham Forest','Bournemouth','Leicester City',
  'Real Madrid','Barcelona','Bayern Munich','PSG','Inter Milan','AC Milan','Juventus',
  'Borussia Dortmund','Atletico Madrid','Benfica','Porto','Ajax','Galatasaray','Al Ahly',
  'Simba SC','Yanga SC','Azam FC','APR FC','TP Mazembe','Mamelodi Sundowns'
];

const sel = document.getElementById('club');
clubs.forEach(c => {
  const o = document.createElement('option');
  o.value = c;
  o.textContent = c;
  sel.appendChild(o);
});

const teams = clubs.slice(0,16);
document.getElementById('table').innerHTML = teams.map((t,i) =>
  `<tr><td>${String(i+1).padStart(2,'0')}</td><td>🟢 ${t}</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>`
).join('');

const matches = [
  ['Manchester City','Chelsea','19:30'],
  ['Arsenal','Liverpool','21:00'],
  ['Manchester United','Tottenham Hotspur','22:30']
];
document.getElementById('matches').innerHTML = matches.map(m =>
  `<div style="padding:15px 0;border-bottom:1px solid #29351c"><small>Premier League · ${m[2]}</small><p><b>${m[0]}</b>　 VS　 <b>${m[1]}</b></p></div>`
).join('');

const countEl = document.getElementById('count');
const msg = document.getElementById('msg');

async function refreshCount() {
  try {
    const snap = await db.collection('players').where('seasonId','==',seasonId).get();
    countEl.textContent = snap.size;
  } catch (err) {
    console.error(err);
    countEl.textContent = '0';
  }
}

auth.signInAnonymously()
  .then(() => refreshCount())
  .catch(err => {
    console.error(err);
    msg.textContent = 'Firebase authentication is not enabled yet.';
    msg.style.color = '#ff6670';
  });

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();

  if (!auth.currentUser) {
    msg.textContent = 'Please wait for Firebase connection.';
    msg.style.color = '#ff6670';
    return;
  }

  const name = document.getElementById('name').value.trim();
  const rawId = document.getElementById('pid').value.trim();
  const id = rawId.toLowerCase().replace(/\s+/g,'');
  const competition = document.getElementById('competition').value;
  const club = sel.value;

  if (!name || !id || !club) return;

  // One player identity can exist only once per season.
  const docId = `${seasonId}_${id.replace(/[^a-z0-9_-]/g,'_')}`;
  const ref = db.collection('players').doc(docId);

  try {
    const existing = await ref.get();
    if (existing.exists) {
      const old = existing.data();
      msg.textContent = `Player already registered with ${old.club || 'another club'} for Season 1.`;
      msg.style.color = '#ff6670';
      return;
    }

    await ref.set({
      name,
      playerId: rawId,
      playerIdKey: id,
      competition,
      club,
      seasonId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    });

    msg.textContent = `Registration successful — ${club}`;
    msg.style.color = '#baff21';
    e.target.reset();
    await refreshCount();
  } catch (err) {
    console.error(err);
    msg.textContent = 'Registration failed. Check Firebase settings/rules.';
    msg.style.color = '#ff6670';
  }
});
