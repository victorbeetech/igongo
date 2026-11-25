// What HR holds about the person signed in (the staff record).

import '../../../shared/api/api_client.dart';
import '../../../shared/staff/staff_ref.dart';

/// My staff record: who I am at work and how to reach me.
class MyProfile {
  /// Creates a profile.
  const MyProfile({
    required this.staff,
    required this.status,
    this.phone,
    this.email,
    this.hireDate,
    this.emergencyContact,
  });

  /// Reads one from the API's JSON.
  factory MyProfile.fromJson(Json json) => MyProfile(
    staff: StaffRef.fromJson(json),
    status: '${json['status']}',
    phone: json['phone'] as String?,
    email: json['email'] as String?,
    hireDate: json['hireDate'] as String?,
    emergencyContact: json['emergencyContact'] as String?,
  );

  /// Number, name, department and job title.
  final StaffRef staff;

  /// Active, on leave, suspended or left.
  final String status;

  /// Work phone.
  final String? phone;

  /// Work email.
  final String? email;

  /// First day at work, `YYYY-MM-DD`.
  final String? hireDate;

  /// Who to call in an emergency.
  final String? emergencyContact;
}
