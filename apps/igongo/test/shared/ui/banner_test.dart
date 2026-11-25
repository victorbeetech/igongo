// StatusBanner: the message shows and the action runs.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/banner/status_banner.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('shows the message and runs the action', (tester, dark) async {
    var acted = false;
    await pumpComponent(
      tester,
      StatusBanner(tone: BannerTone.offline, message: 'Offline', action: 'Sync', onAction: () => acted = true),
      dark: dark,
    );
    expect(find.text('Offline'), findsOneWidget);
    await tester.tap(find.text('Sync'));
    expect(acted, isTrue);
  });
}
