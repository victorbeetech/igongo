// Where one records-kit module lives in the API, for the shared record pages.

export interface RecordPlace {
  /** The API path, such as `/api/lost-found`. */
  path: string;
  /** The module key, such as `lost-found` (also the photo upload purpose). */
  module: string;
}
