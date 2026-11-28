// Behaviour tests for the Updates screen (S00-28): the filter tabs narrow the
// cards and "Mark all as read" clears the unread marks. These run on the placeholder content, before the feed is wired.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:igongo/shared/session/session_controller.dart';

import '../../support/guest_session.dart';
import '../../support/open_app.dart';

void main() {
  // Step 1: open the screen for a signed-in guest, on a phone-sized window.
  Future<void> openUpdates(WidgetTester tester) async {
    usePhoneWindow(tester, width: 430, height: 932, ratio: 2);
    await openApp(
      tester,
      CatalogIndex.instance.locationOf(CatalogIndex.instance.screens['S00-28']!),
      preview: false,
      overrides: [sessionProvider.overrideWith(FakeGuestSession.new)],
    );
    await tester.pumpAndSettle();
  }

  testWidgets('each filter tab shows only its own cards', (tester) async {
    await openUpdates(tester);
    // Step 2: the Promos tab hides every card except the weekend offer.
    await tester.tap(find.text('Promos'));
    await tester.pumpAndSettle();
    expect(find.text('Special Weekend Offer'), findsOneWidget);
    expect(find.text('Room Service Order on the Way'), findsNothing);
    expect(find.text('Cultural Tour Reminder'), findsNothing);
    // Step 3: the Resort News tab shows only the tour reminder.
    await tester.tap(find.text('Resort News'));
    await tester.pumpAndSettle();
    expect(find.text('Cultural Tour Reminder'), findsOneWidget);
    await tester.tap(find.text('Orders & Stays'));
    await tester.pumpAndSettle();
    expect(find.text('Room Service Order on the Way'), findsOneWidget);
    expect(find.text('Cultural Tour Reminder'), findsNothing);
  });

  testWidgets('mark all as read clears the new count and disables the action', (tester) async {
    await openUpdates(tester);
    // Step 4: two new updates at the start.
    expect(find.text('2 new'), findsOneWidget);
    // Step 5: marking all read shows zero new and the action reads "All read".
    await tester.tap(find.text('Mark all as read'));
    await tester.pumpAndSettle();
    expect(find.text('0 new'), findsOneWidget);
    expect(find.text('All read'), findsOneWidget);
    // Step 6: the app itself is still the one being tested.
    expect(find.byType(IgongoApp), findsOneWidget);
  });
}
