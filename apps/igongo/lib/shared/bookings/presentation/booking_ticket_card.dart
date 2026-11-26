// The booking receipt, drawn like an air ticket: the Igongo name, the booking
// reference, the dates and time, a dashed tear line with notches at each side,
// then the QR code and a barcode strip. Built from the booking the API returns,
// so it is ready as soon as the booking is paid (or requested).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../format/day_key.dart';
import '../../format/day_label.dart';
import '../../format/ugx.dart';
import '../../theme/theme.dart';
import '../../ui/ticket/barcode_strip.dart';
import '../../ui/ticket/dashed_divider.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';

/// The ticket for [booking] at [place].
class BookingTicketCard extends StatelessWidget {
  /// Creates the ticket.
  const BookingTicketCard({super.key, required this.booking, required this.place});

  /// The booking the ticket is for.
  final Booking booking;

  /// The booking module, for the word for one unit.
  final BookingPlace place;

  /// Size of the QR code square.
  static const _qrSize = IgongoSpace.xxl * 4;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final t = context.text;
    // Step 1: the date fields. A stay shows check-in and check-out; a day shows the day and its time.
    final from = parseDayKey(booking.date);
    final to = parseDayKey(booking.endDate);
    return Container(
      decoration: BoxDecoration(
        color: p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: p.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Step 2: the top half: the name, the item and the key details.
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.md,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text('Igongo', style: t.titleLarge?.copyWith(color: p.primaryText)),
                    ),
                    Text('Booking receipt', style: t.labelMedium?.copyWith(color: p.textMuted)),
                  ],
                ),
                Text(booking.offeringName, style: t.titleMedium),
                Row(
                  spacing: IgongoSpace.lg,
                  children: [
                    _TicketField(
                      label: to == null ? 'Date' : 'Check-in',
                      value: from == null ? booking.when : shortDay(from),
                    ),
                    if (to != null) _TicketField(label: 'Check-out', value: shortDay(to)),
                    if (to == null) _TicketField(label: 'Time', value: booking.slot ?? 'All day'),
                    _TicketField(
                      label: 'Guests',
                      value: '${booking.units} ${place.unit}${booking.units == 1 ? '' : 's'}',
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Booking reference', style: t.labelMedium?.copyWith(color: p.textMuted)),
                    SelectableText(booking.code, style: t.headlineSmall?.copyWith(color: p.primaryText)),
                  ],
                ),
              ],
            ),
          ),
          // Step 3: the tear line, with a notch at each side.
          const _TearLine(),
          // Step 4: the bottom half: the QR code (the one the door scans), the barcode strip and the amount.
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              spacing: IgongoSpace.md,
              children: [
                _QrPanel(data: booking.qr, size: _qrSize),
                BarcodeStrip(code: booking.code, height: IgongoSpace.xl),
                Text(
                  '${ugx(booking.paid)} paid of ${ugx(booking.total)}',
                  style: t.bodySmall?.copyWith(color: p.textMuted),
                ),
                Text('Show this at the door.', style: t.bodySmall?.copyWith(color: p.textMuted)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// One labelled value on the ticket, such as "Check-in" and "Tue, 28 Apr".
class _TicketField extends StatelessWidget {
  /// Creates the field.
  const _TicketField({required this.label, required this.value});

  /// The small heading above the value.
  final String label;

  /// The value.
  final String value;

  @override
  Widget build(BuildContext context) => Flexible(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: context.text.labelMedium?.copyWith(color: context.palette.textMuted)),
        Text(value, style: context.text.bodyMedium),
      ],
    ),
  );
}

/// The tear line: a dashed line between two notches cut into the ticket's sides.
class _TearLine extends StatelessWidget {
  /// Creates the line.
  const _TearLine();

  /// The notch's diameter, and how far it sits over the edge (half of it).
  static const _notch = IgongoSpace.xxl;
  static const _half = IgongoSpace.lg;

  @override
  Widget build(BuildContext context) {
    final notch = Container(
      width: _notch,
      height: _notch,
      decoration: BoxDecoration(color: context.palette.background, shape: BoxShape.circle),
    );
    return Row(
      children: [
        Transform.translate(offset: const Offset(-_half, 0), child: notch),
        const Expanded(child: DashedDivider()),
        Transform.translate(offset: const Offset(_half, 0), child: notch),
      ],
    );
  }
}

/// The QR code on a light panel, so it scans the same in light and dark mode.
class _QrPanel extends StatelessWidget {
  /// Creates the panel for [data].
  const _QrPanel({required this.data, required this.size});

  /// The text the code holds.
  final String data;

  /// The square's size.
  final double size;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(IgongoSpace.sm),
    decoration: BoxDecoration(color: IgongoColorsLight.surface, borderRadius: BorderRadius.circular(IgongoRadius.md)),
    child: QrImageView(
      data: data,
      size: size,
      eyeStyle: const QrEyeStyle(color: IgongoColorsLight.brandInk),
      dataModuleStyle: const QrDataModuleStyle(color: IgongoColorsLight.brandInk),
    ),
  );
}
