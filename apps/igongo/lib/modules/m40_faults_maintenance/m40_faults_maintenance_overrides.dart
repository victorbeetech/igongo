// The hand-made screens of module 40 (Faults & Maintenance), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/my_faults/my_faults_screen.dart';
import 'presentation/report/report_fault_screen.dart';

/// Module 40's hand-made screens.
final m40Overrides = <String, ScreenOverride>{
  'S40-01': (_, s) => ReportFaultScreen(s),
  'S40-02': (_, s) => MyFaultsScreen(s),
  // Details open inside the screen above, so their numbers lead there too.
  'S40-04': (_, s) => MyFaultsScreen(s),
};
