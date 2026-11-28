// Golden (screenshot) tests for the checkout and order-tracking screens:
// booking review, guest details, payment selection, reservation confirmed,
// and the order tracker in its live and delivered states. Each screen is
// made on a large phone in light and dark mode. Regenerate with
// `flutter test --update-goldens --tags golden test/golden/checkout`.

@Tags(['golden'])
library;

import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/booking_review_screen.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/guest_details_screen.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/order_confirmed_screen.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/order_tracking/order_tracking_screen.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/payment_selection_screen.dart';
import 'package:igongo/shared/theme/igongo_theme.dart';

import '../../support/open_app.dart';

void main() {
  // Step 1: each named screen, paired with the file name its picture is saved under.
  final screens = <String, Widget Function()>{
    'booking_review': () => const BookingReviewScreen(),
    'guest_details': () => const GuestDetailsScreen(),
    'payment_selection': () => const PaymentSelectionScreen(),
    'order_confirmed': () => const OrderConfirmedScreen(),
    'order_tracking_live': () => const OrderTrackingScreen(status: TrackingStatus.live),
    'order_tracking_delivered': () => const OrderTrackingScreen(status: TrackingStatus.delivered),
  };

  // Step 2: the two modes, each shown with the same brand theme.
  const modes = {'light': ThemeMode.light, 'dark': ThemeMode.dark};

  for (final MapEntry(key: name, value: build) in screens.entries) {
    for (final MapEntry(key: modeName, value: mode) in modes.entries) {
      testWidgets('$name on a large phone, $modeName', (tester) async {
        // Step 3: a large phone window at two device pixels each.
        usePhoneWindow(tester, width: 430, height: 932, ratio: 2);
        // Step 4: the screen under the app's light or dark theme.
        await tester.pumpWidget(
          ProviderScope(
            child: MaterialApp(
              debugShowCheckedModeBanner: false,
              theme: IgongoTheme.light,
              darkTheme: IgongoTheme.dark,
              themeMode: mode,
              home: build(),
            ),
          ),
        );
        await tester.pumpAndSettle();
        // Step 5: compare with the approved picture.
        await expectLater(find.byType(MaterialApp), matchesGoldenFile('goldens/$modeName/checkout_$name.png'));
      });
    }
  }
}
