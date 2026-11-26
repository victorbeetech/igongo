// The receipt screen after payment (or for a booking with nothing to pay): a
// green tick, the words "Booking Confirmed!", then the ticket receipt. A
// request (not yet approved) reads "Request sent" instead.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../layout/igongo_scaffold.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import 'booking_status_screen.dart';
import 'booking_ticket_card.dart';

/// Shows the booking is made, with its ticket receipt.
class BookingConfirmedScreen extends StatelessWidget {
  /// Creates the screen for [booking] at [place].
  const BookingConfirmedScreen({super.key, required this.booking, required this.place});

  /// The booking the receipt is for.
  final Booking booking;

  /// The booking module.
  final BookingPlace place;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final requested = booking.status == 'requested';
    return IgongoScaffold(
      title: requested ? 'Request sent' : 'Booking confirmed',
      body: ListView(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        children: [
          // Step 1: the tick and the headline.
          Center(child: Icon(Icons.check_circle, size: IgongoSpace.xxl * 2, color: p.success)),
          const SizedBox(height: IgongoSpace.md),
          Text(
            requested ? 'Request sent!' : 'Booking Confirmed!',
            textAlign: TextAlign.center,
            style: context.text.headlineSmall,
          ),
          const SizedBox(height: IgongoSpace.xs),
          Text(
            requested
                ? 'Our team will confirm your request soon.'
                : 'Your booking has been successfully made.',
            textAlign: TextAlign.center,
            style: context.text.bodyMedium?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 2: the receipt, shaped like an air ticket.
          BookingTicketCard(booking: booking, place: place),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: where to go next.
          IgongoButton(
            label: 'View my booking',
            expand: true,
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute<void>(builder: (_) => BookingStatusScreen(booking: booking, place: place)),
            ),
          ),
          const SizedBox(height: IgongoSpace.sm),
          IgongoButton(
            label: 'Back to home',
            variant: ButtonVariant.text,
            expand: true,
            onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
          ),
        ],
      ),
    );
  }
}
