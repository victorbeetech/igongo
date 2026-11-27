// Tests for the Bookings home's static pieces: the eight resort experience tiles,
// the status words, and the experience tile's tap and screen-reader name.

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/booking_status_label.dart';
import 'package:igongo/shared/bookings/domain/resort_experiences.dart';
import 'package:igongo/shared/bookings/presentation/home/experience_tile.dart';

import '../../../support/pump_component.dart';

void main() {
  test('the home has the eight resort experiences in order', () {
    expect(resortExperiences.map((e) => e.label), [
      'Accommodations',
      'Dining & Bars',
      'Erijukiro Museum',
      'Eclipse Hill',
      'Heated Pool',
      'Spa & Sauna',
      'Conferences',
      'Craft Village',
    ]);
  });

  test('the experiences without a screen yet have no screen number (placeholder)', () {
    final none = resortExperiences.where((e) => e.screenId == null).map((e) => e.label);
    expect(none, ['Eclipse Hill']);
  });

  test('booking status codes read as words, and unknown codes show as they are', () {
    expect(bookingStatusLabel('awaiting_payment'), 'Awaiting payment');
    expect(bookingStatusLabel('checked_in'), 'Checked in');
    expect(bookingStatusLabel('something_new'), 'something_new');
  });

  bothModes('an experience tile has its name for screen readers and reports a tap', (tester, dark) async {
    var taps = 0;
    await pumpComponent(
      tester,
      // The tile fills the space it is given, so it gets a box of its own.
      SizedBox(
        width: 170,
        height: 210,
        child: ExperienceTile(experience: resortExperiences.first, onTap: () => taps++),
      ),
      dark: dark,
    );
    expect(find.bySemanticsLabel('Accommodations'), findsOneWidget);
    await tester.tap(find.byType(ExperienceTile));
    expect(taps, 1);
  });
}
