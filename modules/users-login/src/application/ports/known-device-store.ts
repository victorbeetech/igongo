/** The devices each account has signed in from, for new-device alerts. */

export interface KnownDeviceStore {
  /** Saves the device; returns true when it was new, and how many devices the account had before. */
  remember(userId: string, deviceKey: string, label: string): Promise<{ isNew: boolean; knownBefore: number }>;
}
