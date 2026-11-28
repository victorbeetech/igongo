// The Updates screen (S00-28): the person's alerts about orders, stays, offers
// and resort news. It has the top row, the title with "Mark all as read", filter
// tabs, the Today and Past Days groups and the footer. The cards show placeholder
// content until the alerts feed is wired.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/screens/parts/screen_list_view.dart';
import 'cultural_tour_update_card.dart';
import 'room_service_update_card.dart';
import 'spa_booking_update_card.dart';
import 'update_category.dart';
import 'updates_empty_state.dart';
import 'updates_filter_tabs.dart';
import 'updates_footer.dart';
import 'updates_section_label.dart';
import 'updates_title_row.dart';
import 'updates_top_bar.dart';
import 'weekend_offer_update_card.dart';

/// Placeholder counts for each filter tab, matching the cards below. Replace them with the feed's counts when it is wired.
const _placeholderCounts = {
  UpdateCategory.all: 4,
  UpdateCategory.ordersStays: 2,
  UpdateCategory.promos: 1,
  UpdateCategory.resortNews: 1,
};

/// The Updates screen. Its filter and "mark all as read" work on screen for now.
class UpdatesScreen extends StatefulWidget {
  /// Creates the screen.
  const UpdatesScreen({super.key});

  @override
  State<UpdatesScreen> createState() => _UpdatesScreenState();
}

/// The screen's state: the picked filter and whether everything has been read.
class _UpdatesScreenState extends State<UpdatesScreen> {
  /// The filter tab the person picked. All shows every card.
  UpdateCategory _selected = UpdateCategory.all;

  /// True after "Mark all as read", until the alerts feed is wired.
  bool _allRead = false;

  /// Two cards are unread until marked: the room service order and the spa booking.
  int get _unreadCount => _allRead ? 0 : 2;

  /// Whether a card of [category] shows under the picked filter.
  bool _shows(UpdateCategory category) => _selected == UpdateCategory.all || _selected == category;

  /// Picks a filter tab.
  void _select(UpdateCategory category) => setState(() => _selected = category);

  /// Builds one timeline group: its label, then its cards with even gaps.
  Widget _group(String title, List<Widget> cards) => Padding(
    padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.lg),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: IgongoSpace.lg,
      children: [
        UpdatesSectionLabel(title: title),
        ...cards,
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    // Step 1: which cards show under the picked filter, grouped by when they happened.
    final today = [
      if (_shows(UpdateCategory.ordersStays)) RoomServiceUpdateCard(unread: !_allRead),
      if (_shows(UpdateCategory.ordersStays)) SpaBookingUpdateCard(unread: !_allRead),
    ];
    final past = [
      if (_shows(UpdateCategory.resortNews)) const CulturalTourUpdateCard(),
      if (_shows(UpdateCategory.promos)) const WeekendOfferUpdateCard(),
    ];
    // Step 2: the top row stays fixed; the title, filters, groups and footer scroll below it.
    return SafeArea(
      bottom: false,
      child: Column(
        children: [
          const UpdatesTopBar(),
          Expanded(
            child: ScreenListView(
              children: [
                UpdatesTitleRow(unreadCount: _unreadCount, onMarkAllRead: () => setState(() => _allRead = true)),
                UpdatesFilterTabs(selected: _selected, counts: _placeholderCounts, onSelected: _select),
                const SizedBox(height: IgongoSpace.sm),
                // Step 3: the groups, or the empty message when the filter has nothing.
                if (today.isNotEmpty) _group('Today', today),
                if (past.isNotEmpty) _group('Past Days', past),
                if (today.isEmpty && past.isEmpty) UpdatesEmptyState(onViewAll: () => _select(UpdateCategory.all)),
                // Step 4: the preferences link and the concierge line.
                const UpdatesFooter(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
