// The guest's bookings at one booking module, in two tabs: Upcoming (not yet
// over) and Past (over or cancelled). Each card shows its status, the code to
// show at the door, and buttons to pay what is owed or cancel. Tapping a card
// opens its status and receipt. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../format/day_key.dart';
import '../../format/ugx.dart';
import '../../live/live_view.dart';
import '../../payments/presentation/pay_sheet.dart';
import '../../screens/parts/purpose_text.dart';
import '../../screens/parts/screen_list_view.dart';
import '../../screens/screen_layout.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/chip/status_chip.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/bookings_providers.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import '../domain/booking_timeline.dart';
import 'booking_status_screen.dart';

/// My bookings at [place].
class MyBookingsScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [screen] at [place].
  const MyBookingsScreen(this.screen, this.place, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// The booking module.
  final BookingPlace place;

  @override
  ConsumerState<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends ConsumerState<MyBookingsScreen> {
  /// True for the Upcoming tab, false for Past.
  bool _upcoming = true;

  /// Cancels [b] after the guest confirms.
  Future<void> _cancel(Booking b) async {
    final sure = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Cancel this booking?'),
        content: Text('${b.offeringName}, ${b.when}'),
        actions: [
          TextButton(onPressed: () => Navigator.of(c).pop(false), child: const Text('Keep it')),
          TextButton(onPressed: () => Navigator.of(c).pop(true), child: const Text('Cancel booking')),
        ],
      ),
    );
    if (sure != true) return;
    try {
      await ref.read(bookingsApiProvider(widget.place)).cancel(b.id);
      if (mounted) showIgongoToast(context, 'Booking cancelled');
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(myBookingsProvider(widget.place));
  }

  @override
  Widget build(BuildContext context) {
    final place = widget.place;
    return LiveView<List<Booking>>(
      screenName: widget.screen.spec.name,
      value: ref.watch(myBookingsProvider(place)),
      onRetry: () => ref.invalidate(myBookingsProvider(place)),
      sample: (_) => screenLayout(widget.screen),
      builder: (context, bookings, _) {
        // Step 1: split the list by the two tabs.
        final today = dayOnly(DateTime.now());
        final shown = [
          for (final b in bookings)
            if (isPastBooking(b, today) != _upcoming) b,
        ];
        return RefreshIndicator(
          onRefresh: () => ref.refresh(myBookingsProvider(place).future),
          child: ScreenListView(
            children: [
              PurposeText(widget.screen.spec.purpose),
              // Step 2: the two tabs.
              Padding(
                padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
                child: SegmentedButton<bool>(
                  segments: const [
                    ButtonSegment<bool>(value: true, label: Text('Upcoming')),
                    ButtonSegment<bool>(value: false, label: Text('Past')),
                  ],
                  selected: {_upcoming},
                  onSelectionChanged: (s) => setState(() => _upcoming = s.first),
                ),
              ),
              if (shown.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(IgongoSpace.lg),
                  child: Text(_upcoming ? 'No upcoming bookings.' : 'No past bookings.'),
                ),
              // Step 3: one card per booking.
              for (final b in shown)
                Padding(
                  padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
                  child: _BookingCard(
                    booking: b,
                    place: place,
                    onOpen: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => BookingStatusScreen(booking: b, place: place),
                      ),
                    ),
                    onPaid: () => ref.invalidate(myBookingsProvider(place)),
                    onCancel: () => _cancel(b),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

/// One booking in the list: status, the code, the amount, and its buttons.
class _BookingCard extends StatelessWidget {
  /// Creates the card for [booking].
  const _BookingCard({
    required this.booking,
    required this.place,
    required this.onOpen,
    required this.onPaid,
    required this.onCancel,
  });

  /// The booking shown.
  final Booking booking;

  /// The booking module, for the unit word and payments.
  final BookingPlace place;

  /// Opens the status and receipt.
  final VoidCallback onOpen;

  /// Called after a payment from this card.
  final VoidCallback onPaid;

  /// Cancels the booking.
  final VoidCallback onCancel;

  @override
  Widget build(BuildContext context) {
    final b = booking;
    return IgongoCard(
      onTap: onOpen,
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
          Text('${b.units} × ${place.unit}  ·  ${b.when}', style: context.text.bodySmall),
          SelectableText(b.code, style: context.text.titleMedium?.copyWith(color: context.palette.primaryText)),
          Text('${ugx(b.paid)} paid of ${ugx(b.total)}', style: context.text.bodySmall),
          Wrap(
            spacing: IgongoSpace.sm,
            children: [
              if (b.owed > 0)
                IgongoButton(
                  label: 'Pay ${ugx(b.owed)}',
                  onPressed: () async {
                    await showPaySheet(
                      context,
                      module: place.module,
                      recordId: b.id,
                      label: '${b.offeringName} ${b.code}',
                      owed: b.owed,
                    );
                    onPaid();
                  },
                ),
              if (b.status != 'cancelled' && b.status != 'checked_in')
                IgongoButton(label: 'Cancel', variant: ButtonVariant.text, onPressed: onCancel),
            ],
          ),
        ],
      ),
    );
  }
}
