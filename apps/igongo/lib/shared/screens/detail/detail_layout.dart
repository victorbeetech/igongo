// The detail layout: one record's header, its details and history.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../mock/sample_text.dart';
import '../../theme/theme.dart';
import '../../ui/avatar/initials_avatar.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/chip/status_chip.dart';
import '../../ui/list_row/igongo_list_row.dart';
import '../../ui/section/section_header.dart';
import '../parts/dialog_buttons.dart';
import '../parts/link_rows.dart';
import '../parts/purpose_text.dart';
import '../parts/screen_list_view.dart';

/// One record with its details and history.
class DetailLayout extends StatelessWidget {
  /// Creates the detail screen for [screen].
  const DetailLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    final mock = screen.module.mock;
    final record = mock.items.first;
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Step 1: the record's header card with its status.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: IgongoCard(
            child: Row(
              spacing: IgongoSpace.md,
              children: [
                InitialsAvatar(name: record, size: 56),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: 4,
                    children: [
                      Text(record, style: context.text.titleMedium),
                      Text(SampleText.subtitleFor(0), style: context.text.bodySmall),
                      StatusChip(mock.statuses.first),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        // Step 2: the details, one row per field.
        const SectionHeader('Details'),
        for (final field in mock.fields)
          IgongoListRow(title: field, subtitle: SampleText.hintFor(field), leading: const Icon(Icons.notes_outlined)),
        // Step 3: the history, so every change can be traced (Audit Trail).
        const SectionHeader('History'),
        for (var i = 0; i < 3; i++)
          IgongoListRow(
            title: '${SampleText.people[i]} · ${mock.statuses[i % mock.statuses.length]}',
            subtitle: SampleText.subtitleFor(i),
            leading: const Icon(Icons.history),
          ),
        LinkRows(screen),
        DialogButtons(screen),
      ],
    );
  }
}
