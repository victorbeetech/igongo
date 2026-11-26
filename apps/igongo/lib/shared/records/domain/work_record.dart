// One record of a records-kit module, as the API sends it.

import '../../api/api_client.dart';

/// One record.
class WorkRecord {
  /// Creates a record.
  const WorkRecord({
    required this.id,
    required this.code,
    required this.type,
    required this.title,
    required this.status,
    required this.fields,
    required this.ownerName,
    required this.createdAt,
    this.assigneeName,
    this.dueOn,
    this.location,
    this.qr,
  });

  /// Reads one from the API's JSON.
  factory WorkRecord.fromJson(Json json) => WorkRecord(
    id: '${json['id']}',
    code: '${json['code']}',
    type: '${json['type']}',
    title: '${json['title']}',
    status: '${json['status']}',
    fields: (json['fields'] as Json?) ?? const {},
    ownerName: '${json['ownerName']}',
    createdAt: DateTime.parse('${json['createdAt']}'),
    assigneeName: json['assigneeName'] as String?,
    dueOn: json['dueOn'] as String?,
    location: json['location'] as String?,
    qr: json['qr'] as String?,
  );

  /// The record's ID.
  final String id;

  /// The running code, such as `LF-0042`.
  final String code;

  /// The record type key.
  final String type;

  /// A one-line summary.
  final String title;

  /// The status key.
  final String status;

  /// Field values by field key.
  final Json fields;

  /// Who it is for.
  final String ownerName;

  /// When it was added.
  final DateTime createdAt;

  /// Who is working on it.
  final String? assigneeName;

  /// The day it is due or happens.
  final String? dueOn;

  /// Where.
  final String? location;

  /// The QR text, such as `IGG-REC:LF-0042`.
  final String? qr;
}
