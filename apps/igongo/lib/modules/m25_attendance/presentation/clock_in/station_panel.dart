// Station mode for the gate, reception and security phones: tap "Start",
// then hold each staff card to the phone. Every tap clocks the holder in or
// out and shows who it was, so the guard can check the face against the
// name. Lost or unknown cards are refused with the API's message.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_exception.dart';
import '../../../../shared/nfc/nfc_provider.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/chip/status_chip.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../application/attendance_providers.dart';
import '../../domain/station_result.dart';
import 'time_text.dart';

/// The station panel.
class StationPanel extends ConsumerStatefulWidget {
  /// Creates the panel.
  const StationPanel({super.key});

  @override
  ConsumerState<StationPanel> createState() => _StationPanelState();
}

class _StationPanelState extends ConsumerState<StationPanel> {
  final _station = TextEditingController(text: 'Main gate');
  bool _running = false;
  StationResult? _last;
  String? _refusal;

  @override
  void dispose() {
    _running = false;
    ref.read(nfcReaderProvider).cancel();
    _station.dispose();
    super.dispose();
  }

  /// Reads cards one after another until stopped.
  Future<void> _run() async {
    final reader = ref.read(nfcReaderProvider);
    if (!await reader.isAvailable()) {
      setState(() => _refusal = 'NFC is off or missing on this phone. Switch it on in the phone settings.');
      return;
    }
    setState(() => _running = true);
    while (_running && mounted) {
      // Step 1: wait for a tap.
      final uid = await reader.readUid(prompt: 'Hold the staff card near the phone');
      if (uid == null || !mounted) break;
      // Step 2: clock its holder, and show who it was.
      try {
        final result = await ref.read(attendanceApiProvider).stationClock(uid: uid, station: _station.text.trim());
        setState(() {
          _last = result;
          _refusal = null;
        });
      } on ApiException catch (e) {
        setState(() => _refusal = e.message);
      }
    }
    if (mounted) setState(() => _running = false);
  }

  /// Stops reading.
  void _stop() {
    _running = false;
    ref.read(nfcReaderProvider).cancel();
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final last = _last;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: IgongoSpace.md,
        children: [
          IgongoField(label: "This station's name", controller: _station),
          IgongoButton(
            label: _running ? 'Stop reading cards' : 'Start reading cards',
            icon: Icons.contactless_outlined,
            variant: _running ? ButtonVariant.secondary : ButtonVariant.primary,
            expand: true,
            onPressed: _running ? _stop : _run,
          ),
          if (_refusal != null) IgongoCard(child: Text(_refusal!, style: context.text.bodyMedium)),
          if (last != null)
            IgongoCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: IgongoSpace.xs,
                children: [
                  StatusChip(last.event.isIn ? (last.event.late ? 'Late' : 'On time') : 'Clocked out'),
                  Text(last.staff.name, style: context.text.titleLarge),
                  Text('${last.staff.line} · ${last.event.isIn ? 'in' : 'out'} at ${timeText(last.event.at)}'),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
