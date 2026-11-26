// The add screen every records-kit module shares (log a found item, ask
// for leave, report an incident, give feedback): the type's own fields as
// the super admin set them. After saving it opens the new record.
// Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../live/live_view.dart';
import '../../screens/parts/purpose_text.dart';
import '../../screens/parts/screen_list_view.dart';
import '../../screens/screen_layout.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/field/igongo_field.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/records_providers.dart';
import '../domain/record_config.dart';
import '../domain/record_place.dart';
import '../domain/record_type.dart';
import 'field_input.dart';
import 'record_detail_screen.dart';

/// The add screen for [types] of [place] (every self-service type when empty).
class RecordFormScreen extends ConsumerWidget {
  /// Creates the screen.
  const RecordFormScreen(this.screen, this.place, {super.key, this.types = const []});

  /// The screen's context.
  final ScreenContext screen;

  /// The module.
  final RecordPlace place;

  /// The record types this screen adds.
  final List<String> types;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<RecordConfig>(
    screenName: screen.spec.name,
    value: ref.watch(recordConfigProvider(place)),
    onRetry: () => ref.invalidate(recordConfigProvider(place)),
    sample: (_) => screenLayout(screen),
    builder: (context, config, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        if (config.notice.isNotEmpty)
          Padding(padding: const EdgeInsets.all(IgongoSpace.lg), child: Text(config.notice)),
        _RecordForm(place: place, types: config.pick(types)),
      ],
    ),
  );
}

/// The form itself, holding the typed values until Save.
class _RecordForm extends ConsumerStatefulWidget {
  const _RecordForm({required this.place, required this.types});

  final RecordPlace place;
  final List<RecordType> types;

  @override
  ConsumerState<_RecordForm> createState() => _RecordFormState();
}

class _RecordFormState extends ConsumerState<_RecordForm> {
  late RecordType? _type = widget.types.firstOrNull;
  final Map<String, Object?> _values = {};
  final Map<String, TextEditingController> _text = {};
  final _day = TextEditingController();
  final _where = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    for (final c in [..._text.values, _day, _where]) {
      c.dispose();
    }
    super.dispose();
  }

  /// The controller for field [key].
  TextEditingController _controller(String key) => _text.putIfAbsent(key, TextEditingController.new);

  /// Saves the record and opens it.
  Future<void> _save() async {
    final type = _type!;
    final missing = type.fields
        .where((f) => f.required && (_values[f.key] == null || _values[f.key] == ''))
        .map((f) => f.label);
    if (missing.isNotEmpty) {
      showIgongoToast(context, 'Please fill in: ${missing.join(', ')}');
      return;
    }
    setState(() => _busy = true);
    try {
      final record = await ref
          .read(recordsApiProvider)
          .create(
            widget.place,
            type: type.key,
            fields: Map.of(_values),
            dueOn: _day.text.trim().isEmpty ? null : _day.text.trim(),
            location: _where.text.trim().isEmpty ? null : _where.text.trim(),
          );
      if (!mounted) return;
      showIgongoToast(context, '${record.code} saved');
      setState(_values.clear);
      for (final c in [..._text.values, _day, _where]) {
        c.clear();
      }
      await Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => RecordDetailScreen(place: widget.place, id: record.id),
        ),
      );
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final type = _type;
    if (type == null) {
      return const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('Nothing can be added here yet.'));
    }
    return Padding(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: IgongoSpace.md,
        children: [
          if (widget.types.length > 1)
            DropdownButtonFormField<String>(
              initialValue: type.key,
              decoration: const InputDecoration(labelText: 'What to add'),
              items: [for (final t in widget.types) DropdownMenuItem(value: t.key, child: Text(t.name))],
              onChanged: (k) => setState(() {
                _type = widget.types.firstWhere((t) => t.key == k);
                _values.clear();
              }),
            ),
          for (final f in type.fields)
            FieldInput(
              key: ValueKey('${type.key}.${f.key}'),
              field: f,
              value: _values[f.key],
              module: widget.place.module,
              controller: _controller('${type.key}.${f.key}'),
              onChanged: (v) => setState(() => _values[f.key] = v),
            ),
          IgongoField(label: 'Day (when it is due or happens)', hint: 'YYYY-MM-DD', controller: _day),
          IgongoField(label: 'Where', controller: _where),
          IgongoButton(label: 'Save', expand: true, onPressed: _busy ? null : _save),
        ],
      ),
    );
  }
}
