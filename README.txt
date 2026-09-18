Gosper Global eFootball League — Firebase Connected
=====================================================

Connected to Firebase project:
gospel-global-efootball

Current connection:
- Firebase Web SDK (compat/CDN)
- Anonymous Authentication for public player registration
- Firestore `players` collection
- One-player-per-season enforced by document ID
- Player count is read from Firestore

IMPORTANT SETUP IN FIREBASE:
1. Authentication -> Sign-in method -> enable Anonymous.
2. Firestore Database -> Rules -> paste firestore.rules and Publish.
3. Then upload these website files to GitHub Pages/hosting.

The static club list is still the starter UI. The next development step is the
Admin Panel, where the admin will control seasons, available clubs, competitions,
fixtures, results, news and Hall of Fame.
