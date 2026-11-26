// The guest's bookings at one booking module, newest first: the code to show
// at the door (also in the ticket's QR text), the status, and buttons to pay
// what is owed or cancel. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

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
import '../../ui/toast/igongo_toast.dart';
import '../../payments/presentation/pay_sheet.dart';
import '../application/bookings_providers.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';

/// My bookings at [place].
class MyBookingsScreen extends ConsumerWidget {
  /// Creates the screen for [screen] at [place].
  const MyBookingsScreen(this.screen, this.place, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// The booking module.
  final BookingPlace place;

  /// Cancels [b] after the guest confirms.
  Future<void> _cancel(BuildContext context, WidgetRef ref, Booking b) async {
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
      await ref.read(bookingsApiProvider(place)).cancel(b.id);
      if (context.mounted) showIgongoToast(context, 'Booking cancelled');
    } on Exception catch (e) {
      if (context.mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(myBookingsProvider(place));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<Booking>>(
    screenName: screen.spec.name,
    value: ref.watch(myBookingsProvider(place)),
    onRetry: () => ref.invalidate(myBookingsProvider(place)),
    sample: (_) => screenLayout(screen),
    builder: (context, bookings, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(myBookingsProvider(place).future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          if (bookings.isEmpty) const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No bookings yet.')),
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
                    Text('${b.units} × ${place.unit}  ·  ${b.when}', style: context.text.bodySmall),
                    SelectableText(b.code, style: context.text.headlineSmall),
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
                              ref.invalidate(myBookingsProvider(place));
                            },
                          ),
                        if (b.status != 'cancelled' && b.status != 'checked_in')
                          IgongoButton(
                            label: 'Cancel',
                            variant: ButtonVariant.text,
                            onPressed: () => _cancel(context, ref, b),
                          ),
                      ],
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
