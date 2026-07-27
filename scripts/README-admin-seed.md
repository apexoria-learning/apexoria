// One-shot admin seed — run from the browser console at /admin AFTER the first admin is manually added in Firestore, OR run locally with a service account.
// Simplest bootstrap: manually add the first admin doc in the Firebase Console,
// then use this file as a reference for what fields each doc should carry.
//
// Firestore path: /admins/{email}
// Doc fields (all optional except email):
//   email: string (matches the doc ID; lowercased)
//   name: string
//   addedAt: timestamp (auto server timestamp)
//   addedBy: string (email of the admin who added them)
//
// To bootstrap the very first admin, go to Firebase Console → Firestore →
// Start collection → collection id = admins → document id = your email (lowercased)
// → add fields as above.
//
// After that, in the CMS you can add more admins from the browser (a future admin-users page).
