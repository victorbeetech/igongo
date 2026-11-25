// The hand-made screens of module 25 (Attendance), by screen number, live
// from the API. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/clock_in/clock_in_screen.dart';
import 'presentation/my_attendance/my_attendance_screen.dart';

/// Module 25's hand-made screens.
final m25Overrides = <String, ScreenOverride>{
  'S25-01': (_, s) => ClockInScreen(s),
  'S25-03': (_, s) => MyAttendanceScreen(s),
};
