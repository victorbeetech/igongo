// Booking review for a museum tour (design: "Booking Review"), live from the
// museum API. Tours are the museum's offerings without a visitor type. The
// resident and child counters book their own visitor-type offerings
// (details.visitor = "resident" or "child"), each at its own API price.
// Confirm books the tour for adults, then the other visitor types.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/application/bookings_providers.dart';
import 'package:igongo/shared/bookings/domain/booking_place.dart';
import 'package:igongo/shared/bookings/domain/booking_rules.dart';
import 'package:igongo/shared/bookings/domain/offering.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_choice_tile.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_counter.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_date_strip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_dates.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_hero.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_offerings_scope.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_price_row.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_section_heading.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_submit.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/format/day_key.dart';
import 'package:igongo/shared/format/ugx.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The `details.visitor` value that marks the East African resident price offering.
const _residentType = 'resident';

/// The `details.visitor` value that marks the child and student price offering.
const _childType = 'child';

/// The museum tour booking review, live from the museum API.
class MuseumBookingReviewScreen extends ConsumerStatefulWidget {
  /// Creates the review screen for [place] (the museum module).
  const MuseumBookingReviewScreen({super.key, required this.place});

  /// The museum module.
  final BookingPlace place;

  @override
  ConsumerState<MuseumBookingReviewScreen> createState() => _MuseumBookingReviewScreenState();
}

class _MuseumBookingReviewScreenState extends ConsumerState<MuseumBookingReviewScreen> {
  /// The picked tour (index into the tours), the picked day and the picked time slot (index into the tour's slots).
  int _tour = 0;
  DateTime _day = flowNextDays(5).first;
  int _slot = 0;

  /// Visitor counts: adults (the tour's price), East African residents and children (their own offerings).
  int _adults = 2;
  int _residents = 0;
  int _children = 0;

  /// True while the booking is being made.
  bool _busy = false;

  /// The offering for a visitor type (its `details.visitor`), or null when none is on sale.
  static Offering? _find(List<Offering> all, String type) {
    for (final o in all) {
      if (o.details['visitor'] == type) return o;
    }
    return null;
  }

  /// The total for the picks: each visitor type at its own API price.
  int _total(Offering tour, Offering? resident, Offering? child) =>
      tour.price * _adults + (resident?.price ?? 0) * _residents + (child?.price ?? 0) * _children;

  /// Books the tour for adults and the resident and child offerings for their counts, then moves on.
  Future<void> _confirm(Offering tour, Offering? resident, Offering? child) async {
    setState(() => _busy = true);
    await submitFlowBooking(
      context,
      ref,
      widget.place,
      lines: [
        (offering: tour, units: _adults),
        if (resident != null) (offering: resident, units: _residents),
        if (child != null) (offering: child, units: _children),
      ],
      date: dayKey(_day),
      slot: tour.slots.isEmpty ? null : tour.slots[_slot.clamp(0, tour.slots.length - 1)],
    );
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    // Step 1: read the museum's offerings here too, so the footer can show the total.
    final all = ref.watch(offeringsProvider(widget.place)).valueOrNull ?? const <Offering>[];
    final tours = [for (final o in all) if (o.kind == 'slot' && !o.details.containsKey('visitor')) o];
    final resident = _find(all, _residentType);
    final child = _find(all, _childType);
    final rules = ref.watch(bookingRulesProvider(widget.place)).valueOrNull;
    final tour = tours.isEmpty ? null : tours[_tour.clamp(0, tours.length - 1)];
    return Scaffold(
      backgroundColor: context.palette.background,
      appBar: const CheckoutAppBar(title: 'Booking Review'),
      bottomNavigationBar: tour == null
          ? null
          : FlowBottomBar(
              caption: 'Total',
              amount: ugx(_total(tour, resident, child)),
              buttonLabel: 'Confirm & Book Tour',
              icon: Icons.confirmation_number_outlined,
              onPressed: _busy ? null : () => _confirm(tour, resident, child),
            ),
      body: FlowOfferingsScope(
        place: widget.place,
        emptyText: 'No museum tours are on sale yet.',
        builder: (context, _, _) => _body(tours, resident, child, rules),
      ),
    );
  }

