// The order tracker, in two states from the design: "live" while the kitchen
// prepares and the runner brings the order, and "delivered" once it is served
// (with the receipt and a feedback form). Stages, names and times are
// placeholders until the order status comes from the API.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/button/igongo_button.dart';
import '../checkout_app_bar.dart';
import '../checkout_placeholders.dart';
import '../checkout_section_card.dart';
import 'tracking_step_tile.dart';

/// Which state of the tracker to show.
enum TrackingStatus {
  /// The order is being prepared or is on its way.
  live,

  /// The order has been served.
  delivered,
}

/// The order tracking screen, live or delivered.
class OrderTrackingScreen extends StatelessWidget {
  /// Creates the tracker in the [status] state.
  const OrderTrackingScreen({super.key, required this.status});

  /// The state to show.
  final TrackingStatus status;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final delivered = status == TrackingStatus.delivered;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: const CheckoutAppBar(title: 'Order Tracking'),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Step 1: the order number and status badge.
          _OrderHeader(delivered: delivered),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the stage the kitchen is on (live) or the served summary (delivered).
          if (!delivered) const _LiveStageCard() else const _ServedCard(),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the stage-by-stage track.
          _TrackCard(delivered: delivered),
          const SizedBox(height: IgongoSpace.md),
          // Step 4: the feedback form, shown only once delivered.
          if (delivered) const _FeedbackCard(),
          if (!delivered) const _DestinationCard(),
        ],
      ),
      bottomNavigationBar: delivered
          ? null
          : SafeArea(
              minimum: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
              child: IgongoButton(
                label: 'Message the butler',
                icon: Icons.chat_outlined,
                expand: true,
                onPressed: () {},
              ),
            ),
    );
  }
}

/// The order number and the status badge (live or delivered).
class _OrderHeader extends StatelessWidget {
  /// Creates the header.
  const _OrderHeader({required this.delivered});

  /// True when the order has been delivered.
  final bool delivered;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Row(
      children: [
        Expanded(child: Text(kOrderNumberPlaceholder, style: context.text.labelMedium)),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
          decoration: BoxDecoration(
            color: delivered ? palette.success : palette.primaryContainer,
            borderRadius: BorderRadius.circular(IgongoRadius.pill),
          ),
          child: Text(
            delivered ? 'DELIVERED' : 'LIVE TRACKER',
            style: context.text.labelSmall?.copyWith(color: delivered ? palette.onPrimary : palette.primaryText),
          ),
        ),
      ],
    );
  }
}

/// The live state: the current kitchen station, the progress bar and the ETA.
class _LiveStageCard extends StatelessWidget {
  /// Creates the card.
  const _LiveStageCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('KITCHEN STATION', style: context.text.labelSmall?.copyWith(color: palette.accent)),
          const SizedBox(height: IgongoSpace.xs),
          Text('Preparing your order', style: context.text.headlineSmall?.copyWith(fontFamily: IgongoFonts.brand)),
          const SizedBox(height: IgongoSpace.md),
          // Step 1: the progress bar (no progress until the API reports a stage).
          ClipRRect(
            borderRadius: BorderRadius.circular(IgongoRadius.pill),
            child: LinearProgressIndicator(
              value: 0,
              minHeight: 6,
              backgroundColor: palette.border,
              color: palette.primary,
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the estimate, as a placeholder.
          Row(
            children: [
              Expanded(child: Text('Estimated delivery', style: context.text.bodyMedium)),
              Text(kTimePlaceholder, style: context.text.titleSmall?.copyWith(color: palette.primary)),
            ],
          ),
        ],
      ),
    );
  }
}

/// The delivered state: the served line, the time and the in-room host.
class _ServedCard extends StatelessWidget {
  /// Creates the card.
  const _ServedCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Enjoy your meal', style: context.text.headlineSmall?.copyWith(fontFamily: IgongoFonts.brand)),
          const SizedBox(height: IgongoSpace.sm),
          Text('Served to your place · host —', style: context.text.bodyMedium?.copyWith(color: palette.textMuted)),
        ],
      ),
    );
  }
}

/// The stage-by-stage track. The live and delivered states show different stages.
class _TrackCard extends StatelessWidget {
  /// Creates the card for the chosen state.
  const _TrackCard({required this.delivered});

  /// True to show the delivered stages.
  final bool delivered;

  @override
  Widget build(BuildContext context) {
    // Step 1: the stages for this state. Placeholders until the API sends the real stages.
    final stages = delivered
        ? const [
            ('Order confirmed & placed', TrackStageState.done),
            ('Prepared in the kitchen', TrackStageState.done),
            ('On the way to your place', TrackStageState.done),
            ('Delivered & served', TrackStageState.done),
          ]
        : const [
            ('Order placed & confirmed', TrackStageState.done),
            ('Kitchen preparing', TrackStageState.active),
            ('Out for delivery', TrackStageState.upcoming),
            ('Arrived at your place', TrackStageState.upcoming),
          ];
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Order progression', style: context.text.titleMedium),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: one row per stage, the last without a line below it.
          for (var i = 0; i < stages.length; i++)
            TrackingStepTile(
              title: stages[i].$1,
              detail: 'Placeholder detail',
              state: stages[i].$2,
              isLast: i == stages.length - 1,
            ),
        ],
      ),
    );
  }
}

/// The destination card on the live state: where the order goes, with an update action.
class _DestinationCard extends StatelessWidget {
  /// Creates the card.
  const _DestinationCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Row(
        children: [
          Icon(Icons.home_outlined, color: palette.primary),
          const SizedBox(width: IgongoSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('DESTINATION', style: context.text.labelSmall?.copyWith(color: palette.accent)),
                Text('Your cottage or table', style: context.text.titleSmall),
              ],
            ),
          ),
          // Step 1: the update action (wired later with the order's location).
          OutlinedButton(onPressed: () {}, child: const Text('Update')),
        ],
      ),
    );
  }
}

/// The feedback form on the delivered state: a comment box and the submit action.
class _FeedbackCard extends StatelessWidget {
  /// Creates the card.
  const _FeedbackCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('How was your dining experience?', style: context.text.titleMedium),
          const SizedBox(height: IgongoSpace.xs),
          Text(
            'Your notes help the kitchen and the veranda team.',
            style: context.text.bodySmall?.copyWith(color: palette.textMuted),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 1: five stars for the food and the service (placeholders until ratings are wired).
          for (final label in const ['Food quality', 'Service'])
            Padding(
              padding: const EdgeInsets.only(bottom: IgongoSpace.sm),
              child: Row(
                children: [
                  Expanded(child: Text(label, style: context.text.bodyMedium)),
                  Row(children: [for (var i = 0; i < 5; i++) Icon(Icons.star_border, color: palette.accent, size: 22)]),
                ],
              ),
            ),
          const SizedBox(height: IgongoSpace.sm),
          // Step 2: the comment box.
          const TextField(maxLines: 3, decoration: InputDecoration(hintText: 'Tell us how it was')),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: submit (wired later).
          IgongoButton(label: 'Submit feedback', icon: Icons.send_outlined, expand: true, onPressed: () {}),
        ],
      ),
    );
  }
}
