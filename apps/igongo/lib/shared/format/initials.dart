// Initials for a person's or record's name, such as "Victor Bee" -> "VB".
// Shared by every avatar so the rule is written once.

/// Up to two initials from [name]: the first letter of its first two words.
/// Words that do not start with a letter (such as numbers) are skipped.
String initialsOf(String name) {
  // Step 1: split on spaces and the middle dot, keeping words that start with a letter.
  final words = name
      .split(RegExp(r'[\s·]+'))
      .where((w) => w.isNotEmpty && RegExp(r'[A-Za-z]').hasMatch(w[0]));
  // Step 2: take the first letter of the first two words, in capitals.
  return words.take(2).map((w) => w[0].toUpperCase()).join();
}
