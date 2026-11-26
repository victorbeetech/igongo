// Staff: scan or paste a guest's ticket. The server says Valid, Used, Forged,
// Cancelled or Not paid yet, and shows the booking when the signature matches.
// Staff check in only when the verdict is Valid; the server enforces that too.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../api/api_exception.dart';
import '../../format/ugx.dart';
import '../../layout/igongo_scaffold.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/chip/status_chip.dart';
import '../../ui/field/igongo_field.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/bookings_providers.dart';
import '../domain/booking_place.dart';
import '../domain/ticket_scan.dart';

/// The ticket check screen for one booking module.
class TicketVerifyScreen extends ConsumerStatefulWidget {
  /// Creates the check screen at [place].
  const TicketVerifyScreen({super.key, required this.place});

  /// The booking module the ticket belongs to.
  final BookingPlace place;

  @override
  ConsumerState<TicketVerifyScreen> createState() => _TicketVerifyScreenState();
}

class _TicketVerifyScreenState extends ConsumerState<TicketVerifyScreen> {
  /// The text of the ticket: the scanned QR text, or the code typed or pasted.
  final _ticket = TextEditingController();

  /// The last scan, or null before the first check.
  TicketScan? _scan;

  /// True while a request is running, so the screen shows a loading state.
  bool _busy = false;

  /// The server's reason when a request failed, or null.
  String? _error;

  @override
  void dispose() {
    _ticket.dispose();
    super.dispose();
  }

  /// Asks the server for the verdict of the text in the field.
  Future<void> _verify() async {
    // Step 1: an empty field is a question for staff, not a request.
    final text = _ticket.text.trim();
    if (text.isEmpty) return showIgongoToast(context, 'Scan or paste the ticket first.');
    // Step 2: show the loading state and ask the server.
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final scan = await ref.read(bookingsApiProvider(widget.place)).verifyTicket(text);
      if (mounted) setState(() => _scan = scan);
    } on ApiException catch (e) {
      // Step 3: a failed request shows the server's reason, not a guess.
      if (mounted) setState(() => _error = e.message);
    } finally {
      // Step 4: always leave the loading state.
      if (mounted) setState(() => _busy = false);
    }
  }

  /// Checks in the ticket the server has just called valid.
  Future<void> _checkIn() async {
    setState(() => _busy = true);
    try {
      final b = await ref.read(bookingsApiProvider(widget.place)).checkInTicket(_ticket.text.trim());
      if (!mounted) return;
      // Step 1: show the booking as checked in, and tell staff.
      setState(() => _scan = TicketScan(verdict: 'checked_in', booking: b));
      showIgongoToast(context, 'Checked in: ${b.offeringName} ${b.code}');
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    } finally {
      // Step 2: always leave the loading state. The desk reloads when this screen closes.
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scan = _scan;
    return IgongoScaffold(
      title: 'Check a ticket',
      body: ListView(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        children: [
          // Step 1: the field takes the scanned text or a typed code.
          IgongoField(
            label: 'Ticket',
            hint: 'Scan the QR, or type or paste the code',
            icon: Icons.qr_code_scanner,
            controller: _ticket,
            lines: 2,
          ),
          const SizedBox(height: IgongoSpace.sm),
          IgongoButton(
            label: 'Check ticket',
            icon: Icons.verified_outlined,
            expand: true,
            onPressed: _busy ? null : _verify,
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 2: the states, one at a time: loading, failed, or the result.
          if (_busy) const Center(child: CircularProgressIndicator()),
          if (!_busy && _error != null) Text(_error!, style: context.text.bodyMedium),
          if (!_busy && _error == null && scan == null) Text('The result shows here.', style: context.text.bodySmall),
          if (!_busy && scan != null) _Result(scan: scan, unit: widget.place.unit, onCheckIn: _checkIn),
        ],
      ),
    );
  }
}

/// The verdict chip, the plain advice, and the booking details when the signature matched.
class _Result extends StatelessWidget {
  /// Creates the result for [scan]. [unit] names what was booked; [onCheckIn] checks it in.
  const _Result({required this.scan, required this.unit, required this.onCheckIn});

  /// The server's answer.
  final TicketScan scan;

  /// The booking unit, for example "room" or "seat".
  final String unit;

  /// Checks in this ticket. Shown only when the verdict is valid.
  final VoidCallback onCheckIn;

  @override
  Widget build(BuildContext context) {
    final b = scan.booking;
    return IgongoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.sm,
        children: [
          // Step 1: the verdict, as a chip and in words.
          StatusChip(ticketVerdictWords[scan.verdict] ?? scan.verdict),
          Text(ticketVerdictAdvice[scan.verdict] ?? '', style: context.text.bodyMedium),
          // Step 2: the booking, only when the server showed it.
          if (b != null) ...[
            Text(b.offeringName, style: context.text.titleMedium),
            Text('${b.code}  ·  ${b.units} × $unit  ·  ${b.when}', style: context.text.bodySmall),
            Text('${ugx(b.paid)} paid of ${ugx(b.total)}', style: context.text.bodySmall),
          ],
          // Step 3: only a valid ticket can be checked in from here.
          if (scan.isValid) IgongoButton(label: 'Check in', onPressed: onCheckIn),
        ],
      ),
    );
  }
}
