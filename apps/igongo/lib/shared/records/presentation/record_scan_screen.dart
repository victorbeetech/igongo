// Type or scan a record's code (asset tag, key tag, visitor pass, voucher)
// to open it. The QR text is `IGG-REC:<code>`. Signed out, the prototype
// design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../screens/parts/purpose_text.dart';
import '../../screens/parts/screen_list_view.dart';
import '../../screens/screen_layout.dart';
import '../../session/session_controller.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/field/igongo_field.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/records_providers.dart';
import '../domain/record_place.dart';
import 'record_detail_screen.dart';

/// Finds a record of [place] by its code.
class RecordScanScreen extends ConsumerStatefulWidget {
  /// Creates the screen.
  const RecordScanScreen(this.screen, this.place, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// The module.
  final RecordPlace place;

  @override
  ConsumerState<RecordScanScreen> createState() => _RecordScanScreenState();
}

class _RecordScanScreenState extends ConsumerState<RecordScanScreen> {
  final _code = TextEditingController();

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  /// Looks the code up and opens the record.
  Future<void> _find() async {
    try {
      final r = await ref.read(recordsApiProvider).lookup(widget.place, _code.text.trim());
      if (mounted) {
        await Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (_) => RecordDetailScreen(place: widget.place, id: r.id),
          ),
        );
      }
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
  }

  @override
  Widget build(BuildContext context) {
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
              IgongoField(
                label: 'Code on the tag or pass',
                hint: 'Such as AS-0042',
                controller: _code,
                onSubmitted: (_) => _find(),
              ),
              IgongoButton(label: 'Find', expand: true, onPressed: _find),
            ],
          ),
        ),
      ],
    );
  }
}
