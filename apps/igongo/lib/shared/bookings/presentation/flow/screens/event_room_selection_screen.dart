// Room selection for an event venue (design: "Room Selection").
// Covers the occasion, dates and times, guest capacity, the seating layout,
// the catering and cultural add-ons, the reservation estimate with the
// deposit, and the planner card. Amounts are placeholders until the API
// supplies them. Selections are local UI state only.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_placeholders.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_dates.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_hero.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_price_row.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_section_heading.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The event venue room selection screen.
class EventRoomSelectionScreen extends StatefulWidget {
  /// Creates the room selection screen.
  const EventRoomSelectionScreen({super.key});

  @override
  State<EventRoomSelectionScreen> createState() => _EventRoomSelectionScreenState();
}

class _EventRoomSelectionScreenState extends State<EventRoomSelectionScreen> {
  /// The picked occasion (index into [_occasions]).
  int _occasion = 0;

  /// Whether the booking runs over several days.
  bool _multiDay = false;

  /// The guest count, from 50 to 650.
  double _guests = 250;

  /// The picked seating layout (index into [_layouts]).
  int _layout = 0;

  /// The add-ons the guest ticked (indexes into [_addOns]).
  final Set<int> _addOns = {0, 1, 2, 3};

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final today = flowNextDays(1).first;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: CheckoutAppBar(
        title: 'Room Selection',
        actions: [IconButton(tooltip: 'Call', icon: Icon(Icons.call, color: palette.primary), onPressed: () {})],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Hero: the garden venue, its rating and a short line.
          const FlowHero(
            photo: 'assets/photos/hotel-gardens.jpg',
            badge: FlowTag('4.9 (140+ Celebrations)', solid: true),
            kicker: 'Mayanja Gardens & Banquet Hall',
            title: 'Celebrate in Regal Ankole Splendor',
            detail: 'Custom open-air garden lawns, pavilion terraces and bespoke cultural banqueting.',
            height: 220,
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 1: the occasion grid, two per row.
          const FlowSectionHeading(eyebrow: 'Select occasion', title: 'What are we celebrating?', meta: 'Step 1 of 4'),
          const SizedBox(height: IgongoSpace.md),
          _TileGrid(
            children: [
              for (var i = 0; i < _occasions.length; i++)
                _OptionBlock(
                  icon: _occasions[i].$1,
                  title: _occasions[i].$2,
                  detail: _occasions[i].$3,
                  selected: _occasion == i,
                  onTap: () => setState(() => _occasion = i),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Dates and times: start and end dates, arrival, and wind-down.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: Text('Dates & Schedule', style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
                    Text('Multi-day', style: context.text.labelMedium?.copyWith(color: palette.textMuted)),
                    Switch(value: _multiDay, onChanged: (v) => setState(() => _multiDay = v)),
                  ],
                ),
                const SizedBox(height: IgongoSpace.sm),
                _TileGrid(
                  children: [
                    _FieldBlock(label: 'Event date', value: _dateText(today), icon: Icons.event),
                    _FieldBlock(label: 'End date', value: _multiDay ? _dateText(today) : 'Single day', icon: Icons.event_repeat),
                    const _FieldBlock(label: 'Guest arrival', value: '11:30 AM', icon: Icons.schedule),
                    const _FieldBlock(label: 'Curfew / wind-down', value: '08:00 PM', icon: Icons.bedtime_outlined),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: guest capacity with a slider and the recommended venue.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: Text('Guest Capacity', style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
                    FlowTag('${_guests.round()} Guests', solid: true),
                  ],
                ),
                const SizedBox(height: IgongoSpace.xs),
                Text('Recommended: Mayanja Upper Amphitheatre · 50 – 650 pax',
                    style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                Slider(
                  min: 50,
                  max: 650,
                  divisions: 60,
                  value: _guests,
                  label: '${_guests.round()}',
                  onChanged: (v) => setState(() => _guests = v),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('50 Intimate', style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
                    Text('250 Royal Banquet', style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
                    Text('500+ Mega Gala', style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
                  ],
                ),
                const SizedBox(height: IgongoSpace.lg),
                Text('FLOOR & SEATING LAYOUT', style: context.text.labelSmall?.copyWith(color: palette.accent, letterSpacing: 1.2)),
                const SizedBox(height: IgongoSpace.sm),
                _TileGrid(
                  children: [
                    for (var i = 0; i < _layouts.length; i++)
                      _OptionBlock(
                        icon: _layouts[i].$1,
                        title: _layouts[i].$2,
                        detail: _layouts[i].$3,
                        selected: _layout == i,
                        onTap: () => setState(() => _layout = i),
                      ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: catering and cultural add-ons, each with a checkbox.
          const FlowSectionHeading(eyebrow: 'Catering & cultural add-ons', title: 'Catering & Cultural Add-ons'),
          const SizedBox(height: IgongoSpace.xs),
          Text('Authentic touches crafted by Igongo cultural artisans',
              style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _addOnItems.length; i++) ...[
            _AddOnRow(
              item: _addOnItems[i],
              checked: _addOns.contains(i),
              onChanged: (v) => setState(() {
                // Step 1: tick or untick this add-on; the estimate updates when wired.
                if (v) {
                  _addOns.add(i);
                } else {
                  _addOns.remove(i);
                }
              }),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the reservation estimate, with the deposit due.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('FINANCIAL BREAKDOWN', style: context.text.labelSmall?.copyWith(color: palette.accent, letterSpacing: 1.2)),
                Text('Reservation Estimate', style: context.text.titleLarge?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand)),
                const SizedBox(height: IgongoSpace.sm),
                const FlowPriceRow(label: 'Venue base hire (garden lawns & pavilion)', amount: kAmountPlaceholder),
                const FlowPriceRow(label: 'Estimated catering & setup package', amount: kAmountPlaceholder),
                const FlowPriceRow(label: 'Service charge & dedicated attendants', amount: 'Included'),
                const Divider(height: IgongoSpace.xl),
                const FlowPriceRow(label: 'Total estimated event cost', amount: kAmountPlaceholder, total: true),
                const SizedBox(height: IgongoSpace.sm),
                Container(
                  padding: const EdgeInsets.all(IgongoSpace.md),
                  decoration: BoxDecoration(
                    color: palette.primaryContainer,
                    borderRadius: BorderRadius.circular(IgongoRadius.md),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text('Required deposit to lock the date',
                            style: context.text.bodyMedium?.copyWith(color: palette.onPrimaryContainer)),
                      ),
                      Text(kAmountPlaceholder,
                          style: context.text.titleSmall?.copyWith(color: palette.primary, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
                const SizedBox(height: IgongoSpace.sm),
                Text(
                  'The balance is payable 7 days before the celebration or during on-site rehearsal.',
                  style: context.text.bodySmall?.copyWith(color: palette.textMuted),
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 5: the dedicated planner, with call and WhatsApp actions.
          CheckoutSectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Dedicated Event Planner', style: context.text.titleMedium?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand)),
                Text('Banquet manager, Igongo Cultural Centre', style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                const SizedBox(height: IgongoSpace.sm),
                Row(
                  children: [
                    Expanded(child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.call), label: const Text('Direct call'))),
                    const SizedBox(width: IgongoSpace.sm),
                    Expanded(child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.chat), label: const Text('WhatsApp desk'))),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: const FlowBottomBar(
        caption: 'Deposit due',
        amount: kAmountPlaceholder,
        buttonLabel: 'Reserve with Deposit',
        icon: Icons.lock_outline,
      ),
    );
  }

  /// Formats a date as "Sat, Oct 18, 2025" for the date fields.
  String _dateText(DateTime d) => '${flowWeekdayShort(d)}, ${flowMonthShort(d)} ${d.day}, ${d.year}';

  /// The occasion choices: icon, title and detail.
  static const List<(IconData, String, String)> _occasions = [
    (Icons.favorite_outline, 'Kuhingira & Wedding', 'Traditional & modern'),
    (Icons.groups_outlined, 'Corporate Retreat', 'Hall + breakouts'),
    (Icons.wine_bar_outlined, 'Gala & Banquet', 'Evening elegance'),
    (Icons.family_restroom, 'Family Gathering', 'Intimate gardens'),
  ];

  /// The seating layouts: icon, title and detail.
  static const List<(IconData, String, String)> _layouts = [
    (Icons.table_restaurant_outlined, 'Banquet rounds', '10 pax/table'),
    (Icons.chair_outlined, 'Theatre staging', 'Optimal viewing'),
    (Icons.local_bar_outlined, 'Garden cocktail', 'High-top tables'),
    (Icons.co_present_outlined, 'U-shape board', 'Conferences'),
  ];

  /// The catering and cultural add-on rows: title, detail, and a tag if any.
  static const List<_AddOnItem> _addOnItems = [
    _AddOnItem('Ankole Royal Buffet Feast', 'Slow-smoked local tender beef, matooke stewed in earthen pots, kaimati and fresh plantation salads.', 'Chef signature'),
    _AddOnItem('Live Eshabwe Master Station', 'Traditional clarified ghee and rock salt preparation, prepared live by elder Ankole culinary matrons.', null),
    _AddOnItem('Ekitaguriro Cultural Troupe', '8-piece traditional drumming, long-horn cow honour dances, flutes and ceremonial entrance procession.', null),
    _AddOnItem('Pro Audio & Ambient Lighting Rig', 'Dual cordless lapel mics, outdoor speakers tuned for garden acoustics, warm string tree lighting.', null),
  ];
}

/// One catering or cultural add-on.
class _AddOnItem {
  const _AddOnItem(this.title, this.detail, this.tag);

  final String title;
  final String detail;
  final String? tag;
}

/// A checkbox row for one add-on, with its amount placeholder.
class _AddOnRow extends StatelessWidget {
  const _AddOnRow({required this.item, required this.checked, required this.onChanged});

  final _AddOnItem item;
  final bool checked;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the card with a checkbox, the name and the amount on one line.
    return CheckoutSectionCard(
      padding: const EdgeInsets.all(IgongoSpace.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Checkbox(value: checked, onChanged: (v) => onChanged(v ?? false), activeColor: palette.primary),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.title, style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                const SizedBox(height: IgongoSpace.xxs),
                Text(item.detail, style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                if (item.tag != null) ...[
                  const SizedBox(height: IgongoSpace.xs),
                  FlowTag(item.tag!, solid: true),
                ],
              ],
            ),
          ),
          const SizedBox(width: IgongoSpace.sm),
          Text(kAmountPlaceholder, style: context.text.labelLarge?.copyWith(color: palette.primary, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

/// A two-column grid of equal blocks, used for occasions, layouts and fields.
class _TileGrid extends StatelessWidget {
  const _TileGrid({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    // Step 1: lay the blocks out in pairs, each row the same height.
    final rows = <Widget>[];
    for (var i = 0; i < children.length; i += 2) {
      final pair = children.skip(i).take(2).toList();
      rows.add(
        IntrinsicHeight(
          child: Row(
            children: [
              for (final w in pair) ...[Expanded(child: w), const SizedBox(width: IgongoSpace.sm)],
              if (pair.length == 1) const Expanded(child: SizedBox()),
            ],
          ),
        ),
      );
      rows.add(const SizedBox(height: IgongoSpace.sm));
    }
    return Column(children: rows);
  }
}

/// A selectable block with an icon, title and detail.
class _OptionBlock extends StatelessWidget {
  const _OptionBlock({required this.icon, required this.title, required this.detail, required this.selected, required this.onTap});

  final IconData icon;
  final String title;
  final String detail;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final foreground = selected ? palette.onPrimary : palette.text;
    final muted = selected ? palette.onPrimary : palette.textMuted;
    return Material(
      color: selected ? palette.primary : palette.surface,
      borderRadius: BorderRadius.circular(IgongoRadius.lg),
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(IgongoSpace.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: selected ? palette.onPrimary : palette.primary),
              const SizedBox(height: IgongoSpace.xs),
              Text(title, style: context.text.titleSmall?.copyWith(color: foreground, fontWeight: FontWeight.w700)),
              Text(detail, style: context.text.bodySmall?.copyWith(color: muted)),
            ],
          ),
        ),
      ),
    );
  }
}

/// A read-only labelled field (date or time) in the dates block.
class _FieldBlock extends StatelessWidget {
  const _FieldBlock({required this.label, required this.value, required this.icon});

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(
        color: palette.background,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xxs),
          Row(
            children: [
              Icon(icon, size: 16, color: palette.primary),
              const SizedBox(width: IgongoSpace.xs),
              Expanded(child: Text(value, style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w600))),
            ],
          ),
        ],
      ),
    );
  }
}