  /// The screen body, once the offerings load.
  Widget _body(List<Offering> tours, Offering? resident, Offering? child, BookingRules? rules) {
    final palette = context.palette;
    if (tours.isEmpty) return const Center(child: Text('No museum tours are on sale yet.'));
    final tour = tours[_tour.clamp(0, tours.length - 1)];
    final slots = tour.slots;
    final adultTotal = tour.price * _adults;
    final residentTotal = (resident?.price ?? 0) * _residents;
    final childTotal = (child?.price ?? 0) * _children;
    final total = adultTotal + residentTotal + childTotal;
    return ListView(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xxl),
      children: [
        // Hero: the museum photo, the venue, and its location.
        const FlowHero(
          photo: 'assets/photos/museum-desk.jpg',
          kicker: 'Igongo Heritage Centre',
          title: 'Eriijukiro Museum & Heritage Tours',
          detail: 'Mbarara, Western Uganda • Biharwe Eclipse 1520 AD',
          badge: FlowTag('Curated tours', solid: true),
        ),
        const SizedBox(height: IgongoSpace.lg),
        // Step 1: the museum's tours, one radio each, with the API price.
        FlowSectionHeading(eyebrow: 'Step 1 • Curated itinerary', title: 'Choose Your Cultural Experience', meta: '${tours.length} immersive packages'),
        const SizedBox(height: IgongoSpace.md),
        for (var i = 0; i < tours.length; i++) ...[
          FlowChoiceTile(
            title: tours[i].name,
            subtitle: tours[i].description,
            amount: ugx(tours[i].price),
            selected: _tour == i,
            enabled: !_busy,
            onTap: () => setState(() {
              _tour = i;
              _slot = 0;
            }),
          ),
          const SizedBox(height: IgongoSpace.sm),
        ],
        const SizedBox(height: IgongoSpace.md),
        // Step 2: the day strip and the tour's time slots.
        const FlowSectionHeading(eyebrow: 'Step 2 • Time & date', title: 'Select Schedule', meta: 'Daily departures'),
        const SizedBox(height: IgongoSpace.md),
        FlowDateStrip(days: flowNextDays(5), selected: _day, onChanged: (d) => setState(() => _day = d)),
        const SizedBox(height: IgongoSpace.md),
        if (slots.isEmpty)
          const FlowChoiceTile(title: 'Whole day', selected: true, onTap: null)
        else
          for (var i = 0; i < slots.length; i++) ...[
            FlowChoiceTile(title: slots[i], selected: _slot == i, onTap: () => setState(() => _slot = i)),
            const SizedBox(height: IgongoSpace.sm),
          ],
        const SizedBox(height: IgongoSpace.md),
        // Step 3: visitor passes, each with a stepper and its own API price.
        const FlowSectionHeading(eyebrow: 'Step 3 • Tickets', title: 'Visitor Passes', meta: 'Standard rates in UGX'),
        const SizedBox(height: IgongoSpace.md),
        FlowCounter(label: 'Adults (Standard)', detail: ugx(tour.price), value: _adults, onChanged: (v) => setState(() => _adults = v)),
        const SizedBox(height: IgongoSpace.sm),
        FlowCounter(
          label: 'East African Residents',
          detail: ugx(resident?.price ?? 0),
          value: _residents,
          onChanged: (v) => setState(() => _residents = v),
        ),
        const SizedBox(height: IgongoSpace.sm),
        FlowCounter(label: 'Children / Students', detail: ugx(child?.price ?? 0), value: _children, onChanged: (v) => setState(() => _children = v)),
        const SizedBox(height: IgongoSpace.lg),
        // Step 4: the pricing summary and the deposit policy.
        CheckoutSectionCard(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: Text('Pricing Summary', style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
                  const FlowTag('Guaranteed Booking', solid: true),
                ],
              ),
              const SizedBox(height: IgongoSpace.sm),
              FlowPriceRow(label: '$_adults Adults (Guided Tour)', amount: ugx(adultTotal)),
              FlowPriceRow(label: '$_residents Residents', amount: ugx(residentTotal)),
              FlowPriceRow(label: '$_children Child / Student', amount: ugx(childTotal)),
              const Divider(height: IgongoSpace.xl),
              FlowPriceRow(label: 'Total Investment', amount: ugx(total), total: true),
              const SizedBox(height: IgongoSpace.md),
              Container(
                padding: const EdgeInsets.all(IgongoSpace.md),
                decoration: BoxDecoration(color: palette.background, borderRadius: BorderRadius.circular(IgongoRadius.md)),
                child: Text(
                  'Deposit & Cancellation Policy: '
                  '${rules == null || rules.depositPercent == 0 ? 'pay later' : '${rules.depositPercent}% deposit now'}. '
                  'Refundable up to 24 hours prior.',
                  style: context.text.bodySmall?.copyWith(color: palette.textMuted),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
