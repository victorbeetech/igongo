// The editable words on the guest home. An empty value means the app keeps its
// built-in wording, so nothing shows up blank.

/// The greeting and welcome words from the content API.
class GuestTexts {
  /// Creates the words.
  const GuestTexts({this.greetingMorning = '', this.greetingAfternoon = '', this.greetingEvening = '', this.welcomeLine = ''});

  /// Reads them from the API's JSON; a missing field is empty.
  factory GuestTexts.fromJson(Map<String, dynamic> json) => GuestTexts(
    greetingMorning: json['greetingMorning'] as String? ?? '',
    greetingAfternoon: json['greetingAfternoon'] as String? ?? '',
    greetingEvening: json['greetingEvening'] as String? ?? '',
    welcomeLine: json['welcomeLine'] as String? ?? '',
  );

  /// The morning greeting, e.g. "Good morning" (empty keeps the built-in one).
  final String greetingMorning;

  /// The afternoon greeting (empty keeps the built-in one).
  final String greetingAfternoon;

  /// The evening greeting (empty keeps the built-in one).
  final String greetingEvening;

  /// The line shown with no guest signed in (empty keeps the built-in one).
  final String welcomeLine;
}
