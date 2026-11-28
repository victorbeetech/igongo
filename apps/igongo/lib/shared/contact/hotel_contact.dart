// The hotel's contact details, as the super admin set them in the web portal
// (Hotel profile). This is the one model the Contact Us screen and the WhatsApp
// buttons read. Empty fields mean "not set yet": the screen hides that channel
// rather than showing a made-up number.

import '../api/api_client.dart';

/// The hotel's contact details. Read-only; built from the public settings.
class HotelContact {
  /// Creates the details. Use [HotelContact.fromSettings] to read them from the API.
  const HotelContact({
    required this.name,
    required this.phone,
    required this.email,
    required this.whatsapp,
    required this.address,
    required this.hours,
    required this.contactUsOn,
  });

  /// Reads the hotel section of `/api/public/settings`. A missing field is treated as empty.
  factory HotelContact.fromSettings(Json settings) {
    // Step 1: the hotel section (an empty map if the server did not send one).
    final hotel = (settings['hotel'] as Json?) ?? const <String, dynamic>{};
    // Step 2: read each field as text, with "" for anything missing.
    String text(String key) => (hotel[key] as String?)?.trim() ?? '';
    // Step 3: build the details; the switch is on unless the server turned it off.
    return HotelContact(
      name: text('name'),
      phone: text('phone'),
      email: text('email'),
      whatsapp: whatsappDigits(text('whatsapp')),
      address: text('address'),
      hours: text('hours'),
      contactUsOn: hotel['contactUsOn'] as bool? ?? true,
    );
  }

  /// The hotel name, shown above the screen title.
  final String name;

  /// The front desk number as typed, such as "+256 393 262 050". Empty when not set.
  final String phone;

  /// The reservations email address. Empty when not set.
  final String email;

  /// The WhatsApp number as digits with the country code (such as 256700000002). Empty when not set.
  final String whatsapp;

  /// The address shown in the location strip. Empty when not set.
  final String address;

  /// The opening hours, such as "24/7". Empty when not set.
  final String hours;

  /// False when the super admin has switched Contact Us off.
  final bool contactUsOn;

  /// The phone number with no spaces, in the form the phone dialler uses.
  String get dialPhone => phone.replaceAll(RegExp(r'[^0-9+]'), '');
}

/// Turns a typed WhatsApp number into digits with the country code: "0700 000 002" becomes 256700000002.
/// It is the one place this is done, so every WhatsApp link is built the same way.
String whatsappDigits(String typed) {
  // Step 1: keep digits only.
  final digits = typed.replaceAll(RegExp(r'[^0-9]'), '');
  // Step 2: a local number that starts with 0 gets the Uganda country code in place of the 0.
  return digits.startsWith('0') ? '256${digits.substring(1)}' : digits;
}
