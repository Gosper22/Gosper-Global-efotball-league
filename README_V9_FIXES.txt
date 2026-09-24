Gosper Global eFootball League — v9 code fixes

This version keeps the Firestore rules from v8 and fixes application-side admin workflows.

Fixes:
- Save Champion writes directly to hallOfFame and no longer depends on a post-save loadData() cycle.
- Admin actions verify the actual Firebase Auth session instead of relying only on the UI state flag.
- Start New Season reports the exact stage that failed instead of only showing a generic permissions error.
- Fixed the catalog lookup used when creating next-season team documents.
- Start New Season continues to support continuous seasons, Hall of Fame, promotion/relegation, player carry-over, and UCL qualification.
