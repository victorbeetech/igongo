// Picks the shared layout for a screen from its kind. This is the only place
// that knows which layout draws which kind.

import 'package:material_ui/material_ui.dart';

import '../catalog/catalog.dart';
import 'builder/builder_layout.dart';
import 'dashboard/dashboard_layout.dart';
import 'detail/detail_layout.dart';
import 'form/form_layout.dart';
import 'home/hub_layout.dart';
import 'list/list_layout.dart';
import 'map/map_layout.dart';
import 'result/result_layout.dart';
import 'scanner/scanner_layout.dart';
import 'settings/settings_layout.dart';

/// The shared layout for [screen], chosen by its kind.
Widget screenLayout(ScreenContext screen) => switch (screen.spec.kind) {
  ScreenKind.home => HubLayout(screen),
  ScreenKind.dashboard => DashboardLayout(screen),
  ScreenKind.scanner => ScannerLayout(screen),
  ScreenKind.map => MapLayout(screen),
  ScreenKind.settings => SettingsLayout(screen),
  ScreenKind.builder => BuilderLayout(screen),
  ScreenKind.form => FormLayout(screen),
  ScreenKind.detail => DetailLayout(screen),
  ScreenKind.result => ResultLayout(screen),
  ScreenKind.list => ListLayout(screen),
};
