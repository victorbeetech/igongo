// Step 1 of checkout: review the order. Shows where it goes (Veranda, Cottage
// Room or Takeaway), the service location, the items, the kitchen request and
// the bill summary. Amounts and items are placeholders until the cart is wired.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import 'checkout_app_bar.dart';
import 'checkout_placeholders.dart';
import 'checkout_section_card.dart';
import 'checkout_step_bar.dart';
import 'guest_details_screen.dart';

/// Where the order is eaten: the three choices at the top of the review.
enum ServiceArea {
  /// The veranda of the guest's cottage.
  veranda,

  /// The guest's cottage room.
  cottageRoom,

  /// Takeaway pickup.
  takeaway,
}

/// The order review screen (step 1 of 3).
class BookingReviewScreen extends StatefulWidget {
  /// Creates the review screen.
  const BookingReviewScreen({super.key});

  @override
  State<BookingReviewScreen> createState() => _BookingReviewScreenState();
}

class _BookingReviewScreenState extends State<BookingReviewScreen> {
  /// The service area the guest picked (Veranda by default, as in the design).
  ServiceArea _area = ServiceArea.veranda;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: const CheckoutAppBar(title: 'Booking Review'),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Step 1: progress through the three checkout steps.
          const CheckoutStepBar(step: 1, stepName: 'Fulfilment & review'),
          const SizedBox(height: IgongoSpace.lg),
          // Step 2: the service-area picker (Veranda, Cottage Room, Takeaway).
          _AreaPicker(selected: _area, onChanged: (a) => setState(() => _area = a)),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: where the food goes, with the estimated preparation time.
          _ServiceLocationCard(area: _area),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the items as cards (photo, name, description, tag, quantity).
          Text('Order items', style: context.text.titleMedium),
          const SizedBox(height: IgongoSpace.sm),
          const _ItemCard(),
          const SizedBox(height: IgongoSpace.lg),
          // Step 5: a note for the kitchen (placeholder text until notes are wired).
          const _KitchenRequest(),
          const SizedBox(height: IgongoSpace.lg),
          // Step 6: the bill summary with placeholder amounts.
          const _BillSummary(),
        ],
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
        child: IgongoButton(
          label: 'Continue to Guest Details',
          icon: Icons.arrow_forward,
          expand: true,
          // Step 7: go to step 2 (guest details).
          onPressed: () =>
              Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GuestDetailsScreen())),
        ),
      ),
    );
  }
}

/// The three-way service-area picker, as a row of selectable tiles.
class _AreaPicker extends StatelessWidget {
  /// Creates the picker with the [selected] area.
  const _AreaPicker({required this.selected, required this.onChanged});

  /// The area currently chosen.
  final ServiceArea selected;

  /// Called with the area the guest taps.
  final ValueChanged<ServiceArea> onChanged;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: one tile per area, each with its icon and label.
    const options = [
      (ServiceArea.veranda, Icons.deck_outlined, 'Veranda'),
      (ServiceArea.cottageRoom, Icons.cottage_outlined, 'Cottage Room'),
      (ServiceArea.takeaway, Icons.takeout_dining_outlined, 'Takeaway'),
    ];
    return Row(
      children: [
        for (final (area, icon, label) in options)
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 3),
              child: Material(
                color: area == selected ? palette.surface : palette.surfaceAlt,
                borderRadius: BorderRadius.circular(IgongoRadius.md),
                child: InkWell(
                  borderRadius: BorderRadius.circular(IgongoRadius.md),
                  onTap: () => onChanged(area),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: IgongoSpace.sm),
                    child: Column(
                      children: [
                        Icon(icon, color: area == selected ? palette.primary : palette.textMuted),
                        const SizedBox(height: IgongoSpace.xxs),
                        Text(
                          label,
                          style: context.text.labelMedium?.copyWith(
                            color: area == selected ? palette.primary : palette.textMuted,
                            fontWeight: area == selected ? FontWeight.w700 : FontWeight.w400,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

/// The service location and the estimated preparation time.
class _ServiceLocationCard extends StatelessWidget {
  /// Creates the card for the chosen [area].
  const _ServiceLocationCard({required this.area});

  /// The chosen service area (the location name comes from the API later).
  final ServiceArea area;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.place_outlined, color: palette.primary),
              const SizedBox(width: IgongoSpace.sm),
              Expanded(
                child: Text('SERVICE LOCATION', style: context.text.labelSmall?.copyWith(color: palette.accent)),
              ),
              // Step 1: an Edit action (wired later with the area's choices).
              TextButton(onPressed: () {}, child: const Text('Edit')),
            ],
          ),
          Text(
            area == ServiceArea.takeaway
                ? 'Takeaway pickup'
                : 'Cottage 7 ${area == ServiceArea.veranda ? 'Veranda' : 'Room'}',
            style: context.text.titleMedium,
          ),
          const SizedBox(height: IgongoSpace.sm),
          // Step 2: the preparation estimate row, with a placeholder time.
          Row(
            children: [
              Icon(Icons.timer_outlined, size: 18, color: palette.textMuted),
              const SizedBox(width: IgongoSpace.sm),
              Expanded(child: Text('Est. preparation & setup', style: context.text.bodyMedium)),
              Text(kTimePlaceholder, style: context.text.labelLarge?.copyWith(color: palette.primary)),
            ],
          ),
        ],
      ),
    );
  }
}

