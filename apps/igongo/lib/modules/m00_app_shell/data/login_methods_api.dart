// Reads which sign-in methods the server has switched on (public, no sign-in
// needed), so the login screen shows only those.

import '../../../shared/api/api_client.dart';
import '../../../shared/social_sign_in/sign_in_option.dart';

/// Calls the public login-methods endpoint.
class LoginMethodsApi {
  /// Creates the calls on [_api].
  const LoginMethodsApi(this._api);

  final ApiClient _api;

  /// The switched-on methods, in the server's order.
  Future<List<SignInOption>> methods() async {
    // Step 1: GET /api/login-methods returns { methods: [...] }.
    final json = await _api.get('/api/login-methods');
    // Step 2: read each entry into a SignInOption.
    final list = (json['methods'] as List<dynamic>? ?? const []);
    return list.map((m) => SignInOption.fromJson(m as Map<String, dynamic>)).toList();
  }
}
