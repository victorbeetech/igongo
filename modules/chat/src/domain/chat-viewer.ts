/** Who is chatting, as far as chat rules need. */

export interface ChatViewer {
  userId: string;
  name: string;
  isStaff: boolean;
  roleKeys: string[];
}

/** The desks [viewer] answers. */
export const desksOf = (desks: { key: string; roles: string[] }[], viewer: ChatViewer) => (viewer.isStaff ? desks.filter((d) => d.roles.some((r) => viewer.roleKeys.includes(r))).map((d) => d.key) : []);
