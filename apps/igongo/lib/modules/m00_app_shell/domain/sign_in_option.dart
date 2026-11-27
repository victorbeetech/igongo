// One sign-in method the server has switched on for the login screen
// (Google or Apple here). Read from GET /api/login-methods.

/// A sign-in method offered on the login screen.
class SignInOption {
  /// Creates an option. [method] is the server's key, such as `google`.
  const SignInOption({required this.method, required this.label});

  /// The server's key for the method, such as `google` or `apple`.
  final String method;

  /// The words shown on the button, such as "Continue with Google".
  final String label;

  /// Reads one entry of the server's `methods` list.
  factory SignInOption.fromJson(Map<String, dynamic> json) =>
      SignInOption(method: json['method'] as String, label: json['label'] as String);
}
