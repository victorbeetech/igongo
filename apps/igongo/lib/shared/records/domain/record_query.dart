// Which records a list screen asks for: its types and whose records.

/// One list's filter. Equal filters share a cached list.
class RecordQuery {
  /// Creates a filter for the list at [path].
  const RecordQuery({required this.path, this.type, this.mine = false, this.assigned = false, this.openOnly = true});

  /// The module's API path.
  final String path;

  /// Only this record type.
  final String? type;

  /// Only my own records.
  final bool mine;

  /// Only records given to me.
  final bool assigned;

  /// Only open records.
  final bool openOnly;

  /// The query string.
  String get search => [
    if (type != null) 'type=$type',
    if (mine) 'mine=1',
    if (assigned) 'assigned=1',
    if (openOnly) 'open=1',
  ].join('&');

  @override
  bool operator ==(Object other) =>
      other is RecordQuery &&
      other.path == path &&
      other.type == type &&
      other.mine == mine &&
      other.assigned == assigned &&
      other.openOnly == openOnly;

  @override
  int get hashCode => Object.hash(path, type, mine, assigned, openOnly);
}
