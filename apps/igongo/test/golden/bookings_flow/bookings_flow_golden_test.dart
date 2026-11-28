// Golden (screenshot) tests for the booking-flow screens built from the new
// designs: museum booking review, event room selection, safari dates and
// guests, spa payment and confirmation, pool accommodation, stay room choice,
// primary guest details and the boarding pass confirmation. Each screen is
// drawn on a large phone, tall enough to show the top of the screen, in light
// and dark mode. Regenerate with
// `flutter test --update-goldens --tags golden test/golden/bookings_flow`.

@Tags(['golden'])
library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/bookings/presentation/flow/screens/boarding_pass_confirmation_screen.dart';
import 'package:igongo/shared/bookings/presentation/flow/screens/cottage_guest_details_screen.dart';
import 'package:igongo/shared/bookings/presentation/flow/screens/event_room_selection_screen.dart';
import 'package:igongo/shared/bookings/presentation/flow/screens/museum_booking_review_screen.dart';
import 'package:igongo/shared/bookings/presentation/flow/screens/pool_accommodation_screen.dart';
import 'package:igongo/shared/bookings/presentation/flow/screens/safari_dates_guests_screen.dart';
import 'package:igongo/shared/bookings/presentation/flow/screens/spa_payment_confirmation_screen.dart';
import 'package:igongo/shared/bookings/presentation/flow/screens/stay_room_guest_details_screen.dart';
import 'package:igongo/shared/theme/igongo_theme.dart';

import '../../support/open_app.dart';

void main() {
  // Step 1: each screen, paired with the file name its picture is saved under.
  final screens = <String, Widget Function()>{
    'museum_booking_review': () => const MuseumBookingReviewScreen(),
    'event_room_selection': () => const EventRoomSelectionScreen(),
    'safari_dates_guests': () => const SafariDatesGuestsScreen(),
    'spa_payment_confirmation': () => const SpaPaymentConfirmationScreen(),
    'pool_accommodation': () => const PoolAccommodationScreen(),
    'stay_room_guest_details': () => const StayRoomGuestDetailsScreen(),
    'cottage_guest_details': () => const CottageGuestDetailsScreen(),
    'boarding_pass_confirmation': () => const BoardingPassConfirmationScreen(),
  };

  // Step 2: the two modes, each shown with the same brand theme.
  const modes = {'light': ThemeMode.light, 'dark': ThemeMode.dark};

  for (final MapEntry(key: name, value: build) in screens.entries) {
    for (final MapEntry(key: modeName, value: mode) in modes.entries) {
      testWidgets('$name on a large phone, $modeName', (tester) async {
        // Step 3: a large phone window, tall enough for the top of each long screen.
        usePhoneWindow(tester, width: 430, height: 2400, ratio: 2);
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
        await expectLater(find.byType(MaterialApp), matchesGoldenFile('goldens/bookings_flow/$modeName/$name.png'));
      });
    }
  }
}
