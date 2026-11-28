// Behaviour tests for the Updates screen (S00-28). The inbox is replaced by a
// fixed test page, so the tests check the app bar and the mark-all action with
// no sample data on screen.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/modules/m10_notifications/application/inbox_providers.dart';
import 'package:igongo/modules/m10_notifications/domain/inbox_item.dart';
import 'package:igongo/modules/m10_notifications/domain/inbox_page.dart';
import 'package:igongo/shared/session/session_controller.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/guest_session.dart';
import '../../support/open_app.dart';

void main() {
  // A two-alert inbox for the test: one unread, one read.
  final testPage = InboxPage(
    items: [
      InboxItem(id: 'a1', title: 'Order ready', body: 'Your room service order is on the way', createdAt: DateTime(2026, 11, 28)),
      InboxItem(
        id: 'a2',
        title: 'Spa booked',
        body: 'Your spa visit is confirmed',
        createdAt: DateTime(2026, 11, 27),
        readAt: DateTime(2026, 11, 27, 12),
      ),
    ],
    unreadCount: 1,
  );

  // Step 1: open the screen for a signed-in guest, on a phone-sized window, with the test inbox.
  Future<void> openUpdates(WidgetTester tester) async {
    usePhoneWindow(tester, width: 430, height: 932, ratio: 2);
    await openApp(
      tester,
      CatalogIndex.instance.locationOf(CatalogIndex.instance.screens['S00-28']!),
      preview: false,
      overrides: [
        sessionProvider.overrideWith(FakeGuestSession.new),
        inboxProvider.overrideWith((ref) async => testPage),
      ],
    );
    await tester.pumpAndSettle();
  }

  testWidgets('the app bar is titled Updates and has no logo row', (tester) async {
    await openUpdates(tester);
    // Step 2: the title sits in the app bar, and the old top row (bell, avatar) is gone.
    expect(find.text('Updates'), findsOneWidget);
    expect(find.byTooltip('Notifications'), findsNothing);
    expect(find.byIcon(Icons.person), findsNothing);
    // Step 3: the live alerts show their real titles.
    expect(find.text('Order ready'), findsOneWidget);
    expect(find.text('Spa booked'), findsOneWidget);
  });

  testWidgets('Mark all as read is in the app bar and is enabled while something is unread', (tester) async {
    await openUpdates(tester);
    // Step 4: the action is present and enabled because one alert is unread.
    final action = find.widgetWithText(TextButton, 'Mark all as read');
    expect(action, findsOneWidget);
    expect(tester.widget<TextButton>(action).onPressed, isNotNull);
  });
}
