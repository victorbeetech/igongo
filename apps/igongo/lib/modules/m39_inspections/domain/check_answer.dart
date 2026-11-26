// One answer on a checkup line, as the app sends it.

/// An answer: `ok`, `fault` or `na`, with a note and photos for faults.
class CheckAnswer {
  /// Creates an answer.
  const CheckAnswer({required this.key, this.result = 'ok', this.note = '', this.photoIds = const []});

  /// The line's key.
  final String key;

  /// `ok`, `fault` or `na`.
  final String result;

  /// What is wrong.
  final String note;

  /// Photos of the fault.
  final List<String> photoIds;

  /// A copy with some parts changed.
  CheckAnswer copyWith({String? result, String? note, List<String>? photoIds}) => CheckAnswer(
    key: key,
    result: result ?? this.result,
    note: note ?? this.note,
    photoIds: photoIds ?? this.photoIds,
  );

  /// The JSON the API takes.
  Map<String, Object?> toJson() => {
    'key': key,
    'result': result,
    'note': note.isEmpty ? null : note,
    'photoIds': photoIds,
  };
}
