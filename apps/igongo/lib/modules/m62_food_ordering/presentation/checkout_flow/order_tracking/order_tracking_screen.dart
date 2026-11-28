// The order tracker for one order, from the API. "Live" while the order is
// being prepared or is on its way; "delivered" once it is served, with a button
// to rate it (the same sheet as My orders). The screen reloads the order every
// 15 seconds, so each status change shows without leaving the screen.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/format/when.dart';
import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/button/igongo_button.dart';
import '../../../../../shared/ui/loader/spiral_loader.dart';
import '../../../../../shared/ui/message/state_message.dart';
import '../../../application/orders_providers.dart';
import '../../../domain/order.dart';
import '../../rate_order_sheet.dart';
import '../checkout_app_bar.dart';
import '../checkout_section_card.dart';
import 'tracking_step_tile.dart';

/// How often the tracker asks the API for the order's status.
const Duration kTrackerRefresh = Duration(seconds: 15);

/// The stages a live order goes through, in order. The status names are the API's.
const List<(String status, String label)> kLiveStages = [
  ('received', 'Order placed & confirmed'),
  ('preparing', 'Kitchen preparing'),
  ('ready', 'Ready to leave the kitchen'),
  ('on_the_way', 'Out for delivery'),
];

/// The order tracking screen for the order with [orderId].
class OrderTrackingScreen extends ConsumerStatefulWidget {
  /// Creates the tracker for [orderId].
  const OrderTrackingScreen({super.key, required this.orderId});

  /// The order to track.
  final String orderId;

  @override
  ConsumerState<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends ConsumerState<OrderTrackingScreen> {
  /// Asks the API for the orders again every [kTrackerRefresh], so status changes show live.
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(kTrackerRefresh, (_) => ref.invalidate(myOrdersProvider));
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final orders = ref.watch(myOrdersProvider);
    return Scaffold(
      backgroundColor: palette.background,
      appBar: const CheckoutAppBar(title: 'Order Tracking'),
      body: orders.when(
        loading: () => const Center(child: SpiralLoader()),
        error: (_, _) => const Center(
          child: StateMessage(icon: Icons.error_outline, title: 'Order could not load', message: 'Check your connection and try again.'),
        ),
        data: (all) {
          // Step 1: find this order; a missing order is shown as not found.
          final order = all.where((o) => o.id == widget.orderId).firstOrNull;
          if (order == null) {
            return const Center(
              child: StateMessage(icon: Icons.search_off, title: 'Order not found', message: 'This order is not on your account.'),
            );
          }
          return _body(context, order);
        },
      ),
    );
  }

  /// The tracker body for [order].
  Widget _body(BuildContext context, Order order) {
    final delivered = order.status == 'delivered';
    return ListView(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.xxl),
      children: [
        // Step 1: the order number and status badge.
        _OrderHeader(order: order),
        const SizedBox(height: IgongoSpace.md),
        // Step 2: the stage now (live) or the served summary (delivered).
        if (delivered) _ServedCard(order: order) else _LiveStageCard(order: order),
        const SizedBox(height: IgongoSpace.md),
        // Step 3: the stage-by-stage track.
        _TrackCard(order: order),
        const SizedBox(height: IgongoSpace.md),
        // Step 4: rate the order once it is served and not yet rated.
        if (delivered) _RateCard(order: order),
      ],
    );
  }
}

/// The order number and the status badge (live, delivered or cancelled).
class _OrderHeader extends StatelessWidget {
  /// Creates the header for [order].
  const _OrderHeader({required this.order});

  /// The order shown.
  final Order order;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final delivered = order.status == 'delivered';
    final badge = switch (order.status) {
      'delivered' => 'DELIVERED',
      'cancelled' => 'CANCELLED',
      _ => 'LIVE TRACKER',
    };
    return Row(
      children: [
        Expanded(child: Text(order.number, style: context.text.labelMedium)),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
          decoration: BoxDecoration(
            color: delivered ? palette.success : palette.primaryContainer,
            borderRadius: BorderRadius.circular(IgongoRadius.pill),
          ),
          child: Text(
            badge,
            style: context.text.labelSmall?.copyWith(color: delivered ? palette.onPrimary : palette.primaryText),
          ),
        ),
      ],
    );
  }
}

