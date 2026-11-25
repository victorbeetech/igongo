// Tests the "Allow notifications" explainer: Confirm continues, Cancel doesn't.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m10_notifications/presentation/push_permission_explainer.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

void main() {
  // Opens the explainer from a button and records the answer.
  Future<List<bool>> open(WidgetTester tester) async {
    final answers = <bool>[];
    await tester.pumpWidget(
      MaterialApp(
        theme: IgongoTheme.light,
        home: Builder(
          builder: (context) => TextButton(
            onPressed: () async => answers.add(await explainPushPermission(context)),
            child: const Text('open'),
          ),
        ),
      ),
    );
    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();
    expect(find.text('Allow notifications'), findsOneWidget);
    return answers;
  }

  testWidgets('Confirm continues to the phone question', (tester) async {
    final answers = await open(tester);
    await tester.tap(find.text('Confirm'));
    await tester.pumpAndSettle();
    expect(answers, [true]);
  });

  testWidgets('Cancel means not now', (tester) async {
    final answers = await open(tester);
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();
    expect(answers, [false]);
  });
}
