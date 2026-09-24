Gosper Global eFootball League — v11 Original Clubs Reset

Changes:
- Added Admin -> Teams -> Restore Original Clubs.
- Restores the original 40-club structure from the built-in catalog:
  * Premier League: Liverpool, Arsenal, Manchester City, Manchester United, Chelsea, Tottenham Hotspur, Newcastle United, Leeds United
  * LaLiga: Real Madrid, Barcelona, Atletico Madrid, Athletic Bilbao, Sevilla, Valencia, Real Betis, Villarreal
  * Serie A: Inter, AC Milan, Juventus, Napoli, Roma, Lazio, Atalanta, Fiorentina
  * Bundesliga: Bayern Munich, Borussia Dortmund, Bayer Leverkusen, RB Leipzig, Eintracht Frankfurt, VfB Stuttgart, Wolfsburg, Borussia Monchengladbach
  * Championship: Al Ahly, Zamalek, Esperance Tunis, Wydad Casablanca, Mamelodi Sundowns, Simba SC, Young Africans, TP Mazembe
- Removes all promoted/relegated team records from the selected season when Restore Original Clubs is used.
- Restores original competition assignment and original catalog logo URL for every club.
- Clears saved manual promotion/relegation choices for the selected season.
- Previous seasons are not touched.
- Existing manual promotion/relegation and continuous-season code remains available for future season transitions.
- Save Club Availability also preserves the original catalog logos.

Important:
This ZIP cannot directly modify the live Firestore database until deployed. After deployment, use Admin -> Teams -> Restore Original Clubs once on the season you want to reset.
