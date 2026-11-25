// StateMessage and the illustrations: title and message show, the brand
// drawing replaces the icon when given, and result names pick the right drawing.

import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/illustration/state_illustration.dart';
import 'package:igongo/shared/ui/message/state_message.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/pump_component.dart';

void main() {
  test('result names pick a drawing', () {
    expect(IllustrationKind.forName('Page not found'), IllustrationKind.notFound);
    expect(IllustrationKind.forName('Booking confirmed'), IllustrationKind.success);
    expect(IllustrationKind.forName('Account locked'), IllustrationKind.denied);
    expect(IllustrationKind.forName('Something went wrong'), IllustrationKind.error);
    expect(IllustrationKind.forName('Shift summary'), isNull);
  });

  bothModes('shows the drawing instead of the icon', (tester, dark) async {
    await pumpComponent(
      tester,
      const StateMessage(
        icon: Icons.inbox,
        illustration: IllustrationKind.empty,
        title: 'Nothing here yet',
        message: 'Add the first one',
      ),
      dark: dark,
    );
    expect(find.text('Nothing here yet'), findsOneWidget);
    expect(find.byType(SvgPicture), findsOneWidget);
    expect(find.byIcon(Icons.inbox), findsNothing);
  });

  bothModes('shows the icon when there is no drawing', (tester, dark) async {
    await pumpComponent(
      tester,
      const StateMessage(icon: Icons.inbox, title: 'T', message: 'M'),
      dark: dark,
    );
    expect(find.byIcon(Icons.inbox), findsOneWidget);
  });
}