/// One order line as a card: photo, name, description, tag and quantity.
class _ItemCard extends StatelessWidget {
  /// Creates the placeholder item card.
  const _ItemCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      padding: const EdgeInsets.all(IgongoSpace.sm),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 1: the dish photo (placeholder frame until the menu supplies one).
          ClipRRect(
            borderRadius: BorderRadius.circular(IgongoRadius.md),
            child: const SizedBox(width: 92, height: 92, child: _DishFrame()),
          ),
          const SizedBox(width: IgongoSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Item name', style: context.text.titleSmall),
                Text('Item description', style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                const SizedBox(height: IgongoSpace.xs),
                Row(
                  children: [
                    Text(kAmountPlaceholder, style: context.text.labelLarge?.copyWith(color: palette.primary)),
                    const Spacer(),
                    Text('Qty: —', style: context.text.labelMedium),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Placeholder dish photo: uses the app's own sample food photo.
class _DishFrame extends StatelessWidget {
  /// Creates the frame.
  const _DishFrame();

  @override
  Widget build(BuildContext context) => Image.asset('assets/photos/food-fish.jpg', fit: BoxFit.cover);
}

/// The kitchen request box (placeholder text until notes are wired).
class _KitchenRequest extends StatelessWidget {
  /// Creates the box.
  const _KitchenRequest();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Kitchen & preparation request', style: context.text.titleSmall),
          const SizedBox(height: IgongoSpace.sm),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(IgongoSpace.md),
            decoration: BoxDecoration(color: palette.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
            child: Text(
              'Notes you add will appear here',
              style: context.text.bodyMedium?.copyWith(color: palette.textMuted),
            ),
          ),
        ],
      ),
    );
  }
}

/// The bill summary: subtotal, service charge, delivery and the total (all placeholders).
class _BillSummary extends StatelessWidget {
  /// Creates the summary.
  const _BillSummary();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: one row per line of the bill, with the label on the left and the amount on the right.
    Widget row(String label, String value, {bool strong = false}) => Padding(
      padding: const EdgeInsets.symmetric(vertical: IgongoSpace.xs),
      child: Row(
        children: [
          Expanded(child: Text(label, style: context.text.bodyMedium)),
          Text(
            value,
            style: (strong ? context.text.titleMedium : context.text.bodyMedium)?.copyWith(
              color: strong ? palette.primary : null,
            ),
          ),
        ],
      ),
    );
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Bill summary', style: context.text.titleMedium),
          const SizedBox(height: IgongoSpace.sm),
          row('Items subtotal', kAmountPlaceholder),
          row('Service charge', kAmountPlaceholder),
          row('Delivery & tray setup', 'Complimentary'),
          const Divider(height: IgongoSpace.lg),
          row('Total', kAmountPlaceholder, strong: true),
          Text('Taxes & resort levy inclusive', style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
        ],
      ),
    );
  }
}
