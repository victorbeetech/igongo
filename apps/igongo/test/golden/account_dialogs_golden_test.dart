// Golden (screenshot) tests for the sign-out and delete-account dialogs, in
// light and dark mode. Regenerate on Linux with --update-goldens, like the other goldens.

@Tags(['golden'])
library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/dialogs/delete_account/delete_account_dialog.dart';
import 'package:igongo/shared/dialogs/sign_out/sign_out_dialog.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

import '../support/open_app.dart';

/// Shows [dialog] over a plain screen in [theme], for a picture of just the dialog.
Future<void> _pumpDialog(WidgetTester tester, ThemeData theme, Widget dialog) async {
  usePhoneWindow(tester, width: 390, height: 844, ratio: 2);
  await tester.pumpWidget(
    ProviderScope(
      child: MaterialApp(
        theme: theme,
        home: Builder(
          builder: (context) => Scaffold(
            body: Center(
              child: ElevatedButton(
                onPressed: () => showDialog<void>(context: context, builder: (_) => dialog),
                child: const Text('open'),
              ),
            ),
          ),
        ),
      ),
    ),
  );
  await tester.tap(find.text('open'));
  await tester.pumpAndSettle();
}

void main() {
  final modes = {'light': IgongoTheme.light, 'dark': IgongoTheme.dark};
  for (final MapEntry(key: modeName, value: theme) in modes.entries) {
    testWidgets('sign out dialog, $modeName', (tester) async {
      await _pumpDialog(tester, theme, const SignOutDialog(name: 'Mugisha Kenneth', email: 'guest@example.com'));
      await expectLater(find.byType(Dialog), matchesGoldenFile('goldens/$modeName/sign_out_dialog.png'));
    });
    testWidgets('delete account dialog, $modeName', (tester) async {
      await _pumpDialog(tester, theme, const DeleteAccountDialog());
      await expectLater(find.byType(Dialog), matchesGoldenFile('goldens/$modeName/delete_account_dialog.png'));
    });
  }
}
