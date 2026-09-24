FIRESTORE RULES — GOSPER GLOBAL eFOOTBALL LEAGUE

This ZIP includes firestore.rules and it is intended to be deployed with the
continuous-seasons build.

ADMIN SETUP (IMPORTANT)
1. Sign in to Firebase Authentication with the admin email/password account.
2. Copy that Firebase Authentication user's UID.
3. In Firestore Console create:
   Collection: admins
   Document ID: <ADMIN_AUTH_UID>
   Example fields: role = "admin"
4. Deploy firestore.rules.

The rules identify administrators by the existence of /admins/{auth.uid}.
Do NOT rely on the email/password provider itself as proof of admin access.

SEASON SUPPORT
- Admins can create/update/archive seasons.
- Fixtures/results are tied to seasonId.
- A season must be Ongoing before new fixtures/results/player registrations
  can be created for it.
- Historical season documents remain readable.

HALL OF FAME
- Hall of Fame is public-readable and admin-writable.
- Start New Season writes champion records without deleting previous records.
- Manual Save Champion also persists the record in hallOfFame.

UCL
- UCL qualification/group data is stored on the season document.
- Generated UCL fixtures are stored with the new seasonId.

If the first admin document does not exist yet, create it in Firebase Console;
the rules intentionally prevent an unauthenticated user from making themselves
an admin.
