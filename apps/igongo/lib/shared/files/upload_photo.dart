// Sends a photo to Files & Media (module 11) and returns its ID, which
// other modules store, such as a fault's photo IDs.

import 'dart:convert';

import 'package:image_picker/image_picker.dart';

import '../api/api_client.dart';

/// Uploads [file] for the module [purpose] (such as `faults-maintenance`).
/// Returns the new file's ID; throws ApiException when refused.
Future<String> uploadPhoto(ApiClient api, XFile file, String purpose) async {
  // Step 1: the API takes the bytes as base64 in plain JSON.
  final data = base64Encode(await file.readAsBytes());
  final saved = await api.post('/api/files', {
    'name': file.name,
    'type': file.mimeType ?? 'image/jpeg',
    'data': data,
    'purpose': purpose,
  });
  return '${saved['id']}';
}
