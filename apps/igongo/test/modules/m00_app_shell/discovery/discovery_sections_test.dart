// Widget tests for the search screen's discovery sections. Each section is
// drawn at the Standard and the 1.5x text size, and must show its words
// without errors (text is scaled for people with weaker eyesight). Also checks
// the empty states the admin's empty lists show.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/widgets/curated_findings_section.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/widgets/trending_experiences_card.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

import 'discovery_fixtures.dart';

/// Pumps [child] in the light theme at [scale] times the text size.
Future<void> _pump(WidgetTester tester, Widget child, {double scale = 1.0}) async {
  // Step 1: a phone-width surface so the layout is tested at a real size.
  tester.view.physicalSize = const Size(390, 1600);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  // Step 2: the app theme, with the text scaled the way the Settings screen scales it.
  await tester.pumpWidget(
    MaterialApp(
      theme: IgongoTheme.light,
      home: Scaffold(
        body: MediaQuery(
          data: MediaQueryData(textScaler: TextScaler.linear(scale)),
          child: SingleChildScrollView(child: child),
        ),
      ),
    ),
  );
}

void main() {
  for (final scale in [1.0, 1.5]) {
    testWidgets('curated findings show every card at ${scale}x text', (tester) async {
      await _pump(tester, CuratedFindingsSection(findings: testFindings, onOpen: (_) {}), scale: scale);
      expect(tester.takeException(), isNull);
      expect(find.text('Curated Findings'), findsOneWidget);
      expect(find.text('${testFindings.length} Matches'), findsOneWidget);
      expect(find.text('Open'), findsNWidgets(testFindings.length));
    });

    testWidgets('trending experiences show every row at ${scale}x text', (tester) async {
      await _pump(tester, TrendingExperiencesCard(experiences: testTrending, onOpen: (_) {}), scale: scale);
      expect(tester.takeException(), isNull);
      expect(find.text('Trending Experiences'), findsOneWidget);
      expect(find.text(testTrending.first.title), findsOneWidget);
    });
  }

  testWidgets('empty findings and trending say so instead of showing sample items', (tester) async {
    await _pump(
      tester,
      Column(
        children: [
          CuratedFindingsSection(findings: const [], onOpen: (_) {}),
          TrendingExperiencesCard(experiences: const [], onOpen: (_) {}),
        ],
      ),
    );
    expect(tester.takeException(), isNull);
    expect(find.text('No curated findings yet.'), findsOneWidget);
    expect(find.text('Nothing trending yet.'), findsOneWidget);
    expect(find.text('0 Matches'), findsOneWidget);
  });
}
