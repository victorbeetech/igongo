// Where one records-kit module lives in the API, for the shared record screens.

/// One records module's address.
class RecordPlace {
  /// Creates the place of module [module] at [path].
  const RecordPlace({required this.path, required this.module});

  /// The API path, such as `/api/lost-found`.
  final String path;

  /// The module key, such as `lost-found` (also the photo upload purpose).
  final String module;

  @override
  bool operator ==(Object other) => other is RecordPlace && other.path == path;

  @override
  int get hashCode => path.hashCode;
}
