// The hotel's public profile from the super admin's "hotel" settings: the name,
// address and the numbers guests use. Read-only; the server owns the values.

/// The hotel's contact and identity details, as the super admin set them.
class HotelProfile {
  /// Creates a profile; every field is shown as the super admin wrote it.
  const HotelProfile({
    required this.name,
    required this.address,
    required this.phone,
    required this.whatsapp,
    required this.email,
    this.hours = '',
    this.contactUsOn = true,
  });

  /// Reads the `hotel` block of `/api/public/settings`. Missing keys become empty text.
  factory HotelProfile.fromJson(Map<String, dynamic> json) => HotelProfile(
    name: '${json['name'] ?? ''}',
    address: '${json['address'] ?? ''}',
    phone: '${json['phone'] ?? ''}',
    whatsapp: '${json['whatsapp'] ?? ''}',
    email: '${json['email'] ?? ''}',
    hours: '${json['hours'] ?? ''}',
    // The Contact Us switch: on unless the super admin turned it off.
    contactUsOn: json['contactUsOn'] as bool? ?? true,
  );

  /// The hotel's name, shown above the screen title.
  final String name;

  /// The street address shown in the location strip.
  final String address;

  /// The front desk phone number, as typed (may be empty until the admin sets it).
  final String phone;

  /// The WhatsApp concierge number, digits with the country code (may be empty).
  final String whatsapp;

  /// The reservations email (may be empty until the admin sets it).
  final String email;

  /// The opening hours, such as "24/7" (empty until the admin sets it). Shown as the front desk chip.
  final String hours;

  /// False when the super admin has switched the Contact Us details off.
  final bool contactUsOn;
}
