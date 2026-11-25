// Small helpers that make sample text look real: people's names, times and
// row subtitles. All invented for the prototype.

import '../catalog/catalog.dart';

/// Sample people, times and row details for the prototype screens.
abstract final class SampleText {
  /// Invented staff and guest names.
  static const people = [
    'Atuhaire Grace',
    'Mugisha Brian',
    'Kyomuhendo Sarah',
    'Tumusiime Ronald',
    'Natukunda Esther',
    'Byaruhanga Joel',
    'Kansiime Doreen',
    'Okello James',
  ];

  /// Sample times of day.
  static const times = ['07:52', '08:30', '09:15', '11:40', '13:05', '16:00', '18:20', '21:45'];

  /// The status for row [i] of [mock], cycling through the module's statuses.
  static String statusFor(ModuleMock mock, int i) => mock.statuses[i % mock.statuses.length];

  /// A subtitle for row [i], such as "Today 09:15 · Mugisha Brian".
  static String subtitleFor(int i) =>
      '${i < 3 ? 'Today' : 'Yesterday'} ${times[i % times.length]} · ${people[(i + 3) % people.length]}';

  /// A sample value for a form field, chosen from its label.
  static String hintFor(String label) {
    final l = label.toLowerCase();
    // Each check looks for a word in the label and gives a matching sample.
    if (l.contains('phone')) return '+256 772 000 111';
    if (l.contains('email')) return 'name@example.com';
    if (l.contains('name') || l.contains('person') || l.contains('who')) return people.first;
    if (l.contains('date') || l.contains('from') || l.contains('to') || l.contains('when')) return '28 Nov 2026';
    if (l.contains('time')) return '16:00';
    if (l.contains('amount') || l.contains('price') || l.contains('value')) return 'UGX 0';
    if (l.contains('number') || l.contains('quantity') || l.contains('nights') || l.contains('guests')) return '1';
    return label;
  }
}
