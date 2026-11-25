// Where the app finds the Igongo API. Set at build time, so a test or
// staging build can point elsewhere without code changes:
//   flutter run --dart-define=IGONGO_API_URL=http://localhost:8787

/// The API's address, with no trailing slash.
const String igongoApiUrl = String.fromEnvironment('IGONGO_API_URL', defaultValue: 'https://igongo-api.victorbee.com');
