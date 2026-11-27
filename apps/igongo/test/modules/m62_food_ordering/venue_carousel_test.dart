// Checks the Food venue slideshow: it starts on the first venue with the middle
// card highlighted, moves to the next venue every 2.5 seconds, and loops back.

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/food_home/venue_carousel.dart';

/// Builds a carousel of three plain text venues; the highlighted one reads "HIGHLIGHT n".
Widget _carousel({int count = 3}) => Directionality(
  textDirection: TextDirection.ltr,
  child: SizedBox(
    width: 400,
    height: 170,
    child: VenueCarousel(
      itemCount: count,
      itemBuilder: (_, i, highlighted) => Text(highlighted ? 'HIGHLIGHT $i' : 'venue $i'),
    ),
  ),
);

/// Moves the clock forward in small steps, so timers fire and slides animate frame by frame.
Future<void> _advance(WidgetTester tester, Duration total) async {
  for (var t = Duration.zero; t < total; t += const Duration(milliseconds: 100)) {
    await tester.pump(const Duration(milliseconds: 100));
  }
}

void main() {
  testWidgets('starts on the first venue, then slides every 2.5 seconds and loops', (tester) async {
    await tester.pumpWidget(_carousel());
    // Step 1: at the start the first venue is highlighted.
    expect(find.text('HIGHLIGHT 0'), findsOneWidget);

    // Step 2: after one interval plus the slide, the second venue is highlighted.
    await _advance(tester, kVenueSlideInterval + kVenueSlideDuration);
    expect(find.text('HIGHLIGHT 1'), findsOneWidget);

    // Step 3: two more slides bring it back round to the first venue, so it loops.
    await _advance(tester, kVenueSlideInterval + kVenueSlideDuration);
    await _advance(tester, kVenueSlideInterval + kVenueSlideDuration);
    expect(find.text('HIGHLIGHT 0'), findsOneWidget);
  });

  testWidgets('a single venue does not slide', (tester) async {
    await tester.pumpWidget(_carousel(count: 1));
    await _advance(tester, kVenueSlideInterval * 3);
    expect(find.text('HIGHLIGHT 0'), findsOneWidget);
  });
}
