// A staff member as every staff module's API returns them (the HR Records
// contract). Shared by every app module that shows a person.

import '../api/api_client.dart';

/// A staff member.
class StaffRef {
  /// Creates a staff member.
  const StaffRef({
    required this.staffId,
    required this.staffNumber,
    required this.name,
    this.department,
    this.jobTitle,
  });

  /// Reads one from the API's JSON.
  factory StaffRef.fromJson(Json json) => StaffRef(
    staffId: '${json['staffId']}',
    staffNumber: '${json['staffNumber']}',
    name: '${json['name']}',
    department: json['department'] as String?,
    jobTitle: json['jobTitle'] as String?,
  );

  /// The staff record's ID.
  final String staffId;

  /// The number on the card, such as `IGG-0042`.
  final String staffNumber;

  /// The person's name.
  final String name;

  /// The department key, such as `kitchen`.
  final String? department;

  /// The job title.
  final String? jobTitle;

  /// "IGG-0042 · kitchen", for subtitles.
  String get line => [staffNumber, jobTitle, department].whereType<String>().join(' · ');
}
