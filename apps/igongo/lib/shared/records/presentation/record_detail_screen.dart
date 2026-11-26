// One record opened (shared by every records-kit module): its fields,
// status, the QR text, the next steps, comments and history. The API
// decides who may take each step; a refused step comes back as a toast.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/when.dart';
import '../../screens/parts/screen_list_view.dart';
import '../../states/state_view.dart';
import '../../states/view_state.dart';
import '../../live/live_view.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/chip/status_chip.dart';
import '../../ui/field/igongo_field.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/records_providers.dart';
import '../domain/field_def.dart';
import '../domain/record_place.dart';
import 'field_text.dart';

/// The record [id] of [place], as its own page.
class RecordDetailScreen extends ConsumerStatefulWidget {
  /// Creates the page.
  const RecordDetailScreen({super.key, required this.place, required this.id});

  /// The module.
  final RecordPlace place;

  /// The record's ID.
  final String id;

  @override
  ConsumerState<RecordDetailScreen> createState() => _RecordDetailScreenState();
}

class _RecordDetailScreenState extends ConsumerState<RecordDetailScreen> {
  final _comment = TextEditingController();

  @override
  void dispose() {
    _comment.dispose();
    super.dispose();
  }

  /// Runs [call], toasts [done] or the refusal, and reloads the record.
  Future<void> _act(Future<void> Function() call, String done) async {
    try {
      await call();
      if (mounted) showIgongoToast(context, done);
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(recordProvider((widget.place, widget.id)));
    ref.invalidate(recordListProvider);
  }

  @override
  Widget build(BuildContext context) {
    final api = ref.read(recordsApiProvider);
    final config = ref.watch(recordConfigProvider(widget.place)).valueOrNull;
    final value = ref.watch(recordProvider((widget.place, widget.id)));
    return Scaffold(
      appBar: AppBar(title: Text(value.valueOrNull?.$1.code ?? '')),
      body: value.when(
        loading: () => const StateView(state: ViewState.loading, screenName: ''),
        error: (e, _) => StateView(state: LiveView.stateOf(e), screenName: 'This record'),
        data: (data) {
          final (r, events) = data;
          final type = config?.type(r.type);
          return ScreenListView(
            children: [
              Padding(
                padding: const EdgeInsets.all(IgongoSpace.lg),
                child: IgongoCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: IgongoSpace.xs,
                    children: [
                      Row(
                        children: [
                          Expanded(child: Text(r.title, style: context.text.titleMedium)),
                          StatusChip(type?.statusLabel(r.status) ?? r.status),
                        ],
                      ),
                      Text(
                        [
                          type?.name,
                          'For ${r.ownerName}',
                          if (r.assigneeName != null) 'With ${r.assigneeName}',
                          ?r.dueOn,
                          ?r.location,
                        ].whereType<String>().join('  ·  '),
                        style: context.text.bodySmall,
                      ),
                      for (final f in type?.fields ?? const <FieldDef>[])
                        Text('${f.label}: ${fieldText(f, r.fields[f.key])}', style: context.text.bodyMedium),
                      if (r.qr != null) SelectableText(r.qr!, style: context.text.bodySmall),
                    ],
                  ),
                ),
              ),
              // The other statuses; the API refuses the ones this person may not take.
              if (type != null)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                  child: Wrap(
                    spacing: IgongoSpace.sm,
                    runSpacing: IgongoSpace.sm,
                    children: [
                      for (final s in type.statuses.where((s) => s.key != r.status))
                        IgongoButton(
                          label: s.label,
                          variant: s.done ? ButtonVariant.secondary : ButtonVariant.primary,
                          onPressed: () => _act(() => api.move(widget.place, r.id, s.key), s.label),
                        ),
                    ],
                  ),
                ),
              Padding(
                padding: const EdgeInsets.all(IgongoSpace.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  spacing: IgongoSpace.xs,
                  children: [
                    Text('History', style: context.text.titleSmall),
                    for (final e in events)
                      Text('${dayTime(e.at)} · ${e.byName}: ${e.text}', style: context.text.bodySmall),
                    if (config?.comments ?? false) ...[
                      IgongoField(label: 'Add a comment', controller: _comment),
                      IgongoButton(
                        label: 'Send',
                        onPressed: () {
                          final text = _comment.text.trim();
                          if (text.isEmpty) return;
                          _comment.clear();
                          _act(() => api.comment(widget.place, r.id, text), 'Comment added');
                        },
                      ),
                    ],
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
