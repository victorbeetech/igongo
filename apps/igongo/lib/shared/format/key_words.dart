// Turns a menu key such as `gluten-free` or `fish` into words for people:
// "Gluten free", "Fish". Used for tags and allergens shown on screens.

/// [key] as readable words: dashes and underscores become spaces, the first letter is capitalised.
String keyWords(String key) {
  // Step 1: dashes and underscores become spaces.
  final spaced = key.replaceAll(RegExp(r'[-_]+'), ' ').trim();
  // Step 2: capitalise the first letter; empty stays empty.
  return spaced.isEmpty ? spaced : '${spaced[0].toUpperCase()}${spaced.substring(1)}';
}
