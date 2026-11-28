// Booking confirmation with a digital access boarding pass (design: "Booking
// Confirmation"). The pass shows the lead guest, the reserved experience, the
// arrival and departure, the payment status, a tear line, the QR code and the
// barcode, then the wallet, PDF and WhatsApp actions and the arrival info.
// The QR, barcode, folio number, guest name, dates and amounts are
// placeholders until the API issues the booking.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_placeholders.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:igongo/shared/ui/ticket/dashed_divider.dart';

/// The booking confirmation screen with the digital access boarding pass.
class BoardingPassConfirmationScreen extends StatelessWidget {
  /// Creates the confirmation screen.
  const BoardingPassConfirmationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: CheckoutAppBar(
        title: 'Booking Confirmation',
        actions: [IconButton(tooltip: 'Call the concierge', icon: Icon(Icons.support_agent, color: palette.primary), onPressed: () {})],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // The confirmed header: the check, the eyebrow, the title and the folio number.
          const SizedBox(height: IgongoSpace.sm),
          Center(child: Icon(Icons.check_circle, size: 56, color: palette.success)),
          const SizedBox(height: IgongoSpace.xs),
          const Center(child: FlowTag('Confirmed', solid: true)),
          const SizedBox(height: IgongoSpace.sm),
          Text(
            'ERIROBA • ROYAL WELCOME',
            textAlign: TextAlign.center,
            style: context.text.labelSmall?.copyWith(color: palette.accent, letterSpacing: 1.2),
          ),
          const SizedBox(height: IgongoSpace.xxs),
          Text(
            'Booking Guaranteed & Folio Confirmed!',
            textAlign: TextAlign.center,
            style: context.text.headlineSmall?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand),
          ),
          const SizedBox(height: IgongoSpace.sm),
          const Center(child: FlowTag('Folio ID: $kOrderNumberPlaceholder')),
          const SizedBox(height: IgongoSpace.lg),
          // The boarding pass: the top stub, the details, the tear line and the code.
          _BoardingPass(),
          const SizedBox(height: IgongoSpace.lg),
          // Actions: wallet, PDF voucher and WhatsApp share.
          FilledButton.icon(
            onPressed: () {},
            style: FilledButton.styleFrom(backgroundColor: palette.secondary, foregroundColor: palette.background),
            icon: const Icon(Icons.account_balance_wallet_outlined),
            label: const Text('Add to Apple Wallet / Google Wallet'),
          ),
          const SizedBox(height: IgongoSpace.sm),
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.download_outlined),
            label: const Text('Download PDF boarding voucher'),
          ),
          const SizedBox(height: IgongoSpace.sm),
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.share_outlined),
            label: const Text('Share voucher via WhatsApp'),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Essential arrival information.
          Text('Essential Arrival Info', style: context.text.titleLarge?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand)),
          const SizedBox(height: IgongoSpace.sm),
          const _InfoCard(
            icon: Icons.turn_sharp_right,
            title: 'Highway location & directions',
            body: 'Turn off the Masaka–Mbarara Highway at Mile 12, Biharwe. It is opposite the 1520 AD Biharwe Eclipse Monument.',
            action: 'Open in Google Maps',
          ),
          const SizedBox(height: IgongoSpace.sm),
          const _InfoCard(
            icon: Icons.phone_in_talk_outlined,
            title: 'Resort concierge hotline',
            body: '+256 — (set by the resort)',
            action: 'Call desk',
          ),
          const SizedBox(height: IgongoSpace.sm),
          const _InfoCard(
            icon: Icons.museum_outlined,
            title: 'Complimentary inclusions',
            body: 'Your pass grants unlimited access to the Eriijukiro Museum of South Western Uganda and the Traditional Ankole Homestead tour.',
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Footer actions: back to the resort home and the WhatsApp butler.
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.home_outlined), label: const Text('Resort home')),
              ),
              const SizedBox(width: IgongoSpace.sm),
              Expanded(
                child: FilledButton.icon(onPressed: () {}, icon: const Icon(Icons.chat), label: const Text('WhatsApp butler')),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// The boarding pass card: a red header with the hotel and pass title, the
/// guest and experience details, the dates, the payment status, the tear
/// line and the code area.
class _BoardingPass extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header: the hotel name, the pass title and the location.
          Container(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            decoration: BoxDecoration(
              color: palette.primary,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(IgongoRadius.lg)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(kHotelName.toUpperCase(), style: context.text.labelSmall?.copyWith(color: palette.onPrimary, letterSpacing: 1)),
                const SizedBox(height: IgongoSpace.xxs),
                Text('Digital access boarding pass',
                    style: context.text.titleLarge?.copyWith(color: palette.onPrimary, fontFamily: IgongoFonts.brand)),
                const SizedBox(height: IgongoSpace.xxs),
                Text('Biharwe, Mbarara • Western Uganda', style: context.text.bodySmall?.copyWith(color: palette.onPrimary)),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Lead guest and access tier.
                const Row(
                  children: [
                    Expanded(child: _Pair(label: 'Lead guest', value: '—')),
                    _Pair(label: 'Access tier', value: '—', end: true),
                  ],
                ),
                const SizedBox(height: IgongoSpace.md),
                // The reserved experience.
                Container(
                  padding: const EdgeInsets.all(IgongoSpace.sm),
                  decoration: BoxDecoration(color: palette.background, borderRadius: BorderRadius.circular(IgongoRadius.md)),
                  child: Row(
                    children: [
                      Icon(Icons.villa_outlined, color: palette.primary),
                      const SizedBox(width: IgongoSpace.sm),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Reserved experience', style: context.text.labelSmall?.copyWith(color: palette.accent)),
                            Text('Reserved experience name', style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: IgongoSpace.md),
                // Arrival, nights and departure.
                const Row(
                  children: [
                    Expanded(child: _Pair(label: 'Arrival', value: kTimePlaceholder)),
                    Expanded(child: _Pair(label: 'Nights', value: '—', center: true)),
                    Expanded(child: _Pair(label: 'Departure', value: kTimePlaceholder, end: true)),
                  ],
                ),
                const SizedBox(height: IgongoSpace.md),
                // Payment status: the paid deposit and the balance due at check-in.
                Container(
                  padding: const EdgeInsets.all(IgongoSpace.sm),
                  decoration: BoxDecoration(color: palette.background, borderRadius: BorderRadius.circular(IgongoRadius.md)),
                  child: Column(
                    children: [
                      _PaymentLine(label: 'Deposit paid', amount: kAmountPlaceholder, color: palette.success),
                      _PaymentLine(label: 'Due at front desk check-in', amount: kAmountPlaceholder, color: palette.primary),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // The tear line between the details and the code.
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: IgongoSpace.md),
            child: DashedDivider(),
          ),
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              children: [
                // The QR placeholder until the API issues the booking code.
                Container(
                  width: 180,
                  height: 180,
                  decoration: BoxDecoration(
                    color: palette.surfaceAlt,
                    borderRadius: BorderRadius.circular(IgongoRadius.md),
                    border: Border.all(color: palette.border),
                  ),
                  child: Icon(Icons.qr_code_2, size: 96, color: palette.textMuted),
                ),
                const SizedBox(height: IgongoSpace.sm),
                Text('Scan at front gate, museum entrance and pool reception',
                    textAlign: TextAlign.center, style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
                Text('Show this screen or print the voucher on arrival',
                    textAlign: TextAlign.center, style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                const SizedBox(height: IgongoSpace.sm),
                // The barcode placeholder, under the same label style as the code.
                Container(
                  height: IgongoSpace.xxl,
                  alignment: Alignment.center,
                  color: palette.surfaceAlt,
                  child: Text('Barcode appears when issued', style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// A small label over a value, aligned left, centre or right.
class _Pair extends StatelessWidget {
  const _Pair({required this.label, required this.value, this.center = false, this.end = false});

  final String label;
  final String value;
  final bool center;
  final bool end;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final align = center
        ? CrossAxisAlignment.center
        : (end ? CrossAxisAlignment.end : CrossAxisAlignment.start);
    return Column(
      crossAxisAlignment: align,
      children: [
        Text(label.toUpperCase(), style: context.text.labelSmall?.copyWith(color: palette.textMuted, letterSpacing: 1)),
        Text(value, style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
      ],
    );
  }
}

/// One payment line: a dot, the label and the amount.
class _PaymentLine extends StatelessWidget {
  const _PaymentLine({required this.label, required this.amount, required this.color});

  final String label;
  final String amount;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: IgongoSpace.xxs),
      child: Row(
        children: [
          Icon(Icons.circle, size: 8, color: color),
          const SizedBox(width: IgongoSpace.xs),
          Expanded(child: Text(label, style: context.text.bodySmall)),
          Text(amount, style: context.text.bodySmall?.copyWith(color: color, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

/// An arrival info card: an icon, a title, a body and an optional action label.
class _InfoCard extends StatelessWidget {
  const _InfoCard({required this.icon, required this.title, required this.body, this.action});

  final IconData icon;
  final String title;
  final String body;
  final String? action;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            backgroundColor: palette.primaryContainer,
            child: Icon(icon, color: palette.primary),
          ),
          const SizedBox(width: IgongoSpace.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                const SizedBox(height: IgongoSpace.xxs),
                Text(body, style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                if (action != null)
                  TextButton(onPressed: () {}, child: Text(action!)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
