// Pool passes and sessions (design: "Select Accommodation").
// Covers the pass type, the date and session, the swimmer passes, the
// poolside add-ons, and the pricing with the deposit. Amounts are
// placeholders until the API supplies them. Selections are local UI state only.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_placeholders.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_choice_tile.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_counter.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_date_strip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_dates.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_hero.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_price_row.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_section_heading.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_select_chip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The pool pass booking screen.
class PoolAccommodationScreen extends StatefulWidget {
  /// Creates the pool screen.
  const PoolAccommodationScreen({super.key});

  @override
  State<PoolAccommodationScreen> createState() => _PoolAccommodationScreenState();
}

class _PoolAccommodationScreenState extends State<PoolAccommodationScreen> {
  /// The picked pass (index into [_passes]).
  int _pass = 0;

  /// The picked day, and the picked session (index into [_sessions]).
  late DateTime _day = flowNextDays(5).first;
  int _session = 0;

  /// Swimmer passes: adults and children.
  int _adults = 2;
  int _children = 0;

  /// The poolside add-ons ticked (indexes into [_addOns]).
  final Set<int> _addOns = {};

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final days = flowNextDays(5);
    return Scaffold(
      backgroundColor: palette.background,
      appBar: CheckoutAppBar(
        title: 'Select Accommodation',
        actions: [IconButton(tooltip: 'Call', icon: Icon(Icons.call, color: palette.primary), onPressed: () {})],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Hero: the pool, the resort and the water temperature.
          const FlowHero(
            photo: 'assets/photos/hotel-pool.jpg',
            kicker: 'Igongo Country Resort',
            title: 'Olympic Pool & Sun Cabanas',
            detail: 'A refreshing hillside aquatic sanctuary overlooking the Biharwe Eclipse valley.',
            badge: FlowTag('Lush Garden Leisure', solid: true),
            trailingBadge: FlowTag('Water temperature shown by API'),
            height: 220,
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 1: the pass types, each priced per day or per package.
          const FlowSectionHeading(eyebrow: 'Step 1 • Experience', title: 'Select Experience', meta: 'Per day & session'),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _passes.length; i++) ...[
            FlowChoiceTile(
              title: _passes[i].$1,
              subtitle: _passes[i].$2,
              tags: [if (_passes[i].$3 != null) FlowTag(_passes[i].$3!)],
              amount: kAmountPlaceholder,
              selected: _pass == i,
              onTap: () => setState(() => _pass = i),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the day and the session time.
          const FlowSectionHeading(eyebrow: 'Step 2 • Date & time session', title: 'Choose Your Session'),
          const SizedBox(height: IgongoSpace.md),
          FlowDateStrip(days: days, selected: _day, onChanged: (d) => setState(() => _day = d)),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _sessions.length; i++) ...[
            FlowChoiceTile(
              title: _sessions[i].$1,
              subtitle: _sessions[i].$2,
              selected: _session == i,
              onTap: () => setState(() => _session = i),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 3: swimmer passes with counters.
          const FlowSectionHeading(eyebrow: 'Step 3 • Swimmer passes', title: 'Swimmer Passes'),
          const SizedBox(height: IgongoSpace.md),
          FlowCounter(
            label: 'Adults',
            detail: 'Ages 13 and above',
            value: _adults,
            max: 20,
            onChanged: (v) => setState(() => _adults = v),
          ),
          const SizedBox(height: IgongoSpace.sm),
          FlowCounter(
            label: 'Children',
            detail: 'Under 12 years',
            value: _children,
            max: 20,
            onChanged: (v) => setState(() => _children = v),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: poolside add-ons, each a checkbox at an a-la-carte price.
          const FlowSectionHeading(eyebrow: 'Step 4 • Refreshments', title: 'Poolside Refreshment Add-ons', meta: 'A la carte'),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _addOnItems.length; i++) ...[
            FlowChoiceTile(
              title: _addOnItems[i].$1,
              subtitle: _addOnItems[i].$2,
              amount: kAmountPlaceholder,
              checkbox: true,
              selected: _addOns.contains(i),
              onTap: () => setState(() {
                // Step 1: tick or untick this add-on.
                if (_addOns.contains(i)) {
                  _addOns.remove(i);
                } else {
                  _addOns.add(i);
                }
              }),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 5: the pricing summary, the deposit and the fast deposit channels.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Pricing & Deposit', style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                const SizedBox(height: IgongoSpace.sm),
                const FlowPriceRow(label: 'Selected pool passes', amount: kAmountPlaceholder),
                const FlowPriceRow(label: 'Refreshment add-ons', amount: kAmountPlaceholder),
                const Divider(height: IgongoSpace.xl),
                const FlowPriceRow(label: 'Estimated total', amount: kAmountPlaceholder, total: true),
                const SizedBox(height: IgongoSpace.sm),
                Container(
                  padding: const EdgeInsets.all(IgongoSpace.md),
                  decoration: BoxDecoration(color: palette.primaryContainer, borderRadius: BorderRadius.circular(IgongoRadius.md)),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text('Required deposit. Holds your lounger and locker today.',
                            style: context.text.bodyMedium?.copyWith(color: palette.onPrimaryContainer)),
                      ),
                      Text(kAmountPlaceholder, style: context.text.titleSmall?.copyWith(color: palette.primary, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
                const SizedBox(height: IgongoSpace.md),
                Text('Fast deposit channels', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
                const SizedBox(height: IgongoSpace.xs),
                const Row(
                  children: [
                    Expanded(child: FlowSelectChip(label: 'MTN MoMo', selected: false, onTap: _noop)),
                    SizedBox(width: IgongoSpace.xs),
                    Expanded(child: FlowSelectChip(label: 'Airtel Money', selected: false, onTap: _noop)),
                    SizedBox(width: IgongoSpace.xs),
                    Expanded(child: FlowSelectChip(label: 'Room folio', selected: false, onTap: _noop)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // The pool butler action.
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.call),
            label: const Text('Call pool butler · Inquire for a private sundowner'),
          ),
        ],
      ),
      bottomNavigationBar: const FlowBottomBar(
        caption: 'Due today (deposit)',
        amount: kAmountPlaceholder,
        buttonLabel: 'Confirm Booking',
        icon: Icons.lock_outline,
      ),
    );
  }

  /// A no-op for chips that are not wired yet.
  static void _noop() {}

  /// The pool passes: title, detail and an optional tag.
  static const List<(String, String, String?)> _passes = [
    ('Full day leisure swim pass', 'Includes heated towel, poolside teak lounger and garden shower access', 'Popular'),
    ('VIP private shade cabana', 'Private cushioned daybed, fresh seasonal fruit platter, pool butler', 'Regal touch'),
    ('Family splash & dine package', 'Includes 2 adult passes, 2 child passes, poolside lunch basket and soft drinks', null),
  ];

  /// The swim sessions: title and time.
  static const List<(String, String)> _sessions = [
    ('Morning serenity', '8:00 AM – 12:00 PM • Crisp, uncrowded waters'),
    ('Afternoon sun & cocktails', '12:30 PM – 4:30 PM • Warm sunshine and pool music'),
    ('Sunset swim', '5:00 PM – 8:00 PM • Golden hour valley view'),
  ];

  /// The poolside add-ons: title and detail.
  static const List<(String, String)> _addOnItems = [
    ('Fresh passion juice carafe', 'Chilled, fresh-from-passion fruit (1 litre)'),
    ('Wood-fired snack platter', 'Chicken skewers, roasted plantains and samosas'),
    ('In-water towel & sunscreen kit', 'Organic SPF 50 and plush extra bath sheet'),
  ];
}
