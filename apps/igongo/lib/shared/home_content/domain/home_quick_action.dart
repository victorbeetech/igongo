// One quick-action card under the hero, as the super admin entered it.

import 'home_json_readers.dart';

/// A quick action: its words, its icon key and the screen it opens.
class HomeQuickAction {
  /// Creates an action from its fields.
  const HomeQuickAction({required this.title, required this.subtitle, required this.icon, required this.screenId});

  /// Reads an action from the settings JSON.
  factory HomeQuickAction.fromJson(Map<String, dynamic> json) => HomeQuickAction(
    title: readText(json['title']),
    subtitle: readText(json['subtitle']),
    icon: readText(json['icon']),
    screenId: readText(json['screenId']),
  );

  /// The bold title.
  final String title;

  /// The muted line under the title.
  final String subtitle;

  /// The icon key (see the home icon map).
  final String icon;

  /// The catalogue screen to open, such as S67-01; "" opens the coming-soon page.
  final String screenId;
}
