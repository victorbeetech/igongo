// The shapes of the generated screen catalogue: screens, dialogs, modules and
// roles. The same shapes as the Flutter app's catalogue models.

import type { ReactNode } from "react";
import type { ViewState } from "@/shared/states/viewState";

/** Which shared layout draws a screen. Kinds come from the screen's name, as in the wireframes. */
export type ScreenKind = "home" | "dashboard" | "scanner" | "map" | "settings" | "builder" | "form" | "detail" | "result" | "list";

/** Where a screen is used: the app, the web portal, a kiosk or a public page. */
export type Surface = "app" | "web" | "kiosk" | "public";

/** One screen from the approved screen inventory. */
export interface ScreenSpec {
  /** The screen number, such as S16-09. */
  id: string;
  /** The screen name shown in the title. */
  name: string;
  /** What the screen is for, in one line. */
  purpose: string;
  /** The route, the same on the app and the web. `:id` marks a record screen. */
  route: string;
  /** Which shared layout draws it. */
  kind: ScreenKind;
  /** Where it is used. */
  surfaces: Surface[];
  /** Screen numbers it opens, or `home`. */
  opens: string[];
  /** Dialog numbers it opens. */
  dialogs: string[];
  /** Form field labels, when the inventory names them. */
  fields: string[];
}

/** How a dialog looks. */
export type DialogTone = "confirm" | "danger" | "warning" | "sheet";

/** One dialog from the approved screen inventory. */
export interface DialogSpec {
  /** The dialog number, such as D16-03. */
  id: string;
  /** The dialog title. */
  name: string;
  /** What it is for. */
  purpose: string;
  /** The `?dialog=` value that opens it. */
  slug: string;
  /** How it looks. */
  tone: DialogTone;
  /** Screens it leads to after confirming. */
  opens: string[];
}

/** Sample data for a module's screens, invented for the prototype. */
export interface ModuleMock {
  /** Record names shown in lists. */
  items: string[];
  /** Status words for chips. */
  statuses: string[];
  /** Dashboard numbers as [label, value]. */
  kpis: string[][];
  /** Form field labels used when a screen names none. */
  fields: string[];
}

/** One module: its screens, dialogs and sample data. */
export interface ModuleSpec {
  /** The two-digit code, such as 16. */
  code: string;
  /** The module name. */
  name: string;
  /** The folder and route name. */
  slug: string;
  /** Every screen. */
  screens: ScreenSpec[];
  /** Every dialog. */
  dialogs: DialogSpec[];
  /** Sample data. */
  mock: ModuleMock;
}

/** One pre-made role with its home tiles, each [label, screen number]. */
export interface RoleSpec {
  /** The role key, such as super-admin. */
  key: string;
  /** The role name. */
  name: string;
  /** The level group, such as Department managers. */
  level: string;
  /** The home tiles. */
  tiles: string[][];
}

/** Everything a screen layout needs to draw one screen. */
export interface ScreenContext {
  /** The screen being drawn. */
  spec: ScreenSpec;
  /** Its module, with sample data. */
  module: ModuleSpec;
  /** The state to show. */
  state: ViewState;
  /** The role being shown. */
  role: RoleSpec;
  /** The screens it leads to, without the role home. */
  links: string[];
}

/** A hand-made screen that replaces the shared layout. */
export type ScreenOverride = (screen: ScreenContext) => ReactNode;

/** Hand-made screens by screen number. */
export type ScreenOverrides = Record<string, ScreenOverride>;
