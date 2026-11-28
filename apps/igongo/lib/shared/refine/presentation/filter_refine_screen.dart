// The Filter & Refine screen: the sections of the filter, scrolling, with the
// Clear All and Apply Filters bar pinned at the bottom. The choices are held
// here for now; they are wired to the results in a later step.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../domain/refine_option.dart';
import '../infrastructure/refine_placeholders.dart';
import 'widgets/refine_amenity_row.dart';
import 'widgets/refine_category_pill.dart';
import 'widgets/refine_footer.dart';
import 'widgets/refine_header.dart';
import 'widgets/refine_hero.dart';
import 'widgets/refine_price_card.dart';
import 'widgets/refine_section_card.dart';
import 'widgets/refine_sort_grid.dart';
import 'widgets/refine_zone_row.dart';

/// Returns the positions of the options that start ticked.
Set<int> _startTicked(List<RefineOption> options) => {
  for (var i = 0; i < options.length; i++)
    if (options[i].selected) i,
};

/// Returns the position of the option that starts picked (the first one if none is marked).
int _startPicked(List<RefineOption> options) {
  final at = options.indexWhere((o) => o.selected);
  return at < 0 ? 0 : at;
}

/// The Filter & Refine screen.
class FilterRefineScreen extends StatefulWidget {
  /// Creates the screen.
  const FilterRefineScreen({super.key});

  @override
  State<FilterRefineScreen> createState() => _FilterRefineScreenState();
}

class _FilterRefineScreenState extends State<FilterRefineScreen> {
  /// The categories ticked, by position.
  late Set<int> _categories = _startTicked(RefinePlaceholders.categories);

  /// The amenities ticked, by position.
  late Set<int> _amenities = _startTicked(RefinePlaceholders.amenities);

  /// The sort order picked, by position.
  late int _sort = _startPicked(RefinePlaceholders.sorts);

  /// The zone picked, by position.
  late int _zone = _startPicked(RefinePlaceholders.zones);

  /// The two price handle positions, from 0 to 1.
  late RangeValues _price = RangeValues(RefinePlaceholders.price.low, RefinePlaceholders.price.high);

  /// Puts every choice back to where the screen started.
  void _reset() => setState(() {
    _categories = _startTicked(RefinePlaceholders.categories);
    _amenities = _startTicked(RefinePlaceholders.amenities);
    _sort = _startPicked(RefinePlaceholders.sorts);
    _zone = _startPicked(RefinePlaceholders.zones);
    _price = RangeValues(RefinePlaceholders.price.low, RefinePlaceholders.price.high);
  });

  /// Unticks every category and amenity. Sort and zone stay, since one of each is always picked.
  void _clearAll() => setState(() {
    _categories = {};
    _amenities = {};
  });

  /// Ticks the item at [index] in [set] if it is off, or unticks it if it is on.
  void _flip(Set<int> set, int index) => setState(() => set.contains(index) ? set.remove(index) : set.add(index));

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    const categories = RefinePlaceholders.categories;
    const amenities = RefinePlaceholders.amenities;
    const zones = RefinePlaceholders.zones;
    return Scaffold(
      backgroundColor: palette.background,
      // Step 1: the scrolling sections, with the header on top.
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 24,
            children: [
              RefineHeader(onReset: _reset, onClose: () => Navigator.of(context).maybePop()),
              const RefineHero(place: RefinePlaceholders.heroPlace, title: RefinePlaceholders.heroTitle),
              RefineSectionCard(
                title: 'Categories',
                trailing: Text('Multi-select', style: context.text.labelSmall!.copyWith(color: palette.textMuted)),
                note: 'Choose from suites, dining pavillions, or historical excursions',
                child: Wrap(
                  spacing: 8,
                  children: [
                    for (var i = 0; i < categories.length; i++)
                      RefineCategoryPill(
                        option: categories[i],
                        selected: _categories.contains(i),
                        onTap: () => _flip(_categories, i),
                      ),
                  ],
                ),
              ),
              RefinePriceCard(
                price: RefinePlaceholders.price,
                values: _price,
                onChanged: (values) => setState(() => _price = values),
              ),
              RefineSectionCard(
                title: 'Sort By',
                child: RefineSortGrid(
                  options: RefinePlaceholders.sorts,
                  selected: _sort,
                  onPick: (index) => setState(() => _sort = index),
                ),
              ),
              RefineSectionCard(
                title: 'Resort Amenities & Features',
                trailing: Text(
                  'Bespoke Comfort',
                  style: context.text.labelSmall!.copyWith(color: palette.accent, fontWeight: FontWeight.w600),
                ),
                gap: 10,
                child: Column(
                  spacing: 10,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    for (var i = 0; i < amenities.length; i++)
                      RefineAmenityRow(
                        option: amenities[i],
                        on: _amenities.contains(i),
                        onTap: () => _flip(_amenities, i),
                      ),
                  ],
                ),
              ),
              RefineSectionCard(
                title: 'Location / Zone',
                trailing: Text('Igongo Grounds', style: context.text.labelSmall!.copyWith(color: palette.textMuted)),
                gap: 8,
                child: Column(
                  spacing: 8,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    for (var i = 0; i < zones.length; i++)
                      RefineZoneRow(option: zones[i], selected: i == _zone, onTap: () => setState(() => _zone = i)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      // Step 2: the pinned bar. Applying and wiring the results come in a later step, so it closes the sheet.
      bottomNavigationBar: SafeArea(
        top: false,
        child: RefineFooter(
          resultCount: RefinePlaceholders.resultCount,
          onClear: _clearAll,
          onApply: () => Navigator.of(context).maybePop(),
        ),
      ),
    );
  }
}
