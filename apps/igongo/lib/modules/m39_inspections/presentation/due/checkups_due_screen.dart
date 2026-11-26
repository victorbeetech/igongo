// S39-01 Inspections due, live: today's and this week's checklists for my
// department, done or due. Tapping a due one starts it.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../application/inspection_providers.dart';
import '../../domain/due_checkup.dart';
import '../run/run_checkup_screen.dart';

/// The due list.
class CheckupsDueScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const CheckupsDueScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<DueCheckup>>(
    screenName: screen.spec.name,
    value: ref.watch(dueCheckupsProvider),
    onRetry: () => ref.invalidate(dueCheckupsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, due, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(dueCheckupsProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          if (due.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No checkups for you today.')),
          for (final d in due)
            IgongoListRow(
              title: d.checklist.name,
              subtitle: d.doneBy != null
                  ? 'Done by ${d.doneBy} · score ${d.score}%'
                  : '${d.checklist.frequency == 'daily' ? 'Today' : 'This week'}, by ${d.checklist.dueBy} · ${d.checklist.items.length} lines',
              status: d.doneBy != null ? 'Done' : 'Due',
              onTap: d.doneBy != null
                  ? null
                  : () =>
                        Navigator.of(context)
                            .push(MaterialPageRoute<void>(builder: (_) => RunCheckupScreen(checklist: d.checklist))),
            ),
        ],
      ),
    ),
  );
}
