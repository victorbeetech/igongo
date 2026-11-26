// S62-09..11 My orders, live: each order's number, status, what is owed and,
// for deliveries on the way, the rider and the code to give at the door.
// Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/payments/presentation/pay_sheet.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../../../shared/ui/chip/status_chip.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/orders_providers.dart';
import '../domain/order.dart';
import '../domain/order_type.dart';

/// The guest's orders.
class MyOrdersScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MyOrdersScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// Cancels [o]; the API refuses once the kitchen started or the window closed.
  Future<void> _cancel(BuildContext context, WidgetRef ref, Order o) async {
    try {
      await ref.read(ordersApiProvider).cancel(o.id);
      if (context.mounted) showIgongoToast(context, 'Order ${o.number} cancelled');
    } on Exception catch (e) {
      if (context.mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(myOrdersProvider);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<Order>>(
    screenName: screen.spec.name,
    value: ref.watch(myOrdersProvider),
    onRetry: () => ref.invalidate(myOrdersProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, orders, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(myOrdersProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          if (orders.isEmpty) const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No orders yet.')),
          for (final o in orders)
            Padding(
              padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
              child: IgongoCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.xs,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text('${o.number} · ${orderTypeWords(o.type)}', style: context.text.titleMedium),
                        ),
                        StatusChip(statusWords(o.status)),
                      ],
                    ),
                    for (final l in o.lines) Text('${l.quantity} × ${l.name}'),
                    Text('${ugx(o.total)} · ${ugx(o.paid)} paid', style: context.text.bodySmall),
                    if (o.tracking) _Track(orderId: o.id),
                    Wrap(
                      spacing: IgongoSpace.sm,
                      children: [
                        if (o.owed > 0 && o.status == 'awaiting_payment')
                          IgongoButton(
                            label: 'Pay ${ugx(o.owed)}',
                            onPressed: () async {
                              await showPaySheet(
                                context,
                                module: 'food-ordering',
                                recordId: o.id,
                                label: 'Order ${o.number}',
                                owed: o.owed,
                                outlet: o.outlet,
                              );
                              ref.invalidate(myOrdersProvider);
                            },
                          ),
                        if (o.cancellable)
                          IgongoButton(
                            label: 'Cancel',
                            variant: ButtonVariant.text,
                            onPressed: () => _cancel(context, ref, o),
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

/// The rider and the door code for a delivery on its way.
class _Track extends ConsumerWidget {
  const _Track({required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) => ref
      .watch(trackProvider(orderId))
      .when(
        loading: () => const LinearProgressIndicator(),
        error: (_, _) => const SizedBox.shrink(),
        data: (t) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              t.riderName == null ? 'Waiting for a rider' : '${t.riderName} is bringing it (about ${t.minutes} min)',
            ),
            Text('Give the rider this code: ${t.code}', style: context.text.titleMedium),
          ],
        ),
      );
}
