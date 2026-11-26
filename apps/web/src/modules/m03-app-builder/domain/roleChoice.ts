// A role as the layout pages list it (from the roles API).

export interface RoleChoice {
  id: string;
  key: string;
  name: string;
  homeTiles: string[];
  archivedAt: string | null;
}
