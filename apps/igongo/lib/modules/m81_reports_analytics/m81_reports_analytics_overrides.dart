// The hand-made screens of module 81 (Reports & Analytics), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/dashboard/dashboard_screen.dart';

/// Module 81's hand-made screens.
final m81Overrides = <String, ScreenOverride>{
  'S81-01': (_, s) => DashboardScreen(s),
  'S81-02': (_, s) => DashboardScreen(s),
};
