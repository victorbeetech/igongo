// S40-02 My faults, live: faults I reported, and (switch) faults given to
// me to fix. Tapping one opens it. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/format/when.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../application/fault_providers.dart';
import '../../domain/fault.dart';
import '../detail/fault_detail_screen.dart';

/// My faults.
class MyFaultsScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [screen].
  const MyFaultsScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<MyFaultsScreen> createState() => _MyFaultsScreenState();
}

class _MyFaultsScreenState extends ConsumerState<MyFaultsScreen> {
  bool _assigned = false;

  @override
  Widget build(BuildContext context) => LiveView<List<Fault>>(
    screenName: widget.screen.spec.name,
    value: ref.watch(myFaultsProvider(_assigned)),
    onRetry: () => ref.invalidate(myFaultsProvider(_assigned)),
    sample: (_) => screenLayout(widget.screen),
    builder: (context, faults, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(myFaultsProvider(_assigned).future),
      child: ScreenListView(
        children: [
          PurposeText(widget.screen.spec.purpose),
          SwitchListTile(
            title: const Text('Show faults given to me to fix'),
            value: _assigned,
            onChanged: (v) => setState(() => _assigned = v),
          ),
          if (faults.isEmpty) const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No faults here.')),
          for (final f in faults)
            IgongoListRow(
              title: '${f.number} · ${f.title}',
              subtitle: [
                f.location,
                dayTime(f.createdAt),
                f.assignedTo ?? 'Not assigned',
              ].whereType<String>().join(' · '),
              status: statusWords(f.status),
              onTap: () =>
                  Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => FaultDetailScreen(id: f.id))),
            ),
        ],
      ),
    ),
  );
}
