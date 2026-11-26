/**
 * The super admin's chat settings (S50-05): who may chat, and the desks
 * guests can write to, each answered by the holders of its roles.
 */

export interface ChatDesk {
  key: string;
  name: string;
  /** Role keys whose holders answer this desk. */
  roles: string[];
}

export interface ChatSettings {
  staffChat: boolean;
  groups: boolean;
  guestChat: boolean;
  desks: ChatDesk[];
  attachments: boolean;
  maxGroupSize: number;
}

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  staffChat: true,
  groups: true,
  guestChat: true,
  desks: [{ key: "front-desk", name: "Front desk", roles: ["receptionist", "front-office-manager", "guest-relations-officer"] }],
  attachments: true,
  maxGroupSize: 50,
};
