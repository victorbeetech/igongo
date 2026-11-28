// Event venue booking (design: "Room Selection"), live from the events API.
// The venue is the events' enquiry offering. Occasion, layout, guest count,
// date, and the add-ons (the events' stock offerings) are sent with the request
// as notes. Events are priced by the team, so the screen shows "Quoted" and
// sends a request: the deposit comes after the quote.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/application/bookings_providers.dart';
import 'package:igongo/shared/bookings/domain/booking_place.dart';
import 'package:igongo/shared/bookings/domain/offering.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_dates.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_hero.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_offerings_scope.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_price_row.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_section_heading.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_submit.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/format/day_key.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The event venue booking screen, live from the events API.
class EventRoomSelectionScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [place] (the events module).
  const EventRoomSelectionScreen({super.key, required this.place});

  /// The events module.
  final BookingPlace place;

  @override
  ConsumerState<EventRoomSelectionScreen> createState() => _EventRoomSelectionScreenState();
}

class _EventRoomSelectionScreenState extends ConsumerState<EventRoomSelectionScreen> {
  /// The picked occasion and layout (indexes into [_occasions] and [_layouts]).
  int _occasion = 0;
  int _layout = 0;

  /// The event day (the first day offered until the guest picks another).
  DateTime _day = flowNextDays(1).first;

  /// Whether the event runs over several days (sent as a note).
  bool _multiDay = false;

  /// The guest count, from 50 to 650 (sent as a note: an enquiry is one unit).
  double _guests = 250;

  /// The add-ons ticked (indexes into the events' stock offerings).
  final Set<int> _addOns = {};

  /// True while the request is being sent.
  bool _busy = false;

  /// The notes sent with the request: the occasion, layout, guest count, multi-day and add-ons.
  String _notes(List<Offering> addOns) => [
    'Occasion: ${_occasions[_occasion].$2}',
    'Layout: ${_layouts[_layout].$2}',
    'Guests: ${_guests.round()}',
    if (_multiDay) 'Multi-day event',
    if (_addOns.isNotEmpty) 'Add-ons: ${[for (final i in _addOns) addOns[i].name].join(', ')}',
  ].join('. ');

