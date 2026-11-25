// The Staff Meals endpoints (`/api/staff-meals`) the app uses, as typed calls.

import '../../../shared/api/api_client.dart';
import '../domain/my_meal.dart';

/// Calls the Staff Meals API.
class MealsApi {
  /// Creates the calls on [_api].
  const MealsApi(this._api);

  final ApiClient _api;

  /// Today's meals for me (S32-01).
  Future<List<MyMeal>> today() async {
    final json = await _api.get('/api/staff-meals/today');
    return [for (final m in json['meals'] as List<dynamic>) MyMeal.fromJson(m as Json)];
  }
}
