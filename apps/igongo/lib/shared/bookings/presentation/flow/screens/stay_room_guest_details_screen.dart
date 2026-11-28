// Room choice for a stay (design: "Guest Details", room cards version).
// Shows the stay duration, the guests, the room options, what is included,
// the optional cottage enhancements, the reservation summary and the deposit
// choice. Amounts are placeholders until the API supplies them. Selections
// are local UI state only.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_placeholders.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_choice_tile.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_dates.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_hero.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_price_row.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_section_heading.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The stay room-choice screen with room cards.
class StayRoomGuestDetailsScreen extends StatefulWidget {
  /// Creates the room-choice screen.
  const StayRoomGuestDetailsScreen({super.key});

  @override
  State<StayRoomGuestDetailsScreen> createState() => _StayRoomGuestDetailsScreenState();
}

class _StayRoomGuestDetailsScreenState extends State<StayRoomGuestDetailsScreen> {
  /// The picked room (index into [_rooms]). The first is picked, as in the design.
  int _room = 0;

  /// The enhancements ticked (indexes into [_enhancements]).
  final Set<int> _extras = {0};

  /// The deposit option (0 pay half now, 1 pay in full, 2 hold and pay at the front desk).
  int _deposit = 0;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final checkIn = flowNextDays(1).first;
    final checkOut = DateTime(checkIn.year, checkIn.month, checkIn.day + 2);
    return Scaffold(
      backgroundColor: palette.background,
      appBar: CheckoutAppBar(
        title: 'Guest Details',
        actions: [IconButton(tooltip: 'Call', icon: Icon(Icons.call, color: palette.primary), onPressed: () {})],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Hero: the cottages, the signature stay, and the starting price placeholder.
          const FlowHero(
            photo: 'assets/photos/hotel-cottages.jpg',
            kicker: 'Igongo signature stays',
            title: 'Royal Thatched Cottages & Suites',
            detail: 'From $kAmountPlaceholder',
            badge: FlowTag('Heritage sanctuary', solid: true),
            height: 200,
          ),
          const SizedBox(height: IgongoSpace.lg),
          // The stay: check-in, check-out, guests and bed request.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: Text('Stay duration', style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700))),
                    const FlowTag('2 nights'),
                  ],
                ),
                const SizedBox(height: IgongoSpace.sm),
                Row(
                  children: [
                    Expanded(child: _DateBlock(label: 'Check-in', date: checkIn, time: 'From 2:00 PM')),
                    const SizedBox(width: IgongoSpace.sm),
                    Expanded(child: _DateBlock(label: 'Check-out', date: checkOut, time: 'Until 11:00 AM')),
                  ],
                ),
                const SizedBox(height: IgongoSpace.sm),
                Row(
                  children: [
                    Icon(Icons.group_outlined, color: palette.primary, size: 20),
                    const SizedBox(width: IgongoSpace.xs),
                    Expanded(child: Text('2 adults, 0 children', style: context.text.bodyMedium)),
                    OutlinedButton(onPressed: () {}, child: const Text('Modify')),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 1: the room cards, each with a tag, bed, size and price.
          const FlowSectionHeading(eyebrow: 'Select sanctuary room', title: 'Select Sanctuary Room', meta: '3 options'),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _rooms.length; i++) ...[
            _RoomCard(
              room: _rooms[i],
              selected: _room == i,
              onTap: () => setState(() => _room = i),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 2: what the stay includes, in a 2 by 2 grid.
          const FlowSectionHeading(eyebrow: 'Included', title: 'Included With Your Stay'),
          const SizedBox(height: IgongoSpace.md),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: IgongoSpace.sm,
            crossAxisSpacing: IgongoSpace.sm,
            childAspectRatio: 2.4,
            children: [
              for (final (icon, title, detail) in _included)
                CheckoutSectionCard(
                  padding: const EdgeInsets.all(IgongoSpace.sm),
                  child: Row(
                    children: [
                      Icon(icon, color: palette.primary, size: 20),
                      const SizedBox(width: IgongoSpace.xs),
                      Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(title, style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
                            Text(detail, style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: optional cottage enhancements with checkboxes.
          const FlowSectionHeading(eyebrow: 'Optional', title: 'Cottage Enhancements'),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _enhancements.length; i++) ...[
            FlowChoiceTile(
              title: _enhancements[i].$1,
              subtitle: _enhancements[i].$2,
              amount: kAmountPlaceholder,
              checkbox: true,
              selected: _extras.contains(i),
              onTap: () => setState(() {
                // Step 1: tick or untick this enhancement.
                if (_extras.contains(i)) {
                  _extras.remove(i);
                } else {
                  _extras.add(i);
                }
              }),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 4: the reservation summary, then the deposit choice.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Reservation Summary', style: context.text.titleMedium?.copyWith(fontFamily: IgongoFonts.brand)),
                const SizedBox(height: IgongoSpace.sm),
                const FlowPriceRow(label: 'Room stay', amount: kAmountPlaceholder),
                const FlowPriceRow(label: 'Hotel service tax & tourism levy', amount: kAmountPlaceholder),
                const FlowPriceRow(label: 'Selected enhancements', amount: kAmountPlaceholder),
                const Divider(height: IgongoSpace.xl),
                const FlowPriceRow(label: 'Total stay value', amount: kAmountPlaceholder, total: true),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          Text('Deposit payment option', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          for (var i = 0; i < _depositOptions.length; i++) ...[
            FlowChoiceTile(
              title: _depositOptions[i].$1,
              subtitle: _depositOptions[i].$2,
              amount: kAmountPlaceholder,
              selected: _deposit == i,
              onTap: () => setState(() => _deposit = i),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Special requests and group bookings.
          CheckoutSectionCard(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Special requests or group booking?', style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                      Text('Call reservations', style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right, color: palette.primary),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: const FlowBottomBar(
        caption: 'Due today',
        amount: kAmountPlaceholder,
        buttonLabel: 'Pay Deposit',
        icon: Icons.lock_outline,
      ),
    );
  }

  /// The room options: name, tag, description, bed, and size.
  static const List<_Room> _rooms = [
    _Room('Traditional Ankole Cottage', 'Best seller', 'Private veranda', 'Handcrafted eucalyptus beams, private plunge pool access and lush valley views.', 'King bed', '52 m²'),
    _Room('Deluxe Hillside Suite', 'Hillside panoramic', null, 'Elevated sun deck facing the Biharwe 1520 AD Eclipse monument ridge.', 'King or twin', '68 m²'),
    _Room('Executive Heritage Family Villa', '2 bedrooms', null, 'Two en-suite bedrooms, a private garden fire-pit and a VIP lounge butler.', 'Up to 5 guests', '110 m²'),
  ];

  /// The included items: icon, title and detail.
  static const List<(IconData, String, String)> _included = [
    (Icons.restaurant_outlined, 'Organic buffet', 'Fresh Ankole breakfast'),
    (Icons.wifi, 'High-speed Wi-Fi', 'Cottage-wide fibre'),
    (Icons.pool_outlined, 'Swimming pool', 'Complimentary access'),
    (Icons.museum_outlined, 'Museum pass', 'Eriijukiro Museum entry'),
  ];

  /// The optional enhancements: title and detail.
  static const List<(String, String)> _enhancements = [
    ('Fireplace firewood & cedar setup', 'Evening hearth tending service'),
    ('Sparkling wine on arrival', 'Chilled bottle and artisanal fruit plate'),
    ('Private veranda candlelit dinner', 'Exclusive three-course chef set menu'),
  ];

  /// The deposit options: title and detail.
  static const List<(String, String)> _depositOptions = [
    ('Pay 50% deposit now', 'Balance payable upon arrival'),
    ('Pay full amount now', 'Express fast-track check-in'),
    ('Hold & pay at front desk', 'Free cancellation up to 48 hours'),
  ];
}

/// One room option: name, tag, detail, bed and size.
class _Room {
  const _Room(this.name, this.tag, this.secondTag, this.detail, this.bed, this.size);

  final String name;
  final String tag;
  final String? secondTag;
  final String detail;
  final String bed;
  final String size;
}

/// A room card: the tag, name, detail, bed and size, and the price placeholder.
class _RoomCard extends StatelessWidget {
  const _RoomCard({required this.room, required this.selected, required this.onTap});

  final _Room room;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: palette.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        side: BorderSide(color: selected ? palette.primary : palette.border, width: selected ? 1.5 : 1),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(IgongoSpace.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  FlowTag(room.tag, solid: selected),
                  if (room.secondTag != null) ...[const SizedBox(width: IgongoSpace.xs), FlowTag(room.secondTag!)],
                  const Spacer(),
                  Icon(selected ? Icons.check_circle : Icons.radio_button_unchecked,
                      color: selected ? palette.primary : palette.textMuted),
                ],
              ),
              const SizedBox(height: IgongoSpace.sm),
              Text(room.name, style: context.text.titleMedium?.copyWith(fontFamily: IgongoFonts.brand, color: palette.primary)),
              const SizedBox(height: IgongoSpace.xxs),
              Text(room.detail, style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
              const SizedBox(height: IgongoSpace.sm),
              Row(
                children: [
                  Icon(Icons.bed_outlined, size: 16, color: palette.textMuted),
                  const SizedBox(width: IgongoSpace.xxs),
                  Text(room.bed, style: context.text.labelMedium),
                  const SizedBox(width: IgongoSpace.md),
                  Icon(Icons.crop_free, size: 16, color: palette.textMuted),
                  const SizedBox(width: IgongoSpace.xxs),
                  Text(room.size, style: context.text.labelMedium),
                  const Spacer(),
                  Text('$kAmountPlaceholder / night',
                      style: context.text.titleSmall?.copyWith(color: palette.primary, fontWeight: FontWeight.w700)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A date and time block for check-in or check-out.
class _DateBlock extends StatelessWidget {
  const _DateBlock({required this.label, required this.date, required this.time});

  final String label;
  final DateTime date;
  final String time;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: palette.background, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label.toUpperCase(), style: context.text.labelSmall?.copyWith(color: palette.textMuted, letterSpacing: 1)),
          Text('${flowWeekdayShort(date)}, ${date.day} ${flowMonthShort(date)}',
              style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w700)),
          Text(time, style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
        ],
      ),
    );
  }
}
