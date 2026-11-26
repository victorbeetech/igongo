// The hand-made screens of module 29 (Earnings Statements), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/lifetime/lifetime_earnings_screen.dart';
import 'presentation/payslips/my_payslips_screen.dart';

/// Module 29's hand-made screens.
final m29Overrides = <String, ScreenOverride>{
  'S29-01': (_, s) => MyPayslipsScreen(s),
  'S29-03': (_, s) => LifetimeEarningsScreen(s),
  // Details open inside the screen above, so their numbers lead there too.
  'S29-02': (_, s) => MyPayslipsScreen(s),
  'S29-04': (_, s) => LifetimeEarningsScreen(s),
};
