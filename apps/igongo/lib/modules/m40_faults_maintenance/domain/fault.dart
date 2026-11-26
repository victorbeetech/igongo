// A fault report, as the API returns it in lists and on the detail.

import '../../../shared/api/api_client.dart';

/// A fault.
class Fault {
  /// Creates a fault.
  const Fault({
    required this.id,
    required this.number,
    required this.title,
    required this.description,
    required this.location,
    required this.priority,
    required this.status,
    required this.photoCount,
    required this.reportedBy,
    required this.assignedTo,
    required this.createdAt,
    this.likes = 0,
    this.comments = 0,
  });

  /// Reads one from the API's JSON.
  factory Fault.fromJson(Json json) => Fault(
    id: '${json['id']}',
    number: '${json['number']}',
    title: '${json['title']}',
    description: '${json['description'] ?? ''}',
    location: json['location'] as String?,
    priority: '${json['priority']}',
    status: '${json['status']}',
    photoCount: ((json['photoIds'] as List?) ?? const []).length,
    reportedBy: '${(json['reportedBy'] as Json?)?['name'] ?? ''}',
    assignedTo: (json['assignedTo'] as Json?)?['name'] as String?,
    createdAt: DateTime.parse('${json['createdAt']}'),
    likes: (json['likes'] as num?)?.toInt() ?? 0,
    comments: (json['comments'] as num?)?.toInt() ?? 0,
  );

  /// The fault's ID.
  final String id;

  /// Such as `FLT-0042`.
  final String number;

  /// What is wrong.
  final String title;

  /// More detail.
  final String description;

  /// Where.
  final String? location;

  /// `low`, `normal`, `high` or `urgent`.
  final String priority;

  /// Where it is in its life, such as `in_progress`.
  final String status;

  /// How many photos are attached.
  final int photoCount;

  /// Who reported it.
  final String reportedBy;

  /// Who is fixing it, if anyone yet.
  final String? assignedTo;

  /// When it was reported.
  final DateTime createdAt;

  /// Likes (lists only).
  final int likes;

  /// Comments (lists only).
  final int comments;
}
