GOSPER GLOBAL eFOOTBALL LEAGUE - WEBSITE OVERHAUL

This version keeps the Firebase project configuration supplied by the owner and redesigns the public site as a responsive league dashboard.

Included:
- Dashboard, competitions, teams, fixtures, standings, players, Hall of Fame and news sections
- Firebase player registration with one registration document per Player ID/phone + season
- Firebase reads for teams, fixtures, results, news and Hall of Fame
- Team logo support through team logo URLs; Firebase team documents can override the catalog
- Responsive mobile navigation
- Admin login entry point

Important:
The current Firestore rules must permit the collections used by the public site to be read. Player creation uses the anonymous-authenticated user. Admin write controls require admin-specific Firestore rules/authorization; this public build does not grant write access to admin collections by itself.
