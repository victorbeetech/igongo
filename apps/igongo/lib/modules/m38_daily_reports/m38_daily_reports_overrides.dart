// The hand-made screens of module 38 (Daily Reports), by screen number, live
// from the API. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/my_report/my_report_screen.dart';

/// Module 38's hand-made screens.
final m38Overrides = <String, ScreenOverride>{
  'S38-01': (_, s) => MyReportScreen(s),
  'S38-02': (_, s) => MyReportScreen(s),
  // Details open inside the screen above, so their numbers lead there too.
  'S38-06': (_, s) => MyReportScreen(s),
};
