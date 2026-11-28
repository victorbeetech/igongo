// The guest's points wallet, as `GET /api/points/me` sends it. While the
// programme is off the API sends only `enabled: false`, and the app shows no
// points at all.

import '../../../../shared/api/api_client.dart';

/// One line of the points history: points in or out, and why.
class PointsEntry {
  /// Creates one history line.
  const PointsEntry({required this.points, required this.note, required this.createdAt});

  /// Reads one history line from the API's JSON.
  factory PointsEntry.fromJson(Json json) => PointsEntry(
    points: (json['points'] as num).toInt(),
    note: '${json['note']}',
    createdAt: DateTime.parse('${json['createdAt']}'),
  );

  /// Signed: positive when points were added, negative when they left.
  final int points;

  /// A short plain note, such as "Order ORD-0042" or "Points expired".
  final String note;

  /// When it happened.
  final DateTime createdAt;
}

/// Points that expire soon: how many, and the date they go.
class ExpiringPoints {
  /// Creates the warning.
  const ExpiringPoints({required this.points, required this.expiresOn});

  /// How many points expire.
  final int points;

  /// The day they expire.
  final DateTime expiresOn;
}

/// The guest's wallet. [enabled] is false while the programme is off.
class PointsWallet {
  /// Creates a wallet.
  const PointsWallet({
    required this.enabled,
    this.balance = 0,
    this.valueUgx = 0,
    this.minimumToRedeem = 0,
    this.ugxPerPoint = 0,
    this.pointsPer1000Ugx = 0,
    this.expiryDays = 0,
    this.expiringSoon,
    this.history = const [],
  });

  /// Reads the wallet from the API's JSON. Switched off, only the switch comes back.
  factory PointsWallet.fromJson(Json json) {
    if (json['enabled'] != true) return const PointsWallet(enabled: false);
    final soon = json['expiringSoon'] as Json?;
    return PointsWallet(
      enabled: true,
      balance: (json['balance'] as num).toInt(),
      valueUgx: (json['valueUgx'] as num).toInt(),
      minimumToRedeem: (json['minimumToRedeem'] as num).toInt(),
      ugxPerPoint: (json['ugxPerPoint'] as num).toInt(),
      pointsPer1000Ugx: (json['pointsPer1000Ugx'] as num).toInt(),
      expiryDays: (json['expiryDays'] as num).toInt(),
      expiringSoon: soon == null
          ? null
          : ExpiringPoints(points: (soon['points'] as num).toInt(), expiresOn: DateTime.parse('${soon['expiresOn']}')),
      history: [for (final e in json['history'] as List<dynamic>? ?? const []) PointsEntry.fromJson(e as Json)],
    );
  }

  /// True while the programme is on.
  final bool enabled;

  /// Points the guest has to spend.
  final int balance;

  /// What the balance is worth, in shillings.
  final int valueUgx;

  /// The fewest points that can be spent in one go.
  final int minimumToRedeem;

  /// Shillings off for each point.
  final int ugxPerPoint;

  /// Points earned for every 1,000 UGX paid.
  final int pointsPer1000Ugx;

  /// Days before earned points expire (0 for never).
  final int expiryDays;

  /// The points expiring soon, or null.
  final ExpiringPoints? expiringSoon;

  /// The newest history lines.
  final List<PointsEntry> history;

  /// True when the guest has enough points to spend.
  bool get canSpend => enabled && balance >= minimumToRedeem && balance > 0;

  /// The most points that can come off an order totalling [total] shillings, without going past the total or the balance.
  int pointsFor(int total) {
    if (ugxPerPoint <= 0) return 0;
    final needed = total ~/ ugxPerPoint;
    return needed < balance ? needed : balance;
  }
}
