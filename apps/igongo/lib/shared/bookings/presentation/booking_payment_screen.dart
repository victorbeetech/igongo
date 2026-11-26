// The payment step after a booking is made: what is owed, and "Pay now" which
// opens the pay sheet (mobile money or card, from the methods the super admin
// switched on). Until a live gateway is on, the screen says it is a demo and
// nothing is charged. A paid booking opens its receipt; "Pay later" keeps the
// booking, to pay from My bookings.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/ugx.dart';
import '../../layout/igongo_scaffold.dart';
import '../../payments/application/payments_providers.dart';
import '../../payments/presentation/pay_sheet.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/toast/igongo_toast.dart';
import '../application/bookings_providers.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import 'booking_confirmed_screen.dart';

/// Pays what is owed on [booking].
class BookingPaymentScreen extends ConsumerWidget {
  /// Creates the screen for [booking] at [place].
  const BookingPaymentScreen({super.key, required this.booking, required this.place});

  /// The booking to pay.
  final Booking booking;

  /// The booking module.
  final BookingPlace place;

  /// Opens the pay sheet; a paid booking opens its receipt in place of this screen.
  Future<void> _pay(BuildContext context, WidgetRef ref) async {
    final paid = await showPaySheet(
      context,
      module: place.module,
      recordId: booking.id,
      label: '${booking.offeringName} ${booking.code}',
      owed: booking.owed,
    );
    ref.invalidate(myBookingsProvider(place));
    if (!paid || !context.mounted) return;
    // Step 1: paid, so the receipt is generated and replaces this step.
    await Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(builder: (_) => BookingConfirmedScreen(booking: booking, place: place)),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = context.palette;
    // Step 2: is a live gateway on? Until one is, the screen says it is a demo.
    final methods = ref.watch(payMethodsProvider((module: place.module, outlet: null)));
    final live = methods.valueOrNull?.any((m) => !m.preview) ?? false;
    return IgongoScaffold(
      title: 'Payment',
      body: ListView(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        children: [
          if (!live)
            Container(
              padding: const EdgeInsets.all(IgongoSpace.md),
              decoration: BoxDecoration(
                color: p.primaryContainer,
                borderRadius: BorderRadius.circular(IgongoRadius.md),
              ),
              child: Text(
                'DEMO: payment is not connected yet, so nothing is charged.',
                style: context.text.bodyMedium?.copyWith(color: p.onPrimaryContainer),
              ),
            ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: what the guest is paying for, and the amount owed.
          IgongoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.sm,
              children: [
                Text(booking.offeringName, style: context.text.titleMedium),
                Text('Booking ${booking.code}', style: context.text.bodySmall),
                Text(booking.when, style: context.text.bodySmall),
                const Divider(),
                Row(
                  children: [
                    Expanded(child: Text('Total to pay', style: context.text.titleSmall)),
                    Text(ugx(booking.owed), style: context.text.headlineSmall?.copyWith(color: p.primaryText)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.xl),
          IgongoButton(label: 'Pay now', expand: true, onPressed: () => _pay(context, ref)),
          const SizedBox(height: IgongoSpace.sm),
          IgongoButton(
            label: 'Pay later',
            variant: ButtonVariant.text,
            expand: true,
            onPressed: () {
              // Step 4: keep the booking, go back to its start, and say where to pay it later.
              showIgongoToast(context, 'Booked. Pay from My bookings.');
              Navigator.of(context).popUntil((route) => route.isFirst);
            },
          ),
        ],
      ),
    );
  }
}
