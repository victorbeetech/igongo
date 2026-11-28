// Golden test for the search screen's layout: the top bar, the search box, the
// recent searches, the categories, the curated findings and the trending list,
// in light and dark mode at a phone width. Compare with the design before merging.

import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/discovery_categories.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/widgets/curated_findings_section.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/widgets/discovery_search_row.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/widgets/discovery_top_bar.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/widgets/explore_categories.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/widgets/recent_searches.dart';
import 'package:igongo/modules/m00_app_shell/presentation/global_search/widgets/trending_experiences_card.dart';
import 'package:igongo/shared/theme/theme.dart';

import 'discovery_fixtures.dart';

void main() {
  for (final mode in [ThemeMode.light, ThemeMode.dark]) {
    final name = mode == ThemeMode.light ? 'light' : 'dark';
    testWidgets('search screen layout, $name mode', (tester) async {
      tester.view.physicalSize = const Size(390 * 2, 2400 * 2);
      tester.view.devicePixelRatio = 2;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        MaterialApp(
          theme: IgongoTheme.light,
          darkTheme: IgongoTheme.dark,
          themeMode: mode,
          home: Scaffold(
            body: ListView(
              children: [
                DiscoveryTopBar(onBell: () {}),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                  child: DiscoverySearchRow(onFilter: () {}, onChanged: (_) {}, onSubmitted: (_) {}, onVoice: () {}),
                ),
                RecentSearches(
                  searches: const ['Grilled Tilapia', 'Heritage Cottage'],
                  onRemove: (_) {},
                  onClear: () {},
                ),
                const SizedBox(height: 16),
                ExploreCategories(categories: discoveryCategories, selected: 0, onSelected: (_) {}),
                const SizedBox(height: 24),
                CuratedFindingsSection(findings: testFindings, onOpen: (_) {}),
                TrendingExperiencesCard(experiences: testTrending, onOpen: (_) {}),
              ],
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      await expectLater(find.byType(MaterialApp), matchesGoldenFile('goldens/discovery_$name.png'));
    });
  }
}
