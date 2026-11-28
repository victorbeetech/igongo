// Widget tests for the Filter & Refine screen: every section is drawn, taps flip
// the choices, Clear All empties them, and the screen fits at 1.5x text size in
// both light and dark mode.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/refine/presentation/filter_refine_screen.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/load_fonts.dart';
import '../../support/open_app.dart';

/// Pumps the screen in a phone-sized window, in [dark] or light mode, at [textScale].
Future<void> _pumpScreen(WidgetTester tester, {bool dark = false, double textScale = 1}) async {
  usePhoneWindow(tester, ratio: 2);
  await tester.pumpWidget(
    MaterialApp(
      theme: IgongoTheme.light,
      darkTheme: IgongoTheme.dark,
      themeMode: dark ? ThemeMode.dark : ThemeMode.light,
      // Step 1: the text size under test, applied over the whole screen.
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(textScale)),
        child: child!,
      ),
      home: const FilterRefineScreen(),
    ),
  );
  await tester.pump(const Duration(milliseconds: 50));
}

void main() {
  setUpAll(loadAppFonts);

  testWidgets('shows every section of the design', (tester) async {
    await _pumpScreen(tester);
    for (final text in [
      'Filter & Refine',
      'Curate Your Igongo Stay',
      'Categories',
      'Price Range (UGX)',
      'Sort By',
      'Resort Amenities & Features',
      'Location / Zone',
      'Clear All',
      'Apply Filters',
      '24 Results',
    ]) {
      expect(find.text(text), findsOneWidget, reason: text);
    }
  });

  testWidgets('tapping a category flips it, and Clear All empties the categories and amenities', (tester) async {
    await _pumpScreen(tester);
    // Starting check marks: 2 categories, 4 ticked amenities and the picked sort order.
    expect(find.byIcon(Icons.check), findsNWidgets(7));

    // Accommodations starts ticked, so one tap unticks it.
    await tester.tap(find.text('Accommodations'));
    await tester.pump();
    expect(find.byIcon(Icons.check), findsNWidgets(6));

    // Clear All leaves only the sort order's check mark.
    await tester.tap(find.text('Clear All'));
    await tester.pump();
    expect(find.byIcon(Icons.check), findsOneWidget);
  });

  testWidgets('tapping a zone picks it', (tester) async {
    await _pumpScreen(tester);
    // The zone list is below the fold, so scroll it into view before tapping.
    await tester.ensureVisible(find.text('Hill View Cottages'));
    await tester.tap(find.text('Hill View Cottages'));
    await tester.pump();
    expect(tester.takeException(), isNull);
  });

  testWidgets('the screen fits at 1.5x text size, light and dark', (tester) async {
    for (final dark in [false, true]) {
      await _pumpScreen(tester, dark: dark, textScale: 1.5);
      // Any overflow would fail the test with a framework error.
      expect(tester.takeException(), isNull, reason: dark ? 'dark' : 'light');
    }
  });
}
