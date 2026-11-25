// The one way the app calls the Igongo API: JSON in and out, the signed-in
// person's session token as a Bearer header on every call, and every refusal
// turned into an [ApiException] with the API's own message.

import 'dart:convert';

import 'package:http/http.dart' as http;

import 'api_exception.dart';

/// JSON as the API sends it.
typedef Json = Map<String, dynamic>;

/// Calls the Igongo API.
class ApiClient {
  /// Creates a client for [baseUrl]. [token] gives the current session token (or null).
  ApiClient({required this.baseUrl, required this.token, http.Client? client}) : _http = client ?? http.Client();

  /// The API's address, such as `https://igongo-api.victorbee.com`.
  final String baseUrl;

  /// The signed-in person's session token, or null when signed out.
  final String? Function() token;

  final http.Client _http;

  /// GET [path] (such as `/api/attendance/status`).
  Future<Json> get(String path) => send('GET', path);

  /// POST [body] to [path].
  Future<Json> post(String path, [Object? body]) => send('POST', path, body);

  /// PUT [body] to [path].
  Future<Json> put(String path, Object body) => send('PUT', path, body);

  /// Sends one call and returns the JSON reply ({} for empty replies).
  /// Also returns response headers under `_headers`, for sign-in.
  Future<Json> send(String method, String path, [Object? body]) async {
    // Step 1: the request, with the session when there is one.
    final request = http.Request(method, Uri.parse('$baseUrl$path'));
    final session = token();
    if (session != null) request.headers['authorization'] = 'Bearer $session';
    if (body != null) {
      request.headers['content-type'] = 'application/json';
      request.body = jsonEncode(body);
    }
    // Step 2: send it; no network is status 0.
    final http.Response response;
    try {
      response = await http.Response.fromStream(await _http.send(request));
    } on Exception {
      throw const ApiException(0, 'offline', "We couldn't reach Igongo. Check your connection and try again.");
    }
    // Step 3: read the reply and turn refusals into ApiException.
    final data = response.body.isEmpty ? <String, dynamic>{} : jsonDecode(response.body);
    final json = data is Json ? data : <String, dynamic>{'items': data};
    if (response.statusCode >= 300) {
      throw ApiException(
        response.statusCode,
        '${json['error'] ?? 'error'}',
        '${json['message'] ?? 'Something went wrong.'}',
      );
    }
    return {...json, '_headers': response.headers};
  }
}
