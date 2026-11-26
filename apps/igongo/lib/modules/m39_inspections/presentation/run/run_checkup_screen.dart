// S39-02 Run inspection, live: each line OK, fault or not applicable, with a
// note and photos for faults. Lines marked "raise fault" open a fault
// report in module 40 by themselves.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/files/photo_picker_field.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/inspection_providers.dart';
import '../../domain/check_answer.dart';
import '../../domain/checklist.dart';

/// The answer choices.
const _answers = [('ok', 'OK'), ('fault', 'Fault'), ('na', 'N/A')];

/// One checkup in progress.
class RunCheckupScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [checklist].
  const RunCheckupScreen({super.key, required this.checklist});

  /// The checklist being done.
  final Checklist checklist;

  @override
  ConsumerState<RunCheckupScreen> createState() => _RunCheckupScreenState();
}

class _RunCheckupScreenState extends ConsumerState<RunCheckupScreen> {
  // Step 1: every line starts as OK, so the HOD only changes what is wrong.
  late List<CheckAnswer> _a = [for (final i in widget.checklist.items) CheckAnswer(key: i.key)];
  final _note = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    _note.dispose();
    super.dispose();
  }

  /// Changes line [i].
  void _set(int i, CheckAnswer a) => setState(() => _a = [for (final (j, x) in _a.indexed) j == i ? a : x]);

  /// Submits, then goes back to the due list.
  Future<void> _submit() async {
    setState(() => _busy = true);
    try {
      final score = await ref
          .read(inspectionsApiProvider)
          .submit(widget.checklist.id, _a, _note.text.trim().isEmpty ? null : _note.text.trim());
      ref.invalidate(dueCheckupsProvider);
      if (!mounted) return;
      showIgongoToast(context, 'Checkup sent · score $score%');
      Navigator.of(context).pop();
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text(widget.checklist.name)),
    body: ScreenListView(
      children: [
        for (final (i, item) in widget.checklist.items.indexed)
          Padding(
            padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, 0),
            child: IgongoCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: IgongoSpace.sm,
                children: [
                  Text(item.label, style: context.text.titleSmall),
                  Wrap(
                    spacing: IgongoSpace.sm,
                    children: [
                      for (final (value, label) in _answers)
                        ChoiceChip(
                          label: Text(label),
                          selected: _a[i].result == value,
                          onSelected: (_) => _set(i, _a[i].copyWith(result: value)),
                        ),
                    ],
                  ),
                  if (_a[i].result == 'fault') ...[
                    IgongoField(
                      label: 'What is wrong',
                      onChanged: (v) => _set(i, _a[i].copyWith(note: v)),
                    ),
                    if (item.photoOnFail)
                      PhotoPickerField(
                        purpose: 'inspections',
                        value: _a[i].photoIds,
                        onChanged: (v) => _set(i, _a[i].copyWith(photoIds: v)),
                      ),
                    if (item.raiseFault)
                      Text('A fault report will be opened for this line.', style: context.text.bodySmall),
                  ],
                ],
              ),
            ),
          ),
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            spacing: IgongoSpace.md,
            children: [
              IgongoField(label: 'Overall note', controller: _note, lines: 2),
              IgongoButton(label: 'Submit checkup', expand: true, onPressed: _busy ? null : _submit),
            ],
          ),
        ),
      ],
    ),
  );
}
