// The one place that says whether the map can be used.
//
// The map needs a Google Maps key from the owner, given to the app at build
// time: `--dart-define=IGONGO_MAPS_KEY=<key>`. Until that key is set,
// [mapReady] is false and the checkout shows an honest notice instead of a
// map. See docs/NEEDS-YOU.md for the exact steps.

/// The map key, from the build (empty when not set).
const String kIgongoMapsKey = String.fromEnvironment('IGONGO_MAPS_KEY');

/// True once the owner's map key is built in, so the map can be drawn.
bool get mapReady => kIgongoMapsKey.isNotEmpty;
