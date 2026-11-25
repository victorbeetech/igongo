// Draws one shared component on its own, inside the Igongo theme (light or
// dark), for the component tests in test/shared/ui.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

/// Pumps [child] in a themed page; [dark] picks the dark theme.
Future<void> pumpComponent(WidgetTester tester, Widget child, {bool dark = false}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: IgongoTheme.light,
      darkTheme: IgongoTheme.dark,
      themeMode: dark ? ThemeMode.dark : ThemeMode.light,
      home: Scaffold(
        body: SingleChildScrollView(
          child: Padding(padding: const EdgeInsets.all(16), child: child),
        ),
      ),
    ),
  );
  await tester.pump(const Duration(milliseconds: 50));
}

/// Runs [body] once in light and once in dark mode, naming each test.
void bothModes(String description, Future<void> Function(WidgetTester tester, bool dark) body) {
  for (final dark in [false, true]) {
    testWidgets('$description (${dark ? 'dark' : 'light'})', (tester) => body(tester, dark));
  }
}
