// Money as people read it in Uganda: whole shillings with thousands
// separators, such as "UGX 38,000". Every screen shows money through this.

/// [amount] whole shillings as text.
String ugx(num amount) {
  final digits = amount.round().toString();
  // Step 1: a comma before every group of three digits from the right.
  final grouped = digits.replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ',');
  return 'UGX $grouped';
}

/// Words for a status key, such as `on_the_way` -> "On the way".
String statusWords(String key) {
  final spaced = key.replaceAll('_', ' ');
  return spaced.isEmpty ? spaced : '${spaced[0].toUpperCase()}${spaced.substring(1)}';
}

/// Today's date, `YYYY-MM-DD`, in the hotel's time zone (UTC+3, no daylight saving).
String hotelToday() => DateTime.now().toUtc().add(const Duration(hours: 3)).toIso8601String().substring(0, 10);
