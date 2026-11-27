// The signed-in guest's own profile (module 54): details the hotel keeps to
// serve them better, the contact email, and which messages they agreed to get.

import '../../../shared/api/api_client.dart';

/// My guest profile.
class GuestProfile {
  /// Creates a profile.
  const GuestProfile({
    required this.name,
    required this.sms,
    required this.whatsapp,
    required this.email,
    this.contactEmail,
    this.phone,
    this.preferences,
    this.allergies,
  });

  /// Reads one from the API's JSON. The profile's own `email` is the contact
  /// address; the consent flags live under `consent`.
  factory GuestProfile.fromJson(Json json) {
    // Step 1: the consent choices (the nested map may be missing for a new profile).
    final consent = json['consent'] as Json? ?? const {};
    // Step 2: the profile's details.
    return GuestProfile(
      name: '${json['name']}',
      sms: consent['sms'] == true,
      whatsapp: consent['whatsapp'] == true,
      email: consent['email'] == true,
      contactEmail: json['email'] as String?,
      phone: json['phone'] as String?,
      preferences: json['preferences'] as String?,
      allergies: json['allergies'] as String?,
    );
  }

  /// My name.
  final String name;

  /// I agree to SMS messages.
  final bool sms;

  /// I agree to WhatsApp messages.
  final bool whatsapp;

  /// I agree to emails.
  final bool email;

  /// My contact email address, for receipts and messages (not my sign-in).
  final String? contactEmail;

  /// My phone.
  final String? phone;

  /// What I like (room, food, and so on).
  final String? preferences;

  /// My allergies, shown to the kitchen.
  final String? allergies;
}
