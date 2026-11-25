// The one error the API client throws: the HTTP status, the API's short
// reason code and a sentence a person can read. Screens use [needsSignIn]
// and [denied] to pick the right designed state.

/// A refused or failed API call.
class ApiException implements Exception {
  /// Creates the error. [status] is 0 when the phone could not reach the API.
  const ApiException(this.status, this.code, this.message);

  /// The HTTP status, or 0 when offline.
  final int status;

  /// The API's reason, such as `permission_denied`.
  final String code;

  /// A sentence for the person.
  final String message;

  /// Nobody is signed in, or the session ended.
  bool get needsSignIn => status == 401;

  /// The person's role may not do this.
  bool get denied => status == 403;

  /// The phone could not reach the API.
  bool get offline => status == 0;

  @override
  String toString() => message;
}
