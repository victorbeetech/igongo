// The list screen every records-kit module shares: my records, the records
// given to me, or everyone's for staff, with a switch for closed ones and a
// button to add. Tapping a record opens it. Signed out, the prototype
// design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../live/live_view.dart';
import '../../screens/parts/purpose_text.dart';
import '../../screens/parts/screen_list_view.dart';
import '../../screens/screen_layout.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/chip/status_chip.dart';
import '../application/records_providers.dart';
import '../domain/record_config.dart';
import '../domain/field_def.dart';
import '../domain/record_place.dart';
import '../domain/record_query.dart';
import 'field_text.dart';
import 'record_detail_screen.dart';
import 'record_form_screen.dart';

/// A list of [place]'s records of [types] (all when empty).
class RecordListScreen extends ConsumerStatefulWidget {
  /// Creates the screen.
  const RecordListScreen(
    this.screen,
    this.place, {
    super.key,
    this.types = const [],
    this.mine = false,
    this.assigned = false,
    this.canAdd = true,
  });

  /// The screen's context.
  final ScreenContext screen;

  /// The module.
  final RecordPlace place;

  /// Only these record types.
  final List<String> types;

  /// Only my own records.
  final bool mine;

  /// Only records given to me.
  final bool assigned;

  /// Shows the add button.
  final bool canAdd;

  @override
  ConsumerState<RecordListScreen> createState() => _RecordListScreenState();
}

class _RecordListScreenState extends ConsumerState<RecordListScreen> {
  bool _openOnly = true;

  /// This list's filter.
  RecordQuery get _query => RecordQuery(
    path: widget.place.path,
    type: widget.types.length == 1 ? widget.types.first : null,
    mine: widget.mine,
    assigned: widget.assigned,
    openOnly: _openOnly,
  );

  @override
  Widget build(BuildContext context) => LiveView<RecordConfig>(
    screenName: widget.screen.spec.name,
    value: ref.watch(recordConfigProvider(widget.place)),
    onRetry: () => ref.invalidate(recordConfigProvider(widget.place)),
    sample: (_) => screenLayout(widget.screen),
    builder: (context, config, _) {
      final list = ref.watch(recordListProvider(_query));
      final types = config.pick(widget.types);
      return RefreshIndicator(
        onRefresh: () => ref.refresh(recordListProvider(_query).future),
        child: ScreenListView(
          children: [
            PurposeText(widget.screen.spec.purpose),
            if (config.notice.isNotEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                child: Text(config.notice),
              ),
            SwitchListTile(
              title: const Text('Only open ones'),
              value: _openOnly,
              onChanged: (v) => setState(() => _openOnly = v),
            ),
            if (widget.canAdd)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                child: IgongoButton(
                  label: 'Add',
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => Scaffold(
                        appBar: AppBar(title: Text(widget.screen.spec.name)),
                        body: RecordFormScreen(widget.screen, widget.place, types: widget.types),
                      ),
                    ),
                  ),
                ),
              ),
            ...list.when(
              loading: () => const [Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: LinearProgressIndicator())],
              error: (e, _) => [Padding(padding: const EdgeInsets.all(IgongoSpace.lg), child: Text('$e'))],
              data: (records) => [
                if (records.isEmpty)
                  const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('Nothing here yet.')),
                for (final r in records)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, 0),
                    child: InkWell(
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => RecordDetailScreen(place: widget.place, id: r.id),
                        ),
                      ),
                      child: IgongoCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          spacing: IgongoSpace.xs,
                          children: [
                            Row(
                              children: [
                                Expanded(child: Text('${r.code} · ${r.title}', style: context.text.titleSmall)),
                                StatusChip(config.type(r.type)?.statusLabel(r.status) ?? r.status),
                              ],
                            ),
                            Text(
                              [
                                for (final f
                                    in (config.type(r.type)?.fields ?? const <FieldDef>[])
                                        .where((f) => f.inList)
                                        .take(3))
                                  fieldText(f, r.fields[f.key]),
                                ?r.dueOn,
                                if (r.assigneeName != null) 'With ${r.assigneeName}',
                              ].join('  ·  '),
                              style: context.text.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            if (types.isEmpty)
              const Padding(
                padding: EdgeInsets.all(IgongoSpace.lg),
                child: Text('This module has no record types switched on.'),
              ),
          ],
        ),
      );
    },
  );
}
