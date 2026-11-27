// The Google OAuth client IDs for the phone app. These are public values, not
// secrets (the secret lives only on the server).

/// The Google OAuth client ID for the iPhone app (bundle ug.co.igongo.igongo).
const String googleIosClientId = '707707727967-802llnqis9nfa74280mkl9vjf7l89kep.apps.googleusercontent.com';

/// The Google OAuth client ID for the Android app (package ug.co.igongo.igongo).
const String googleAndroidClientId = '707707727967-ur411vo11lv1ce9undl07q8al2rhttl1.apps.googleusercontent.com';

/// The Google OAuth client ID of the Igongo API (the web client). The Android
/// app passes it as the server client ID, so its ID tokens carry this audience.
/// The API also accepts the iPhone and Android IDs above (see apps/api wrangler.jsonc).
const String googleWebClientId = '707707727967-gdpm3r7q6ckrlorrmoq9a2obchqkm4a7.apps.googleusercontent.com';
