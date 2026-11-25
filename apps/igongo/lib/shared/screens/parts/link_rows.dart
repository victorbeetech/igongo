// The rows that lead from a screen to the screens it opens, so every screen
// is connected exactly as the approved flows say.

import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../mock/sample_text.dart';
import '../../ui/icons/module_icons.dart';
import '../../ui/list_row/igongo_list_row.dart';
import '../../ui/section/section_header.dart';

/// One tappable row per screen this screen opens, under a section header.
class LinkRows extends StatelessWidget {
  /// Creates the rows for [screen]. [title] names the section.
  const LinkRows(this.screen, {super.key, this.title = 'Go to'});

  /// The screen whose links to draw.
  final ScreenContext screen;

  /// The section name above the rows.
  final String title;

  @override
  Widget build(BuildContext context) {
    // A screen that leads nowhere draws nothing (it has Back only).
    if (screen.links.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SectionHeader(title),
        for (final (i, id) in screen.links.indexed)
          IgongoListRow(
            title: screen.nameOf(id),
            subtitle: SampleText.subtitleFor(i),
            leading: Icon(ModuleIcons.of(id.substring(1, 3))),
            onTap: () => screen.open(id),
          ),
      ],
    );
  }
}
