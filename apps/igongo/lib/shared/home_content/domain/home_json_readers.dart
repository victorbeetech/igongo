// Small readers that turn the loose JSON from the public settings into safe Dart
// values. A missing or wrong-typed field gives a default, so one bad value never
// breaks the whole home screen.

/// The text in [value], or "" when it is not text.
String readText(Object? value) => value is String ? value.trim() : '';

/// The true/false in [value]; [fallback] when it is missing or not a true/false value.
bool readSwitch(Object? value, {bool fallback = true}) => value is bool ? value : fallback;

/// The list of JSON objects in [value]; anything else (or a non-object item) is skipped.
List<Map<String, dynamic>> readObjects(Object? value) => value is List ? value.whereType<Map<String, dynamic>>().toList() : const [];
