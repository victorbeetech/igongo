// The order is confirmed: the kitchen has the order, with a confirmation card,
// the live preparation track preview, the order summary and the next actions.
// Items, times and amounts are placeholders until the order is wired.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import 'checkout_app_bar.dart';
import 'checkout_placeholders.dart';
import 'checkout_section_card.dart';

/// The reservation (order) confirmed screen.
class OrderConfirmedScreen extends StatelessWidget {
  /// Creates the screen.
  const OrderConfirmedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: const CheckoutAppBar(title: 'Reservation Confirmed'),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Step 1: the confirmation card with the order reference and status.
          const _ConfirmationCard(),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the estimated arrival with a live badge.
          const _ArrivalCard(),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the live preparation track, summarised (full detail is on the tracker).
          const _PrepPreview(),
          const SizedBox(height: IgongoSpace.md),
          // Step 4: the order summary with the paid badge.
          const _OrderSummaryCard(),
        ],
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
        child: IgongoButton(
          label: 'Track my order',
          icon: Icons.local_fire_department_outlined,
          expand: true,
          // Step 5: the live tracker opens from My orders, which knows the real order.
          onPressed: () => showIgongoToast(context, 'Open the order in My orders to track it'),
        ),
      ),
    );
  }
}

/// The confirmation headline and the order reference.
class _ConfirmationCard extends StatelessWidget {
  /// Creates the card.
  const _ConfirmationCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.check_circle, color: palette.success),
              const SizedBox(width: IgongoSpace.sm),
              Expanded(child: Text('Order ref. $kOrderNumberPlaceholder', style: context.text.labelMedium)),
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          Text(
            'Order received & kitchen preparing',
            style: context.text.headlineSmall?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand),
          ),
          const SizedBox(height: IgongoSpace.sm),
          Text(
            'The restaurant has received your request and is preparing your order.',
            style: context.text.bodyMedium?.copyWith(color: palette.textMuted),
          ),
        ],
      ),
    );
  }
}

/// The estimated arrival, with a "Live" badge.
class _ArrivalCard extends StatelessWidget {
  /// Creates the card.
  const _ArrivalCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Row(
        children: [
          Icon(Icons.timer_outlined, color: palette.accent),
          const SizedBox(width: IgongoSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ESTIMATED ARRIVAL', style: context.text.labelSmall?.copyWith(color: palette.accent)),
                Text(kTimePlaceholder, style: context.text.titleMedium),
              ],
            ),
          ),
          // Step 1: the live badge.
          Container(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
            decoration: BoxDecoration(
              color: palette.primaryContainer,
              borderRadius: BorderRadius.circular(IgongoRadius.pill),
            ),
            child: Text('Live', style: context.text.labelSmall?.copyWith(color: palette.primaryText)),
          ),
        ],
      ),
    );
  }
}

/// The preparation preview: the current stage, with a link to the full tracker.
class _PrepPreview extends StatelessWidget {
  /// Creates the preview.
  const _PrepPreview();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text('Live preparation track', style: context.text.titleMedium)),
              Text('STAGE — OF —', style: context.text.labelSmall?.copyWith(color: palette.accent)),
            ],
          ),
          const SizedBox(height: IgongoSpace.sm),
          // Step 2: the stages as text placeholders, filled from the order later.
          for (final stage in const [
            'Order placed & confirmed',
            'Kitchen preparing food',
            'Out for cottage delivery',
            'Delivered to your place',
          ])
            Padding(
              padding: const EdgeInsets.symmetric(vertical: IgongoSpace.xxs),
              child: Text(stage, style: context.text.bodyMedium?.copyWith(color: palette.textMuted)),
            ),
        ],
      ),
    );
  }
}

/// The order summary card: the paid badge, items placeholders and the total.
class _OrderSummaryCard extends StatelessWidget {
  /// Creates the summary.
  const _OrderSummaryCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text('Order summary', style: context.text.titleMedium)),
              Text('PAID IN FULL', style: context.text.labelSmall?.copyWith(color: palette.success)),
            ],
          ),
          const SizedBox(height: IgongoSpace.sm),
          Text('Items come from your order', style: context.text.bodyMedium?.copyWith(color: palette.textMuted)),
          const Divider(height: IgongoSpace.lg),
          Row(
            children: [
              Expanded(child: Text('Total', style: context.text.titleMedium)),
              Text(kAmountPlaceholder, style: context.text.titleMedium?.copyWith(color: palette.primary)),
            ],
          ),
        ],
      ),
    );
  }
}
