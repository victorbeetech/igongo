// Booking review for a museum tour (design: "Booking Review").
// Shows the hero, four step sections (experience, time and date, visitor
// passes, guide language), the pricing summary, the curator card and the
// confirm bar. Amounts are placeholders until the API supplies prices.
// Selections are local UI state only; nothing is booked yet.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_placeholders.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_choice_tile.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_counter.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_dates.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_date_strip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_hero.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_price_row.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_section_heading.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_select_chip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The museum tour booking review screen.
class MuseumBookingReviewScreen extends StatefulWidget {
  /// Creates the review screen.
  const MuseumBookingReviewScreen({super.key});

  @override
  State<MuseumBookingReviewScreen> createState() => _MuseumBookingReviewScreenState();
}

class _MuseumBookingReviewScreenState extends State<MuseumBookingReviewScreen> {
  /// The picked tour (index into the four packages). The first is picked, as in the design.
  int _experience = 0;

  /// The picked day, and the picked time slot (index).
  late DateTime _day = flowNextDays(5).first;
  int _slot = 1;

  /// Visitor pass counts: adults, East African residents, children and students.
  int _adults = 2;
  int _residents = 0;
  int _children = 1;

  /// The picked guide language (index into [_languages]).
  int _language = 0;

  /// The guide languages offered.
  static const List<String> _languages = ['English', 'Runyankore', 'Luganda', 'French'];

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final days = flowNextDays(5);
    return Scaffold(
      backgroundColor: palette.background,
      appBar: CheckoutAppBar(
        title: 'Booking Review',
        actions: [
          IconButton(tooltip: 'Call', icon: Icon(Icons.call, color: palette.primary), onPressed: () {}),
        ],
      ),
      body: ListView(
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
          // Step 1: the four cultural experiences, one radio each.
          const FlowSectionHeading(
            eyebrow: 'Step 1 • Curated itinerary',
            title: 'Choose Your Cultural Experience',
            meta: '4 immersive packages',
          ),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _experiences.length; i++) ...[
            FlowChoiceTile(
              title: _experiences[i].title,
              subtitle: _experiences[i].detail,
              tags: [for (final t in _experiences[i].tags) FlowTag(t)],
              selected: _experience == i,
              onTap: () => setState(() => _experience = i),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the day strip and the time slots.
          const FlowSectionHeading(eyebrow: 'Step 2 • Time & date', title: 'Select Schedule', meta: 'Daily departures'),
          const SizedBox(height: IgongoSpace.md),
          FlowDateStrip(days: days, selected: _day, onChanged: (d) => setState(() => _day = d)),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _slots.length; i++) ...[
            FlowChoiceTile(
              title: _slots[i].$1,
              subtitle: _slots[i].$2,
              selected: _slot == i,
              onTap: () => setState(() => _slot = i),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 3: visitor passes, each with a stepper.
          const FlowSectionHeading(eyebrow: 'Step 3 • Tickets', title: 'Visitor Passes', meta: 'Standard rates in UGX'),
          const SizedBox(height: IgongoSpace.md),
          FlowCounter(
            label: 'Adults (Standard)',
            detail: kAmountPlaceholder,
            value: _adults,
            onChanged: (v) => setState(() => _adults = v),
          ),
          const SizedBox(height: IgongoSpace.sm),
          FlowCounter(
            label: 'East African Residents',
            detail: kAmountPlaceholder,
            value: _residents,
            onChanged: (v) => setState(() => _residents = v),
          ),
          const SizedBox(height: IgongoSpace.sm),
          FlowCounter(
            label: 'Children / Students',
            detail: kAmountPlaceholder,
            value: _children,
            onChanged: (v) => setState(() => _children = v),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the guide language, as pills.
          const FlowSectionHeading(eyebrow: 'Step 4 • Guide dialect', title: 'Language Preference', meta: 'Included'),
          const SizedBox(height: IgongoSpace.md),
          Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (var i = 0; i < _languages.length; i++)
                FlowSelectChip(
                  label: _languages[i],
                  selected: _language == i,
                  icon: _language == i ? Icons.check : null,
                  onTap: () => setState(() => _language = i),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 5: the pricing summary, the deposit policy and the accepted payments.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text('Pricing Summary', style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                    ),
                    const FlowTag('Guaranteed Booking', solid: true),
                  ],
                ),
                const SizedBox(height: IgongoSpace.sm),
                FlowPriceRow(label: '$_adults Adults (Guided Tour)', amount: kAmountPlaceholder),
                FlowPriceRow(label: '$_children Child / Student', amount: kAmountPlaceholder),
                const Divider(height: IgongoSpace.xl),
                const FlowPriceRow(label: 'Total Investment', amount: kAmountPlaceholder, total: true),
                const SizedBox(height: IgongoSpace.md),
                Container(
                  padding: const EdgeInsets.all(IgongoSpace.md),
                  decoration: BoxDecoration(
                    color: palette.background,
                    borderRadius: BorderRadius.circular(IgongoRadius.md),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Deposit & Cancellation Policy: full advance payment is required for dedicated curator sessions. '
                        'Refundable up to 24 hours prior.',
                        style: context.text.bodySmall?.copyWith(color: palette.textMuted),
                      ),
                      const SizedBox(height: IgongoSpace.sm),
                      const Wrap(
                        spacing: IgongoSpace.xs,
                        runSpacing: IgongoSpace.xs,
                        children: [FlowTag('MTN MoMo'), FlowTag('Airtel Money'), FlowTag('Visa / Mastercard')],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 6: the curator card, with a call action.
          CheckoutSectionCard(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Speak to Chief Cultural Curator', style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                      Text('Custom group inquiries', style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                    ],
                  ),
                ),
                IconButton(tooltip: 'Call the curator', icon: Icon(Icons.call, color: palette.primary), onPressed: () {}),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: const FlowBottomBar(
        caption: 'Total',
        amount: kAmountPlaceholder,
        buttonLabel: 'Confirm & Book Tour',
        icon: Icons.confirmation_number_outlined,
      ),
    );
  }

  /// The four tour packages: title, detail line and tags. Copy from the design; prices are not shown here.
  static const List<_TourOption> _experiences = [
    _TourOption(
      'Guided Eriijukiro Museum Tour',
      'Royal drums, milk pots & ancient Ankole kingdom artifacts',
      ['60–75 mins', 'Resident & Curator Led'],
    ),
    _TourOption(
      'Biharwe Solar Eclipse 1520 AD Hike',
      'Legend of King Olimi I, scenic summit monument & valley vista',
      ['90 mins', 'Gentle hill trail'],
    ),
    _TourOption(
      'Traditional Milking & Eshabwe Class',
      'Hands-on butter churning, gourd curing & tasting ritual',
      ['110 mins', 'Tasting Included'],
    ),
    _TourOption(
      'All-Inclusive Cultural Day Pass',
      'Museum tour + Hill hike + Traditional banquet lunch',
      ['Full Day Immersion', 'Buffet Included'],
    ),
  ];

  /// The three time slots: label and detail.
  static const List<(String, String)> _slots = [
    ('10:00 AM Morning Gallery Tour', 'Cool temperature, high curator availability'),
    ('2:00 PM Afternoon Tour & Drums', 'Includes interactive royal drum rhythm session'),
    ('4:30 PM Sunset Biharwe Hill Walk', 'Golden hour photography over Rwizi plains'),
  ];
}

/// One tour package on the review: its title, detail and tags.
class _TourOption {
  const _TourOption(this.title, this.detail, this.tags);

  final String title;
  final String detail;
  final List<String> tags;
}
