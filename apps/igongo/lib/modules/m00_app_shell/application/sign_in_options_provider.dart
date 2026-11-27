// Riverpod providers for the sign-in options. The screen watches these; the
// data comes from LoginMethodsApi.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/login_methods_api.dart';
import '../domain/sign_in_option.dart';

/// The API wrapper for login methods, using the shared API client.
final loginMethodsApiProvider = Provider<LoginMethodsApi>(
  (ref) => LoginMethodsApi(ref.watch(apiClientProvider)),
);

/// The switched-on sign-in methods, loaded once per screen visit.
final signInOptionsProvider = FutureProvider.autoDispose<List<SignInOption>>(
  (ref) => ref.watch(loginMethodsApiProvider).methods(),
);
