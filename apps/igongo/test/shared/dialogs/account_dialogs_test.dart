// Behaviour tests for the sign-out and delete-account dialogs: the buttons
// answer with the right value, and Permanently Delete stays off until DELETE is typed.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/dialogs/delete_account/delete_account_dialog.dart';
import 'package:igongo/shared/dialogs/sign_out/sign_out_dialog.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

/// Opens [dialog] from a button, and records what it closed with in [result].
Future<void> _openDialog(WidgetTester tester, Widget dialog, List<bool?> result) async {
  await tester.pumpWidget(
    ProviderScope(
      child: MaterialApp(
        theme: IgongoTheme.light,
        home: Builder(
          builder: (context) => Scaffold(
            body: Center(
              child: ElevatedButton(
                onPressed: () async => result.add(await showDialog<bool>(context: context, builder: (_) => dialog)),
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
  testWidgets('sign out: Yes, Sign Out pops true', (tester) async {
    final result = <bool?>[];
    await _openDialog(tester, const SignOutDialog(name: 'Mugisha Kenneth', email: 'guest@example.com'), result);
    expect(find.text('Sign Out of Igongo?'), findsOneWidget);
    expect(find.text('Mugisha Kenneth'), findsOneWidget);
    await tester.tap(find.text('Yes, Sign Out'));
    await tester.pumpAndSettle();
    expect(result, [true]);
  });

  testWidgets('sign out: Stay Signed In pops false', (tester) async {
    final result = <bool?>[];
    await _openDialog(tester, const SignOutDialog(name: 'Mugisha Kenneth', email: ''), result);
    await tester.tap(find.text('Stay Signed In'));
    await tester.pumpAndSettle();
    expect(result, [false]);
  });

  testWidgets('delete: Permanently Delete stays disabled until DELETE is typed', (tester) async {
    final result = <bool?>[];
    await _openDialog(tester, const DeleteAccountDialog(), result);
    FilledButton deleteButton() => tester.widget<FilledButton>(
      find.ancestor(of: find.text('Permanently Delete'), matching: find.byType(FilledButton)),
    );
    // Step 1: nothing typed, so the button is off.
    expect(deleteButton().onPressed, isNull);
    // Step 2: a wrong word keeps it off.
    await tester.enterText(find.byType(TextField), 'DELET');
    await tester.pump();
    expect(deleteButton().onPressed, isNull);
    // Step 3: the word in any case turns it on; tapping it pops true.
    await tester.enterText(find.byType(TextField), 'delete');
    await tester.pump();
    expect(deleteButton().onPressed, isNotNull);
    await tester.tap(find.text('Permanently Delete'));
    await tester.pumpAndSettle();
    expect(result, [true]);
  });

  testWidgets('delete: Keep My Account pops false', (tester) async {
    final result = <bool?>[];
    await _openDialog(tester, const DeleteAccountDialog(), result);
    await tester.tap(find.text('Keep My Account'));
    await tester.pumpAndSettle();
    expect(result, [false]);
  });
}
