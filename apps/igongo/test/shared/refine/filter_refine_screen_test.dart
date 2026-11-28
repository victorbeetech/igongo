// Widget tests for the Filter & Refine screen: every section is drawn, the
// availability choice narrows the count on the Apply button, Clear All puts the
// choices back, and the screen fits at 1.5x text size in light and dark mode.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m00_app_shell/domain/menu_search_results.dart';
import 'package:igongo/modules/m00_app_shell/domain/search_item_hit.dart';
import 'package:igongo/modules/m00_app_shell/domain/search_outlet_hit.dart';
import 'package:igongo/shared/refine/presentation/filter_refine_screen.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/load_fonts.dart';
import '../../support/public_settings_fixture.dart';

/// Two dishes, one of them off today, from one outlet.
const _results = MenuSearchResults(
  items: [
    SearchItemHit(id: '1', outlet: 'kitchen', section: 'Main', name: 'Tilapia', price: 28000, available: true),
    SearchItemHit(id: '2', outlet: 'kitchen', section: 'Main', name: 'Luwombo', price: 22000, available: false),
  ],
  outlets: [SearchOutletHit(key: 'kitchen', name: 'Main Kitchen')],
);

/// Pumps the screen with the results, in [dark] or light mode, at [textScale].
Future<void> _pumpScreen(WidgetTester tester, {bool dark = false, double textScale = 1}) async {
  tester.view.physicalSize = const Size(390 * 2, 1640 * 2);
  tester.view.devicePixelRatio = 2;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    ProviderScope(
      overrides: [publicSettingsFixture()],
      child: MaterialApp(
        theme: IgongoTheme.light,
        darkTheme: IgongoTheme.dark,
        themeMode: dark ? ThemeMode.dark : ThemeMode.light,
        builder: (context, child) => MediaQuery(
          data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(textScale)),
          child: child!,
        ),
        home: const FilterRefineScreen(results: _results),
      ),
    ),
  );
  await tester.pump(const Duration(milliseconds: 50));
  await tester.pump(const Duration(milliseconds: 50));
}

void main() {
  setUpAll(loadAppFonts);

  testWidgets('shows every section and counts both dishes at the start', (tester) async {
    await _pumpScreen(tester);
    for (final text in [
      'Filter & Refine',
      'Curate Your Igongo Stay',
      'Outlets',
      'Main Kitchen',
      'Price Range (UGX)',
      'Sort By',
      'Availability',
      'On sale today only',
      'Clear All',
      'Apply Filters',
      '2 Results',
    ]) {
      expect(find.text(text), findsOneWidget, reason: text);
    }
  });

  testWidgets('on sale today only leaves the dish that is off out of the count', (tester) async {
    await _pumpScreen(tester);
    await tester.tap(find.text('On sale today only'));
    await tester.pump();
    expect(find.text('1 Results'), findsOneWidget);
  });

  testWidgets('Clear All puts the count back to every dish', (tester) async {
    await _pumpScreen(tester);
    await tester.tap(find.text('On sale today only'));
    await tester.pump();
    await tester.tap(find.text('Clear All'));
    await tester.pump();
    expect(find.text('2 Results'), findsOneWidget);
  });

  testWidgets('the screen fits at 1.5x text size, light and dark', (tester) async {
    for (final dark in [false, true]) {
      await _pumpScreen(tester, dark: dark, textScale: 1.5);
      expect(tester.takeException(), isNull, reason: dark ? 'dark' : 'light');
    }
  });
}
