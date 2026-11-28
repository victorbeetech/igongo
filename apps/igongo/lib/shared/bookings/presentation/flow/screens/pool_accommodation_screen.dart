// Pool passes and sessions (design: "Select Accommodation").
// The pass types come from the pool's own offerings (kind `slot`), the sessions
// are each pass's time slots, the poolside add-ons are the pool's `stock`
// offerings, and every amount is the API's price. Confirm books the pass
// (units = swimmers) and each ticked add-on, then moves on as every booking does.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/application/bookings_providers.dart';
import 'package:igongo/shared/bookings/domain/booking_place.dart';
import 'package:igongo/shared/bookings/domain/booking_rules.dart';
import 'package:igongo/shared/bookings/domain/offering.dart';
import 'package:igongo/shared/bookings/presentation/booking_next.dart';
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
import 'package:igongo/shared/format/day_key.dart';
import 'package:igongo/shared/format/ugx.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:igongo/shared/ui/toast/igongo_toast.dart';

/// The pool pass booking screen, live from the pool module's API.
class PoolAccommodationScreen extends ConsumerStatefulWidget {
  /// Creates the pool screen for [place] (the pool module).
  const PoolAccommodationScreen({super.key, required this.place});

  /// The pool module.
  final BookingPlace place;

  @override
  ConsumerState<PoolAccommodationScreen> createState() => _PoolAccommodationScreenState();
}

class _PoolAccommodationScreenState extends ConsumerState<PoolAccommodationScreen> {
  /// The picked pass (index into the pool's passes).
  int _pass = 0;

  /// The picked day.
  late DateTime _day = flowNextDays(5).first;

  /// The picked session (index into the pass's slots).
  int _session = 0;

  /// Swimmer counts: adults and children. Their sum is the pass's units.
  int _adults = 2;
  int _children = 0;

  /// The poolside add-ons ticked (indexes into the pool's stock offerings).
  final Set<int> _addOns = {};

  /// True while the bookings are being made.
  bool _busy = false;

