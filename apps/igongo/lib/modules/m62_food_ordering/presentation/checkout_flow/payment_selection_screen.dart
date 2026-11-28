// Step 3 of checkout: choose how to pay (MTN MoMo, Airtel Money, card, room
// folio or cash), then pay. The amount and order number are placeholders until
// the order is placed through the API; the payment buttons are not wired yet.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import 'checkout_app_bar.dart';
import 'checkout_placeholders.dart';
import 'checkout_step_bar.dart';
import 'order_confirmed_screen.dart';
import 'payment_channel_tile.dart';

/// The ways the guest can pay, in the order the design shows them.
enum PaymentChannel {
  /// MTN Mobile Money prompt on the phone.
  mtnMomo,

  /// Airtel Money push notification.
  airtelMoney,

  /// Visa, Mastercard or UnionPay card.
  card,

  /// Billed to the cottage folio.
  roomFolio,

  /// Cash to the waiter or room service.
  cash,
}

/// The payment selection screen (step 3 of 3).
class PaymentSelectionScreen extends StatefulWidget {
  /// Creates the screen.
  const PaymentSelectionScreen({super.key});

  @override
  State<PaymentSelectionScreen> createState() => _PaymentSelectionScreenState();
}

class _PaymentSelectionScreenState extends State<PaymentSelectionScreen> {
  /// The channel the guest picked (MTN MoMo by default, as in the design).
  PaymentChannel _channel = PaymentChannel.mtnMomo;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: const CheckoutAppBar(title: 'Payment Selection'),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Step 1: progress, currently on step 3.
          const CheckoutStepBar(step: 3, stepName: 'Payment'),
          const SizedBox(height: IgongoSpace.lg),
          // Step 2: the amount due and the order number.
          const _AmountDueCard(),
          const SizedBox(height: IgongoSpace.lg),
          Text('Select payment channel', style: context.text.titleMedium),
          const SizedBox(height: IgongoSpace.sm),
          // Step 3: one tile per channel; the chosen one shows its own detail field.
          for (final channel in PaymentChannel.values) ...[
            PaymentChannelTile(
              channel: channel,
              selected: channel == _channel,
              onTap: () => setState(() => _channel = channel),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.sm),
          // Step 4: the bank and security line under the channels.
          Center(
            child: Text(
              'Secure payment · Instant e-receipt · 24/7 desk',
              style: context.text.bodySmall?.copyWith(color: palette.textMuted),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
        child: IgongoButton(
          label: 'Pay $kAmountPlaceholder',
          icon: Icons.lock_outline,
          expand: true,
          // Step 5: place the order and show the confirmation (payment is wired later).
          onPressed: () =>
              Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const OrderConfirmedScreen())),
        ),
      ),
    );
  }
}

/// The total amount due card with the order number, placeholders until the order is placed.
class _AmountDueCard extends StatelessWidget {
  /// Creates the card.
  const _AmountDueCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(color: palette.primary, borderRadius: BorderRadius.circular(IgongoRadius.lg)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text('TOTAL AMOUNT DUE', style: context.text.labelSmall?.copyWith(color: palette.onPrimary)),
              ),
              // Step 1: the order number (placeholder until the API gives it).
              Container(
                padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
                decoration: BoxDecoration(
                  color: palette.onPrimary.withValues(alpha: 0.18),
                  borderRadius: BorderRadius.circular(IgongoRadius.pill),
                ),
                child: Text(
                  kOrderNumberPlaceholder,
                  style: context.text.labelSmall?.copyWith(color: palette.onPrimary),
                ),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.sm),
          // Step 2: the amount, in the brand serif.
          Text(
            kAmountPlaceholder,
            style: context.text.headlineMedium?.copyWith(color: palette.onPrimary, fontFamily: IgongoFonts.brand),
          ),
          const SizedBox(height: IgongoSpace.xs),
          Text('Your order · Cottage —', style: context.text.bodySmall?.copyWith(color: palette.onPrimary)),
        ],
      ),
    );
  }
}