/// The live state: the current stage, the progress bar and the arrival time.
class _LiveStageCard extends StatelessWidget {
  /// Creates the card for [order].
  const _LiveStageCard({required this.order});

  /// The order shown.
  final Order order;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final index = stageIndex(order.status);
    final label = index < 0 ? 'Waiting for payment' : kLiveStages[index].$2;
    // The progress fills as the stages go by; nothing filled before the first stage.
    final progress = index < 0 ? 0.0 : (index + 1) / kLiveStages.length;
    // The arrival time as a local time, when the API gives a readable one.
    final arrives = order.arriveAt == null ? null : DateTime.tryParse(order.arriveAt!)?.toLocal();
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(order.type.toUpperCase(), style: context.text.labelSmall?.copyWith(color: palette.accent)),
          const SizedBox(height: IgongoSpace.xs),
          Text(label, style: context.text.headlineSmall?.copyWith(fontFamily: IgongoFonts.brand)),
          const SizedBox(height: IgongoSpace.md),
          ClipRRect(
            borderRadius: BorderRadius.circular(IgongoRadius.pill),
            child: LinearProgressIndicator(value: progress, minHeight: 6, backgroundColor: palette.border, color: palette.primary),
          ),
          const SizedBox(height: IgongoSpace.md),
          // The arrival time, when the API gives one.
          if (arrives != null)
            Row(
              children: [
                Expanded(child: Text('Estimated time', style: context.text.bodyMedium)),
                Text(dayTime(arrives), style: context.text.titleSmall?.copyWith(color: palette.primary)),
              ],
            ),
        ],
      ),
    );
  }
}

/// The delivered state: the served line.
class _ServedCard extends StatelessWidget {
  /// Creates the card for [order].
  const _ServedCard({required this.order});

  /// The order shown.
  final Order order;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Enjoy your meal', style: context.text.headlineSmall?.copyWith(fontFamily: IgongoFonts.brand)),
          const SizedBox(height: IgongoSpace.sm),
          Text(_servedLine(order), style: context.text.bodyMedium?.copyWith(color: palette.textMuted)),
        ],
      ),
    );
  }
}

/// The stage-by-stage track: each stage is done, active or upcoming, from the API status.
class _TrackCard extends StatelessWidget {
  /// Creates the card for [order].
  const _TrackCard({required this.order});

  /// The order shown.
  final Order order;

  @override
  Widget build(BuildContext context) {
    final index = stageIndex(order.status);
    final delivered = order.status == 'delivered';
    // Step 1: each stage's state from how far the order has got.
    TrackStageState stateOf(int i) {
      if (delivered || i < index) return TrackStageState.done;
      if (i == index) return TrackStageState.active;
      return TrackStageState.upcoming;
    }

    final stages = [for (var i = 0; i < kLiveStages.length; i++) (kLiveStages[i].$2, stateOf(i))];
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Order progression', style: context.text.titleMedium),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: one row per stage, the last without a line below it.
          for (var i = 0; i < stages.length; i++)
            TrackingStepTile(title: stages[i].$1, detail: '', state: stages[i].$2, isLast: i == stages.length - 1),
        ],
      ),
    );
  }
}

/// Outlet and the time it was ready, or only the outlet when the time is not readable.
String _servedLine(Order order) {
  final ready = DateTime.tryParse(order.readyAt)?.toLocal();
  return ready == null ? order.outlet : '${order.outlet} · ${dayTime(ready)}';
}

/// The rate action on a served order. It opens the same sheet as My orders,
/// and reads "Rated" once the guest has rated it.
class _RateCard extends StatelessWidget {
  /// Creates the card for [order].
  const _RateCard({required this.order});

  /// The order to rate.
  final Order order;

  @override
  Widget build(BuildContext context) => CheckoutSectionCard(
    child: IgongoButton(
      label: order.rated ? 'Rated. Thank you' : 'Rate this order',
      icon: Icons.star_outline,
      expand: true,
      onPressed: order.rated ? null : () => showRateOrderSheet(context, order),
    ),
  );
}

/// Where an API status sits in [kLiveStages]; -1 before the kitchen has it (for example, awaiting payment).
int stageIndex(String status) => kLiveStages.indexWhere((s) => s.$1 == status);
