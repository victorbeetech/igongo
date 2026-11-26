// S40-01 Report fault, live: what is wrong, where, how urgent, and photos
// taken with the camera. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/files/photo_picker_field.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/fault_providers.dart';
import '../detail/fault_detail_screen.dart';

/// The fault priorities, least urgent first.
const _priorities = ['low', 'normal', 'high', 'urgent'];

/// The report form.
class ReportFaultScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [screen].
  const ReportFaultScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<ReportFaultScreen> createState() => _ReportFaultScreenState();
}

class _ReportFaultScreenState extends ConsumerState<ReportFaultScreen> {
  final _title = TextEditingController();
  final _details = TextEditingController();
  final _where = TextEditingController();
  String _priority = 'normal';
  List<String> _photos = const [];
  bool _busy = false;

  @override
  void dispose() {
    _title.dispose();
    _details.dispose();
    _where.dispose();
    super.dispose();
  }

  /// Sends the report, then opens it.
  Future<void> _send() async {
    if (_title.text.trim().length < 3) return showIgongoToast(context, 'Say what is wrong in a few words.');
    setState(() => _busy = true);
    try {
      final fault = await ref
          .read(faultsApiProvider)
          .report(
            title: _title.text.trim(),
            description: _details.text.trim(),
            location: _where.text.trim().isEmpty ? null : _where.text.trim(),
            priority: _priority,
            photoIds: _photos,
          );
      ref.invalidate(myFaultsProvider);
      if (!mounted) return;
      showIgongoToast(context, 'Fault ${fault.number} reported');
      _title.clear();
      _details.clear();
      _where.clear();
      setState(() => _photos = const []);
      await Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => FaultDetailScreen(id: fault.id)));
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    // Signed out, show the approved design.
    if (ref.watch(sessionProvider).valueOrNull == null) return screenLayout(widget.screen);
    return ScreenListView(
      children: [
        PurposeText(widget.screen.spec.purpose),
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: IgongoSpace.md,
            children: [
              IgongoField(label: 'What is wrong?', hint: 'Such as: Tap leaking in room 12', controller: _title),
              IgongoField(label: 'Details', controller: _details, lines: 3),
              IgongoField(label: 'Where', hint: 'Room, building or area', controller: _where),
              Wrap(
                spacing: IgongoSpace.sm,
                children: [
                  for (final p in _priorities)
                    ChoiceChip(
                      label: Text(statusWords(p)),
                      selected: _priority == p,
                      onSelected: (_) => setState(() => _priority = p),
                    ),
                ],
              ),
              PhotoPickerField(
                purpose: 'faults-maintenance',
                value: _photos,
                max: 10,
                onChanged: (v) => setState(() => _photos = v),
              ),
              IgongoButton(label: 'Report fault', expand: true, onPressed: _busy ? null : _send),
            ],
          ),
        ),
      ],
    );
  }
}
