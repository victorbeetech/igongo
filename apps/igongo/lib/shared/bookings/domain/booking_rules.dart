// The super admin's booking rules for one module, as the app needs them: the
// deposit percent (the rest is paid later). Read from the API's `/rules` route.

/// A module's booking rules, as the app uses them.
class BookingRules {
  /// Creates the rules.
  const BookingRules({required this.depositPercent});

  /// Reads the rules from the API's JSON.
  factory BookingRules.fromJson(Map<String, dynamic> json) =>
      BookingRules(depositPercent: (json['depositPercent'] as num?)?.toInt() ?? 0);

  /// Percent of the total due before a booking is confirmed (0 means pay later).
  final int depositPercent;

  /// The deposit on [total] whole shillings, rounded up as the API does.
  int depositOn(int total) => ((total * depositPercent) / 100).ceil();
}
