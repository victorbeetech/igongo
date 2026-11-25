// One person's day at work, worked out by the API from their clock events.

import '../../../shared/api/api_client.dart';

/// A day: first in, last out, time on site and late.
class DaySummary {
  /// Creates a day.
  const DaySummary({
    required this.workDate,
    this.firstIn,
    this.lastOut,
    required this.minutesOnSite,
    required this.late,
    required this.onSite,
  });

  /// Reads one from the API's JSON.
  factory DaySummary.fromJson(Json json) => DaySummary(
    workDate: '${json['workDate']}',
    firstIn: json['firstIn'] == null ? null : DateTime.parse('${json['firstIn']}').toLocal(),
    lastOut: json['lastOut'] == null ? null : DateTime.parse('${json['lastOut']}').toLocal(),
    minutesOnSite: (json['minutesOnSite'] as num?)?.toInt() ?? 0,
    late: json['late'] == true,
    onSite: json['onSite'] == true,
  );

  /// The hotel day, `YYYY-MM-DD`.
  final String workDate;

  /// The first clock-in, if any.
  final DateTime? firstIn;

  /// The last clock-out, if any.
  final DateTime? lastOut;

  /// Minutes between each in and its out (an open "in" counts until now).
  final int minutesOnSite;

  /// The first clock-in was late.
  final bool late;

  /// The last clock was an "in".
  final bool onSite;

  /// "7 h 35 min".
  String get hours => '${minutesOnSite ~/ 60} h ${minutesOnSite % 60} min';
}
