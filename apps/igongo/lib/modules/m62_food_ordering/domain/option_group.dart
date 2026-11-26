// A group of choices on a menu item, such as "Size" or "Sides".

import '../../../shared/api/api_client.dart';
import 'option_choice.dart';

/// An option group.
class OptionGroup {
  /// Creates a group.
  const OptionGroup({
    required this.key,
    required this.name,
    required this.required,
    required this.multiple,
    required this.choices,
  });

  /// Reads one from the API's JSON.
  factory OptionGroup.fromJson(Json json) => OptionGroup(
    key: '${json['key']}',
    name: '${json['name']}',
    required: json['required'] == true,
    multiple: json['multiple'] == true,
    choices: [for (final c in json['choices'] as List<dynamic>? ?? const []) OptionChoice.fromJson(c as Json)],
  );

  /// Its key, such as `size`.
  final String key;

  /// Its name for people.
  final String name;

  /// True when the guest must pick one.
  final bool required;

  /// True when the guest may pick several.
  final bool multiple;

  /// The choices.
  final List<OptionChoice> choices;
}
