// The delivery rules (S66-02), as the API returns them.

export interface DeliveryRules {
  zones: { zone: string; name: string; fee: number; minutes: number }[];
  assignment: "auto" | "dispatcher";
  proof: "code" | "none";
  ridersCarryCash: boolean;
  cashLimit: number;
  payPerTrip: number;
}
