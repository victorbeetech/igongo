// Booking details: the offering, the days picked, how many, and a time when
// the offering has time slots. "Continue to payment" books it (the API checks
// availability and prices it), then opens the payment screen; a booking with
// nothing to pay goes straight to the receipt.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/day_label.dart';
import '../../format/ugx.dart';
import '../../layout/igongo_scaffold.dart';
import '../../session/sign_in_first.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/bookings_providers.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import '../domain/booking_selection.dart';
import '../domain/offering.dart';
import 'booking_confirmed_screen.dart';
import 'booking_payment_screen.dart';

/// The details of one offering before booking.
class BookingDetailsScreen extends ConsumerStatefulWidget {
  /// Creates the screen. [dates] is null for fixed-date events and shop items.
  const BookingDetailsScreen({super.key, required this.place, required this.offering, this.dates});

  /// The booking module.
  final BookingPlace place;

  /// What is being booked.
  final Offering offering;

  /// The days picked, if any.
  final BookingSelection? dates;

  @override
  ConsumerState<BookingDetailsScreen> createState() => _BookingDetailsScreenState();
}

class _BookingDetailsScreenState extends ConsumerState<BookingDetailsScreen> {
  /// How many rooms, tickets, people or items.
  int _units = 1;

  /// The chosen time slot, when the offering has slots.
  String? _slot;

  /// True while the booking is being made.
  bool _busy = false;

  Offering get _o => widget.offering;

  /// How many nights (stays) or 1 for anything else; the estimate multiplies by it.
  int get _nights {
    final n = widget.dates?.nights ?? 0;
    return n > 0 ? n : 1;
  }

  /// The day line for the card: the picked days, a fixed event date, or a prompt.
  String get _dayWords {
    final d = widget.dates;
    if (d != null) {
      final to = d.to;
      return to == null ? shortDay(d.from) : '${shortDay(d.from)}  →  ${shortDay(to)}  ·  $_nights nights';
    }
    final fixed = _o.onDate;
    return fixed ?? 'Any day';
  }

  /// Books, then moves on: to payment when money is owed, else straight to the receipt.
  Future<void> _book() async {
    // Step 1: a time is needed when the offering has slots.
    if (_o.slots.isNotEmpty && _slot == null) return showIgongoToast(context, 'Pick a time first.');
    // Step 2: a visitor signs in first; their choices stay on screen.
    if (!signedInOrAsk(context, ref)) return;
    setState(() => _busy = true);
    try {
      // Step 3: book; the API checks availability and prices it.
      final booking = await ref
          .read(bookingsApiProvider(widget.place))
          .book(
            offeringId: _o.id,
            units: _units,
            date: widget.dates?.fromKey ?? _o.onDate,
            endDate: widget.dates?.toKey,
            slot: _slot,
          );
      ref.invalidate(myBookingsProvider(widget.place));
      if (!mounted) return;
      await _next(booking);
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  /// Opens the next step for [booking] in place of this screen.
  Future<void> _next(Booking booking) async {
    final nav = Navigator.of(context);
    // Step 1: a request (an enquiry or an approval) owes nothing now; say so and go back.
    if (booking.status == 'requested') {
      showIgongoToast(context, 'Request sent');
      nav.pop();
      return;
    }
    // Step 2: nothing to pay, so the receipt is ready at once.
    if (booking.owed <= 0) {
      await nav.pushReplacement(
        MaterialPageRoute<void>(builder: (_) => BookingConfirmedScreen(booking: booking, place: widget.place)),
      );
      return;
    }
    // Step 3: money is owed, so the payment screen opens next.
    await nav.pushReplacement(
      MaterialPageRoute<void>(builder: (_) => BookingPaymentScreen(booking: booking, place: widget.place)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final estimate = _o.price * _units * _nights;
    final enquiry = _o.kind == 'enquiry';
    return IgongoScaffold(
      title: _o.name,
      body: ListView(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        children: [
          // Step 1: the offering and the days.
          IgongoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.sm,
              children: [
                Text(_o.name, style: context.text.titleLarge),
                if (_o.description case final d?) Text(d),
                Row(
                  children: [
                    Icon(Icons.calendar_month_outlined, color: p.primaryText),
                    const SizedBox(width: IgongoSpace.sm),
                    Expanded(child: Text(_dayWords, style: context.text.titleSmall)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 2: how many.
          Row(
            children: [
              Expanded(child: Text('How many ${widget.place.unit}s', style: context.text.titleSmall)),
              IconButton(
                tooltip: 'Fewer',
                icon: const Icon(Icons.remove),
                onPressed: _units > 1 ? () => setState(() => _units--) : null,
              ),
              Text('$_units', style: context.text.titleMedium),
              IconButton(tooltip: 'More', icon: const Icon(Icons.add), onPressed: () => setState(() => _units++)),
            ],
          ),
          // Step 3: the time, when there are slots to pick from.
          if (_o.slots.isNotEmpty) ...[
            const SizedBox(height: IgongoSpace.md),
            Text('Time', style: context.text.titleSmall),
            const SizedBox(height: IgongoSpace.sm),
            Wrap(
              spacing: IgongoSpace.sm,
              runSpacing: IgongoSpace.sm,
              children: [
                for (final s in _o.slots)
                  ChoiceChip(label: Text(s), selected: _slot == s, onSelected: (_) => setState(() => _slot = s)),
              ],
            ),
          ],
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the estimate. The API prices the booking and its receipt shows the final amount.
          if (!enquiry)
            Row(
              children: [
                Expanded(child: Text('Estimated total', style: context.text.titleSmall)),
                Text(ugx(estimate), style: context.text.titleMedium?.copyWith(color: p.primaryText)),
              ],
            ),
          const SizedBox(height: IgongoSpace.xl),
          IgongoButton(
            label: _busy ? 'Booking…' : (enquiry ? 'Send request' : 'Continue to payment'),
            expand: true,
            onPressed: _busy ? null : _book,
          ),
        ],
      ),
    );
  }
}
