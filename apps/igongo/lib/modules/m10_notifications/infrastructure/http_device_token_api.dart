// The device token endpoints of the Igongo API, over HTTP, behind the
// `DeviceTokenApi` port. Phase 7 swaps the raw HTTP calls for the client
// generated from the API's OpenAPI file; the port stays the same.

import 'dart:convert';

import 'package:http/http.dart' as http;

import '../application/ports/device_token_api.dart';
import '../domain/device_registration.dart';
import '../domain/push_platform.dart';

/// `DeviceTokenApi` over HTTP.
class HttpDeviceTokenApi implements DeviceTokenApi {
  /// Creates the client.
  ///
  /// [baseUrl] is the API's address, such as `https://api.igongo.victorbee.com`.
  /// [accessToken] gives the signed-in person's session token for each call.
  HttpDeviceTokenApi({required this.baseUrl, required this.accessToken, http.Client? client})
    : _client = client ?? http.Client();

  /// The API's address, with no trailing slash.
  final String baseUrl;

  /// Returns the signed-in person's session token.
  final Future<String> Function() accessToken;

  final http.Client _client;

  @override
  Future<DeviceRegistration> register({required String token, required PushPlatform platform}) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/notifications/devices'),
      headers: await _headers(),
      body: jsonEncode({'token': token, 'platform': platform.name}),
    );
    _check(response);
    final json = jsonDecode(response.body) as Map<String, dynamic>;
    return DeviceRegistration(topics: [for (final t in json['topics'] as List<dynamic>? ?? []) '$t']);
  }

  @override
  Future<void> remove(String token) async {
    final response = await _client.delete(
      Uri.parse('$baseUrl/notifications/devices/${Uri.encodeComponent(token)}'),
      headers: await _headers(),
    );
    _check(response);
  }

  /// JSON and the person's session on every call.
  Future<Map<String, String>> _headers() async => {
    'content-type': 'application/json',
    'authorization': 'Bearer ${await accessToken()}',
  };

  /// Throws on any answer that is not a success, so the use case can retry.
  static void _check(http.Response response) {
    if (response.statusCode >= 300) {
      throw http.ClientException('Device token call failed with ${response.statusCode}', response.request?.url);
    }
  }
}
