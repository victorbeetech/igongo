// The shape of one outside service the super admin connects (a payment
// gateway, SMS, sign-in and so on): what it needs to work. Data, not code:
// adding a provider is adding an entry to providers.ts.

/** One setting a provider needs, such as an API key. */
export interface ProviderField {
  /** The label, in the provider's own words, so it matches their dashboard. */
  label: string;
  /** A hint of what to paste, never a real value. */
  hint: string;
  /** True for keys and secrets: stored encrypted, shown masked. */
  secret?: boolean;
}

/** One provider and its settings. */
export interface ProviderSpec {
  /** Its address name, such as "mtn-momo". */
  slug: string;
  /** Its name, such as "MTN Mobile Money". */
  name: string;
  /** The group it shows under, such as "Payments". */
  group: string;
  /** What Igongo uses it for. */
  use: string;
  /** Whether it has a test (sandbox) and a live mode. */
  sandbox: boolean;
  /** The settings to fill in. */
  fields: ProviderField[];
  /** Whether the provider calls Igongo back (payments, messages), so it needs the webhook address. */
  webhook: boolean;
}
