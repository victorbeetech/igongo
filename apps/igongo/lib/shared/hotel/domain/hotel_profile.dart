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
  });

  /// Reads the `hotel` block of `/api/public/settings`. Missing keys become empty text.
  factory HotelProfile.fromJson(Map<String, dynamic> json) => HotelProfile(
    name: '${json['name'] ?? ''}',
    address: '${json['address'] ?? ''}',
    phone: '${json['phone'] ?? ''}',
    whatsapp: '${json['whatsapp'] ?? ''}',
    email: '${json['email'] ?? ''}',
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
}
