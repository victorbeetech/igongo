// Dates and guests for a safari (design: "Dates And Guests").
// Four numbered steps: the experience, the travel date and pickup point,
// the safari preferences, and the guests and conservation tariff, then the
// excursion summary, payment options and the confirm bar. Prices are
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

/// The safari dates and guests screen.
class SafariDatesGuestsScreen extends StatefulWidget {
  /// Creates the safari screen.
  const SafariDatesGuestsScreen({super.key});

  @override
  State<SafariDatesGuestsScreen> createState() => _SafariDatesGuestsScreenState();
}

class _SafariDatesGuestsScreenState extends State<SafariDatesGuestsScreen> {
  /// The picked safari (index into [_safaris]).
  int _safari = 0;

  /// The picked day.
  late DateTime _day = flowNextDays(4).first;

  /// The pickup time (0 dawn, 1 afternoon) and the pickup spot (0 cottage porch, 1 reception).
  int _pickupTime = 0;
  int _pickupSpot = 0;

  /// The vehicle is fixed; the guide language, snack and tariff are picked by index.
  int _language = 0;
  int _snack = 0;
  int _tariff = 0;

  /// Passenger counts.
  int _adults = 1;
  int _children = 0;

  /// The payment method (index into [_payments]).
  int _payment = 0;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final days = flowNextDays(4);
    return Scaffold(
      backgroundColor: palette.background,
      appBar: CheckoutAppBar(
        title: 'Dates And Guests',
        actions: [IconButton(tooltip: 'Call', icon: Icon(Icons.call, color: palette.primary), onPressed: () {})],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Hero: the wildlife drive, its distance and the ranger guides.
          const FlowHero(
            photo: 'assets/photos/hotel-antelope.jpg',
            kicker: 'Wildlife & Nature Excursion',
            title: 'Lake Mburo Safari & Wildlife Drive',
            detail: 'Embark from Igongo into the whisper of golden acacia woodland.',
            badge: FlowTag('30 mins from Igongo gates', solid: true),
            height: 220,
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 1: the three safari experiences.
          const FlowSectionHeading(eyebrow: 'Step 1 of 4', title: 'Select Experience'),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _safaris.length; i++) ...[
            FlowChoiceTile(
              title: _safaris[i].$1,
              subtitle: _safaris[i].$2,
              tags: [for (final t in _safaris[i].$3) FlowTag(t)],
              amount: kAmountPlaceholder,
              selected: _safari == i,
              onTap: () => setState(() => _safari = i),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the travel date, the pickup times and the pickup spot.
          const FlowSectionHeading(eyebrow: 'Step 2 of 4', title: 'Date & Pickup Point'),
          const SizedBox(height: IgongoSpace.md),
          FlowDateStrip(days: days, selected: _day, onChanged: (d) => setState(() => _day = d)),
          const SizedBox(height: IgongoSpace.md),
          Text('Resort pickup schedule', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          Row(
            children: [
              Expanded(
                child: FlowChoiceTile(
                  title: '6:00 AM',
                  subtitle: 'Dawn departure',
                  selected: _pickupTime == 0,
                  onTap: () => setState(() => _pickupTime = 0),
                ),
              ),
              const SizedBox(width: IgongoSpace.sm),
              Expanded(
                child: FlowChoiceTile(
                  title: '2:30 PM',
                  subtitle: 'Afternoon drive',
                  selected: _pickupTime == 1,
                  onTap: () => setState(() => _pickupTime = 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          Text('Pickup spot within resort', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          FlowChoiceTile(
            title: 'Private cottage front porch',
            selected: _pickupSpot == 0,
            onTap: () => setState(() => _pickupSpot = 0),
          ),
          const SizedBox(height: IgongoSpace.sm),
          FlowChoiceTile(
            title: 'Main resort reception desk',
            selected: _pickupSpot == 1,
            onTap: () => setState(() => _pickupSpot = 1),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: the vehicle (included), the guide language and the snack.
          const FlowSectionHeading(eyebrow: 'Step 3 of 4', title: 'Safari Preferences'),
          const SizedBox(height: IgongoSpace.md),
          CheckoutSectionCard(
            child: Row(
              children: [
                Icon(Icons.directions_car_outlined, color: palette.primary),
                const SizedBox(width: IgongoSpace.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Custom 4x4 Safari Land Cruiser', style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                      Text('Pop-up canvas roof, binocular stands and chilled Igongo water',
                          style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                    ],
                  ),
                ),
                const FlowTag('Included'),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          Text('Guide language & heritage focus', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          Row(
            children: [
              Expanded(
                child: FlowChoiceTile(
                  title: 'English guided',
                  selected: _language == 0,
                  onTap: () => setState(() => _language = 0),
                ),
              ),
              const SizedBox(width: IgongoSpace.sm),
              Expanded(
                child: FlowChoiceTile(
                  title: 'Runyankore & Ankole lore',
                  selected: _language == 1,
                  onTap: () => setState(() => _language = 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          Text('Bush hamper snack preference', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (var i = 0; i < _snacks.length; i++)
                FlowSelectChip(
                  label: _snacks[i],
                  selected: _snack == i,
                  onTap: () => setState(() => _snack = i),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: adults, children and the park tariff category.
          const FlowSectionHeading(eyebrow: 'Step 4 of 4', title: 'Guests & Conservation'),
          const SizedBox(height: IgongoSpace.md),
          FlowCounter(
            label: 'Adult passengers',
            detail: 'Ages 15 and above',
            value: _adults,
            min: 1,
            max: 12,
            onChanged: (v) => setState(() => _adults = v),
          ),
          const SizedBox(height: IgongoSpace.sm),
          FlowCounter(
            label: 'Children',
            detail: 'Ages 5 – 14 (add-on fee)',
            value: _children,
            max: 12,
            onChanged: (v) => setState(() => _children = v),
          ),
          const SizedBox(height: IgongoSpace.md),
          Text('Park tariff category', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          Row(
            children: [
              Expanded(
                child: FlowChoiceTile(
                  title: 'Non-resident',
                  subtitle: 'Foreign passport',
                  selected: _tariff == 0,
                  onTap: () => setState(() => _tariff = 0),
                ),
              ),
              const SizedBox(width: IgongoSpace.sm),
              Expanded(
                child: FlowChoiceTile(
                  title: 'EAC resident',
                  subtitle: 'Uganda / EAC ID',
                  selected: _tariff == 1,
                  onTap: () => setState(() => _tariff = 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Excursion summary: the lines, the total and the deposit due.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: Text('Excursion Summary', style: context.text.titleMedium?.copyWith(fontFamily: IgongoFonts.brand))),
                    const FlowTag('Deposit required', solid: true),
                  ],
                ),
                const SizedBox(height: IgongoSpace.sm),
                const FlowPriceRow(label: 'Sunrise Savannah Game Drive', amount: kAmountPlaceholder),
                const FlowPriceRow(label: 'UWA ranger & 4x4 cruiser fee', amount: 'Included'),
                const FlowPriceRow(label: 'Complimentary safari water', amount: 'Included'),
                const Divider(height: IgongoSpace.xl),
                const FlowPriceRow(label: 'Estimated total', amount: kAmountPlaceholder, total: true),
                const FlowPriceRow(label: 'Due today (deposit)', amount: kAmountPlaceholder),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Payment options: mobile money, card and room folio.
          Text('Payment options', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          Row(
            children: [
              for (var i = 0; i < _payments.length; i++) ...[
                Expanded(
                  child: FlowSelectChip(
                    label: _payments[i],
                    icon: Icons.payment,
                    selected: _payment == i,
                    onTap: () => setState(() => _payment = i),
                  ),
                ),
                if (i < _payments.length - 1) const SizedBox(width: IgongoSpace.xs),
              ],
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          // The ranger card, with an inquiry action.
          CheckoutSectionCard(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Questions for your safari guide?', style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                      Text('Ranger Jackson Mugisha', style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                    ],
                  ),
                ),
                OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.call), label: const Text('Inquire')),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: const FlowBottomBar(
        caption: 'Required deposit',
        amount: kAmountPlaceholder,
        buttonLabel: 'Confirm Safari',
        icon: Icons.arrow_forward,
      ),
    );
  }

  /// The three safaris: title, detail and tags.
  static const List<(String, String, List<String>)> _safaris = [
    ('Sunrise Savannah Game Drive', '3.5 hrs • Spot zebras, elands, impalas and Rothschild giraffes in morning mist, with a UWA armed ranger.', ['Best for big herds', 'Early bird']),
    ('Sunset Boat Cruise', '2 hrs • Tranquil lake cruise with hippos, Nile crocodiles and birdwatching.', ['Birding paradise', 'Serene waterway']),
    ('Full Day Wildlife & Cultural', '6 hrs • Morning game drive, lakeside picnic hamper lunch and a 2-hour boat safari.', ['Picnic hamper included']),
  ];

  /// The snack preferences.
  static const List<String> _snacks = ['Standard Igongo', 'Vegetarian', 'Halal certified'];

  /// The payment methods.
  static const List<String> _payments = ['MTN MoMo', 'Airtel', 'Visa / MC', 'Room folio'];
}