  /// Books the pass and each ticked add-on, then moves on from the pass's booking.
  Future<void> _confirm(List<Offering> passes, List<Offering> addOns) async {
    // Step 1: a pass must be picked, and a session when the pass has sessions.
    if (passes.isEmpty) return;
    final pass = passes[_pass];
    final slot = pass.slots.isEmpty ? null : pass.slots[_session];
    final swimmers = _adults + _children;
    setState(() => _busy = true);
    try {
      // Step 2: book the pass for the swimmers on the day and session picked.
      final api = ref.read(bookingsApiProvider(widget.place));
      final booking = await api.book(offeringId: pass.id, units: swimmers, date: dayKey(_day), slot: slot);
      // Step 3: book each ticked add-on (one unit each), so each one is a real booking.
      for (final i in _addOns) {
        await api.book(offeringId: addOns[i].id, units: 1);
      }
      ref.invalidate(myBookingsProvider(widget.place));
      if (mounted) await openAfterBooking(context, booking, widget.place);
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final offerings = ref.watch(offeringsProvider(widget.place));
    final rules = ref.watch(bookingRulesProvider(widget.place));
    // The footer needs the loaded passes and add-ons, so it is built from the value (null while loading or on error).
    final loaded = offerings.valueOrNull;
    final passes = loaded?.where((o) => o.kind == 'slot').toList() ?? const <Offering>[];
    final addOns = loaded?.where((o) => o.kind == 'stock').toList() ?? const <Offering>[];
    return Scaffold(
      backgroundColor: context.palette.background,
      appBar: const CheckoutAppBar(title: 'Select Accommodation'),
      bottomNavigationBar: loaded == null || passes.isEmpty
          ? null
          : _footer(passes, addOns, rules.valueOrNull),
      body: offerings.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Could not load the pool passes. $e', textAlign: TextAlign.center),
                const SizedBox(height: IgongoSpace.md),
                FilledButton(onPressed: () => ref.invalidate(offeringsProvider(widget.place)), child: const Text('Try again')),
              ],
            ),
          ),
        ),
        data: (all) {
          // Step 1: no passes on sale means the empty state, not the design.
          if (passes.isEmpty) {
            return const Center(child: Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No pool passes are on sale yet.')));
          }
          return _body(passes, addOns, rules.valueOrNull);
        },
      ),
    );
  }

  /// Does nothing: the fast deposit channels wait for the payment API (the pending-payment placeholder).
  static void _noop() {}

  /// The amounts for the current picks: the pass for every swimmer, plus each ticked add-on.
  ({int passTotal, int addOnTotal, int total, int deposit}) _amounts(List<Offering> passes, List<Offering> addOns, BookingRules? rules) {
    final pass = passes[_pass.clamp(0, passes.length - 1)];
    final passTotal = pass.price * (_adults + _children);
    final addOnTotal = [for (final i in _addOns) addOns[i].price].fold<int>(0, (a, b) => a + b);
    final total = passTotal + addOnTotal;
    return (passTotal: passTotal, addOnTotal: addOnTotal, total: total, deposit: rules?.depositOn(total) ?? 0);
  }

  /// The footer: the deposit due today and the Confirm button.
  Widget _footer(List<Offering> passes, List<Offering> addOns, BookingRules? rules) {
    final a = _amounts(passes, addOns, rules);
    return FlowBottomBar(
      caption: 'Due today (deposit)',
      amount: ugx(a.deposit),
      buttonLabel: 'Confirm Booking',
      icon: Icons.lock_outline,
      onPressed: _busy ? null : () => _confirm(passes, addOns),
    );
  }

  /// The screen body, once the passes and rules are loaded.
  Widget _body(List<Offering> passes, List<Offering> addOns, BookingRules? rules) {
    final palette = context.palette;
    final pass = passes[_pass.clamp(0, passes.length - 1)];
    final sessions = pass.slots;
    final a = _amounts(passes, addOns, rules);
    return Stack(
      children: [
        ListView(
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
            // Step 1: the pass types, each priced by the API.
            const FlowSectionHeading(eyebrow: 'Step 1 • Experience', title: 'Select Experience', meta: 'Per day & session'),
            const SizedBox(height: IgongoSpace.md),
            for (var i = 0; i < passes.length; i++) ...[
              FlowChoiceTile(
                title: passes[i].name,
                subtitle: passes[i].description,
                amount: ugx(passes[i].price),
                selected: _pass == i,
                onTap: () => setState(() {
                  _pass = i;
                  _session = 0;
                }),
                enabled: !_busy,
              ),
              const SizedBox(height: IgongoSpace.sm),
            ],
            const SizedBox(height: IgongoSpace.md),
            // Step 2: the day and the session time (the pass's own slots).
            const FlowSectionHeading(eyebrow: 'Step 2 • Date & time session', title: 'Choose Your Session'),
            const SizedBox(height: IgongoSpace.md),
            FlowDateStrip(days: flowNextDays(5), selected: _day, onChanged: (d) => setState(() => _day = d)),
            const SizedBox(height: IgongoSpace.md),
            if (sessions.isEmpty)
              const FlowChoiceTile(title: 'Whole day', selected: true, onTap: null)
            else
              for (var i = 0; i < sessions.length; i++) ...[
                FlowChoiceTile(
                  title: sessions[i],
                  selected: _session == i,
                  onTap: () => setState(() => _session = i),
                ),
                const SizedBox(height: IgongoSpace.sm),
              ],
            const SizedBox(height: IgongoSpace.md),
            // Step 3: swimmer passes with counters.
            const FlowSectionHeading(eyebrow: 'Step 3 • Swimmer passes', title: 'Swimmer Passes'),
            const SizedBox(height: IgongoSpace.md),
            FlowCounter(label: 'Adults', detail: 'Ages 13 and above', value: _adults, max: 20, onChanged: (v) => setState(() => _adults = v)),
            const SizedBox(height: IgongoSpace.sm),
            FlowCounter(label: 'Children', detail: 'Under 12 years', value: _children, max: 20, onChanged: (v) => setState(() => _children = v)),
            const SizedBox(height: IgongoSpace.lg),
            // Step 4: poolside add-ons (the pool's stock), each a checkbox at its API price.
            if (addOns.isNotEmpty) ...[
              const FlowSectionHeading(eyebrow: 'Step 4 • Refreshments', title: 'Poolside Refreshment Add-ons', meta: 'A la carte'),
              const SizedBox(height: IgongoSpace.md),
              for (var i = 0; i < addOns.length; i++) ...[
                FlowChoiceTile(
                  title: addOns[i].name,
                  subtitle: addOns[i].description,
                  amount: ugx(addOns[i].price),
                  checkbox: true,
                  selected: _addOns.contains(i),
                  onTap: () => setState(() => _addOns.contains(i) ? _addOns.remove(i) : _addOns.add(i)),
                ),
                const SizedBox(height: IgongoSpace.sm),
              ],
              const SizedBox(height: IgongoSpace.md),
            ],
            // Step 5: the pricing summary and the deposit.
            CheckoutSectionCard(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Pricing & Deposit', style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                  const SizedBox(height: IgongoSpace.sm),
                  FlowPriceRow(label: 'Selected pool passes', amount: ugx(a.passTotal)),
                  FlowPriceRow(label: 'Refreshment add-ons', amount: ugx(a.addOnTotal)),
                  const Divider(height: IgongoSpace.xl),
                  FlowPriceRow(label: 'Estimated total', amount: ugx(a.total), total: true),
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
                        Text(ugx(a.deposit), style: context.text.titleSmall?.copyWith(color: palette.primary, fontWeight: FontWeight.w700)),
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
          ],
        ),
      ],
    );
  }
}