  /// Sends the request for the picked venue, the day and the notes; the events team quotes it.
  Future<void> _send(Offering venue, List<Offering> addOns) async {
    setState(() => _busy = true);
    await submitFlowBooking(
      context,
      ref,
      widget.place,
      lines: [(offering: venue, units: 1)],
      date: dayKey(_day),
      notes: _notes(addOns),
    );
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    // Step 1: the venues (enquiry offerings) and the add-ons (stock) from the events API.
    final all = ref.watch(offeringsProvider(widget.place)).valueOrNull ?? const <Offering>[];
    final venues = [
      for (final o in all)
        if (o.kind == 'enquiry') o,
    ];
    final addOns = [
      for (final o in all)
        if (o.kind == 'stock') o,
    ];
    final venue = venues.isEmpty ? null : venues.first;
    final palette = context.palette;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: const CheckoutAppBar(title: 'Room Selection'),
      bottomNavigationBar: venue == null
          ? null
          : FlowBottomBar(
              caption: 'Quote',
              amount: 'After quote',
              buttonLabel: 'Send request',
              icon: Icons.lock_outline,
              onPressed: _busy ? null : () => _send(venue, addOns),
            ),
      body: FlowOfferingsScope(
        place: widget.place,
        emptyText: 'No event venues are open for requests yet.',
        builder: (context, _, _) => venue == null
            ? const Center(child: Text('No event venues are open for requests yet.'))
            : _body(venue, addOns),
      ),
    );
  }

  /// The screen body, once the venues load.
  Widget _body(Offering venue, List<Offering> addOns) {
    final palette = context.palette;
    return ListView(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xxl),
      children: [
        // Hero: the garden venue (the venue's own name and description from the API).
        FlowHero(
          photo: 'assets/photos/hotel-gardens.jpg',
          badge: const FlowTag('Event request', solid: true),
          kicker: venue.name,
          title: 'Celebrate in Regal Ankole Splendor',
          detail: venue.description ?? '',
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
        // Dates: the event day (tap to change) and whether it runs several days.
        CheckoutSectionCard(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Dates & Schedule',
                      style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                    ),
                  ),
                  Text('Multi-day', style: context.text.labelMedium?.copyWith(color: palette.textMuted)),
                  Switch(value: _multiDay, onChanged: (v) => setState(() => _multiDay = v)),
                ],
              ),
              const SizedBox(height: IgongoSpace.sm),
              _FieldBlock(
                label: 'Event date',
                value: _dateText(_day),
                icon: Icons.event,
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _day,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 730)),
                  );
                  if (picked != null) setState(() => _day = picked);
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: IgongoSpace.md),
        // Step 2: guest count with a slider, then the seating layout.
        CheckoutSectionCard(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Guest Capacity',
                      style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                    ),
                  ),
                  FlowTag('${_guests.round()} Guests', solid: true),
                ],
              ),
              const SizedBox(height: IgongoSpace.xs),
              Text(
                '${venue.name} · 50 – 650 guests',
                style: context.text.bodySmall?.copyWith(color: palette.textMuted),
              ),
              Slider(
                min: 50,
                max: 650,
                divisions: 60,
                value: _guests,
                label: '${_guests.round()}',
                onChanged: (v) => setState(() => _guests = v),
              ),
              const SizedBox(height: IgongoSpace.lg),
              Text(
                'FLOOR & SEATING LAYOUT',
                style: context.text.labelSmall?.copyWith(color: palette.accent, letterSpacing: 1.2),
              ),
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
        // Step 3: the add-ons the events team offers (stock items), each ticked on or off.
        if (addOns.isNotEmpty) ...[
          const FlowSectionHeading(eyebrow: 'Catering & cultural add-ons', title: 'Catering & Cultural Add-ons'),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < addOns.length; i++) ...[
            _AddOnRow(
              item: _AddOnItem(addOns[i].name, addOns[i].description ?? '', null),
              checked: _addOns.contains(i),
              onChanged: (v) => setState(() => v ? _addOns.add(i) : _addOns.remove(i)),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.lg),
        ],
        // Step 4: the quote is sent by the events team; nothing is charged here.
        CheckoutSectionCard(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Reservation Quote',
                style: context.text.titleLarge?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand),
              ),
              const SizedBox(height: IgongoSpace.sm),
              const FlowPriceRow(label: 'Venue hire, catering and setup', amount: 'Quoted'),
              const FlowPriceRow(label: 'Deposit to lock the date', amount: 'After quote'),
              const SizedBox(height: IgongoSpace.sm),
              Text(
                'Our events team replies with a quote. The deposit is due once you accept it.',
                style: context.text.bodySmall?.copyWith(color: palette.textMuted),
              ),
            ],
          ),
        ),
      ],
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
}

/// One add-on row's content: its title, detail and an optional tag.
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
                if (item.tag != null) ...[const SizedBox(height: IgongoSpace.xs), FlowTag(item.tag!, solid: true)],
              ],
            ),
          ),
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
  const _OptionBlock({
    required this.icon,
    required this.title,
    required this.detail,
    required this.selected,
    required this.onTap,
  });

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
              Text(
                title,
                style: context.text.titleSmall?.copyWith(color: foreground, fontWeight: FontWeight.w700),
              ),
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
  const _FieldBlock({required this.label, required this.value, required this.icon, this.onTap});

  final String label;
  final String value;
  final IconData icon;

  /// Opens the field's picker when tapped (null for a read-only field).
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // The block is tappable only when it has a picker.
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(IgongoRadius.md),
      child: Container(
        padding: const EdgeInsets.all(IgongoSpace.md),
        decoration: BoxDecoration(color: palette.background, borderRadius: BorderRadius.circular(IgongoRadius.md)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
            const SizedBox(height: IgongoSpace.xxs),
            Row(
              children: [
                Icon(icon, size: 16, color: palette.primary),
                const SizedBox(width: IgongoSpace.xs),
                Expanded(
                  child: Text(value, style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
