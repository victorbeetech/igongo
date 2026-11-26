// The staff desk for one booking module: every booking, filtered by status
// (and by today for arrivals), with Approve for requests and Check in for
// confirmed bookings, plus check-in by the code on the guest's ticket.
// Used by front desk, museum, events, pool and spa screens.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../api/api_exception.dart';
import '../../catalog/catalog.dart';
import '../../format/ugx.dart';
import '../../live/live_view.dart';
import '../../screens/parts/purpose_text.dart';
import '../../screens/parts/screen_list_view.dart';
import '../../screens/screen_layout.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/chip/status_chip.dart';
import '../../ui/field/igongo_field.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/bookings_providers.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';

/// The statuses staff can filter by, with their words.
const _filters = {
  null: 'All',
  'requested': 'Requests',
  'awaiting_payment': 'Awaiting payment',
  'confirmed': 'Confirmed',
  'checked_in': 'Checked in',
};

/// The staff bookings desk at [place].
class BookingsDeskScreen extends ConsumerStatefulWidget {
  /// Creates the desk for [screen] at [place]. [status] and [todayOnly] set the first filter.
  const BookingsDeskScreen(this.screen, this.place, {super.key, this.status, this.todayOnly = false});

  /// The screen's context.
  final ScreenContext screen;

  /// The booking module.
  final BookingPlace place;

  /// The status shown first (null for all).
  final String? status;

  /// Only today's bookings (arrivals, today's entries).
  final bool todayOnly;

  @override
  ConsumerState<BookingsDeskScreen> createState() => _BookingsDeskScreenState();
}

class _BookingsDeskScreenState extends ConsumerState<BookingsDeskScreen> {
  late String? _status = widget.status;
  final _code = TextEditingController();

  DeskFilter get _filter => (place: widget.place, status: _status, date: widget.todayOnly ? hotelToday() : null);

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  /// Runs a desk action, shows [done] or the server's reason, and reloads.
  Future<void> _run(Future<Booking> Function() action, String Function(Booking) done) async {
    try {
      final b = await action();
      if (mounted) showIgongoToast(context, done(b));
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    }
    ref.invalidate(deskBookingsProvider(_filter));
  }

  /// Checks in the code typed in the field.
  Future<void> _checkInCode() async {
    final code = _code.text.trim();
    if (code.length < 4) return showIgongoToast(context, 'Type the code on the ticket.');
    final api = ref.read(bookingsApiProvider(widget.place));
    await _run(() => api.checkIn(code), (b) => 'Checked in: ${b.offeringName} ${b.code}');
    _code.clear();
  }

  @override
  Widget build(BuildContext context) {
    final api = ref.read(bookingsApiProvider(widget.place));
    return LiveView<List<Booking>>(
      screenName: widget.screen.spec.name,
      value: ref.watch(deskBookingsProvider(_filter)),
      onRetry: () => ref.invalidate(deskBookingsProvider(_filter)),
      sample: (_) => screenLayout(widget.screen),
      builder: (context, bookings, _) => RefreshIndicator(
        onRefresh: () => ref.refresh(deskBookingsProvider(_filter).future),
        child: ScreenListView(
          children: [
            PurposeText(widget.screen.spec.purpose),
            // Step 1: check in by the code on the ticket.
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
              child: Row(
                spacing: IgongoSpace.sm,
                children: [
                  Expanded(
                    child: IgongoField(
                      label: 'Ticket code',
                      icon: Icons.qr_code,
                      controller: _code,
                      onSubmitted: (_) => _checkInCode(),
                    ),
                  ),
                  IgongoButton(label: 'Check in', onPressed: _checkInCode),
                ],
              ),
            ),
            // Step 2: the status filters.
            SizedBox(
              height: 48,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.all(IgongoSpace.sm),
                children: [
                  for (final MapEntry(key: key, value: words) in _filters.entries)
                    Padding(
                      padding: const EdgeInsets.only(right: IgongoSpace.sm),
                      child: ChoiceChip(
                        label: Text(words),
                        selected: _status == key,
                        onSelected: (_) => setState(() => _status = key),
                      ),
                    ),
                ],
              ),
            ),
            // Step 3: the bookings, each with its next step.
            if (bookings.isEmpty)
              const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No bookings here yet.')),
            for (final b in bookings)
              Padding(
                padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
                child: IgongoCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: IgongoSpace.xs,
                    children: [
                      Row(
                        children: [
                          Expanded(child: Text(b.offeringName, style: context.text.titleMedium)),
                          StatusChip(statusWords(b.status)),
                        ],
                      ),
                      Text(
                        '${b.code}  ·  ${b.units} × ${widget.place.unit}  ·  ${b.when}',
                        style: context.text.bodySmall,
                      ),
                      Text('${ugx(b.paid)} paid of ${ugx(b.total)}', style: context.text.bodySmall),
                      if (b.status == 'requested')
                        IgongoButton(
                          label: 'Approve',
                          onPressed: () => _run(() => api.approve(b.id), (x) => 'Approved: ${x.code}'),
                        ),
                      if (b.status == 'confirmed')
                        IgongoButton(
                          label: 'Check in',
                          onPressed: () => _run(() => api.checkIn(b.code), (x) => 'Checked in: ${x.code}'),
                        ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
