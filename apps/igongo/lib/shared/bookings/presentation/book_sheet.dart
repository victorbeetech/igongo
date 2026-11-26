// The sheet that books one offering: how many, which day (and check-out day
// for rooms), which time slot, then book. When something is owed straight
// away the pay sheet opens next. Events marked "enquiry" send a request
// that staff answer with a price.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/ugx.dart';
import '../../payments/presentation/pay_sheet.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/bookings_providers.dart';
import '../domain/booking_place.dart';
import '../domain/offering.dart';

/// Opens the booking sheet for [offering] at [place].
Future<void> showBookSheet(BuildContext context, BookingPlace place, Offering offering) => showModalBottomSheet<void>(
  context: context,
  isScrollControlled: true,
  builder: (_) => BookSheet(place: place, offering: offering),
);

/// The booking form for one offering.
class BookSheet extends ConsumerStatefulWidget {
  /// Creates the sheet.
  const BookSheet({super.key, required this.place, required this.offering});

  /// The booking module.
  final BookingPlace place;

  /// What is being booked.
  final Offering offering;

  @override
  ConsumerState<BookSheet> createState() => _BookSheetState();
}

class _BookSheetState extends ConsumerState<BookSheet> {
  int _units = 1;
  DateTime? _date;
  DateTime? _endDate;
  String? _slot;
  bool _busy = false;

  Offering get _o => widget.offering;

  /// `YYYY-MM-DD` of [d].
  static String _day(DateTime d) => d.toIso8601String().substring(0, 10);

  /// Picks a day from today on; returns null when the guest closes the picker.
  Future<DateTime?> _pick(DateTime? from) {
    final today = DateTime.now();
    return showDatePicker(
      context: context,
      firstDate: from ?? today,
      lastDate: today.add(const Duration(days: 365)),
      initialDate: from ?? today,
    );
  }

  /// Books, then opens the pay sheet when money is due now.
  Future<void> _book() async {
    // Step 1: check the form has what this kind of offering needs.
    final needsDate = _o.onDate == null && _o.kind != 'stock';
    if (needsDate && _date == null) return showIgongoToast(context, 'Pick a day first.');
    if (_o.kind == 'nights' && _endDate == null) return showIgongoToast(context, 'Pick the check-out day.');
    if (_o.slots.isNotEmpty && _slot == null) return showIgongoToast(context, 'Pick a time.');
    setState(() => _busy = true);
    try {
      // Step 2: book; the API checks availability and prices it.
      final booking = await ref
          .read(bookingsApiProvider(widget.place))
          .book(
            offeringId: _o.id,
            units: _units,
            date: _date == null ? _o.onDate : _day(_date!),
            endDate: _endDate == null ? null : _day(_endDate!),
            slot: _slot,
          );
      ref.invalidate(myBookingsProvider(widget.place));
      if (!mounted) return;
      Navigator.of(context).pop();
      // Step 3: pay now when the rules ask for money up front.
      if (booking.owed > 0) {
        await showPaySheet(
          context,
          module: widget.place.module,
          recordId: booking.id,
          label: '${booking.offeringName} ${booking.code}',
          owed: booking.owed,
        );
        ref.invalidate(myBookingsProvider(widget.place));
      } else {
        showIgongoToast(context, booking.status == 'requested' ? 'Request sent' : 'Booked: ${booking.code}');
      }
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.fromLTRB(
      IgongoSpace.lg,
      IgongoSpace.lg,
      IgongoSpace.lg,
      IgongoSpace.lg + MediaQuery.viewInsetsOf(context).bottom,
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.md,
      children: [
        Text(_o.name, style: context.text.titleLarge),
        if (_o.kind != 'enquiry') Text('${ugx(_o.price)} per ${widget.place.unit}', style: context.text.bodySmall),
        // How many rooms, tickets, people or items.
        Row(
          children: [
            Expanded(child: Text('How many ${widget.place.unit}s')),
            IconButton(
              tooltip: 'Fewer',
              icon: const Icon(Icons.remove),
              onPressed: _units > 1 ? () => setState(() => _units--) : null,
            ),
            Text('$_units'),
            IconButton(tooltip: 'More', icon: const Icon(Icons.add), onPressed: () => setState(() => _units++)),
          ],
        ),
        if (_o.onDate case final fixed?) Text('On $fixed'),
        if (_o.onDate == null && _o.kind != 'stock')
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.event),
            title: Text(_date == null ? (_o.kind == 'nights' ? 'Check-in day' : 'Day') : _day(_date!)),
            onTap: () async {
              final d = await _pick(null);
              if (d == null) return;
              setState(() {
                _date = d;
                _endDate = null;
              });
            },
          ),
        if (_o.kind == 'nights')
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.event_available),
            title: Text(_endDate == null ? 'Check-out day' : _day(_endDate!)),
            onTap: () async {
              final d = await _pick(_date?.add(const Duration(days: 1)));
              if (d != null) setState(() => _endDate = d);
            },
          ),
        if (_o.slots.isNotEmpty)
          Wrap(
            spacing: IgongoSpace.sm,
            children: [
              for (final s in _o.slots)
                ChoiceChip(label: Text(s), selected: _slot == s, onSelected: (_) => setState(() => _slot = s)),
            ],
          ),
        IgongoButton(
          label: _busy ? 'Booking…' : (_o.kind == 'enquiry' ? 'Send request' : 'Book'),
          expand: true,
          onPressed: _busy ? null : _book,
        ),
      ],
    ),
  );
}
