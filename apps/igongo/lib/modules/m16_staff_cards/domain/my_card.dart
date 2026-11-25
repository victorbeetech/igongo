// My staff card, as `GET /api/cards/mine` returns it.

import '../../../shared/api/api_client.dart';
import '../../../shared/staff/staff_ref.dart';

/// My card (or none yet) and who I am.
class MyCard {
  /// Creates it.
  const MyCard({required this.holder, this.cardNumber, this.status, this.cardType, this.qr});

  /// Reads it from the API's JSON.
  factory MyCard.fromJson(Json json) {
    final card = json['card'] as Json?;
    return MyCard(
      holder: StaffRef.fromJson(json['holder'] as Json),
      cardNumber: card?['cardNumber'] as String?,
      status: card?['status'] as String?,
      cardType: card?['cardType'] as String?,
      qr: card?['qr'] as String?,
    );
  }

  /// The card's holder: me.
  final StaffRef holder;

  /// The printed number, such as `C-00042`, or null with no card.
  final String? cardNumber;

  /// `active`, `lost`...
  final String? status;

  /// The chip type, such as `ntag213`.
  final String? cardType;

  /// The QR text on the card, to show at a station when the card is at home.
  final String? qr;
}
