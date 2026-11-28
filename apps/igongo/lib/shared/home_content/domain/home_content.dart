// The guest home's content, as the super admin set it in the "home" settings
// section and read from the public settings. Items switched off are dropped here,
// so the screens only ever see what should show.

import '../../api/api_client.dart';
import 'home_hero_slide.dart';
import 'home_json_readers.dart';
import 'home_quick_action.dart';
import 'home_story.dart';

/// The whole home content: each block's switch and its visible items.
class HomeContent {
  /// Creates the content from already-checked parts.
  const HomeContent({
    required this.storiesOn,
    required this.stories,
    required this.heroOn,
    required this.slides,
    required this.quickActionsOn,
    required this.quickActions,
    required this.restaurantOn,
    required this.whatsappOn,
  });

  /// What the home shows before the server answers or when it cannot be reached:
  /// the five quick actions the home has always had, and no stories or slides.
  static const fallback = HomeContent(
    storiesOn: true,
    stories: [],
    heroOn: true,
    slides: [],
    quickActionsOn: true,
    quickActions: [
      HomeQuickAction(title: 'Book stay', subtitle: 'Rooms and huts', icon: 'hotel', screenId: 'S67-01'),
      HomeQuickAction(title: 'Dine in', subtitle: 'Reserve table', icon: 'restaurant', screenId: 'S62-01'),
      HomeQuickAction(title: 'Museum', subtitle: 'Cultural tour', icon: 'museum', screenId: 'S68-01'),
      HomeQuickAction(title: 'Spa', subtitle: 'Massage and steam', icon: 'spa', screenId: ''),
      HomeQuickAction(title: 'Pool', subtitle: 'Swim and relax', icon: 'pool', screenId: ''),
    ],
    restaurantOn: true,
    whatsappOn: true,
  );

  /// Reads the "home" section from the public settings JSON. A missing section or
  /// block uses the fallback's value for it.
  factory HomeContent.fromJson(Json? json) {
    if (json == null) return fallback;
    final stories = _block(json, 'stories');
    final hero = _block(json, 'hero');
    final quick = _block(json, 'quickActions');
    return HomeContent(
      storiesOn: readSwitch(stories?['enabled']),
      stories: [for (final s in readObjects(stories?['items'])) HomeStory.fromJson(s)]..removeWhere((s) => s.title.isEmpty),
      heroOn: readSwitch(hero?['enabled']),
      slides: [for (final s in readObjects(hero?['slides'])) HomeHeroSlide.fromJson(s)],
      quickActionsOn: readSwitch(quick?['enabled']),
      quickActions: quick == null
          ? fallback.quickActions
          : [
              for (final a in readObjects(quick['items'])) if (readSwitch(a['enabled'])) HomeQuickAction.fromJson(a),
            ],
      restaurantOn: readSwitch(_block(json, 'restaurant')?['enabled']),
      whatsappOn: readSwitch(_block(json, 'whatsappButton')?['enabled']),
    );
  }

  /// The stories block as a JSON object, or null when the server did not send it.
  static Json? _block(Json json, String key) => json[key] is Map<String, dynamic> ? json[key] as Json : null;

  /// Whether the stories row shows: its switch is on and at least one story is listed.
  bool get showStories => storiesOn && stories.isNotEmpty;

  /// Whether the hero carousel shows: its switch is on and at least one slide is listed.
  bool get showHero => heroOn && slides.isNotEmpty;

  /// Whether the quick-action row shows: its switch is on and at least one action is listed.
  bool get showQuickActions => quickActionsOn && quickActions.isNotEmpty;

  /// Whether the stories switch is on (kept for the stories list, which may be empty).
  final bool storiesOn;

  /// The stories switched on, in the order the super admin set.
  final List<HomeStory> stories;

  /// Whether the hero switch is on.
  final bool heroOn;

  /// The hero slides switched on, in order.
  final List<HomeHeroSlide> slides;

  /// Whether the quick-action switch is on.
  final bool quickActionsOn;

  /// The quick actions switched on, in order.
  final List<HomeQuickAction> quickActions;

  /// Whether the "From our kitchen" dish row shows.
  final bool restaurantOn;

  /// Whether the floating WhatsApp button shows on guest screens.
  final bool whatsappOn;
}
