// SpiralLoader and SkeletonList: the loader tells screen readers it is
// loading, and the skeleton draws without errors.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/loader/spiral_loader.dart';
import 'package:igongo/shared/ui/skeleton/skeleton_list.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('the loader is announced as loading', (tester, dark) async {
    await pumpComponent(tester, const SpiralLoader(), dark: dark);
    expect(find.bySemanticsLabel('Loading'), findsOneWidget);
  });

  bothModes('the skeleton draws', (tester, dark) async {
    await pumpComponent(tester, const SkeletonList(rows: 3), dark: dark);
    expect(tester.takeException(), isNull);
  });
}
