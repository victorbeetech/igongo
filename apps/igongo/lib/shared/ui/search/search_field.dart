// The search box at the top of lists and the global search.

import 'package:material_ui/material_ui.dart';

/// A rounded search box.
class SearchField extends StatelessWidget {
  /// Creates a search box with a [hint].
  const SearchField({super.key, required this.hint, this.autofocus = false});

  /// The words inside the empty box, such as "Search cards".
  final String hint;

  /// Whether to open the keyboard straight away.
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    return TextField(
      autofocus: autofocus,
      textInputAction: TextInputAction.search,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: const Icon(Icons.search, size: 20),
        border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(99))),
      ),
    );
  }
}
