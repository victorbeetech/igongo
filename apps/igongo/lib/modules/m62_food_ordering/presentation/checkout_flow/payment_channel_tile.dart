// One payment channel as a selectable card. The selected MTN MoMo and Airtel
// tiles show a phone-number field; the others show a short description only.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'payment_selection_screen.dart';

/// A selectable card for one [PaymentChannel].
class PaymentChannelTile extends StatelessWidget {
  /// Creates the tile for [channel].
  const PaymentChannelTile({super.key, required this.channel, required this.selected, required this.onTap});

  /// The channel this tile stands for.
  final PaymentChannel channel;

  /// Whether this channel is the one chosen.
  final bool selected;

  /// Called when the tile is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final info = _info(channel);
    return Material(
      color: palette.surface,
      borderRadius: BorderRadius.circular(IgongoRadius.lg),
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(IgongoSpace.md),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(IgongoRadius.lg),
            border: Border.all(color: selected ? palette.primary : palette.border, width: selected ? 1.5 : 1),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  // Step 1: the radio mark, filled when selected.
                  Icon(selected ? Icons.radio_button_checked : Icons.radio_button_unchecked, color: selected ? palette.primary : palette.outline),
                  const SizedBox(width: IgongoSpace.sm),
                  Expanded(child: Text(info.title, style: context.text.titleSmall)),
                  if (info.tag != null) _Tag(text: info.tag!),
                ],
              ),
              const SizedBox(height: IgongoSpace.xxs),
              // Step 2: the short description under the title, indented past the radio.
              Padding(
                padding: const EdgeInsets.only(left: 32),
                child: Text(info.detail, style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
              ),
              // Step 3: the phone field only for the mobile money channels, when selected.
              if (selected && (channel == PaymentChannel.mtnMomo || channel == PaymentChannel.airtelMoney)) ...[
                const SizedBox(height: IgongoSpace.md),
                const _PhoneRow(),
              ],
            ],
          ),
        ),
      ),
    );
  }

  /// The title, short detail and optional tag for each channel.
  static ({String title, String detail, String? tag}) _info(PaymentChannel c) => switch (c) {
        PaymentChannel.mtnMomo => (title: 'MTN Mobile Money', detail: 'Prompt sent to your phone', tag: 'MoMo'),
        PaymentChannel.airtelMoney => (title: 'Airtel Money', detail: 'Instant push notification on Airtel', tag: 'Airtel'),
        PaymentChannel.card => (title: 'Credit / debit card', detail: 'Visa, Mastercard and UnionPay', tag: null),
        PaymentChannel.roomFolio => (title: 'Charge to room folio', detail: 'Billed to your cottage, settled at check-out', tag: 'Room'),
        PaymentChannel.cash => (title: 'Cash to waiter / room service', detail: 'Pay cash in Ugandan shillings on delivery', tag: null),
      };
}

/// The small coloured tag next to a channel's title (for example "MoMo").
class _Tag extends StatelessWidget {
  /// Creates the tag with [text].
  const _Tag({required this.text});

  /// The tag's text.
  final String text;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(color: palette.warmCream, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
      child: Text(text, style: context.text.labelSmall?.copyWith(color: palette.primaryText)),
    );
  }
}

/// The Uganda phone field shown under a mobile money channel (placeholder value).
class _PhoneRow extends StatelessWidget {
  /// Creates the row.
  const _PhoneRow();

  @override
  Widget build(BuildContext context) {
    return const TextField(
      keyboardType: TextInputType.phone,
      decoration: InputDecoration(prefixText: '+256  ', hintText: 'Phone number'),
    );
  }
}
