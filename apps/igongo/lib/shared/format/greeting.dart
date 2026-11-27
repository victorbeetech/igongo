// The time-of-day greeting for the guest home, in the hotel's time zone
// (UTC+3, no daylight saving).

/// "Good morning", "Good afternoon" or "Good evening" for [now] (UTC), then
/// ", [name]" when a first name is known.
String greetingFor(DateTime now, String? name) {
  // Step 1: the hotel's local hour.
  final hour = now.toUtc().add(const Duration(hours: 3)).hour;
  // Step 2: before noon is morning, before 5 PM afternoon, else evening.
  final word = hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
  final first = name?.trim().split(' ').first ?? '';
  return first.isEmpty ? word : '$word, $first';
}
